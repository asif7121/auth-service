import jwt from 'jsonwebtoken'
import { ObjectId } from 'mongoose'

export interface IPayload{
    _id:string
}

export const generate_token = (payload:IPayload): string => {
   
    const token = jwt.sign(
		{
			_id: payload,
		},
		process.env.JWT_SECRET,
		{ expiresIn: process.env.JWT_EXPIRE }
	)

    return token
}