const AWS = require('aws-sdk');
const dynamodb = new AWS.DynamoDB({ apiVersion: '2012-08-10', region: 'us-west-2' });

const objectToArrayWithKeys = (obj) => Object.keys(obj).map(key => ({ key, value: obj[key] }));

exports.handler = (event, context, callback) => {
    const data = JSON.parse(event.body);
    const { phone_number, post_id } = event.pathParameters;

    const updateExpressions = objectToArrayWithKeys(data).map(({ key, value }) => `${key} = :${key}`).join(', ');

    let expressionValues = {};
    objectToArrayWithKeys(data).map(({ key, value }) => {
        if (key == 'donation_location') {
            const { lat, long } = value;
            expressionValues[':donation_location'] = {
                M: {
                    lat: { N: String(lat) },
                    long: { N: String(long) }
                }
            };
        }
        else {
            const type = key == 'donation_quantity' ? 'N' : 'S';
            expressionValues[':' + key] = {
                [type]: String(value)
            };
        }
    });
    dynamodb.updateItem({
        TableName: "SatisfechomxTable",
        Key: {
            phone_number: {
                S: phone_number
            },
            post_id: {
                S: post_id
            }
        },
        UpdateExpression: "SET " + updateExpressions,
        ExpressionAttributeValues: expressionValues,
        ReturnValues: "ALL_NEW"
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
                body: JSON.stringify(data)
            });
        }
    });
};