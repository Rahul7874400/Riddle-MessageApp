import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User.Model";
import { User } from "next-auth";

export async function POST(request : Request){
    await dbConnect()
    const session = await getServerSession(authOptions)
    const user = session?.user

    if(!session || !user){
        return Response.json(
            {
              success : false,
              message : "Please login frist"  
            },
            {
                status  :404
            }
        )
    }

    const userId = user._id

    const {acceptingMessage} = await request.json()

    try {
        const updatedUser = await UserModel.findByIdAndUpdate(
            userId,
            {
                isAccepting : acceptingMessage
            },{
                new : true
            }
        )

        if(!updatedUser){
            return Response.json(
                {
                    success : false,
                    message : "failed to update the user status accepting message"
                },
                {
                    status : 500
                }
            )
        }

        return Response.json(
            {
                success : true,
                message : "Acccepting status of user is updated successfully",
                updatedUser
            },
            {
                status : 200
            }
        )
    } catch (error) {

        console.log("failed to update the user status accepting message")

        return Response.json(
            {
                success : false,
                message : "failed to update the user status accepting message"
            },
            {
                status : 404
            }
        )
        
    }

}


export async function GET(request : Request){
    await dbConnect()

    const session = await getServerSession(authOptions)

    const user = session?.user

    if(!session || !user){
        return Response.json(
            {
              success : false,
              message : "Please login frist"  
            },
            {
                status  :404
            }
        ) 
    }

    const userId = user._id

    try {
        const existedUser = await UserModel.findById(userId)

        if(!existedUser){
            return Response.json(
                {
                    success : false,
                    message : "user not found"
                },
                {
                    status : 500
                }
            )
        }

        const status = existedUser.isAccepting

        return Response.json(
            {
                success : true,
                message : "User message accepting status get successfully",
                isAcceptingMessage : status
            }
        )
        
    } catch (error) {
        console.log("failed to get the user status accepting message")

        return Response.json(
            {
                success : false,
                message : "failed to get the user status accepting message"
            },
            {
                status : 404
            }
        )
    }
}