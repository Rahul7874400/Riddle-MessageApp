import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User.Model";
import { User } from "next-auth";
import mongoose from "mongoose";


export async function GET(request : Request){
    await dbConnect()

    const session = await getServerSession(authOptions)
    const user = session?.user

    if(!session || !user){
        return Response.json(
            {
                success : false,
                message : "Unauthorized user"
            },
            {
                status : 500
            }
        )
    }

    const userId = new mongoose.Types.ObjectId(user._id)

    try {
        const userMessage = await UserModel.aggregate([
            {
                $match : {_id : userId}
            },
            {
                $unwind : '$messages'
            },
            {
                $sort : {'messages.createdAt': -1}
            },
            {
                $group : {
                    _id : "$_id",
                    messages : {$push : '$messages'}
                }
            }
        ])

        if(!userMessage || userMessage.length == 0){
            return Response.json(
                {
                    success : false,
                    message : "User not found"
                },
                {
                    status : 404
                }
            )
        }

        return Response.json(
            {
                success : true,
                messages : userMessage[0].messages
            },
            {
                status : 200
            }
        )
        
    } catch (error) {
        console.log("Something went worng while getting the message",error)
        return Response.json(
            {
                success : false,
                message : "Something went worng while getting the message"
            },
            {
                status : 404
            }
        )
    }
}