import * as express from "express";
import "dotenv/config";
import * as dotenv from "dotenv";
import mongoose from "mongoose";
import User from "./models/User";
import { Request, Response } from "express";
import * as cors from "cors";
import * as bcrypt from "bcrypt";
import * as jwt from "jsonwebtoken";
import * as cookieParser from "cookie-parser";
import { request } from "http";
dotenv.config();

const app = express();
const port = process.env.PORT || 5001;

// Middleware - do obsługi JSON-a i CORS
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());
const MONGODB_URI = process.env.MONGODB_URI;

mongoose
  .connect(MONGODB_URI)
  .then(() => console.log("Połączono z MongoDB"))
  .catch((error) => console.error("Błąd połączenia z MongoDB:", error));

// Prosta trasa API
app.get("/", (req, res) => {
  res.send("Serwer działa!");
});

// Endpoint rejestracja użytkownika
app.post("/api/register", async (req: Request, res: Response) => {
  try {
    const { email, login, name, surname, password } = req.body;

    // Sprawdzenie, czy email się nie powtarza
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res
        .status(400)
        .json({ error: "Użytkownik z tym emailem już istnieje" });
    }

    //hashowanie przed zapissaniem
    const hashedPassword = await bcrypt.hash(password, 10);

    // Tworzenie nowego użytkownika
    const newUser = new User({
      email,
      login,
      name,
      surname,
      password: hashedPassword,
    });

    // Zapisywanie użytkownika w bazie danych
    await newUser.save();

    res.status(201).json({ message: "Użytkownik został zarejestrowany" });
  } catch (error) {
    console.error("Błąd podczas rejestracji", error);
    res.status(500).json({ error: "Wystąpił błąd podczas rejestracji" });
  }
});

app.post("/api/login", async (req: Request, res: Response) => {
  try {
    const { login, password } = req.body;

    //znajdowannie uzytkownika po loginie
    const user = await User.findOne({ login });
    if (!user) {
      return res.status(400).json({ error: "Nieprawidłowy login lub hasło" });
    }

    //porowaninie hasla:
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ error: "Nieprawidłowy login lub hasło" });
    }

    //tworzenie tokenu:

    const token = jwt.sign(
      { userId: user._id, login: user.login },
      process.env.JWT_SECRET!,
      { expiresIn: "24h" }
    );

    res
      .cookie("token", token, {
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000,
      })
      .status(200)
      .json({ message: "Zalogowano pomyslnie", user });
  } catch (error) {
    console.error("Blad podczas logowania", error);
    res.status(500).json({ error: "Wystapil blad podczas logowania" });
  }
});

//Wysyłanie danych z Survey

app.post("/api/submitSurvey", async (req: Request, res: Response) => {
  try {
    const token = req.cookies.token;
    if (!token) {
      return res
        .status(401)
        .json({ error: "Brak aktywnego tokenu. Zaloguj się!" });
    }
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET!);
    } catch (err) {
      return res
        .status(401)
        .json({ error: "Token jest nieprawidłowy lub wygasł!" });
    }
    const userId = decoded.userId;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "Uzytkownik nie istnieje." });
    }

    const { roles, weight, height, goal, age, experience, subroles } = req.body;

    user.userFeatures = {
      roles: roles || [],
      weight: weight || 0,
      height: height || 0,
      goal: goal || "",
      age: age || 0,
      experience: experience || "",
      subroles: subroles || [],
    };
    user.firstLogin = false;

    await user.save();

    return res.status(200).json({
      message: "Dane użytkownika zapisane pomyślnie",
      userFeatures: user.userFeatures,
    });
  } catch (error) {
    console.error("Błąd podczas zapisu ankiety", error);
    return res.status(500).json({ error: "Coś poszło nie tak" });
  }
});

app.get("/api/getCurrentUser", async (req: Request, res: Response) => {
  try {
    const token = req.cookies.token;
    if (!token) {
      res
        .status(400)
        .json({ message: "Nie udało się pobrać tokena, lub jest nieaktywny" });
    }
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET!);
    } catch (error) {
      return res
        .status(400)
        .json({ error: "Nie udało się zweryfikować tokenu" });
    }
    const userId = decoded.userId;
    const user = await User.findById(userId).select("-password");
    if (!user) {
      return res.status(400).json({ error: "Nie znaleziono użytkownika" });
    }
    return res.status(200).json({ user });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Problem z api/getCurrentUser" });
  }
});

// Obsługa żądań preflight (OPTIONS)
app.options("/api/register", cors());
app.options("/api/login", cors());

// Start serwera
app.listen(port, () => {
  console.log(`Serwer działa na porcie ${port}`);
});
