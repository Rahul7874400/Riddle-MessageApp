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
import { useCompletion } from "ai/react"

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

import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
  } from "@/components/ui/card"
import { Loader2 } from "lucide-react"
import  Link  from "next/link"
import { Separator } from "@radix-ui/react-separator"

const initialString = "What's your favorite movie?||Do you have any pets?||What's your dream job?";
const specialChar = "||"

const parseMessageString = (messageString : string):string[] =>{
    return messageString.split(specialChar)
}
export default function (){
    const[isLoading , setIsLoading] = useState(false)
    //const [isSuggestLoading , setIssuggestLoading] = useState(false)
    const params = useParams<{username : string}>()
    const {toast} = useToast()

    const form = useForm({
        resolver : zodResolver(messageSchema)
    })

    const {watch , setValue ,} = form
    const message = watch('content')



    const handleMessage = (message :string )=>{
        setValue('content',message)
    }

    const {
        complete,
        completion,
        isLoading : isSuggestLoading,
        error,
        handleSubmit
    } = useCompletion({
        api : '/api/suggest-messages',
        initialCompletion : initialString
    })
    const onSubmit = async (data : any) =>{
        setIsLoading(true)

        //console.log("data",data)
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

    const fetchSuggestMessage = async ()=>{
        console.log("Inside the fetch suggested message")
        try {
            complete('')
        } catch (error) {
            const axiosError = error as AxiosError<ApiResponse>
            toast({
                title : "Error",
                description : axiosError.response?.data.message
            })
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

            <div className="space-y-8 my-8">
                <div className="space-y-2">
                    <Button 
                    onClick={fetchSuggestMessage}
                    disabled = {isSuggestLoading}
                    className="my-2"
                    >
                        Suggest Message
                    </Button>
                    <p>Click any message below it to suggest it</p>
                </div>

                <Card>
                <CardHeader>
                <h3 className="text-xl font-semibold">Messages</h3>
                </CardHeader>
                <CardContent className="flex flex-col space-y-4">
                    {error ? (
                        <p className="text-red-500">{error.message}</p>
                    ) : (
                        parseMessageString(completion).map( (message,index)=>(
                            <Button
                            key={index}
                            onClick={ ()=>handleMessage(message) }
                            className="mb-2"
                            variant="outline"
                            >
                                {message}
                            </Button>
                        ) )
                    )}
                </CardContent>
                </Card>
            </div>
            <Separator className="my-6"/>

            <div className="text-center">
                <div className="mb-4">Get Your Message</div>

                <Link href='/sing-up'>
                    <Button>
                        Create Account

                    </Button>
                </Link>

            </div>
        </div>
    )
}