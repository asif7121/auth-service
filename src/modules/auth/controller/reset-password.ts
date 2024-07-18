import { Request, Response } from "express"
import { Auth } from "@models/auth"
import bcrypt from 'bcrypt'


export const resetpassword = async (req:Request, res:Response) => {
	try {
		const {token, userId} = req.query
		const {  newPassword } = req.body
		const user = await Auth.findOne({
			_id: userId,
			resetPasswordToken: token
		})
		if (!user) {
			return res.status(400).json({ error: 'Reset password token is invalid.' })
		}
		const newHashedPassword = await bcrypt.hash(newPassword, 10)
		// Update password and clear the reset token
		user.password = newHashedPassword
		user.resetPasswordToken = undefined
		await user.save()
		return res.status(200).json({message: 'Your password has been updated.'})
    } catch (error) {
        console.log(error)
        return res.status(500).json({ error: error.message })
	}
}