import { Message } from "../model/User.Model"
export interface ApiResponse{
    success : boolean
    message : string,
    isAcceptingMessage?:boolean
    messages?: Array<Message>
}