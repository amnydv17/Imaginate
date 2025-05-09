import userModel from "../models/userModel.js";
import transactionModel from "../models/transactionModel.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken"; // Import the JWT library for token authentication
import razorpay from 'razorpay'; // Import the Razorpay library for payment gateway integration

// Create controller registration function 
const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;  // finding from req.body
    if (!name || !email || !password) {
      return res.json({ success: false, message: "Missing Details" });
    }
    // encrypt the password 
    const salt = await bcrypt.genSalt(10);
    // hash the password
    const hashedPassword = await bcrypt.hash(password, salt);
    // create a user data for storing into database
    const userData = {
      name: name,
      email: email,
      password: hashedPassword,
    };
    // create a new user and save it into database
    const newUser = new userModel(userData);
    const user = await newUser.save();
    // generate token for user to return as response
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET); // auto generated id from mongodb database
    // return the token to the user
    res.json({ success: true, token: token, user: { name: user.name } });

  } catch (error) { //  catch the error if any 
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// create controller login function to login user 
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body; // finding from req.body
    // find user by emailid in database
    const user = await userModel.findOne({ email });
    // check if user exist in database or not

    if (!user) { // if user not exist in database return success false
      return res.json({ success: false, message: "User does not exist" });
    }
    // check if password is correct or not
    const isMatch = await bcrypt.compare(password, user.password); 
    // if password is correct then return token to user
    if (isMatch) {
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
      res.json({ success: true, token: token, user: { name: user.name } });
    } else {
      return res.json({ success: false, message: "Invalid credentials" });
    }
  } catch (error) { // if any error occur then return error message
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// create controller function to get user details
const userCredits = async (req, res) => {
  try {// finding user id from req.body
    const { userId } = req.body;
    if (!userId) {
      return res.json({ success: false, message: "User ID is required." });
    }
    
    // find user by id in database
    const user = await userModel.findById(userId);
    if (!user) {
      return res.json({ success: false, message: "User not found." });
    }
    res.json({
      success: true,
      credits: user.creditBalance,
      user: {
        name: user.name,
      },
    }); 
  } catch (error) { // if any error occur then return error message
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};



// instance of razorpay
const razorpayInstance = new razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

const paymentRazorpay = async (req, res) => {
  try {
    const { userId, planId } = req.body;
    
    const userData = await userModel.findById(userId);

    if(!userId || !planId) {
      return res.json({ success: false, message: "User ID and Plan ID are required." });
    }


    let credits, plan, amount, date;

    switch (planId) {
      case 'Basic':
        plan = 'Basic';
        credits = 100;
        amount = 50;
        break;
      
      case 'Advanced':
        plan = 'Advanced';
        credits = 500;
        amount = 200;
        break;

      case 'Business':
        plan = 'Business';
        credits = 5000;
        amount = 2000;
        break;

      default:
        return res.json({success:false, message:"plan not found"});
    }

    date = Date.now();

    const transactionData = {
      userId, plan, amount, credits, date
    };
    // create a new transaction 
    const newTransaction = await transactionModel.create(transactionData);

    const options = {
      amount: amount*100,
      currency: process.env.CURRENCY,
      receipt: newTransaction._id,
    };
    // new order 
    await razorpayInstance.orders.create(options, (error, order) =>{
      if(error){
        console.log(error);
        return res.json({success:false, message:"Error creating order"});
      }
      // save order id in transaction model
      res.json({success:true, order});
    });

  } catch(error){
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// get all transactions for a user and verify here
const varifyRazorpay = async (req, res) => {
  try {
    // Extract razorpay_order_id from request body, support different possible keys
    const {razorpay_order_id} = req.body;
    // if(!razorpay_order_id){
    //   return res.json({success:false, message:"razorpay_order_id is required"});
    // }

    const orderInfo = await razorpayInstance.orders.fetch(razorpay_order_id);

    if(orderInfo.status === 'paid'){
      const transactionData = await transactionModel.findById(orderInfo.receipt);
      if(!transactionData){
        return res.json({success:false, message:"Transaction not found"});
      }
      if(transactionData.payment){
        return res.json({success:false, message:"Payment already verified"});
      }
      // update transaction model with payment status and update credit
      const userData = await userModel.findById(transactionData.userId);
      if(!userData){
        return res.json({success:false, message:"User not found"});
      }

      const creditBalance = (userData.creditBalance || 0) + transactionData.credits;
      await userModel.findByIdAndUpdate(userData._id, {creditBalance});
      // update transaction model with payment status
      await transactionModel.findByIdAndUpdate(transactionData._id, {payment:true});

      res.json({success:true, message:"Credit Added"});
    }else{
      res.json({success:false, message:"Payment not verified"});
    }

  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

export { registerUser, loginUser, userCredits, paymentRazorpay, varifyRazorpay };
