import { viewProfile } from "@services/auth-services";
import { Request, Response } from "express";




export const profileDetails = async (req:Request, res:Response) => {
	try {
		const { _id } = req.user;
		const user = await viewProfile(_id);
		return res.status(200).json(user);
	} catch (error) {
		return res.status(500).json({ error: error.message });
	}
}