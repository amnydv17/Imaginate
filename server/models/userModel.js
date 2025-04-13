import mongoose from "mongoose";


// define the user schema for database to store them
const userSchema = new mongoose.Schema({
    name: {type: String, required: true},
    email: {type: String, required: true, unique: true},
    password: {type: String, required: true},
    creditBalance: {type: Number, default: 5}
})

// first search for user model if not then it create
const userModel = mongoose.models.user || mongoose.model("user", userSchema)

export default userModel;