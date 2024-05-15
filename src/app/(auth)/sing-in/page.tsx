"use client"
import { useToast } from "@/components/ui/use-toast"
import { singinSchema } from "@/schemas/singinSchema"
import { zodResolver } from "@hookform/resolvers/zod"
import { signIn } from "next-auth/react"
import { useRouter} from "next/navigation"
import { useForm } from "react-hook-form"
import * as z from "zod"
import axios , { AxiosError } from 'axios'
import { ApiResponse } from "@/types/ApiResponse"
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


export default function page(){
  const router= useRouter()
  const {toast} = useToast()

  const form  = useForm<z.infer<typeof singinSchema>>({
    resolver : zodResolver(singinSchema),
    defaultValues : {
      identifier : '',
      password : ''
    }
  })

  const onSubmit = async (data : z.infer<typeof singinSchema>)=>{
    console.log("Email :",data.identifier)
    const result = await signIn(
      'credentials',
      {
        redirect : false,
        identifier : data.identifier,
        password : data.password
      }
    )

    console.log("Result : ",result)

    if(result?.error){
      toast({
        title : "Log In failed",
        description : "Incorrect Username or Password",
        variant:"destructive"
      })
    }

    if(result?.url){
      console.log("Login succesfully")
      router.replace('/dashboard')
    }
  }



  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-800">
    <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
        <div className="text-center">
            <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">
                Join Riddle Message
            </h1>
            <p className="mb-4">Sign In to start your anonymous Riddle</p>
        </div>

        <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="identifier"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder="Email" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input type = "password" placeholder="Password" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Submit</Button>
      </form>
    </Form>

    <div className="text-center mt-4">
                <p>
                    <a href='/sing-up' className="text-blue-600 hover:text-blue-800">
                      Create Account
                    </a>
               </p>
              </div>
    </div>
</div>
  )
}