import { updateProfile } from "@services/auth-services";
import { Request, Response } from "express";





export const profileUpdate = async (req: Request, res: Response) => {
    try {
        const { _id } = req.user
        const { address } = req.body
        const user = await updateProfile(_id, address)
        return res.status(200).json({message:'Profile Updated...', data:{address:user.address}})
    } catch (error) {
        console.log(error)
        return res.status(500).json({error:error.message})
    }
}