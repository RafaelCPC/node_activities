import express from "express"
import "express-async-errors"
import "dotenv/config"
import { getAll, getOneById, create, deleteById, updateById} from "./routes/setUpExpress"


const app= express()
const port= process.env.PORT
app.use(express.json())

app.get("/api/planets", getAll)
app.get("/api/planets/:id", getOneById)
app.post("/api/planets", create)
app.put("/api/planets/:id", updateById)
app.delete("/api/planets/:id", deleteById)
app.listen (port, () =>
    {
    console.log(`Working in --> ${port} port`)
}) 