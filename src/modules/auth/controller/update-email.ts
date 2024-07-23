import { generate_random_number } from '@core/utils'
import { Auth } from '@models/auth'
import { Otp } from '@models/otp'
import { send_email } from '@services/two-factor-auth'
import { Request, Response } from 'express'

export const updateUserEmail = async (req: Request, res: Response) => {
	try {
		const { _id } = req.user
		const { newEmail } = req.body
		const otp = generate_random_number(6).toString()
		const user = await Auth.findById(_id)
		const code = await Otp.findOne({_user: _id})
		if (!user) {
			return res.status(400).json({ error: 'Login first..' })
		}
		if (user.email === newEmail) {
			return res
				.status(400)
				.json({ error: 'Existing email and entered email cannot be same' })
		}
		code.otpCode = otp
		user.tempEmail = newEmail
		await user.save()
		await code.save()
		await send_email(newEmail, otp)
		return res
			.status(200)
			.json({
				message: 'An otp has been sent to verify your email.',
				data: { email: newEmail },
			})
	} catch (error) {
		console.log(error)
		return res.status(500).json({ error: error.message })
	}
}
