import { Request, Response } from "express"
import { User } from "@models/auth"
import bcrypt from 'bcrypt'
import crypto from 'crypto'


export const resetpassword = async (req:Request, res:Response) => {
	try {
		const {token, userId} = req.query
		const { newPassword } = req.body
		 const resetToken = token.toString()
			const hashedToken = crypto.createHash('sha256').update(resetToken).digest('hex')
		const user = await User.findOne({
			resetPasswordToken: hashedToken,
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