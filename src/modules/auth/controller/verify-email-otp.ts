import { Auth } from '@models/auth'
import { Request, Response } from 'express'

export const verifyNewEmailOtp = async (req: Request, res: Response) => {
	try {
		const { _id } = req.user
		const { email, otp } = req.body
		const user = await Auth.findById(_id)

		if (user.otp === otp && user.temp_email === email) {
			user.email = email
			user.otp = undefined
			user.temp_email = undefined
			await user.save()
			return res
				.status(200)
                .json({
                    message: 'Your email has been updated..',
                    data: { item: user.email }
                })
		}
		return res
			.status(400)
			.json({ error: 'Invalid OTP or email, please provide correct credentials.' })
	} catch (error) {
		console.log(error)
		return res.status(500).json({ error: error.message })
	}
}
