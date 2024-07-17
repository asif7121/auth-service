import { Auth } from '@models/auth'
import bcrypt from 'bcrypt'

export const login = async (email: string, password: string) => {
	const user = await Auth.findOne({ email })
	if (!user) {
		throw new Error('Invalid User')
	}
	const valid_password = await bcrypt.compare(password, user.password)
	if (!valid_password) {
		throw new Error('Invalid credentials')
	}
	return user
}
