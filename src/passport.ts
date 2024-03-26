import * as dotenv from "dotenv"
import passport from "passport";
import passportJWT from "passport-jwt";
import { db } from "../routes/dbExpress";
dotenv.config();
const {SECRET =""} = process.env;
passport.use(
    new passportJWT.Strategy(
        {
        secretOrKey:SECRET, 
        jwtFromRequest: passportJWT.ExtractJwt.fromAuthHeaderAsBearerToken(),
    }, 
    async(payload:any, done:any) =>{
        const user = db.one(`SELECT * FROM users WHERE id=$1`, payload.id)
        console.log(user)
        try{
            return user ? done(null, user) : done(new Error("User not found."))
        } catch (error) {
            done(error);
        }
    })
);