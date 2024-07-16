import { generateResetToken } from "@services/two-factor-auth"
import { Request, Response } from "express"



export const forgotPassword = async (req:Request, res:Response) => {
	try {
		const { email } = req.body
		const response = await generateResetToken(email)
		 return res.status(200).json(response)
	} catch (error) {
		return res.status(500).json({ error: error.message })
	}
}