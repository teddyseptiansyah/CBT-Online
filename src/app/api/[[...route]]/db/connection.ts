import { MongoClient, Db } from "mongodb"
import dotenv from "dotenv-extended"
dotenv.load()

if (!process.env.MONGODB) {
    throw new Error("DATABASE CONFIG NOT FOUND AT .env")
}

const uri = process.env.MONGODB as string

const globalWithMongo = global as typeof globalThis & {
    _mongoClientPromise?: Promise<MongoClient>
}

if (!globalWithMongo._mongoClientPromise) {
    const client = new MongoClient(uri)
    globalWithMongo._mongoClientPromise = client.connect()
}

const clientPromise = globalWithMongo._mongoClientPromise

export async function getDB(): Promise<Db> {
    const client = await clientPromise
    return client.db("HOSHICBT")
}
