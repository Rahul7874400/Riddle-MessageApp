import { z } from "zod";

export const usernameValidation = z
.string()
.min(2,"User name alteast of two chararcter")
.max(20,"user name is not more than 20 character")

export const singupSchema = z.object({
    username : usernameValidation,
    email : z.string().email({message : "Invalid email address"}),
    password : z.string().min(6, {message : "password must be atleast 6 character"})
    
})

