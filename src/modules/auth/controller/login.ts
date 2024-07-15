import { Request, Response } from 'express'
import { login } from 'services/auth-services'

export const login_user = async (req: Request, res: Response) => {
	const { email, password } = req.body
	try {
		const user = await login(email, password)
		res.status(200).json({message: `OTP sent to email: ${email}`})
	} catch (error) {
		res.status(401).json({ message: error.message })
	}
}
