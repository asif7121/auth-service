import { Auth } from "@models/auth";
import { Request, Response } from "express";
import bcrypt from 'bcrypt'


export const updateUserPassword = async (req:Request, res:Response) => {
    try {
        const { _id } = req.user
        const { oldPass, newPass } = req.body
        const user = await Auth.findById(_id)
		if (!user) {
			return res.status(400).json({error: 'Invalid user request'})
		}
		const compareOldPass = await bcrypt.compare(oldPass, user.password)
		if (!compareOldPass) {
			return res.status(400).json({ error: 'Please enter correct password.' })
			
		}
		const password = await bcrypt.hash(newPass, 10)
		user.password = password
		await user.save()
        return res.status(200).json({message:'Password updated successfully',data:{_user:user._id}})

    } catch (error) {
        console.log(error)
        return res.status(500).json({error:error.message})
    }
}