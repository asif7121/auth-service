import { Auth } from "@models/auth"



export const viewProfile = async (userId:string) => {
	const user = await Auth.findById(userId).select(
		'-password -resetPasswordToken'
	)
	if (!user) throw new Error('User not found.')

	return user
}