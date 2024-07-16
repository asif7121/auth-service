import { Auth } from "@models/auth"
import bcrypt from "bcrypt"

export const resetPassword = async (token:any, newPassword:string) => {
	let user = await Auth.findOne({
		resetPasswordToken: token,
	})
	if (!user) throw new Error('Password reset token is invalid.')
	const newHashedPassword = await bcrypt.hash(newPassword, 10)
	// Update password and clear the reset token
	const updatedUser = await Auth.findByIdAndUpdate(
		user._id,
		{
			password: newHashedPassword,
			resetPasswordToken: "",
		},
		{ new: true }
	)
	if (!updatedUser) throw new Error('Failed to update the password.')
	return {_user: updatedUser._id}
}