import amqplib from 'amqplib'

const rabbitMqUrl = 'amqp://localhost'

export const publishMessage = async (queue: string, message: string) => {
	try {
		const connection = await amqplib.connect(rabbitMqUrl)
		const channel = await connection.createChannel()
		await channel.assertQueue(queue, { durable: true })
		channel.sendToQueue(queue, Buffer.from(message))
		console.log(`Auth-MS Sent: ${message}`)
		setTimeout(() => {
			connection.close()
		}, 500)
	} catch (error) {
		console.error('Error in publishing message:', error)
	}
}
