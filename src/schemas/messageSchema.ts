import { Content } from "next/font/google";
import { z } from "zod";


export const messageSchema = z.object({
    Content : z.string()
    .min(10 , {message : "Content must contain atleast 10 character"})
    .max(300 , {message : "content must not have more than 300 character"})
})