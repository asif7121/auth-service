import { Auth } from '@models/auth'
import { Request, Response } from 'express'
import bcrypt from 'bcrypt'



export const register_user = async (req: Request, res: Response) => {
	try {
		const { username, password, email, phone, address, dob } = req.body
		const hashedPassword = await bcrypt.hash(password, 10)
		const user = await Auth.create({ username, password: hashedPassword, email, phone, address, dob })
		return res.status(201).json({_user:user._id})
	} catch (error) {
		console.log(error)
		return res.status(500).json({error:error.message})
	}
	
}
