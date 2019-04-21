'use strict';

const { WebhookClient, Payload } = require('dialogflow-fulfillment');
const bodyParser = require('body-parser');
const cors = require('cors');
const compression = require('compression');
const awsServerlessExpressMiddleware = require('aws-serverless-express/middleware');
const axios = require('axios');
const { unifyDataObjects, getDate } = require('./utilities');

var express = require('express');
const app = express();
const router = express.Router();

router.use(compression());
router.use(cors());
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: true }));
router.use(awsServerlessExpressMiddleware.eventContext());

router.post('/', (request, response) => {
  const agent = new WebhookClient({ request, response });
  function welcome(agent) {
    agent.add(`Welcome to my agent on AWS Lambda!`);
  }
  function fallback(agent) {
    agent.add(`I didn't understand`);
  }
  function multipurposeFallback(agent) {
    const { postback, message } = agent.originalRequest.payload.data;
    if (postback) {
      const donation_location = postback.data;
      agent.setContext({
        'name': 'donation_location-context',
        'lifespan': 10,
        'parameters': { donation_location }
      });
      agent.add('Excelente');
      agent.add('¿Puedes mandar una foto de la comida?');
    }
    else {
      agent.add('¿Disculpa?');
    }
  }
  function getPhone(agent) {
    const phone_number = agent.originalRequest.payload.data.message.text
    agent.setContext({
      'name': 'phone_number-context',
      'lifespan': 10,
      'parameters': { phone_number }
    });

    agent.add(`Hemos guardado tu número de teléfono: "${phone_number}"`);
    agent.add('¡Genial! Te voy a pedir algunos datos sobre tu donativo.');
    agent.add('¿De qué consiste el donativo?')
    agent.add('(ej. frutas y verduras, sandwiches de pollo)')
  }
  async function finish(agent) {
    const {
      facebook_sender_id,
      phone_number,
      donation_content,
      donation_quantity,
      donation_amount,
      donation_expiration_date,
      donation_pick_up_by_time,
      donation_photo,
      donation_location
    } = unifyDataObjects(agent.contexts);
    const body = {
      phone_number,
      donation_content,
      donation_quantity,
      donation_amount,
      donation_expiration_date: getDate(donation_expiration_date),
      donation_pick_up_by_time,
      donation_photo,
      donation_location,
    };

    //Call API
    let res
    try {
      res = await axios({
        url: 'https://API_URL/PROD/donations/',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': 'API_KEY'
        },
        data: JSON.stringify(body)
      })
    }
    catch (e) { console.log('Error: ', e) }
    finally {
      if (res && res.data == 'Successful') {
        agent.add('Muy bien');
        agent.add('Agradecemos tu donativo');
        agent.add('¡Hasta la próxima!');
      }
      else {
        const quickActions = new Payload('FACEBOOK', {
          text: 'Ha ocurrido un error inesperado. Por favor intentalo otra vez',
          quick_replies: [
            {
              content_type: 'text',
              title: 'Realizar un donativo',
              payload: 'Realizar un donativo'
            },
            {
              content_type: 'text',
              title: 'Saber qué eres',
              payload: 'Saber qué eres'
            },
          ]
        });
        agent.add(quickActions);
      }
    }
  }

  if (
    agent.intent == 'Donation Intent - multipurpose_fallback' &&
    agent.originalRequest.payload.data.message &&
    agent.originalRequest.payload.data.message.attachments &&
    agent.originalRequest.payload.data.message.attachments[0].payload.url
  ) {
    const donation_photo = agent.originalRequest.payload.data.message.attachments[0].payload.url;
    const {
      donation_content,
      donation_quantity,
      donation_amount,
      donation_expiration_date,
      donation_pick_up_by_time,
    } = unifyDataObjects(agent.contexts);

    agent.setContext({
      'name': 'donation_photo-context',
      'lifespan': 10,
      'parameters': { donation_photo }
    });

    //Not using the dialogflow-fullfillment api because it doesn't allow messages && quick replies
    const responseJSON = {
      fulfillmentText: 'hey',
      fulfillmentMessages: [
        {
          platform: 'FACEBOOK',
          payload: {
            facebook: {
              text: '¡Perfecto!'
            }
          }
        },
        {
          platform: 'FACEBOOK',
          payload: {
            facebook: {
              text: 'Esto se publicará en el grupo de Facebook:'
            }
          }
        },
        {
          text: {
            text: [
              `Contenido: ${donation_content}`,
              `Cantidad: ${donation_quantity} ${donation_amount}`,
              `Fecha de caducidad: ${getDate(donation_expiration_date)}`,
              `Recoger: ${donation_pick_up_by_time}`,
            ]
          },
          platform: 'FACEBOOK'
        },
        {
          platform: 'FACEBOOK',
          payload: {
            facebook: {
              text: '¿Deseas confirmar la donación?',
              quick_replies: [{
                content_type: 'text',
                title: 'No, realmente',
                payload: 'No, realmente'
              },
              {
                content_type: 'text',
                title: '¡Claro que sí!',
                payload: '¡Claro que sí!'
              }]
            }
          }
        }]
    }
    agent.client.sendJson_(responseJSON);
  }
  else {
    // Run the proper function handler based on the matched Dialogflow intent name
    let intentMap = new Map();
    // intentMap.set('Initial Welcome Intent', welcome);
    // intentMap.set('Default Fallback Intent', fallback);
    intentMap.set('Donation Intent - multipurpose_fallback', multipurposeFallback);
    intentMap.set('Donation Intent - phone_number', getPhone);
    intentMap.set('Donation Intent - finish - yes', finish);
    agent.handleRequest(intentMap);
  }
});

app.use('/', router);

module.exports = app;
