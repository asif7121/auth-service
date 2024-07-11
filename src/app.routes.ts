import { Router } from "express";
import auth_router from '@modules/auth/user/routes'


const router = Router()

router.use('/auth', auth_router)




export default router