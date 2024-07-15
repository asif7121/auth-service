import { Request, Response } from 'express'
import { register } from 'services/auth-services'

export const register_user = async (req: Request, res: Response) => {
	const { username, password, email, phone } = req.body
	const user = await register(username, password, email, phone)
	return res.status(201).json({message: `OTP sent to email: ${email}`})
}