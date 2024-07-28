import { generate_random_number, otpExpire } from '@core/utils'
import { Auth } from '@models/auth'
import { Otp, OtpTypes } from '@models/otp'
import { send_sms } from '@services/two-factor-auth'
import { Request, Response } from 'express'

export const updatePhone = async (req: Request, res: Response) => {
	try {
		const { _id } = req.user
		const { countryCode, phone } = req.body

		const user = await Auth.findById(_id)
		if (!user) {
			return res.status(400).json({ error: 'Login first..' })
		}

		if (user.phone === phone) {
			return res
				.status(400)
				.json({ error: 'Existing phone and entered phone cannot be same.' })
		}

		if (!user.isPhoneVerified) {
			return res
				.status(400)
				.json({ error: 'Please verify your existing phone before updating.. ' })
		}

		const otp = generate_random_number(6).toString()

		const otpData = await Otp.findOne({ _user: _id })

		if (otpData) {
			otpData.otp = otp
			otpData.purpose = OtpTypes.UpdatePhone
			otpData.otpExpireAt = otpExpire
			await otpData.save()
		} else {
			await Otp.create({
				otp,
				otpExpireAt: otpExpire,
				purpose: OtpTypes.UpdatePhone,
				_user: _id,
			})
		}

		user.tempPhone = phone
		user.tempCountryCode = countryCode
		await user.save()

		await send_sms(countryCode, phone, otp)
		return res.status(200).json({
			message: 'An OTP has been sent to your phone. Please verify first..',
			data: { new_phone: phone, _user: user._id },
		})
	} catch (error) {
		console.log(error)
		return res.status(500).json({ error: error.message })
	}
}
