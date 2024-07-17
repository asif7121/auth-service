import { generate_random_number } from "@core/utils"
import { Auth } from "@models/auth"
import { send_email } from "@services/two-factor-auth"




export const updateEmail = async (userId:string, newEmail:string) => {
	const user = await Auth.findByIdAndUpdate(userId, {
		email: newEmail
	},{new:true})
	if (!user) throw new Error('User not found.')
	const otp = generate_random_number(6).toString()
	await send_email(user.email, otp)
	user.otp = otp
	await user.save()
	return user
}