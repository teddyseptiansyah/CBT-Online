import { Context } from "hono"
import crypto from "crypto"
import { v2 as cloudinary } from "cloudinary"

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
})

export async function upload(c: Context) {
    try {
        const body = await c.req.parseBody()

        if (!(body["file"] instanceof File)) {
            return c.json({ status: "FAIL", msg: "Only File" })
        }

        const file = body["file"] as File
        const type = body["type"] as string

        if (type !== "image" && type !== "audio") {
            return c.json({ status: "FAIL" })
        }

        const date = new Date()
        const extension = file.name.split(".").pop()
        const hash = crypto.createHash("sha256")
            .update(`${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}:${date.getMilliseconds()}.${file.name}`)
            .digest("hex")

        const publicId = `${type === "image" ? "img" : "audio"}/${hash}`
        const resourceType = type === "image" ? "image" : "video" // cloudinary pakai "video" untuk audio

        const arrayBuffer = await file.arrayBuffer()
        const buffer = Buffer.from(arrayBuffer)

        const result = await new Promise<any>((resolve, reject) => {
            cloudinary.uploader.upload_stream(
                { public_id: publicId, resource_type: resourceType },
                (error, result) => {
                    if (error) reject(error)
                    else resolve(result)
                }
            ).end(buffer)
        })

        return c.json({
            status: "OK",
            path: result.secure_url,
        })

    } catch (e: any) {
        return c.json({ status: "FAIL", msg: e.message })
    }
}