import { User } from '@models/user'
import bcrypt from 'bcrypt'
import { send_email, send_sms } from './two-factor-auth'
import { generate_random_number } from '@core/utils'


export const register = async (
	username: string,
	password: string,
	email: string,
	phone: string
) => {
	const hashedPassword = await bcrypt.hash(password, 10)
	let user = new User({ username, password: hashedPassword, email, phone })
	const otp = generate_random_number(6).toString()
	user.otp = otp
	await user.save()
	await send_email(email, otp)
	// await send_sms(phone, otp)
	return user
}

export const login = async (email: string, password: string) => {
	let user = await User.findOne({ email })
	if (!user || !(await bcrypt.compare(password, user.password))) {
		throw new Error('Invalid credentials')
	}
	const otp = generate_random_number(6).toString()
	user.otp = otp
	await user.save()
	await send_email(email, otp)
   
	return user
}
