import { Auth } from "@models/auth"




export const updateProfile = async (userId: string, address:string) => {
    const user = await Auth.findById(userId)
    if (!user) throw new Error('User not found.')
    user.address = address
    await user.save()
    return user
}