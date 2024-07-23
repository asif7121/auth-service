import { Document, Schema, model } from 'mongoose'

export interface IAuth extends Document {
	username: string
	password: string
	email: string
	phone: string
	isEmailVerified?: boolean
	isPhoneVerified?: boolean
	isVerified?: boolean
	secret?: string
	authMethod?: 'email' | 'phone' | 'authenticator'
	isTwoFAEnabled?: boolean
	resetPasswordToken?: string
	address: string
	role?: 'admin' | 'superAdmin' | 'user'
	dob: Date
	tempEmail?: string
	tempPhone?: string
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
		isEmailVerified: {
			type: Boolean,
			default: false,
		},
		isPhoneVerified: {
			type: Boolean,
			default: false,
		},

		secret: {
			type: String,
		},
		authMethod: {
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
			default: 'user',
		},
		dob: {
			type: Date,
			required: true,
		},
		tempEmail: { type: String },
		tempPhone: { type: String },
	},
	{
		timestamps: true,
		versionKey: false,
	}
)

export const Auth = model<IAuth>('User', AuthSchema)
