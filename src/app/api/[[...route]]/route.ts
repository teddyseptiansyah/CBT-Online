import { Context, Hono } from "hono"
import { handle } from "hono/vercel"
import { auth } from "./auth"
import { Instructor } from "./instructor"
import { User } from "./user"
import { Admin } from "./admin"
import { upload } from "./upload"
import dotenv from "dotenv-extended"
dotenv.load()

const app: Hono = new Hono().basePath("/api")

app.route("/auth", auth)
app.route("/instructor", Instructor)
app.route("/user", User)
app.route("/admin", Admin)

app.post("/uploads", upload)

console.log("HONO LOADED")

export const GET = handle(app)
export const POST = handle(app)
export const PUT = handle(app)
export const DELETE = handle(app)