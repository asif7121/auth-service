import { Auth } from '@models/auth'
import { Request, Response } from 'express'

export const verifyNewPhoneOtp = async (req: Request, res: Response) => {
	try {
		const { _id } = req.user
		const { phone, otp } = req.body
		const user = await Auth.findById(_id)
		if (user.otp === otp && user.temp_phone === phone) {
			user.phone = phone
			user.otp = undefined
			user.temp_phone = undefined
			await user.save()
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
