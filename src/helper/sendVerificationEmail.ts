import { resend } from "@/lib/resend";
import  VerificationEmail  from "../../emails/verificationEmail"
import { ApiResponse } from "@/types/ApiResponse";

export async function sendVerificationEmail(
    email:string,
    username:string,
    verifyCode:string
) : Promise<ApiResponse>{
    try {

        const { data, error } = await resend.emails.send({
            from: 'Acme <onboarding@resend.dev>',
            to: email,
            subject: 'Riddle app || Verification code',
            react: VerificationEmail({username , otp : verifyCode}),
          });

          if (error) {
            return {
                success : false,
                message  : error.message || "failed to send the email"
            }
          }
        return {
            success : true,
            message  :"successfully send the email"
        }
        
    } catch (error) {
        console.error("Error in sending email" , error)

        return {
            success : false,
            message  :"failed to send the email"
        }
    }
}