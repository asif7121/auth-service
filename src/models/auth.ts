import { Document, Schema, model } from 'mongoose'

export interface IAuth extends Document {
	username: string
	password: string
	email: string
	phone: string
	isVerified?: boolean
	otp?: string
	secret?: string
	auth_method?: 'email' | 'phone' | 'authenticator'
	isTwoFAEnabled?: boolean
	resetPasswordToken?: string
	address: string
	role?: 'admin' | 'superAdmin' | 'user'
	dob: Date
	temp_email?: string
	temp_phone?: string
}

const AuthSchema: Schema = new Schema(
	{
		username: {
			type: String,
			required: true,
			unique: true,
		},
		password: {
			type: String,
			required: true,
		},
		email: {
			type: String,
			required: true,
			unique: true,
		},
		phone: {
			type: String,
			required: true,
			unique: true,
		},
		isVerified: {
			type: Boolean,
			default: false,
		},
		otp: {
			type: String,
		},
		secret: {
			type: String,
		},
		auth_method: {
			type: String,
			enum: ['email', 'phone', 'authenticator'],
			default: 'email',
		},
		isTwoFAEnabled: {
			type: Boolean,
			default: false,
		},
		resetPasswordToken: {
			type: String,
			default: undefined,
		},
		address: {
			type: String,
			required: true,
		},
		role: {
			type: String,
			enum: ['admin', 'superAdmin', 'user'],
			default : 'user',
		},
		dob: {
			type: Date,
			required: true
		},
		temp_email:{type:String},
		temp_phone:{type:String},
	},
	{
		timestamps: true,
		versionKey: false,
	}
)

export const Auth = model<IAuth>('User', AuthSchema)
