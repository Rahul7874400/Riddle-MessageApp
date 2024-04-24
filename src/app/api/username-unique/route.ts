import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User.Model";
import { usernameValidation } from "@/schemas/singupSchema";
import { z } from "zod";

const usernameQuerySchema = z.object({
    username : usernameValidation
})

export async function GET(request : Request){
    await dbConnect()

    try {
        const {searchParams} = new URL(request.url)
        const queryParams = {
            username : searchParams.get('username')
        }

        

        // validate with zod
        const result = usernameQuerySchema.safeParse(queryParams)

        console.log("eresult : ",result)

        if(!result.success){
            const usernameError = result.error.format().username?._errors || []
            return Response.json({
                success : false,
                message : usernameError?.length >0 ? usernameError.join(',') : "Invalid user name"
            },
            {
            status : 404
        })
        }

        const {username} = result.data

        const existingVerifiedUser = await UserModel.findOne({
            username,
            isVerified : true
        })

        if(existingVerifiedUser){
            return Response.json({
                success : false,
                message : "User name already taken"
            },
        {
            status : 404
        })
        }

        return Response.json({
            success : true,
            message  : "user name is unique"
        },{
            status : 404
        })

        
    } catch (error) {
        console.error("Error checking in user name",error)
        return Response.json({
            success : false,
            message : "Error checking user name"
        },
    {
        status : 500
    })
    }
}


