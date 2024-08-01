import { generate_random_number} from '@core/utils'
import { User } from '@models/auth'
import { Otp, OtpTypes } from '@models/otp'
import { generateTotpQrcode, generateTotpSecret } from '@services/authenticator'
import { send_email, send_sms } from '@services/two-factor-auth'
import { Request, Response } from 'express'
import { isValidObjectId } from 'mongoose'

export const twofasend = async (req: Request, res: Response) => {
	try {
		const { id, authMethod } = req.body
		const code = generate_random_number(6).toString()

		if (!isValidObjectId(id)) {
			return res.status(400).json({ error: 'Invalid ObjectId..' })
		}

		const user = await User.findById(id)
		if (!user) {
			return res.status(400).json({ error: 'No user found with this id..' })
		}
		 const otpExpire = new Date(Date.now() + 5 * 60 * 1000)

		if (authMethod === 'email' || authMethod === 'phone') {
			
			const checkUserOtp = await Otp.findOne({ _user: user._id })
			// console.log(otpExpire.toLocaleString())
			if (checkUserOtp) {
				checkUserOtp.otp = code
				checkUserOtp.purpose = OtpTypes.Signup
				checkUserOtp.otpExpireAt = otpExpire
				console.log(`otpExipre:  ${otpExpire.toLocaleString()}`)
				console.log(`data otp:  ${checkUserOtp.otpExpireAt.toLocaleString()}`)
				await checkUserOtp.save()
			} else {
				await Otp.create({
					otp: code,
					otpExpireAt: otpExpire,
					purpose: OtpTypes.Signup,
					_user: user._id,
				})
			}

			if (authMethod === 'email') {
				await send_email(user.email, code)
				user.authMethod = authMethod
				await user.save()
				return res.status(200).json({ message: `OTP sent to email: ${user.email}` })
			} else if (authMethod === 'phone') {
				await send_sms(user.countryCode, user.phone, code)
				user.authMethod = authMethod
				await user.save()
				return res.status(200).json({ message: `OTP sent to phone: ${user.phone}` })
			}
		} else if (authMethod === 'authenticator') {
			const { secret, otpauth } = generateTotpSecret(user.email)
			user.secret = secret
			user.authMethod = authMethod
			await user.save()
			const qr = await generateTotpQrcode(otpauth)
			return res.status(200).json({
				data: {
					secret: user.secret,
					qrCode: qr,
				},
			})
		} else {
			return res.status(400).json({ error: 'Invalid authentication method' })
		}
	} catch (error) {
		console.log(error)
		return res.status(500).json({ error: error.message })
	}
}
