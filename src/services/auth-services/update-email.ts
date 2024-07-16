import { Auth } from "@models/auth"




export const updateEmail = async (userId:string, newEmail:string) => {
	const user = await Auth.findByIdAndUpdate(userId, {
		email: newEmail
	},{new:true})
	if (!user) throw new Error('User not found.')
	return user
}