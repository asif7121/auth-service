import amqp from 'amqplib'

const QUEUE_NAME = 'auth_queue'

let channel: amqp.Channel

export const connectRabbitMQ = async () => {
	try {
		const connection = await amqp.connect('amqp://localhost')
		channel = await connection.createChannel()
		await channel.assertQueue(QUEUE_NAME, { durable: true })

		console.log('RabbitMQ connected')
	} catch (error) {
		console.error('RabbitMQ connection error:', error)
	}
}

export const sendToQueue = async (message: string) => {
	try {
		channel.sendToQueue(QUEUE_NAME, Buffer.from(message), { persistent: true })
		console.log('Message sent to queue')
	} catch (error) {
		console.error('Error sending message to queue:', error)
	}
}
