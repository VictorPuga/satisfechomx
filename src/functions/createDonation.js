const axios = require('axios');
const AWS = require('aws-sdk');
const dynamodb = new AWS.DynamoDB({ apiVersion: '2012-08-10', region: 'us-west-2' });

exports.handler = (event, context, callback) => {
    const data = JSON.parse(event.body);
    const {
        phone_number,
        donation_content,
        donation_quantity,
        donation_amount,
        donation_expiration_date,
        donation_pick_up_by_time,
        donation_photo,
        donation_location,
    } = data;
    const { lat, long } = donation_location;

    axios.post('https://graph.facebook.com/v3.2/me/photos', {
        access_token: 'ACCESS_TOKEN',
        url: donation_photo,
        caption: `
Buenos días voluntarios,
hay una nueva donación disponible:

Contenido: ${donation_content}
Cantidad: ${donation_quantity} ${donation_amount}
Caducidad: ${donation_expiration_date}
Recoger: ${donation_pick_up_by_time}

https://www.google.com/maps/search/?api=1&query=${lat},${long}
`
    })
        .then(response => {
            if (!response.error) {
                const { post_id } = response.data;
                dynamodb.putItem({
                    TableName: "SatisfechomxTable",
                    Item: {
                        "phone_number": {
                            S: phone_number
                        },
                        "post_id": {
                            S: post_id
                        },
                        "donation_content": {
                            S: donation_content
                        },
                        "donation_quantity": {
                            N: String(donation_quantity)
                        },
                        "donation_amount": {
                            S: donation_amount
                        },
                        "donation_expiration_date": {
                            S: donation_expiration_date
                        },
                        "donation_pick_up_by_time": {
                            S: donation_pick_up_by_time
                        },
                        "donation_photo": {
                            S: donation_photo
                        },
                        "donation_location": {
                            M: {
                                "lat": {
                                    N: String(lat)
                                },
                                "long": {
                                    N: String(long)
                                }
                            }
                        },
                    }
                }, function (err, data) {
                    if (err) {
                        console.log(err, err.stack);
                        callback(null, {
                            statusCode: '500',
                            body: err
                        });
                    } else {
                        callback(null, {
                            statusCode: '200',
                            body: 'Successful'
                        });
                    }
                });
            }
        })
        .catch(e => console.log(e.response.data));
};