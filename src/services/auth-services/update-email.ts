import { generate_random_number } from "@core/utils"
import { Auth } from "@models/auth"
import { send_email } from "@services/two-factor-auth"




export const updateEmail = async (userId:string, newEmail:string) => {
	const user = await Auth.findById(userId)
	if (!user) throw new Error('User not found.')
	if (user.email === newEmail) {
		throw new Error('Existing email and entered email cannot be same')
	}
	user.email = newEmail
	const otp = generate_random_number(6).toString()
	user.otp = otp
	await user.save()
	await send_email(user.email, otp)
	return user
}