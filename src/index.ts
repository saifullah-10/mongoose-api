import express from "express";
import http from "http";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import compression from "compression";
import cors from "cors";
import mongoose from "mongoose";
import router from "./router/index";

// mongodb   ts-practice SoyBDC3QnDE2CRhB

const app = express();

// middleware
app.use(
  cors({
    credentials: true,
  })
);
const server = http.createServer(app);
app.use(compression());
app.use(cookieParser());
app.use(bodyParser.json());

server.listen(3000, () => {
  console.log("server listening on port 3000");
});

const uri =
  "mongodb+srv://ts-practice:SoyBDC3QnDE2CRhB@cluster0.kpsyb7k.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

mongoose.Promise = Promise;
mongoose.connect(uri, { dbName: "userData" });
mongoose.connection.on("error", (err: Error) => console.log(err));

app.use("/", router());
