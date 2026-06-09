import { MongoClient, Db } from "mongodb"
import dotenv from "dotenv-extended"
dotenv.load()

if (!process.env.MONGODB) {
    throw new Error("DATABASE CONFIG NOT FOUND AT .env")
}

const globalWithMongo = global as typeof globalThis & {
    _mongoClient?: MongoClient
    _db?: Db
}

if (!globalWithMongo._mongoClient) {
    globalWithMongo._mongoClient = new MongoClient(process.env.MONGODB as string)
    globalWithMongo._mongoClient.connect()
    globalWithMongo._db = globalWithMongo._mongoClient.db("HOSHICBT")
}

export const Client: MongoClient = globalWithMongo._mongoClient
<<<<<<< HEAD
export const DB: Db = globalWithMongo._db!
=======
export const DB: Db = globalWithMongo._db!
>>>>>>> 1e1d69a2773fb1aeebc16b62680e9d0ca9a34346
