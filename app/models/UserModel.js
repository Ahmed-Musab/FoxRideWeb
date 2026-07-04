import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        required: true,
        enum: ["admin", "employee", "manager", "transportAdmin", "driver"],
    }
})

if (mongoose.models.User) {
    delete mongoose.models.User;
}
const User = mongoose.model("User", userSchema);
export default User;