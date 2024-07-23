import { Auth } from '@models/auth'
import { Request, Response } from 'express'
import bcrypt from 'bcrypt'
import { generate_token } from '@helpers/jwt.helper'

export const login_user = async (req: Request, res: Response) => {
	try {
		const { email, password } = req.body
		const user = await Auth.findOne({ email: email })
		if (!user) {
			return res.status(400).json({ error: 'Invalid credentials!' })
		}
		const valid_password = await bcrypt.compare(password, user.password)
		if (!valid_password) {
			return res.status(400).json({error: 'Invalid credentials!'})
		}
		if (!user.isEmailVerified) {
			return res.status(400).json({error: 'Please verify your email before login.'})
		}
		 const payload = {
				_id: user._id.toString(),
			}
			const token = generate_token(payload)
			return res.status(200).json({
				message: 'Logged in successfully',
				data: {
					_user: user._id,
					token: token,
				},
			})
	} catch (error) {
		console.log(error)
		return res.status(401).json({ message: error.message })
	}
}
