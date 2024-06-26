import dotenv from "dotenv"
import connectDB from "./db/index.js";
import {app} from './app.js'
dotenv.config({
    path: './.env'
})
app.get('/',(req,res) => {
    res.status(200).json({
        message: "Welcome to this site!"
    })
}) 
connectDB()
.then(() => {
    app.listen(process.env.PORT || 8000, () => {
        console.log(`Server is running on the port: ${process.env.PORT}`);
    });
})
.catch((error) => {
    console.log("Mongodb failed the connected! ", error);
});
