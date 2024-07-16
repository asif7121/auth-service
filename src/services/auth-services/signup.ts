import { Auth } from '@models/auth'
import bcrypt from 'bcrypt'

import { generate_random_number } from '@core/utils'
import { send_email, send_sms } from '@services/two-factor-auth'
import { generateTotpSecret } from '@services/authenticator'

export const signup = async (
	username: string,
	password: string,
	email: string,
	phone: string,
	auth_method: string
) => {
	const hashedPassword = await bcrypt.hash(password, 10)
	let user = new Auth({ username, password: hashedPassword, email, phone, auth_method })
	const otp = generate_random_number(6).toString()
	if (auth_method === 'email') {
		await send_email(email, otp)
		user.otp = otp
	} else if (auth_method === 'phone') {
		await send_sms(phone, otp)
		user.otp = otp
	} else if (auth_method === 'authenticator') {
		const { secret, otpauth } = generateTotpSecret(email)
		user.secret = secret
		user.isTwoFAEnabled = true
		await user.save()
		const userObj = user.toObject()
		return { ...userObj, otpauth }
	}
	await user.save()
	return user
}
