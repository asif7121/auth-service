import { Router } from 'express'
import {
	login_user,
	register_user,
	verify_user_otp,
	profileDetails,
	forgotPassword,
	resetpassword,
	updateUserEmail,
	updateUserPassword,
	updatePhone,
	twofasend,
	profileUpdate,
	verifyNewEmailOtp,
	verifyNewPhoneOtp,
	emailVerification,
	verifyEmail,
} from '@modules/auth/controller'
import { verify_token } from '@middlewares/verify-jwt'

const router = Router()

router.post('/register', register_user)
router.post('/login', login_user)
router.post('/verify-otp', verify_user_otp)
router.post('/send-otp', twofasend)
router.post('/forgot-password', forgotPassword)
router.post('/reset-password', resetpassword)
router.post('/verify/email', emailVerification)
router.post('/verify/email/otp', verifyEmail)

//secure routes
router.use(verify_token)
router.get('/profile', profileDetails)
router.patch('/update-email', updateUserEmail)
router.patch('/update-password', updateUserPassword)
router.patch('/update-phone', updatePhone)
router.patch('/update-profile', profileUpdate)
router.patch('/verify-new-email', verifyNewEmailOtp)
router.patch('/verify-new-phone', verifyNewPhoneOtp)

export default router
