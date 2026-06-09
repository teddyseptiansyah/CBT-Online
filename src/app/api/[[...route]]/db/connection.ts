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
export const DB: Db = globalWithMongo._db!