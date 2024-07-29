import { Schema, Document, model } from 'mongoose'

export enum OtpTypes {
    Signup = 'SIGN_UP',
    Login = 'LOGIN',
    UpdateEmail = 'UPDATE_EMAIL',
    UpdatePhone = 'UPDATE_PHONE',
    VerifyExistingEmail = 'VERIFY_EXISTING_EMAIL',
    VerifyExistingPhone = 'VERIFY_EXISTING_PHONE',
}
interface IOtp extends Document {
	otp?: string
	otpExpireAt?: Date
	purpose?:OtpTypes
	_user: Schema.Types.ObjectId
}

const otpSchema: Schema = new Schema(
	{
		otp: {
			type: String,
		},
		otpExpireAt: {
			type: Date,
		},
		purpose: {
			type: String,
			enum: Object.values(OtpTypes),
		},
		_user: {
			type: Schema.Types.ObjectId,
			ref: 'User',
			required: true,
		},
	},
	{
		timestamps: true,
		versionKey: false,
	}
)

export const Otp = model<IOtp>('Otp', otpSchema)
