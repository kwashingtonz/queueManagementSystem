import express from "express"

const app = express()

app.get("/", (req,res): void =>{
    const message: string = "Hello World"

    res.json({ message: message })
})

app.listen("3001", (): void => {
    console.log("Srver Running...")
})