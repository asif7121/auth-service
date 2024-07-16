import { Auth } from "@models/auth"




export const updatePhoneNumber = async (userId:string, newPhoneNumber:string) => {
	const user = await Auth.findById(userId)
	if (!user) throw new Error('User not found.')
	user.phone = newPhoneNumber
	await user.save()
	return user
}