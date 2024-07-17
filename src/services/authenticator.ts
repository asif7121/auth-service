import {  authenticator } from 'otplib'
import qrcode from 'qrcode'



// Generate TOTP secret and otpauth URL
export const generateTotpSecret = (email: string) => {
	const secret = authenticator.generateSecret()
	const otpauth = authenticator.keyuri(email, 'Authenticator', secret)
	return { secret, otpauth }
}

// Generate QR code for TOTP secret
export const generateTotpQrcode = async (otpauth: string) => {
	try {
		const qrCodeDataUrl = await qrcode.toDataURL(otpauth)
		return qrCodeDataUrl
	} catch (error) {
		throw new Error('Error generating QR code')
	}
}
// Verify TOTP token
export const verifyTotpToken = (token: string, secret: string):boolean => {
	return authenticator.check(token, secret)
}
