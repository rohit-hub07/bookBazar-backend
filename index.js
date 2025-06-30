import express from "express";
import dotenv from "dotenv";
import db from "./utils/db.js";
import userRouter from "./routes/user.routes.js";
import cookieParser from "cookie-parser";
import bookRouter from "./routes/book.routes.js";
import reviewRouter from "./routes/review.routes.js";
import orderRouter from "./routes/order.routes.js";
import cors from "cors";

dotenv.config();

const app = express();

const port = process.env.PORT;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
const corsOptions = {
    origin: ["http://localhost:8000", "http://localhost:5173"],
    credentials: true,
}
app.use(
  cors(corsOptions)
);
app.get("/", (req, res) => {
  res.send("This is the route");
});

app.use("/auth", userRouter);
app.use("/books", bookRouter);
app.use("/reviews", reviewRouter);
app.use("/orders", orderRouter);

db();

app.listen(port, () => {
  console.log(`App is listening to port: ${port}`);
});
