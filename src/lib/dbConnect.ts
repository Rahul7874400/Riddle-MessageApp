import mongoose from "mongoose";

type connectionObject = {
    isConnected?:number
}

const connection : connectionObject = {}

async function dbConnect() : Promise<void> {
    if(connection.isConnected){
        console.log("Already connect to database");
        return
        
    }

    try {
        const db = await mongoose.connect(process.env.MONGODB_URL || '' , {})

        console.log("Database connect successfully at : ",db.connection.host)

        connection.isConnected =  db.connections[0].readyState

    } catch (error) {

        console.log("Something went  worng while connecting the database",error)
        process.exit(1)
    }
}

export default dbConnect

