"use client"
 
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z  from "zod"
import Link from "next/link"
import { useEffect, useState } from "react"
import { useDebounceCallback } from 'usehooks-ts'
import { useToast } from "@/components/ui/use-toast"
import { useRouter } from "next/navigation"
import { singupSchema } from "@/schemas/singupSchema"
import axios , { AxiosError } from 'axios'
import { ApiResponse } from "@/types/ApiResponse"
import { Form, 
    FormField, 
    FormItem, 
    FormLabel, 
    FormControl,  
    FormMessage,} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"





export default function page(){
    const [username, setUsername] = useState('')
    const [usernameMessage , setUsernameMessage] = useState('')
    const [isCheckingUsername , setIsCheckingUsername] = useState(false)
    const [isSubmitting , setIsSubmitting] = useState(false)

    const { toast } = useToast()
    const router = useRouter()
    const debouncedValue = useDebounceCallback(setUsername , 300)

    // zod implementation
    const form = useForm({
        resolver : zodResolver(singupSchema),
        defaultValues : {
            username : '',
            email : '',
            password : ''
        }
    })

    useEffect(()=>{
        const checkUsernameUnique = async ()=>{
            if(username){
                setIsCheckingUsername(true)
                setUsernameMessage('')
                try {
                    const response = await axios.get(`/api/username-unique?username=${username}`)
                    console.log(response)
                    setUsernameMessage(response.data.message)
    
                } catch (error) {
                    const axiosError = error as AxiosError<ApiResponse>
                    setUsernameMessage(
                        axiosError.response?.data.message ?? "Error checking username"
                    )
                }finally{
                    setIsCheckingUsername(false)
                }
            }
        }

        checkUsernameUnique()
    },[username])


    const onSubmit = async(data : z.infer<typeof singupSchema>)=>{
        setIsSubmitting(true)

        try {
            const response = await axios.post('/api/sing-up',data)
            toast({
                title : 'Success',
                description : response.data.message
            })

           router.push(`/verify/${username}`)
            
        } catch (error) {
            console.error("Error in singup",error)
            const axiosError = error as AxiosError<ApiResponse>
            let errorMessage = axiosError.response?.data.message || "Error in Signup"
            toast({
                title : 'Signup Failed',
                description : errorMessage,
                variant : "destructive"
            }) 
        }finally{
            setIsSubmitting(false)
            form.reset({ ...form.getValues(), username: '',email : '',password : '' });
        }
    }


    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-800">
            <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
                <div className="text-center">
                    <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">
                        Join Riddle Message
                    </h1>
                    <p className="mb-4">Sign up to start your anonymous Riddle</p>
                </div>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                        <FormField
                        name = "username"
                        control={form.control}
                        render={({ field }) => (
                            <FormItem>
                              <FormLabel>Username</FormLabel>
                              <FormControl>
                                <Input placeholder="username" {...field} 
                                onChange={(e)=>{
                                    field.onChange(e)
                                    debouncedValue(e.target.value)
                                }}
                                />
                              </FormControl>
                              {isCheckingUsername && <Loader2 className="animate-spin" />}
                              {!isCheckingUsername && usernameMessage && (
                                <p className={`text-sm ${
                                            usernameMessage === 'Username is unique'
                                            ? 'text-green-500'
                                            : 'text-red-500'
                                            }`}>
                                    {usernameMessage}
                                </p>
                              )}
                              
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                        name = "email"
                        control={form.control}
                        render={({ field }) => (
                            <FormItem>
                              <FormLabel>email</FormLabel>
                              <FormControl>
                                <Input placeholder="email id" {...field} 
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />


                        <FormField
                        name = "password"
                        control={form.control}
                        render={({ field }) => (
                            <FormItem>
                              <FormLabel>password</FormLabel>
                              <FormControl>
                                <Input type="password" placeholder="password" {...field} 
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <Button type="submit" disabled={isSubmitting}>
                            {
                                isSubmitting ? (
                                    <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin"/> Please Wait
                                    </>
                                ):( 'SignUP')
                            }
                        </Button>
                    </form>
                </Form>

               <div className="text-center mt-4">
                <p>
                    Already a member?{' '}
                    <Link href="/sing-in" className="text-blue-600 hover:text-blue-800">
                    Sign in
                    </Link>
               </p>
              </div>

              <div className="text-center mt-4">
                <p>
                    <a href={`/verify/${username}`} className="text-blue-600 hover:text-blue-800">
                    Please verify your email
                    </a>
               </p>
              </div>
            </div>
        </div>
    )
}