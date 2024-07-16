import { login } from '@services/auth-services/login'
import { Request, Response } from 'express'


export const login_user = async (req: Request, res: Response) => {
	const { email, password } = req.body
	try {
		const user = await login(email, password)
		return res.status(200).json({message: `OTP has been sent to verify your login..`})
	} catch (error) {
		return res.status(401).json({ message: error.message })
	}
}
