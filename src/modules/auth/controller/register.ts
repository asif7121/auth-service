import { signup } from '@services/auth-services'
import { Request, Response } from 'express'

import { generateTotpQrcode } from 'services/authenticator'


export const register_user = async (req: Request, res: Response) => {
	try {
		const { username, password, email, phone, address } = req.body
		const user = await signup(username, password, email, phone, address)
		return res.status(201).json({_user:user._id})
	} catch (error) {
		console.log(error)
		return res.status(500).json({error:error.message})
	}
	
}
