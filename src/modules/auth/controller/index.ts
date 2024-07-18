import { verifyNewPhoneOtp } from './verify-phone-otp';
import { verifyNewEmailOtp } from './verify-email-otp';
import { profileUpdate } from './update-profile';
import { twofasend } from './2FA';
import { updatePhone } from './update-phone';
import { updateUserPassword } from './update-password';
import { updateUserEmail } from './update-email';
import { forgotPassword } from './forgot-password';
import { verify_user_otp } from './verify-otp';
import { register_user } from "./register";
import { login_user } from "./login";
import { profileDetails } from './profile';
import { resetpassword } from './reset-password';



export {
    register_user,
    login_user,
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
}