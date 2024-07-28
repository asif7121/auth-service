import { generate_random_number, otpExpire } from '@core/utils'
import { Auth } from '@models/auth'
import { Otp, OtpTypes } from '@models/otp'
import { send_sms } from '@services/two-factor-auth'
import { Request, Response } from 'express'

export const phoneVerification = async (req: Request, res: Response) => {
	try {
		const { phone } = req.body
		const user = await Auth.findOne({ phone: phone })
		const code = generate_random_number(6).toString()
		
		

		if (!user) {
			return res.status(404).json({ error: 'No user exists with the provided phone' })
		}

		const otpData = await Otp.findOne({ _user: user._id })
		if (otpData) {
			otpData.otp = code
			otpData.purpose = OtpTypes.VerifyExistingPhone
			otpData.otpExpireAt = otpExpire
			await otpData.save()
		} else {
			await Otp.create({
				otp: code,
				otpExpireAt: otpExpire,
				purpose: OtpTypes.VerifyExistingPhone,
				_user: user._id,
			})
		}

		await send_sms(user.countryCode, user.phone, code)
		return res.status(200).json({
			message: 'An OTP has been sent to your phone. Please verify it first',
			data: { phone: user.phone },
		})
	} catch (error) {
		console.log(error)
		return res.status(500).json({ error: error.message })
	}
}
