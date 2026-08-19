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

// Set up Views directory using process.cwd() for Vercel Lambda compatibility
const viewsPath = path.join(process.cwd(), "views");
app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set("views", viewsPath);

// Request parsing & Static assets
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride('_method'));
app.use(express.static(path.join(process.cwd(), "public")));

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

// Ensure database connection middleware (non-blocking for static/home)
app.use(async (req, res, next) => {
  if (mongoose.connection.readyState !== 1 && process.env.DB_URL) {
    try {
      await connectToDatabase();
    } catch (e) {
      console.warn("DB connection attempt failed:", e.message);
    }
  }
  next();
});

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

// Register Google / Microsoft OAuth Strategies (safe fallback)
try {
  require("./passport-config");
} catch (e) {
  console.warn("Passport config warning:", e.message);
}

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
  try {
    res.status(404).render("professors/error", {
      err: { message: `Page not found: ${req.originalUrl}` }
    });
  } catch (err) {
    res.status(404).send("Page not found");
  }
});

// Bulletproof Global Error Handler (Prevents Lambda Crash)
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  console.error("🚨 Server Error:", err);
  try {
    res.status(statusCode).render("professors/error", { 
      err: { message: err.message || "An unexpected error occurred." } 
    });
  } catch (renderErr) {
    console.error("🚨 View Render Error:", renderErr);
    res.status(statusCode).send(`
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <title>MentorMeter - Notice</title>
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">
      </head>
      <body class="bg-light d-flex align-items-center justify-content-center min-vh-100 p-4">
        <div class="card shadow-sm border-0 rounded-4 p-4 p-md-5 text-center bg-white" style="max-width: 500px;">
          <h3 class="fw-bold text-danger mb-2">Notice</h3>
          <p class="text-secondary mb-4">${err.message || "A server error occurred. If you are setting up Vercel, please verify your DB_URL environment variable in the Vercel Dashboard."}</p>
          <a href="/" class="btn btn-primary rounded-pill px-4">Return Home</a>
        </div>
      </body>
      </html>
    `);
  }
});

// Start local server if not on serverless environment
const PORT = process.env.PORT || 3000;
if (process.env.NODE_ENV !== 'production' || !process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`🚀 Serving on port ${PORT}`);
  });
}

module.exports = app;
