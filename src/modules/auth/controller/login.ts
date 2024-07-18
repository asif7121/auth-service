import { Auth } from '@models/auth'
import { Request, Response } from 'express'
import bcrypt from 'bcrypt'

export const login_user = async (req: Request, res: Response) => {
	try {
		const { email, password } = req.body
		const user = await Auth.findOne({ email })
		if (!user) {
			return res.status(400).json({ error: 'Invalid credentials!' })
		}
		const valid_password = await bcrypt.compare(password, user.password)
		if (!valid_password) {
			return res.status(400).json({error: 'Invalid credentials!'})
		}
		return res.status(200).json({_user:user._id})
	} catch (error) {
		return res.status(401).json({ message: error.message })
	}
}
