require('dotenv').config();
const express = require("express");
const mongoose = require("mongoose");
const ejsMate = require("ejs-mate");
const path = require("path");
const session = require("express-session");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const methodOverride = require("method-override");

const User = require("./models/user");
const userRoutes = require("./routes/users");
const professorRoutes = require("./routes/professors");
const reviewRoutes = require("./routes/reviews");
const authRoutes = require("./routes/auth");

const app = express();

// MongoDB Connection with Serverless Connection Caching
const dbUrl = process.env.DB_URL || "mongodb://127.0.0.1:27017/professor-rating";

let cachedDb = null;
async function connectToDatabase() {
  if (cachedDb && mongoose.connection.readyState === 1) {
    return cachedDb;
  }
  try {
    const db = await mongoose.connect(dbUrl, {
      serverSelectionTimeoutMS: 5000,
    });
    cachedDb = db;
    console.log("✅ Database connected successfully");
    return db;
  } catch (err) {
    console.error("❌ MongoDB connection error:", err.message);
  }
}

// Ensure database connection middleware
app.use(async (req, res, next) => {
  if (mongoose.connection.readyState !== 1) {
    await connectToDatabase();
  }
  next();
});

// EJS Template Engine Setup
app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Request parsing & Static assets
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, "public")));

// Session Configuration
const sessionSecret = process.env.SECRET || process.env.SESSION_SECRET || "mentormetersecretkey!";
const sessionConfig = {
  secret: sessionSecret,
  resave: false,
  saveUninitialized: true,
  cookie: {
    httpOnly: true,
    expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
    maxAge: 1000 * 60 * 60 * 24 * 7,
  },
};
app.use(session(sessionConfig));
app.use(flash());

// Passport Authentication Setup
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// Register Google / Microsoft OAuth Strategies
require("./passport-config");

// Global View Locals Middleware
app.use((req, res, next) => {
  res.locals.currentUser = req.user || null;
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  next();
});

// App Routes
app.use("/professors", professorRoutes);
app.use("/professors/:id/reviews", reviewRoutes);
app.use("/auth", authRoutes);
app.use("/", userRoutes);

// Home Page
app.get("/", (req, res) => {
  res.render("users/home");
});

// 404 Fallback Handler
app.all("*", (req, res, next) => {
  res.status(404).render("professors/error", {
    err: { message: `Page not found: ${req.originalUrl}` }
  });
});

// Global Error Handler
app.use((err, req, res, next) => {
  const { statusCode = 500 } = err;
  if (!err.message) err.message = "An unexpected error occurred.";
  console.error("🚨 Server Error:", err);
  res.status(statusCode).render("professors/error", { err });
});

// Start local server if not on serverless environment
const PORT = process.env.PORT || 3000;
if (process.env.NODE_ENV !== 'production' || !process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`🚀 Serving on port ${PORT}`);
  });
}

module.exports = app;
