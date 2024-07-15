import { transporter } from "@core/config/email"
import { twilioClient } from "@core/config/sms"



export const send_sms = async (phone: string, code: string) => {
	await twilioClient.messages.create({
		body: `Your verification code is ${code}`,
		from: process.env.TWILIO_PHONE_NUMBER,
		to: phone,
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
