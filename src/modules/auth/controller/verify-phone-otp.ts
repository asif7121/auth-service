import { Auth } from '@models/auth'
import { Otp } from '@models/otp'
import { Request, Response } from 'express'

export const verifyNewPhoneOtp = async (req: Request, res: Response) => {
	try {
		const { _id } = req.user
		const { phone, otp } = req.body
		const user = await Auth.findById(_id)
		const code = await Otp.findOne({ _user: _id })
		if (code.otpCode === otp && user.tempPhone === phone) {
			user.phone = phone
			code.otpCode = null
			user.tempPhone = undefined
			await user.save()
			await code.save()
			return res
				.status(200)
				.json({
					message: 'Your phone number has been updated..',
					data: { item: user.phone },
				})
		}
		return res
			.status(400)
			.json({ error: 'Invalid OTP or phone, please provide correct credentials.' })
	} catch (error) {
		console.log(error)
		return res.status(500).json({ error: error.message })
	}
}
