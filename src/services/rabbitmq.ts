import amqp from 'amqplib'

const connectToRabbitMQ = async () => {
	const connection = await amqp.connect('amqp://localhost')
	const channel = await connection.createChannel()
	await channel.assertQueue('auth-queue')
	return { connection, channel }
}

export { connectToRabbitMQ }
