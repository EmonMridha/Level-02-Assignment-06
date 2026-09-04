import cookieParser from "cookie-parser";
import express, { Application, Request, Response } from "express";
import config from "./config";
import cors from 'cors'
import { prisma } from "./lib/prisma";


const app: Application = express()

app.use(cors({
    origin: config.app_url,
    credentials: true
}))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())

app.get("/", async (req: Request, res: Response) => {
    const users = await prisma.user.findMany();
    if (users.length === 0) {
        console.log('NO user found')
    }
})

app.post('/api/v1/auth/register', async (req: Request, res: Response) => {
    const { name, email, password } = req.body;
    const isUserExist = await prisma.user.findUnique({
        where: { email }
    })

    if(isUserExist) {
        console.log("User with this email already exists");
    }

    res.status(201).json({
        message: "User registered successfully"
    })
})

export default app;