import { updatePassword } from "@services/auth-services";
import { Request, Response } from "express";



export const updateUserPassword = async (req:Request, res:Response) => {
    try {
        const { _id } = req.user
        const { oldPass, newPass } = req.body
        const user = await updatePassword(_id, oldPass, newPass)
        return res.status(200).json({message:'Password updated successfully',data:{_user:user._id}})

    } catch (error) {
        console.log(error)
        return res.status(500).json({error:error.message})
    }
}