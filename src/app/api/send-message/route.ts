import { Message } from "@/model/User.Model";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User.Model";
import { date } from "zod";


export async function POST(request : Request){
    await dbConnect()

    const { username , content } = await request.json()

    try {
        const user = await UserModel.findOne({username})

        if(!user){
            return Response.json(
                {
                    success : false,
                    message : "User not found"
                },
                {
                    status : 500
                }
            )
        }

        // check user accepring the message

        if(!user.isAccepting){
            return Response.json(
                {
                    success : false,
                    message : "User not Accepting the message"
                },
                {
                    status : 401
                }
            )
        }

        const newMessage = {content , createdAt : new Date()}

        user.messages.push(newMessage as Message)
        await user.save()

        return Response.json(
            {
                success : true,
                message : "Message send Succesfully"
            },
            {
                status : 202
            }
        )

    } catch (error) {
        console.log("Something went worng while sending the message",error)
        return Response.json(
            {
                success : false,
                message : "Something went worng while sending the message"
            },
            {
                status : 404
            }
        )
    }
} 


