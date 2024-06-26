"use client"

import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
  } from "@/components/ui/card"

  import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
  } from "@/components/ui/alert-dialog"

import { Button } from "./ui/button"
import { X } from "lucide-react"
import { Message } from "@/model/User.Model"
import { useToast } from "./ui/use-toast"
import axios from "axios"
import { ApiResponse } from "@/types/ApiResponse"
import { stringify } from "querystring"

  
  type messageCardProps = {
    message : Message,
    onMessageDelete :  (messageId : string) => void
  }

export default function MessageCard({message , onMessageDelete} : messageCardProps){
    const {toast} = useToast()

    const handleDelete = async ()=>{
       const response = await  axios.delete<ApiResponse>(`/api/delete-message?messageId=${message._id}`)
       toast({
        title : response.data.message
       })

       onMessageDelete(message._id)
    }
    return (
        <Card>
        <CardHeader>
            <CardTitle>{message.content}</CardTitle>
            <AlertDialog>
            <AlertDialogTrigger asChild>
                <Button variant="destructive" className="w-20 h-15"><X className="w-10 h-10"/></Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete your
                    account and remove your data from our servers.
                </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction  onClick={handleDelete}>Continue</AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
            </AlertDialog>
            <CardDescription></CardDescription>
        </CardHeader>
        <CardContent>
        </CardContent>
        <CardFooter>
        </CardFooter>
        </Card>

    )
}