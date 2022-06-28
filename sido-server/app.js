// Module variables
const createError = require("http-errors");
const fs = require("fs");
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const cors = require("cors");
let corsOptions = {
  methods: ["GET", "POST", "DELETE", "UPDATE", "PUT", "PATCH"],
  credentials: true,
  origin: ["http://localhost:5001", "http://localhost:3000"],
};

// Routes
let indexRouter = require("./routes/index");
let branchRouter = require("./routes/branch");
let roleRouter = require("./routes/role");
let collateralRouter = require("./routes/collateral");
let districtRouter = require("./routes/district");
let formRequestRouter = require("./routes/formalization_request");
let loanRouter = require("./routes/loan");
let loanDetailsRouter = require("./routes/loan-details");
let loan_requestRouter = require("./routes/loan_request");
let ownerRouter = require("./routes/owner");
let regionRouter = require("./routes/region");
let reminderRouter = require("./routes/reminder");
let repaymentRouter = require("./routes/repayment");
let sectorRouter = require("./routes/sector");
let staffRouter = require("./routes/staff");
let witnessRouter = require("./routes/witness");
let registerRouter = require("./routes/register");
let loginRouter = require("./routes/login");

const app = express();

app.use(cookieParser());
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));
app.use(cors(corsOptions));

// Routes
app.use("/", indexRouter);
app.use("/login", loginRouter);
app.use("/register", registerRouter);

// API Routes
app.use("/api/branches", branchRouter);
app.use("/api/collaterals", collateralRouter);
app.use("/api/districts", districtRouter);
app.use("/api/formalization-requests", formRequestRouter);
app.use("/api/loans", loanRouter);
app.use("/api/loan-details", loanDetailsRouter);
app.use("/api/loan-requests", loan_requestRouter);
app.use("/api/owners", ownerRouter);
app.use("/api/regions", regionRouter);
app.use("/api/reminders", reminderRouter);
app.use("/api/repayments", repaymentRouter);
app.use("/api/roles", roleRouter);
app.use("/api/sectors", sectorRouter);
app.use("/api/staff", staffRouter);
app.use("/api/witnesses", witnessRouter);
app.get("/download/:file", (req, res) => {
  console.log("Downloading...");
  const { file } = req.params;
  fs.readFile(path.join(__dirname, `public/documents/${file}`), (err, data) => {
    if (err) {
      res.writeHead(404, { "Content-Type": "text/html" });
      res.end("404 Not Found");
    } else {
      res.writeHead(200, {
        "Content-Type":
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      });
      res.end(data);
    }
  });
});

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500).json({ success: false, message: err.message });
});

module.exports = app;
