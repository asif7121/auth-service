import { Auth } from "@models/auth"
import bcrypt from 'bcrypt'


export const updatePassword = async (userId: string,oldPassword:string, newPassword:string) => {
    const user = await Auth.findById(userId)
    if (!user) {
        throw new Error('Invalid user id')
    }
    const compareOldPass = await bcrypt.compare(oldPassword, user.password)
	if (!compareOldPass) {
		throw new Error('Enter correct password..')
    }
    const password = await bcrypt.hash(newPassword,10)
    user.password = password
    await user.save()
    return user
}



