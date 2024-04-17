import UserModel from "@/model/User.Model";
import dbConnect from "@/lib/dbConnect";
import bcrypt from "bcryptjs"
import { sendVerificationEmail } from "@/helper/sendVerificationEmail";


export async function POST(req : Request){
    await dbConnect()

    try {

        const {username , email , password} = await req.json()

        const exitingUserVerifyByUsername = await UserModel.findOne({
            username,
            isVerified : true
        })

        if(exitingUserVerifyByUsername){
            return Response.json(
                {
                    success : false,
                    message : "User name already taken"
                },
                {
                    status : 404
                }
            )
        }

        const exitingUserByemail = await UserModel.findOne({
            email
        })

        const verifyCode = Math.floor(100000 + Math.random() * 900000).toString()

        if(exitingUserByemail){
            if(exitingUserByemail.isVerified){
                return Response.json(
                    {
                        success : false,
                        message : "User existed with this email"
                    },
                    {
                        status : 500
                    }
                )
            }else{
                const exipryDate = new Date()
                exipryDate.setHours(exipryDate.getHours() + 1)

                const hashedPassword = await bcrypt.hash(password , 10)

                exitingUserByemail.password = hashedPassword
                exitingUserByemail.verifyCode = verifyCode
                exitingUserByemail.verifyCodeExpiry = exipryDate

                await exitingUserByemail.save()
            }

        }else{
            const hashedPassword = await bcrypt.hash(password , 10)
            const exipryDate = new Date()
            exipryDate.setHours(exipryDate.getHours() + 1)

           const newUser = new  UserModel({
                username,
                email,
                password : hashedPassword,
                verifyCode : verifyCode,
                verifyCodeExpiry : exipryDate,
                messages : []
            })

            await newUser.save()
        }



        // send email to verify
        const emailResponse = await sendVerificationEmail(
            email,
            username,
            verifyCode
        )

        if(!emailResponse.success){
            return Response.json(
                {
                    success : false,
                    message : emailResponse.message
                },
                {
                    status :400
                }
            )
        }

        return Response.json(
            {
                success : true,
                message : "User register successfully. Please verify your email"
            },
            {
                status : 500
            }
        )
        
    } catch (error) {
        console.error("Error registering the user")

        return Response.json(
            {
                success : false,
                message : "failed to registered the user"
            },
            {
                status : 500
            }
        )
    }
}