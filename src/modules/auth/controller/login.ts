import { login } from '@services/auth-services/login'
import { Request, Response } from 'express'


export const login_user = async (req: Request, res: Response) => {
	try {
		const { email, password } = req.body
		const user = await login(email, password)
		return res.status(200).json({_user:user._id})
	} catch (error) {
		return res.status(401).json({ message: error.message })
	}
}
