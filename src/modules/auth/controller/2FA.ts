import { generate_random_number } from '@core/utils'
import { Auth } from '@models/auth'
import { Otp } from '@models/otp'
import { generateTotpQrcode, generateTotpSecret } from '@services/authenticator'
import { send_email, send_sms } from '@services/two-factor-auth'
import { Request, Response } from 'express'

export const twofasend = async (req: Request, res: Response) => {
	try {
		const { id, authMethod } = req.body
		const code = generate_random_number(6).toString()
		const user = await Auth.findById(id)
		if (!user) {
			return res.status(400).json({ error: 'No user found with this id..' })
		}
		const checkUserOtp = await Otp.findOne({ _user: user._id })
		if (checkUserOtp) {
			checkUserOtp.otpCode = code
			await checkUserOtp.save()
		} else {
			 await Otp.create({
				otpCode: code,
				_user: user._id,
			})
		}
		
		if (authMethod === 'email') {
			await send_email(user.email, code)
			user.authMethod = authMethod
            user.isTwoFAEnabled = true
            await user.save()
			return res.status(200).json({ message: `OTP sent to email: ${user.email}` })
		} else if (authMethod === 'phone') {
			await send_sms(user.phone, code)
			user.authMethod = authMethod
            user.isTwoFAEnabled = true
            await user.save()
			return res.status(200).json({ message: `OTP sent to phone: ${user.phone}` })
		} else if (authMethod === 'authenticator') {
			const { secret, otpauth } = generateTotpSecret(user.email)
			user.secret = secret
            user.isTwoFAEnabled = true
            user.authMethod = authMethod
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
