const AWS = require('aws-sdk');
const dynamodb = new AWS.DynamoDB({ apiVersion: '2012-08-10', region: 'us-west-2' });

exports.handler = (event, context, callback) => {
    const { phone_number } = event.pathParameters;
    dynamodb.query({
        TableName: "SatisfechomxTable",
        KeyConditionExpression: "phone_number = :phone_number",
        ExpressionAttributeValues: {
            ":phone_number": {
                S: phone_number
            }
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
                body: JSON.stringify(data.Items)
            });
        }
    });
};