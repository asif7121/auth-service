import { Auth } from '@models/auth'
import { Otp } from '@models/otp'
import { Request, Response } from 'express'

export const verifyNewEmailOtp = async (req: Request, res: Response) => {
	try {
		const { _id } = req.user
		const { email, otp } = req.body
		const user = await Auth.findById(_id)
		const code = await Otp.findOne({ _user: _id })

		if (code.otpCode === otp && user.tempEmail === email) {
			user.email = email
			code.otpCode = null
			user.tempEmail = undefined
			await user.save()
			await code.save()
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
