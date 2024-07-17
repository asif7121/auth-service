import { generate_random_number } from '@core/utils'
import { Auth } from '@models/auth'
import { generateTotpQrcode, generateTotpSecret } from '@services/authenticator'
import { send_email, send_sms } from '@services/two-factor-auth'
import { Request, Response } from 'express'

export const twofasend = async (req: Request, res: Response) => {
	try {
		const { id, auth_method } = req.body
		const user = await Auth.findById(id)
		if (!user) {
			return res.status(400).json({ error: 'No user found with this id..' })
		}
		const otp = generate_random_number(6).toString()
		if (auth_method === 'email') {
			await send_email(user.email, otp)
            user.otp = otp
            user.auth_method = auth_method
            await user.save()
			return res.status(200).json({ message: `OTP sent to email: ${user.email}` })
		} else if (auth_method === 'phone') {
			await send_sms(user.phone, otp)
            user.otp = otp
            user.auth_method = auth_method
            await user.save()
			return res.status(200).json({ message: `OTP sent to phone: ${user.phone}` })
		} else if (auth_method === 'authenticator') {
			const { secret, otpauth } = generateTotpSecret(user.email)
			user.secret = secret
            user.isTwoFAEnabled = true
            user.auth_method = auth_method
			await user.save()
			const qr = await generateTotpQrcode(otpauth)
			return res.status(200).json({
				data: {
					secret: user.secret,
					qrCode: qr,
				},
			})
		}
	} catch (error) {
		console.log(error)
		return res.status(500).json({ error: error.message })
	}
}
