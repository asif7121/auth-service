import { updateEmail } from "@services/auth-services";
import { Request, Response } from "express";



export const updateUserEmail = async (req:Request, res:Response) => {
    try {
        const {_id} = req.user
        const { newEmail } = req.body
        const user = await updateEmail(_id, newEmail)
        return res.status(200).json({message:'Email updated successfully.', data:{email:user.email}})
    } catch (error) {
        console.log(error)
        return res.status(500).json({error:error.message})
    }
}