import { Auth } from '@models/auth'
import bcrypt from 'bcrypt'


export const signup = async (
	username: string,
	password: string,
	email: string,
	phone: string,
	address: string
) => {
	const hashedPassword = await bcrypt.hash(password, 10)
	const user = new Auth({ username, password: hashedPassword, email, phone, address})
	await user.save()
	return user
}
