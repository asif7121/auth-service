import { generate_token } from '@helpers/jwt.helper'
import { Auth } from '@models/auth'
import { Otp } from '@models/otp'
import { Request, Response } from 'express'
import { authenticator } from 'otplib'
import { verifyTotpToken } from 'services/authenticator'

export const verify_user_otp = async (req: Request, res: Response) => {
	try {
		const { id, otp } = req.body
		if ([id, otp].some((field: string) => field.trim() === '')) {
			return res.status(400).json({ error: 'Fields cannot be empty' })
		}
		const user = await Auth.findById(id)
		const code = await Otp.findOne({_user: id})
		if (!user) {
			return res.status(400).json({ error: 'User not found' })
		}
		let isOtpVerified = false
		if (user.authMethod === 'authenticator') {
			const token = authenticator.generate(user.secret)
			const isValid = verifyTotpToken(token, user.secret)
			if (!isValid) {
				return res.status(400).json({ error: 'Invalid OTP' })
			}
			isOtpVerified = true
		} else if (user.authMethod === 'email') {
			if (code.otpCode === otp) {
				user.isEmailVerified = true
				isOtpVerified = true
			} else {
				return res.status(400).json({
					error: 'Incorrect OTP! Please check your email and provide the correct OTP.',
				})
			}
		} else if (user.authMethod === 'phone') {
			if (code.otpCode === otp) {
				user.isPhoneVerified = true
				isOtpVerified = true
			} else {
				return res.status(400).json({
					error: 'Incorrect OTP! Please check your phone and provide the correct OTP.',
				})
			}
		}
		

		if (isOtpVerified) {
			user.isVerified = true
			code.otpCode = null // Clear the OTP
			user.secret = undefined //Clear the secret
			const payload = {
				_id: user._id.toString(),
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
