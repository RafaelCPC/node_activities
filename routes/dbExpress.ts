import pgPromise from "pg-promise";
import  express  from "express";
import Joi from "joi";
import "express-async-errors"
import "dotenv/config"
import { Request, Response } from "express";
const app=express()
const port= process.env.PORT
app.use(express.json())
const db = pgPromise()("postgres://postgres:postgres@localhost:5432/videojuegos")
db.connect()
    .then( () => {
        console.log("Conexion realizada!")
    })
    .catch((err:any) => console.error(err))
const setupDb = async () => {
    await db.none(`
     DROP TABLE IF EXISTS planets;

     CREATE TABLE planets (
         id SERIAL NOT NULL PRIMARY KEY,
         name TEXT NOT NULL,
         image TEXT
     );
     DROP TABLE IF EXISTS users;
     CREATE TABLE users (
        id SERIAL NOT NULL PRIMARY KEY,
        username TEXT NOT NULL,
        password TEXT NOT NULL,
        token TEXT
     )
     `);
     await db.none(`INSERT INTO planets (name) VALUES ('Earth')`);
     await db.none(`INSERT INTO planets (name) VALUES ('Mars')`);
     await db.none(`INSERT INTO users (username, password) VALUES ('dummy', 'dummypass')`);

 };
 setupDb();
 const planetSchema = Joi.object({
    name: Joi.string().required()
 })
 async function getAllDB (req: Request, res: Response){
    console.log("realizado get general")
    const planets = await db.many(`SELECT * FROM planets;`);
    res.status(200).json(planets);
}
async function getOneDB (req: Request, res: Response){
    const {id} = req.params;
    const planet = await db.oneOrNone(`SELECT * FROM planets WHERE id=$1;`, Number(id))
    res.status(200).json(planet);
}
async function createDB (req: Request, res: Response){
    const {name} = req.body;
    const newPlanet = {name};
    const validateNewPlanet = planetSchema.validate(newPlanet)
    if(validateNewPlanet.error){
        return res
            .status(400)
            .json({msg: validateNewPlanet})
    } else{
           await db.none(`INSERT INTO planets (name) VALUES ($1)`, name)
           res.status(200).json({msg: "nuevo planeta"})
    }
}
async function deleteDB (req: Request, res: Response){
    const id = req.params.id;
    const resultado=  await db.result(`DELETE FROM planets WHERE id=$1`, Number(id))
    console.log(resultado);
    res.status(200).json({msg: "un planeta menos"})
}
async function updateDB (req: Request, res: Response){
    const id = req.params.id;
    const name = req.body.name;
        await db.none(`UPDATE planets SET name=$2 WHERE id=$1`, [id,name])
        res.status(200).json({msg: "planeta modificado"})
}
async function uploadImg (req: Request, res: Response){
    const {id} = req.params;
    const fileName= req.file?.path;
    if(fileName) {
        db.none(`UPDATE planets SET image=$2 WHERE id=$1`, [id, fileName])
        res.status(201).json({msg: "Planet img uploaded succesfully"})
    } else {
        res.status(400).json({msg: "Planet img failed to upload"})
    }
}
 export {getAllDB, getOneDB, createDB, deleteDB, updateDB, uploadImg, db}