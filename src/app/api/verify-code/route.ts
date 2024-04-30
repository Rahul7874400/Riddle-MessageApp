import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User.Model";
import { z } from "zod";
import { usernameValidation } from "@/schemas/singupSchema";
import { verifySchema } from "@/schemas/verifySchema";


export async function POST(request : Request){
    await dbConnect()

    try {

        const {username , code} = await request.json()
        const decodeUsername = decodeURIComponent(username)

        const user =  await UserModel.findOne({
            username : decodeUsername
        })


        if(!user){
            return Response.json({
                success : true,
                message : "user not found"
            },{
                status : 404
            })
        }

        const isCodeValide = code === user.verifyCode

        const isCodeExpired = new Date(user.verifyCodeExpiry) > new Date()

        if(isCodeValide && isCodeExpired){
            user.isVerified = true
            await user.save()
            return Response.json({
                success : true,
                message : "user is verify successfully"
            },{
                status : 404
            })
        }else if(!isCodeValide){
            return Response.json({
                success : false,
                message : "code is Incorrect"
            },{
                status : 404
            })
        }else{
            return Response.json({
                success : true,
                message : "code is expired"
            },{
                status : 404
            })
        }
    

        
    } catch (error) {
        console.error("Error verifying in code")

        return Response.json({
            success : true,
            message : "Error verifying in code"
        },
    {
        status : 500
    })
    }
} 