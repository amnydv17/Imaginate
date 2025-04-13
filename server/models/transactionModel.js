import mongoose from "mongoose";


// define the user schema for database to store transaction data
const transactionSchema = new mongoose.Schema({
    userId: {type: String, required:true},
    plan: {type: String, required:true},
    amount: {type: Number, required:true},
    credits: {type: Number, required:true},
    payment: {type: Boolean, default:false},
    date: {type: Number},

})

// first search for transaction model if not then it create
const transactionModel = mongoose.models.transaction || mongoose.model("transaction", transactionSchema)

export default transactionModel;