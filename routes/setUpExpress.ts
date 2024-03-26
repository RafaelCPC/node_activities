import express from "express"
import "express-async-errors"
import "dotenv/config"
import morgan from "morgan"
import joi from "joi"
import { Request, Response } from "express"
const app= express()
app.use(morgan("dev"))
app.use(express.json())
const port= process.env.PORT
type Planet = {
    id: number,
    name: string,
  };
  type Planets = Planet[];
  let planets: Planets = [
    {
      id: 1,
      name: "Earth",
    },
    {
      id: 2,
      name: "Mars",
    },
  ];
  const planetSchema= joi.object(
    {
        id: joi.number().required(),
        name: joi.string().required(),
    })
  
  function getAll (req: Request, res: Response){
    res.status(200).json({planets});
}
function getOneById (req: Request, res: Response){
    const {id} = req.params
    const findPlanet=planets.find((planets) => {
     if(Number(id) == planets.id)  {
           return true;
     }
   })
   if(findPlanet){
       res.status(200).json({findPlanet});
   } else{
       res.status(404).json({msg:"No encontrado"});
   }
}
function create (req: Request, res:Response) {
    const newPlanet = req.body;
    const {error}= planetSchema.validate(newPlanet)
    if(error){
        res.status(400).json({msg:"no se ha podido crear el planeta"})
    } else{
        planets.push(newPlanet)
        res.status(201).json({newPlanet})
    }
}
function updateById(req: Request, res:Response){
    const {id} = req.params
    const {name}= req.body
    const modPlanets= planets.map (planets => planets.id === Number(id) ? ({...planets,name}) : planets)
    res.status(200).json({modPlanets})

}
function deleteById (req: Request, res:Response) {
    const {id}=req.params
    const filterPlanets = planets.filter((planets) => {return Number(id) !== planets.id})
    
    if(filterPlanets.length < planets.length){
        planets=filterPlanets
        res.status(200).json({filterPlanets})
    } else{
        res.status(400).json({msg:"Planeta no encontrado"})
    }
}

export {getAll, getOneById, create, deleteById, updateById}