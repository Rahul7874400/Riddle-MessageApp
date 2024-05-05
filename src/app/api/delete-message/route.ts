import { getServerSession } from "next-auth";
import UserModel from "@/model/User.Model";
import dbConnect from "@/lib/dbConnect";
import { authOptions } from "../auth/[...nextauth]/options";


export async function DELETE(request : Request){
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
                status : 401
            }
        )
    }

    const {searchParams} = new URL(request.url)
    const queryParams = {
            messageId : searchParams.get('messageId')
        }

    try {
        const updatedResult = await UserModel.updateOne(
            {_id : user._id},
            {$pull : {messages : {_id : queryParams.messageId}}}
            
        )

        if(updatedResult.modifiedCount ==0 ){
            return Response.json(
                {
                    success : false,
                    message : "Message not found or Already deleted"
                },
                {
                    status : 401
                }
            )
        }

        return Response.json(
            {
                success : true,
                message : "Message deleted Succesfully"
            },
            {
                status : 201
            }
        )
    } catch (error) {
        console.log("Error in deleting the message",error)
        return Response.json(
            {
                success : false,
                message : "Error in deleting the message"
            },
            {
                status : 500
            }
        )
    }
}