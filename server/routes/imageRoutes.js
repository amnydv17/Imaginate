import express from 'express'
import generateImage from '../controllers/imageController.js'  
import userAuth from '../middlewares/auth.js'

// create instance of router
const imageRouter = express.Router()
// create image generation router
imageRouter.post('/generate-image', userAuth, generateImage)

export default imageRouter;