import { toggleTwoFA } from './toggleTwoFA';
import { changeTwoFA } from './change2FA';
import { phoneVerification } from './phoneVerification';
import { emailVerification } from './emailVerification';
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
    emailVerification,
    phoneVerification,
    changeTwoFA,
    toggleTwoFA,
    
}