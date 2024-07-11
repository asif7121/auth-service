import { Document, Schema, model } from 'mongoose'

export interface IUser extends Document {
	username: string
	password: string
	email: string
	phone: string
	is2FAVerified?: boolean
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
	is2FAVerified: {
		type: Boolean,
		default:false
	}
})

export const User = model<IUser>('User', UserSchema)
