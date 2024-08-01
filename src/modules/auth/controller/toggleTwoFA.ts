import { User } from "@models/auth";
import { Request, Response } from "express";




export const toggleTwoFA = async (req: Request, res: Response) => {
    try {
        const { _id } = req.user
        const  toggle: boolean  = req.body.toggle
        const user = await User.findById(_id)
        if (!user) {
            return res.status(400).json({ error: 'Login first..' })
        }
        if (toggle) {
            user.isTwoFAEnabled = true
            await user.save()
            return res.status(200).json({message: 'Two FA has been enabled..'})
        }
        user.isTwoFAEnabled = false
        await user.save()
        return res.status(200).json({ message: 'Two FA has been disabled..' })
    } catch (error) {
        console.log(error)
		return res.status(500).json({ error: error.message })
    }
}