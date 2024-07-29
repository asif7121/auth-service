import { Auth } from '@models/auth'
import { Request, Response } from 'express'
import bcrypt from 'bcrypt'
import { send_email, send_sms } from '@services/two-factor-auth'
import { generate_random_number, isValidEmail } from '@core/utils'
import { Otp, OtpTypes } from '@models/otp'
import { generateTotpQrcode, generateTotpSecret } from '@services/authenticator'
import { generate_token } from '@helpers/jwt.helper'

export const login_user = async (req: Request, res: Response) => {
	try {
		const { email, password } = req.body
		// Validate email using Regex
		if (!isValidEmail(email)) {
			return res.status(400).json({ error: 'Invalid email format' })
		}
		const user = await Auth.findOne({ email: email })
		if (!user) {
			return res.status(400).json({ error: 'Invalid credentials!' })
		}
		const code = generate_random_number(6).toString()

		const valid_password = await bcrypt.compare(password, user.password)
		if (!valid_password) {
			return res.status(400).json({ error: 'Invalid credentials!' })
		}
		if (!(user.isEmailVerified && user.isVerified)) {
			return res.status(400).json({ error: 'Please verify your email before login.' })
		}
		const otpExpire = new Date(Date.now() + 5 * 60 * 1000)
		
		const userOtpData = await Otp.findOne({ _user: user._id })
		if (user.isTwoFAEnabled) {
			if (user.authMethod === 'email') {
				if (userOtpData) {
					userOtpData.otp = code
					userOtpData.purpose = OtpTypes.Login
					userOtpData.otpExpireAt = otpExpire
					await userOtpData.save()
				} else {
					await Otp.create({
						otp: code,
						otpExpireAt: otpExpire,
						purpose: OtpTypes.Login,
						_user: user._id,
					})
				}
				await send_email(user.email, code)
				return res.status(200).json({
					message: 'An OTP has been sent to your email. Please verify it first...',
					data: {
						_user: user._id,
					},
				})
			} else if (user.authMethod === 'phone') {
				if (userOtpData) {
					userOtpData.otp = code
					userOtpData.purpose = OtpTypes.Login
					userOtpData.otpExpireAt = otpExpire
					await userOtpData.save()
				} else {
					await Otp.create({
						otp: code,
						otpExpireAt: otpExpire,
						purpose: OtpTypes.Login,
						_user: user._id,
					})
				}
				await send_sms(user.countryCode, user.phone, code)
				return res.status(200).json({
					message: 'An OTP has been sent to your phone. Please verify it first...',
					data: {
						_user: user._id,
					},
				})
			} else if (user.authMethod === 'authenticator') {
				const { secret, otpauth } = generateTotpSecret(user.email)
				user.secret = secret
				await user.save()
				const qr = await generateTotpQrcode(otpauth)
				return res.status(200).json({
					data: {
						secret: user.secret,
						qrCode: qr,
					},
				})
			}
		} else {
			const payload = {
				_id: user._id.toString(),
				role: user.role,
			}
			const token = generate_token(payload)
			return res.status(200).json({succes:true, token:token})
		}

	} catch (error) {
		console.log(error)
		return res.status(500).json({ message: error.message })
	}
}
