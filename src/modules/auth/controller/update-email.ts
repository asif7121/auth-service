import { generate_random_number } from '@core/utils'
import { Auth } from '@models/auth'
import { send_email } from '@services/two-factor-auth'
import { Request, Response } from 'express'

export const updateUserEmail = async (req: Request, res: Response) => {
	try {
		const { _id } = req.user
		const newEmail: string = req.body.newEmail
		const user = await Auth.findById(_id)
		if (!user) {
			return res.status(400).json({ error: 'Login first..' })
		}
		if (user.email === newEmail) {
			return res
				.status(400)
				.json({ error: 'Existing email and entered email cannot be same' })
		}
		const otp = generate_random_number(6).toString()
		user.otp = otp
		await user.save()
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
