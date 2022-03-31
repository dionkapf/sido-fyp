// Module variables
var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");

// Routes
var indexRouter = require("./routes/index");
var usersRouter = require("./routes/users");
var branchRouter = require("./routes/branch");
var roleRouter = require("./routes/role");
var branchRouter = require("./routes/branch");
var collateralRouter = require("./routes/collateral");
var districtRouter = require("./routes/district");
var formRequestRouter = require("./routes/formalization_request");
var loanRouter = require("./routes/loan");
var loan_requestRouter = require("./routes/loan_request");
var ownerRouter = require("./routes/owner");
var regionRouter = require("./routes/region");
var reminderRouter = require("./routes/reminder");
var repaymentRouter = require("./routes/repayment");
var roleRouter = require("./routes/role");
var sectorRouter = require("./routes/sector");
var staffRouter = require("./routes/staff");
// var userRouter = require('./routes/user');
var witnessRouter = require("./routes/witness");

var app = express();

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/", indexRouter);
app.use("/api/users", usersRouter);
app.use("/api/branches", branchRouter);
app.use("/api/collaterals", collateralRouter);
app.use("/api/districts", districtRouter);
app.use("/api/formalization-requests", formRequestRouter);
app.use("/api/loans", loanRouter);
app.use("/api/loan-requests", loan_requestRouter);
app.use("/api/owners", ownerRouter);
app.use("/api/regions", regionRouter);
app.use("/api/reminders", reminderRouter);
app.use("/api/repayments", repaymentRouter);
app.use("/api/roles", roleRouter);
app.use("/api/sectors", sectorRouter);
app.use("/api/staff", staffRouter);
// app.use('/api/user', userRouter);
app.use("/api/witnesses", witnessRouter);

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
