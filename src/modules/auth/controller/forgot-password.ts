import { User } from '@models/auth'
import { Request, Response } from 'express'
import crypto from 'crypto'
import { sendPasswordResetEmail } from '@services/two-factor-auth'

export const forgotPassword = async (req: Request, res: Response) => {
	try {
		const { email } = req.body
		const user = await User.findOne({ email })
		if (!user) {
			return res.status(400).json({ error: 'No account exists with provided email address.' })
		}
		const token = crypto.randomBytes(20).toString('hex')
		const hashedToken = crypto.createHash('sha256').update(token).digest('hex')
		user.resetPasswordToken = hashedToken
		await user.save()
		await sendPasswordResetEmail(user, token)
		return res.status(200).json({
			message: 'A reset password url has been sent to to email.',
			data: {
				_user: user._id,
				token: token,
			},
		})
	} catch (error) {
		return res.status(500).json({ error: error.message })
	}
}
