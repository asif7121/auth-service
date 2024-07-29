import { generate_random_number, isValidEmail } from '@core/utils'
import { Auth } from '@models/auth'
import { Otp, OtpTypes } from '@models/otp'
import { send_email } from '@services/two-factor-auth'
import { Request, Response } from 'express'

export const updateUserEmail = async (req: Request, res: Response) => {
	try {
		const { _id } = req.user
		const { email } = req.body

		// Validate email using Regex
		if (!isValidEmail(email)) {
			return res.status(400).json({ error: 'Invalid email format' })
		}

		const otp = generate_random_number(6).toString()

		const user = await Auth.findById(_id)
		if (!user) {
			return res.status(400).json({ error: 'Login first..' })
		}
		const otpExpire = new Date(Date.now() + 5 * 60 * 1000)
		if (user.email === email) {
			return res
				.status(400)
				.json({ error: 'Existing email and entered email cannot be same' })
		}

		if (!user.isEmailVerified) {
			return res
				.status(400)
				.json({ error: 'Please verify your existing email before updating.. ' })
		}

		const otpData = await Otp.findOne({ _user: _id })
		
		if (otpData) {
			otpData.otp = otp
			otpData.purpose = OtpTypes.UpdateEmail
			otpData.otpExpireAt = otpExpire
			await otpData.save()
		} else {
			await Otp.create({
				otp,
				otpExpireAt: otpExpire,
				purpose: OtpTypes.UpdateEmail,
				_user: _id,
			})
		}

		user.tempEmail = email
		await user.save()

		await send_email(email, otp)
		return res.status(200).json({
			message: 'An OTP has been sent to verify your new email.',
			data: { email },
		})
	} catch (error) {
		console.log(error)
		return res.status(500).json({ error: error.message })
	}
}
