import mongoose from "mongoose";
import bcrypt from "bcrypt";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      minlength: [3, "Name must be at least 3 characters long"],
      maxlength: [50, "Name must be less than 50 characters"],
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      minlength: [8, "Password must be of atleast 8 characters"],
      maxlength: [128, "Password must be less than 128 characters"],
      required: true,
    },
    resetPasswordToken: {
      type: String,
    },
    role: {
      type: String,
      enum: ["admin", "user"],
      default: "user",
    },
  },
  { timestamps: true }
);


userSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});

const User = new mongoose.model("User", userSchema);

export default User;
