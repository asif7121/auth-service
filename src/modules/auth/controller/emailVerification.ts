import { generate_random_number } from '@core/utils'
import { generate_token } from '@helpers/jwt.helper'
import { Auth } from '@models/auth'
import { Otp } from '@models/otp'
import { send_email } from '@services/two-factor-auth'
import { Request, Response } from 'express'

export const emailVerification = async (req: Request, res: Response) => {
	try {
		const { email } = req.body
		const user = await Auth.findOne({ email: email })
		const code = generate_random_number(6).toString()
		if (!user) {
			return res.status(404).json({ error: 'No user exist by the provided email' })
		}
		const otpData = await Otp.findOne({ _user: user._id })
		if (otpData) {
			otpData.otpCode = code
			await otpData.save()
		} else {
			await Otp.create({
				otpCode: code,
				_user: user._id,
			})
		}
		await send_email(user.email, code)
		return res
			.status(200)
			.json({
				message: 'An OTP has been sent to your email. Please verify it first',
				data: { email: user.email },
			})
	} catch (error) {
		console.log(error)
		return res.status(500).json({ error: error.message })
	}
}

export const verifyEmail = async (req: Request, res: Response) => {
	try {
        const { otp, email } = req.body
        const user = await Auth.findOne({ email: email })
        if (!user) {
			return res.status(404).json({ error: 'No user exist by the provided email' })
        }
		const otpData = await Otp.findOne({ _user: user._id })
        if (otpData.otpCode === otp && user.email === email) {
            user.isEmailVerified = true
            otpData.otpCode = null
            await user.save()
            await otpData.save()
            const payload = {
				_id: user._id.toString(),
			}
            const token = generate_token(payload)
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
