import { User } from '@models/auth'
import { Request, Response } from 'express'

export const changeTwoFA = async (req: Request, res: Response) => {
    try {
       const {_id} = req.user
		const {authMethod} = req.body
		const user = await User.findById(_id)   
		if (!user) {
			return res.status(400).json({ error: 'Invalid user..' })
		}
		if (authMethod === 'email') {
			user.authMethod = authMethod
			await user.save()
			return res
				.status(200)
				.json({ message: 'Userentication method has been changed to email.' })
		} else if (authMethod === 'phone') {
			user.authMethod = authMethod
			await user.save()
			return res
				.status(200)
				.json({ message: 'Userentication method has been changed to phone.' })
        } else if (authMethod === 'authenticator') {
            user.authMethod = authMethod
			await user.save()
			return res
				.status(200)
				.json({ message: 'Userentication method has been changed to authenticator.' })
        }
		return res.status(400).json({ error: 'Invalid authentication method.' })
	} catch (error) {
		console.log(error)
		return res.status(500).json({ error: error.message })
	}
}
