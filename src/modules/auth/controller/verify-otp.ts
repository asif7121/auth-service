import { generate_token } from "@helpers/jwt.helper"
import { User } from "@models/user"
import { Request, Response } from "express"


export const verify_user_otp = async (req: Request, res: Response) => {
	try {
		const { email, otp } = req.body
		if ([email, otp].some((field: string) => field.trim() === '')) {
			return res.status(400).json({ error: 'Fields cannot be empty' })
		}
		const user = await User.findOne({ email })
		if (!user) {
			return res.status(400).json({ error: 'User not found' })
		}
		// Check if OTP exists in database
		if (!user.otp) {
			return res.status(400).json({ error: 'OTP is expired ' })
		}
		// Check if OTP matches
		if (user.otp !== otp) {
			return res.status(400).json({ error: 'Invalid OTP' })
		}
		// OTP is valid, then generate token and return it
		user.isVerified = true
		user.otp = null // Clear the OTP
		const payload = {
			_id: user._id.toString(),
		}
		const token = generate_token(payload)
		
		await user.save()
		return res.status(200).json({ message: 'OTP verified successfully', user: user._id, token })
	} catch (error) {
		console.log(error)
		return res.status(500).json({ error: error.message })
	}
}