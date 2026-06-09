import { Context } from "hono"
import { getCookie } from "hono/cookie"
import { verify } from "../../auth/jwtauth"
import { DB } from "../../db/connection"
import { ObjectId } from "mongodb"

export async function GetHistory(c: Context) {
    try {
        const cookie = await verify(<string>getCookie(c, "jwt"))
        const user_id = cookie.result._id

        const collection = DB.collection("Exam_Session")
        const sessions = await collection.find({
            user_id: new ObjectId(user_id),
            active: false
        }).toArray()

        const results = sessions.map((s) => {
            const questions = s.questions ?? []
            const total = questions.length
            let score = 0

            questions.forEach((v: any) => {
                v.list_answer?.forEach((w: any) => {
                    if (w.index === v.answer && w.correct) score++
                })
            })

            return {
                exam_id: s.exam_id,
                exam_name: s.exam_name,
                class_id: s.class_id,
                total,
                correct_total: score,
                score: total > 0 ? Math.round((score / total) * 100) : 0,
            }
        })

        return c.json({ status: "OK", data: results })
    } catch (e: any) {
        return c.json({ status: "FAIL", message: e.message })
    }
}