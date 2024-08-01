import { isValidDate } from '@core/utils'
import { User } from '@models/auth'
import { Request, Response } from 'express'

export const profileUpdate = async (req: Request, res: Response) => {
	try {
		const { _id } = req.user
		const { address, dob } = req.body
		if (!isValidDate(dob)) {
			return res.status(400).json({ error: 'Invalid date of birth' })
		}
		const user = await User.findById(_id).select(
			'-password -resetPasswordToken -auth_method -secret -tempEmail -tempPhone -tempCountryCode '
		)
		if (address !== undefined) user.address = address
		if (dob !== undefined) user.dob = dob
		await user.save()
		return res.status(200).json({ message: 'Profile Updated...', data: user })
	} catch (error) {
		console.log(error)
		return res.status(500).json({ error: error.message })
	}
}
