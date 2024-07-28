import { generate_token } from '@helpers/jwt.helper'
import { Auth } from '@models/auth'
import { Otp, OtpTypes } from '@models/otp'
import { Request, Response } from 'express'
import { authenticator } from 'otplib'
import { verifyTotpToken } from '@services/authenticator'
import { isValidObjectId } from 'mongoose'

export const verify_user_otp = async (req: Request, res: Response) => {
	try {
		const { id, otp, purpose } = req.body
		if ([id, otp, purpose].some((field: string) => field.trim() === '')) {
			return res.status(400).json({ error: 'Fields cannot be empty' })
		}
		if (!isValidObjectId(id)) {
			return res.status(400).json({ error: 'Invalid ObjectId.' })
		}
		const user = await Auth.findById(id)
		if (!user) {
			return res.status(400).json({ error: 'User not found' })
		}
		const code = await Otp.findOne({ _user: user._id, purpose: purpose })

		if (!Object.values(OtpTypes).includes(purpose)) {
			return res.status(400).json({ error: 'Invalid OTP purpose' })
		}
		if (!code || code.otpExpireAt < new Date()) {
			return res.status(400).json({ error: 'OTP expired or not found' })
		}

		let isOtpVerified = false

		if (user.authMethod === 'authenticator') {
			const token = authenticator.generate(user.secret)
			const isValid = verifyTotpToken(token, user.secret)
			if (!isValid) {
				return res.status(400).json({ error: 'Invalid OTP' })
			}
			isOtpVerified = true
		} else {
			if (code.otp === otp) {
				switch (purpose) {
					case OtpTypes.VerifyExistingEmail:
						user.isEmailVerified = true
						break
					case OtpTypes.VerifyExistingPhone:
						user.isPhoneVerified = true
						break
					case OtpTypes.UpdateEmail:
						user.email = user.tempEmail
						user.tempEmail = undefined
						break
					case OtpTypes.UpdatePhone:
						user.phone = user.tempPhone
						user.countryCode = user.tempCountryCode
						user.tempPhone = undefined
						user.tempCountryCode = undefined
						break
					case OtpTypes.Signup:
						user.isVerified = true
						user.isTwoFAEnabled = true
						break
					case OtpTypes.Login:
						user.isVerified = true
						break
					default:
						return res.status(400).json({ error: 'Invalid OTP purpose' })
				}
				isOtpVerified = true
			} else {
				return res.status(400).json({
					error: `Incorrect OTP! Please check your ${user.authMethod} and provide the correct OTP.`,
				})
			}
		}

		if (isOtpVerified) {
			code.otp = null // Clear the OTP
			user.secret = undefined // Clear the secret if using authenticator
			user.isActive = true
			user.isEmailVerified = true
			const payload = {
				_id: user._id.toString(),
				role: user.role,
			}
			const token = generate_token(payload)

			await user.save()
			await code.save()
			return res.status(200).json({
				message: 'OTP verified successfully',
				data: {
					_user: user._id,
					token: token,
				},
			})
		}
		return res.status(400).json({ error: 'Invalid OTP' })
	} catch (error) {
		console.log(error)
		return res.status(500).json({ error: error.message })
	}
}
