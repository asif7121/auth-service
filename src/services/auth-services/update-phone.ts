import { generate_random_number } from '@core/utils'
import { Auth } from '@models/auth'
import { send_sms } from '@services/two-factor-auth'

export const updatePhoneNumber = async (userId: string, newPhoneNumber: string) => {
	const user = await Auth.findById(userId)
	if (!user) throw new Error('User not found.')
	if (user.phone === newPhoneNumber) {
		throw new Error('Existing phone and entered phone cannot be same.')
	}
	const otp = generate_random_number(6).toString()
	user.phone = newPhoneNumber
	user.otp = otp
	await user.save()
	await send_sms(user.phone, otp)
	return user
}
