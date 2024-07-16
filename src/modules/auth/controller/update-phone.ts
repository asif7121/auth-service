import { updatePhoneNumber } from "@services/auth-services";
import { Request, Response } from "express";



export const updatePhone = async (req:Request, res:Response) => {
    try {
        const { _id } = req.user
        const { newPhone } = req.body
        const user = await updatePhoneNumber(_id, newPhone)
        return res.status(200).json({message:'Phone number updated successfully', data:{new_phone: user.phone}})
    } catch (error) {
        console.log(error)
        res.status(500).json({error:error.message})
    }
}