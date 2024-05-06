'use client'

import { useToast } from "@/components/ui/use-toast"
import { messageSchema } from "@/schemas/messageSchema"
import { ApiResponse } from "@/types/ApiResponse"
import { zodResolver } from "@hookform/resolvers/zod"
import axios, { AxiosError } from "axios"
import { useParams } from "next/navigation"
import { useState } from "react"
import { useForm } from "react-hook-form"
import * as z from 'zod'
import { Textarea } from "@/components/ui/textarea"

import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Loader2 } from "lucide-react"


export default function (){
    const[isLoading , setIsLoading] = useState(false)
    const params = useParams<{username : string}>()
    const {toast} = useToast()

    const form = useForm({
        resolver : zodResolver(messageSchema)
    })

    const {watch , setValue ,} = form
    const message = watch('sendMessage')
    const onSubmit = async (data : any) =>{
        setIsLoading(true)

        console.log("data",data)
        try {

            const response = await axios.post<ApiResponse>('/api/send-message',{
                content : data.content,
                username : params.username
            })

            form.reset({ ...form.getValues(), content: '' });

            toast({
                title : "Succes",
                description : response.data.message
            })
            
        } catch (error) {
            const axiosError = error as AxiosError<ApiResponse>

            toast({
                title : "Error",
                description : axiosError.response?.data.message,
                variant : "destructive"
            })
        } finally{
            setIsLoading(false)
        }
    }

    return (
        <div className="container mx-auto my-8 p-6 bg-white rounded max-w-4xl">

            <h1 className="text-4xl font-bold mb-6 text-center">
                    Public Profile Link
            </h1>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                    <FormField
                    control={form.control}
                    name="content"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Send your message {params.username}</FormLabel>
                        <FormControl>
                            <Textarea placeholder="Write the message" {...field}
                             className="resize-none"
                            />
                        </FormControl>
                        <FormDescription>
                            This is your public display name.
                        </FormDescription>
                        <FormMessage />
                        </FormItem>
                    )}
                    />
                    <div className="flex justify-center">

                        {isLoading ? (
                            <Button disabled>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />

                                Please wait
                            </Button>
                        ) : (
                            <Button type = "submit" disabled = {isLoading}>
                                Send Message
                            </Button>
                        )}

                    </div>
                </form>
            </Form>
        </div>
    )
}