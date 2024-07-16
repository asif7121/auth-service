import { transporter } from "@core/config/email"
import { twilioClient } from "@core/config/sms"
import { Auth } from '@models/auth'
import crypto from 'crypto'

export const send_sms = async (phone: string, code: string) => {
	await twilioClient.messages.create({
		body: `Your verification code is ${code}`,
		from: process.env.TWILIO_PHONE_NUMBER,
		to: `+91${phone}`,
	})
}

export const send_email = async (email: string, code: string) => {
	await transporter.sendMail({
		from: process.env.EMAIL,
		to: email,
		subject: 'Your verification code',
		text: `Your verification code is ${code}`,
	})
}

export const sendPasswordResetEmail = async (user:any, token:string) => {
	const resetUrl = `${process.env.LOCALHOST_URL}/reset-password/${token}`
	await transporter.sendMail({
		from: process.env.EMAIL,
		to: user.email,
		subject: 'Password Reset',
		text: `You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n
				Please click on the following link, or paste this into your browser to complete the process:\n\n
				${resetUrl}\n\n
				If you did not request this, please ignore this email and your password will remain unchanged.\n`,
	})
}

export const generateResetToken = async (email: string) => {
	const user = await Auth.findOne({ email })
	if (!user) throw new Error('No account with that email address exists.')
		const token = crypto.randomBytes(20).toString('hex')
	const newUser = await Auth.findByIdAndUpdate(user._id, {
		resetPasswordToken:token
	}, {
		new:true
	})
	await sendPasswordResetEmail(newUser, token)
	return {token:token}
}