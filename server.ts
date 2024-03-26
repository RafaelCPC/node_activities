import express from "express"
import "express-async-errors"
import "dotenv/config"
import { getAll, getOneById, create, deleteById, updateById} from "./routes/setUpExpress"
import { createDB, deleteDB, getAllDB, getOneDB, updateDB, uploadImg } from "./routes/dbExpress"
import multer from "multer"
import {logIn, signUp, logOut} from "./controllers/users"
import authorize from "./src/authorize"

const storage = multer.diskStorage({
    destination: (req, file, cb) =>{ 
        cb(null, "./uploads")
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname)
    }
})
const app= express()
const port= process.env.PORT
const upload = multer({storage})

app.use(express.json())

/*
app.get("/api/planets", getAll)
app.get("/api/planets/:id", getOneById)
app.post("/api/planets", create)
app.put("/api/planets/:id", updateById)
app.delete("/api/planets/:id", deleteById)
*/
app.get("/api/planets", getAllDB)
app.get("/api/planets/:id", getOneDB)
app.post("/api/planets", createDB)
app.put("/api/planets/:id", updateDB)
app.delete("/api/planets/:id", deleteDB)
app.post("/api/planets/:id/image",upload.single("image"), uploadImg)
app.post("/api/users/login", logIn) 
app.post("/api/users/signup", signUp) 
app.get("/api/users/logout", authorize, logOut) 
app.listen (port, () =>
    {
    console.log(`Working in --> ${port} port`)
}) 