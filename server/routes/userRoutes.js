import express from "express";
import {
  registerUser,
  loginUser,
  userCredits,
  paymentRazorpay,
  varifyRazorpay
} from "../controllers/userController.js";
import userAuth from "../middlewares/auth.js";

// crerate user router
const userRouter = express.Router();

// create the endpoint for user
userRouter.post("/register", registerUser);  // register user
userRouter.post("/login", loginUser);   // login user
userRouter.get("/credits", userAuth, userCredits);  // get user credits
userRouter.post("/pay-razor", userAuth, paymentRazorpay);  // post for payment
userRouter.post("/varify-razor", userAuth, varifyRazorpay);  // post for payment varification

export default userRouter;


// http://localhost:4000/api/user/register
// http://localhost:4000/api/user/login
