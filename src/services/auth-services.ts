import { generate_token } from '@helpers/jwt.helper'
import { User } from '@models/user'
import bcrypt from 'bcrypt'
import { Kafka } from 'kafkajs'

const kafka = new Kafka({
	clientId: 'auth-service',
	brokers: [process.env.KAFKA_BROKER],
})

const producer = kafka.producer()
producer.connect()

export const register = async (
	username: string,
	password: string,
	email: string,
	phone: string
) => {
	const hashedPassword = await bcrypt.hash(password, 10)
	const user = new User({ username, password: hashedPassword, email, phone })
	await user.save()

	await producer.send({
		topic: 'user-registered',
		messages: [
			{ value: JSON.stringify({ userId: user._id, phone: user.phone, email: user.email, isVerified: user.is2FAVerified }) },
		],
	})

	return user
}

export const login = async (email: string, password: string) => {
	const user = await User.findOne({ email })
	if (!user || !(await bcrypt.compare(password, user.password))) {
		throw new Error('Invalid credentials')
	}
    const user_obj = {_id: user._id.toString()}
	const token = generate_token(user_obj)
	return { user, token }
}
