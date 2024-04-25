// Dependencies
import express from "express";
import expressHandlebars from "express-handlebars";
import session from "express-session";
import path from "path";
import router from "./routes/index.js";
import { dirname } from "path";
import { fileURLToPath } from "url";

// Import the custom helper methods
import helpers from "./utils/helpers.js";
// Incorporate the custom helper methods: ./utils/helpers.js
const handlebars = expressHandlebars.create({ helpers });

// Sets up the Express App
const app = express();
const PORT = process.env.PORT || 3001;

// Set up sessions
const sess = {
  secret: "Secret key goes here",
  cookie: {
    // Stored in milliseconds (86,400,000 === 1 day)
    // 28800000 = 8 hours
    maxAge: 28800000,
  },
  resave: false,
  saveUninitialized: false,
};
app.use(session(sess));

//setup handlebars with express
app.engine("handlebars", handlebars.engine);
app.set("view engine", "handlebars");

//allow api to use json and url encoding
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
//set public folder
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
app.use(express.static(path.join(__dirname, "public")));

// Sets up the routes
app.use(router);

// Starts the server to begin
app.listen(PORT, () => {
  console.log("We've now got a server!");
  console.log("Your routes will be running on http://localhost:3001");
});
