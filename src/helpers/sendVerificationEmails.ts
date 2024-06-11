import resend from "@/lib/resend";
import { ApiResponse } from "@/types/ApiResponse";
import VerificationEmail from "../../emails/VerificationEmail";


export async function sendVerificationEmail(
    email: string,
    username: string,
    verifyCode: string
): Promise<ApiResponse> {
    try {
        await resend.emails.send({
            from: 'dev@hiteshchoudhary.com',
            to: email,
            subject: 'Mystry-Message | Verification code',
            react: VerificationEmail({ username, otp: verifyCode }),
        });
        return { success: true, message: 'Verification email sent successfully.' };
    } catch (emailError) {
        console.error("Error sending verification email", emailError)
        return { success: false, message: 'Failed to send verification email.' };
    }
}