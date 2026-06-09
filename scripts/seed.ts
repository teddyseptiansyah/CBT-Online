import { MongoClient } from "mongodb"
import crypto from "crypto"
import dotenv from "dotenv-extended"
dotenv.load()

async function seed() {
    const client = new MongoClient(process.env.MONGODB!)
    await client.connect()
    const db = client.db("HOSHICBT")

    await db.collection("Users").insertOne({
        username: "admin",
        password: crypto.createHash("sha256").update("admin123").digest("hex"),
        role: "admin",
        information: {
            fullname: "Administrator",
            email: "admin@opscbt.com",
            phone: "",
            avatar: ""
        }
    })

    console.log("User admin berhasil dibuat")
    await client.close()
}

seed()