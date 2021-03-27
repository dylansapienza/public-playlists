import express = require("express");
import cors = require("cors");
import path = require("path");

import request = require("request");
import querystring = require("querystring");
import cookieParser = require("cookie-parser");

const app: express.Application = express();

const port: any = process.env.PORT || 5000;

app.use(
  (req: express.Request, res: express.Response, next: express.NextFunction) => {
    console.log(`Request_Endpoint: ${req.method} ${req.url}`);
    next();
  }
);

//Body Parser Config

app.use(express.json());
app.use(
  express.urlencoded({
    extended: true,
  })
);

//CORs Middleware
app.use(express.static(__dirname + "/public"));
app.use(cors());
app.use(cookieParser());

const api = require("./routes/routes");

app.use("/api", api);

app.get("/", (req: express.Request, res: express.Response) => {
  res.send("Hello");
});

app.listen(port, () => console.log(`Server Running on PORT ${port}`));
