"use client"

import { useToast } from "@/components/ui/use-toast"
import { verifySchema } from "@/schemas/verifySchema"
import { ApiResponse } from "@/types/ApiResponse"
import { zodResolver } from "@hookform/resolvers/zod"
import axios, { AxiosError } from "axios"
import { useParams, useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
 


export default function(){
    const router = useRouter()
    const params = useParams<{username : string}>()
    const {toast} = useToast()
    const form = useForm({
        resolver : zodResolver(verifySchema),
    })

    const onSubmit = async (data :any)=>{
      // console.log("username :",params.username)
      // console.log("code",data.code)
        try {
            const response = await axios.post<ApiResponse>("http://localhost:3000/api/verify-code",{
                username : params.username,
                code : data.code
            })
            console.log(params.username)
            toast({
                title : "Success",
                description : response.data.message
            })

            router.replace(`/sing-in`)
        } catch (error) {
            console.log("Error in verify code",error)
            const axiosError = error as AxiosError<ApiResponse>
            let errorMessage = axiosError.response?.data.message
            toast({
                title : "Verification code failed",
                description : errorMessage,
                variant : "destructive"
            })
        }
    }
    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-800">
        <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
            <div className="text-center">
                <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">
                    Verify Your Account
                </h1>
                <p className="mb-4">Enter the verification sent to Email</p>
            </div>

            <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="code"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Verification Code</FormLabel>
              <FormControl>
                <Input placeholder="verification Code" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Submit</Button>
      </form>
    </Form>

        </div>
    </div>
    )
}