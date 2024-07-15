import { Router } from "express"
import { login_user, register_user, verify_user_otp } from "../controller"


const router = Router()

router.post('/register', register_user)
router.post('/login', login_user)
router.post('/verify-otp', verify_user_otp)

export default router