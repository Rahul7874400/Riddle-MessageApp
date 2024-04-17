import { Message } from "../model/User.Model"
export interface ApiResponse{
    success : boolean
    message : string,
    isAccepting?:boolean
    messages?: Array<Message>
}