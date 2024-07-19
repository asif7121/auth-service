import { Auth } from '@models/auth'
import { Request, Response } from 'express'

export const profileUpdate = async (req: Request, res: Response) => {
	try {
		const { _id } = req.user
		const { address, dob } = req.body
		if ([address, dob].some((field: string) => field.trim() === '')) {
			return res.status(400).json({ error: 'Fields cannot be empty' })
		}
		const user = await Auth.findById(_id).select(
			'-password -resetPasswordToken -auth_method -secret -otp'
		)
		if (address || dob) {
			user.address = address
			user.dob = dob
			await user.save()
			return res.status(200).json({ message: 'Profile Updated...', data: { user: user } })
		}
		return res.status(400).json({ error: 'Please provide some field to update' })
	} catch (error) {
		console.log(error)
		return res.status(500).json({ error: error.message })
	}
}
