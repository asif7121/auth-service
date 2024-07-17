import { generate_random_number } from "@core/utils";
import { updateEmail } from "@services/auth-services";
import { send_email } from "@services/two-factor-auth";
import { Request, Response } from "express";



export const updateUserEmail = async (req:Request, res:Response) => {
    try {
        const {_id} = req.user
        const { newEmail } = req.body
        const user = await updateEmail(_id, newEmail)
        return res.status(200).json({message:'An otp has been sent to verify your email.', data:{email:user.email, _user:user._id}})
    } catch (error) {
        console.log(error)
        return res.status(500).json({error:error.message})
    }
}