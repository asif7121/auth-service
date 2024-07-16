import { generate_random_number } from '@core/utils'
import { Auth } from '@models/auth'
import { send_email, send_sms } from '@services/two-factor-auth'
import bcrypt from 'bcrypt'

export const login = async (email: string, password: string) => {
	let user = await Auth.findOne({ email })
	if (!user) {
		throw new Error('Invalid User')
	}
	const valid_password = await bcrypt.compare(password, user.password)
	if (!valid_password) {
		throw new Error('Invalid credentials')
	}
	const otp = generate_random_number(6).toString()

	if (user.auth_method === 'email') {
		await send_email(email, otp)
		user.otp = otp
	} else if (user.auth_method === 'phone') {
		await send_sms(user.phone, otp)
		user.otp = otp
	}
	await user.save()
	return user
}
