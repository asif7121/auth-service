import { Router } from "express"
import { login_user, register_user, verify_user_otp, profileDetails, forgotPassword, resetpassword, updateUserEmail, updateUserPassword, updatePhone } from "@modules/auth/controller"
import { verify_token } from "@middlewares/verify-jwt"


const router = Router()

router.post('/register', register_user)
router.post('/login', login_user)
router.post('/verify-otp', verify_user_otp)

//secure routes
router.use(verify_token)
router.get('/profile', profileDetails)
router.post('/forgot-password', forgotPassword)
router.post('/reset-password/:token', resetpassword)
router.patch('/update-email', updateUserEmail)
router.patch('/update-password', updateUserPassword)
router.patch('/update-phone', updatePhone)

export default router