import { Document, Schema, model } from 'mongoose'

export interface IUser extends Document {
	username: string
	password: string
	email: string
	phone: string
	isVerified?: boolean
	otp?: string
	secret?: string
	auth_method?: 'email' | 'phone' | 'authenticator'
}

const UserSchema: Schema = new Schema({
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
})

export const User = model<IUser>('User', UserSchema)
