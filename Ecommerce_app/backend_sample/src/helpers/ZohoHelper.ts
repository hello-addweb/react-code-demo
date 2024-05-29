import { DELETE_ZOHO_PRODUCT_SQS } from "../shared/const";
import { SQS } from 'aws-sdk'

export const deleteProductFromZohoSQSMessage = async (ASINS: [string]) => {
    const messagePayload = { ASINS }
    const sqs = new SQS()
    await sqs.sendMessage({
        MessageBody: JSON.stringify(messagePayload),
        QueueUrl: `${DELETE_ZOHO_PRODUCT_SQS}`
    }).promise()
        .then(() => {
            console.log("Message sent successfully");
        })
        .catch((err: any) => {
            console.error("Error sending SQS message:", err);
            // Handle the error appropriately, e.g., logging or throwing
        });
}