import { signup } from '@services/auth-services'
import { Request, Response } from 'express'

import { generateTotpQrcode } from 'services/authenticator'


export const register_user = async (req: Request, res: Response) => {
	const { username, password, email, phone, auth_method } = req.body
	const user:any = await signup(username, password, email, phone, auth_method)
	if (auth_method === 'email') {
		return res.status(201).json({ message: `OTP sent to email: ${email}` })
	} else if (auth_method === 'phone') {
		return res.status(201).json({ message: `OTP sent to phone: ${phone}` })
	} else if (auth_method === 'authenticator') {
		const qr = await generateTotpQrcode(user.otpauth)
		return res.status(201).json({
			data: {
				secret: user.secret,
				qrCode: qr
			}
		})
	} else {
		return res.status(400).json({error: 'Invalid auth method'})
	}
}
