 import express from 'express';
 import cors from 'cors';
 import 'dotenv/config'
 import connectDB from './config/mongodb.js';
 import userRouter from './routes/userRoutes.js';
import imageRouter from './routes/imageRoutes.js';

// creating port
 const PORT = process.env.PORT || 4000;
 const app = express();

 app.use(express.json())  // for parsing application/json 
 app.use(cors())

 // connect to database
 await connectDB()

 app.use('/api/user', userRouter)
 app.use('/api/image', imageRouter)
 app.get('/', (req, res)=> res.send("Backend Working"))


 // listen to port where server is running
 app.listen(PORT, ()=> console.log("Server Running on port",+ PORT));