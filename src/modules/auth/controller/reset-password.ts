import { Request, Response } from "express"
import { resetPassword } from "@services/auth-services"


export const resetpassword = async (req:Request, res:Response) => {
	try {
		const {token} = req.params
		const {  newPassword } = req.body
		const response = await resetPassword(token, newPassword)
		return res.status(200).json(response)
    } catch (error) {
        console.log(error)
        return res.status(500).json({ error: error.message })
	}
}