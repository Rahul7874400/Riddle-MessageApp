import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcryptjs from "bcryptjs"
import UserModel from "@/model/User.Model";
import dbConnect from "@/lib/dbConnect";
import { promises } from "readline";


export const authOptions : NextAuthOptions = {
    providers : [
        CredentialsProvider({
            id : "credentials",
            name : "credentials",
            credentials: {
                email: { label: "email", type: "text" },
                password: { label: "Password", type: "password" }
              },
            async authorize(credentials : any) : Promise<any>{
                await dbConnect()

                try {
                    const user = await UserModel.findOne({
                        $or : [
                            {email : credentials.identifier},
                            {username : credentials.identifier}
                        ]
                    })

                    if(!user){
                        throw new Error("user with this email does not exist")
                    }

                    if(!user.isVerified){
                        throw new Error("Please verify your account first")
                    }

                    const isPassword = await bcryptjs.compare(credentials.password , user.password)
                    if(!isPassword){
                        throw new Error('Invalid Password')
                    }

                    return user
                } catch (error : any) {
                    throw new Error(error)
                }
            }
        })
    ],
    callbacks : {
        async session({ session, token }) {
            if(token){
                session.user._id  = token._id,
                session.user.username = token.username 
                session.user.isAcceptingMessage = token.isAcceptingMessage
                session.user.isVerified = token.isVerified        
            }
            return session
          },
          async jwt({ token, user }) {
            if(user){
                token._id = user._id?.toString()
                token.username = user.username?.toString()
                token.isVerified = user.isVerified
                token.isAcceptingMessage = user.isAcceptingMessage
            }
            return token
          }
    },
    pages : {
        signIn: '/sing-in'
    },
    session : {
        strategy : "jwt"
    },
    secret : process.env.NEXTAUTH_SECERT
}

