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
import * as multer from "multer";
import * as path from "path";
import Exercise from "./models/Exercise";
import Workout from "./models/Workout";
import WorkoutSet from "./models/WorkoutSet";
import * as cron from "node-cron";

import FriendRequest from "./models/FriendRequest";
import TrainerTraineeRelations from "./models/TrainerTraineeRelations";
dotenv.config();

const app = express();
const port = process.env.PORT || 5001;

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

app.get("/", (req, res) => {
  res.send("Serwer działa!");
});

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

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      email,
      login,
      name,
      surname,
      password: hashedPassword,
    });

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

    const user = await User.findOne({ login });
    if (!user) {
      return res.status(400).json({ error: "Nieprawidłowy login lub hasło" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ error: "Nieprawidłowy login lub hasło" });
    }

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
    res.status(400).json({ error: "Wystapil blad podczas logowania" });
  }
});
app.post("/api/logout", async (req: Request, res: Response) => {
  res.clearCookie("token", {
    httpOnly: true,
    sameSite: "strict",
  });
  return res.status(200).json({ message: "Wylogowano pomyślnie" });
});

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

    const { roles, weight, height, goal, age, experience, subroles, gender } =
      req.body;

    user.userFeatures = {
      roles: roles || [],
      weight: weight || 0,
      height: height || 0,
      goal: goal || "",
      age: age || 0,
      experience: experience || "",
      subroles: subroles || [],
      gender,
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

app.get("/api/getUsers", async (req: Request, res: Response) => {
  try {
    const token = req.cookies.token;
    if (!token) {
      return res
        .status(401)
        .json("Użytkownik niezalogowany, lub sesja wygasła!");
    }
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET!);
    } catch (error) {
      console.error(error);
    }

    const userId = decoded.userId;

    const q = req.query.q as string | undefined;
    const role = req.query.role as string | undefined;
    const page = req.query.page ? parseInt(req.query.page as string, 10) : 1;
    const limit = req.query.limit
      ? parseInt(req.query.limit as string, 10)
      : 20;
    const query: Record<string, any> = {};

    if (q) {
      query.$or = [
        { name: { $regex: q, $options: "i" } },
        { surname: { $regex: q, $options: "i" } },
        { login: { $regex: q, $options: "i" } },
      ];
    }
    if (role) {
      query["userFeatures.roles"] = role;
    }

    query._id = { $ne: userId };

    const users = await User.find(query)
      .select("-password")
      .skip((page - 1) * limit)
      .limit(Number(limit));
    res.status(200).json(users);
  } catch (error) {
    console.error("Błąd podczas wyszukiwania użytowników", error);
    res
      .status(500)
      .json({ error: "Wystąpił błąd podczas wyszukiwania użytkowników" });
  }
});
app.get("/api/getUser/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({ error: "Nie przekazano id użytkownika" });
    }
    const user = await User.findById(id).select("-password");
    if (!user) {
      return res
        .status(404)
        .json({ error: "Nie znaleziono użytkownika o takim id" });
    }
    return res.status(200).json({ user });
  } catch (error) {
    console.error(
      "Wystąpił błąd podczas odczytywania danych użytkownika",
      error
    );
    return res
      .status(500)
      .json({ error: "Nie udało się pobrać danych użytkownika" });
  }
});

//multer:

//config dla multera:
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "./uploads"));
  },
  filename: (req, file, cb) => {
    const uniqeName = Date.now() + "-" + file.originalname;
    cb(null, uniqeName);
  },
});

const upload = multer({ storage });

//endpointy z ćwiczeniami

app.post(
  "/api/addExercise",
  upload.single("image"),
  async (req: Request, res: Response) => {
    try {
      const token = req.cookies.token;
      if (!token) {
        return res
          .status(401)
          .json({ error: "Użytkownik niezalogowany, lub jego sesja wygasła!" });
      }
      let decoded;
      try {
        decoded = jwt.verify(token, process.env.JWT_SECRET!);
      } catch (error) {
        console.error("Nie udało się zweryfikować użytkownika", error);
      }
      const userId = decoded.userId;

      const { name, bodySection, bodyPart } = req.body;
      if (!name || !bodySection || !bodyPart) {
        return res
          .status(400)
          .json({ error: "Wypełnij wszystkie wymagane dane" });
      }
      let filePath = null;

      if (req.file) {
        filePath = "uploads/" + req.file.filename;
      }
      const newExercise = new Exercise({
        userId,
        name,
        bodySection,
        bodyPart,
        img: filePath,
      });
      await newExercise.save();
      return res
        .status(201)
        .json({ message: "Pomyślnie dodano nowe ćwiczenie", newExercise });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Nie udało się dodać ćwiczenia" });
    }
  }
);
app.get("/api/getExercises", async (req: Request, res: Response) => {
  try {
    const token = req.cookies.token;
    if (!token) {
      return res
        .status(401)
        .json({ error: "Użytkownik niezalogowany, lub sesja wygasła." });
    }
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET!);
    } catch (error) {
      console.error("Nie udało się zweryfikować użytkownika", error);
    }
    const userId = decoded.userId;
    const exercises = await Exercise.find({
      $or: [{ usersWithAccess: userId }, { isGlobal: true }],
    });
    if (!exercises) {
      console.error("Nie znaleziono ćwiczeń");
      return res
        .status(404)
        .json({ error: "Baza danych nie zawiera żadnych ćwiczeń." });
    }
    return res.status(200).json(exercises);
  } catch (error) {
    console.error(error);
    return res.status(500).json("Nie udało się pobrać ćwiczeń");
  }
});

//endpointy z treningami

app.post("/api/submitWorkout", async (req: Request, res: Response) => {
  try {
    const { name, date, exercises, trainingTime } = req.body;

    if (!date || !exercises) {
      return res
        .status(400)
        .json({ error: "Pola date oraz exercises są wymagane." });
    }
    const token = req.cookies.token;

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET!);
    } catch (error) {
      console.error(error);
      return res
        .status(400)
        .json({ error: "Nie udało się zweryfikować użytkownika" });
    }
    const userId = decoded.userId;

    const workoutDate = new Date(date);

    const newWorkout = new Workout({
      userId: userId,
      name,
      date: workoutDate,
      exercises,
      trainingTime,
    });
    await newWorkout.save();
    return res
      .status(201)
      .json({ message: "Trening zapisany pomyślnie", newWorkout });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Nie udało się zapisać treningu" });
  }
});

app.get("/api/getWorkouts", async (req: Request, res: Response) => {
  try {
    const token = req.cookies.token;
    if (!token) {
      return res
        .status(400)
        .json({ error: "Nie udało się zweryfikować użytkownika" });
    }
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET!);
    } catch (error) {
      console.error(error);
    }
    const loggedUserId = decoded.userId;

    const userWorkouts = await Workout.find({ userId: loggedUserId });

    return res.status(200).json({ userWorkouts });
  } catch (error) {
    console.error(error);
  }
});

app.post("/api/submitWorkoutSet", async (req: Request, res: Response) => {
  try {
    const token = req.cookies.token;
    if (!token) {
      return res
        .status(401)
        .json({ error: "Brak aktywnego tokenu, zaloguj się!" });
    }
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET!);
    } catch (error) {
      return res
        .status(401)
        .json({ error: "Token jest nieprawidłowy, lub wygasł" });
    }
    const userId = decoded.userId;
    const { name, exercises, description } = req.body;
    const newSet = new WorkoutSet({
      userId,
      name: name || "Mój zestaw",
      description: description || "",
      exercises,
    });

    await newSet.save();

    return res
      .status(201)
      .json({ message: "Pomyślnie dodano nowy zestaw treningowy", newSet });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Nie udało się zapisać zestawu" });
  }
});
app.get("/api/getWorkoutSets", async (req: Request, res: Response) => {
  try {
    const token = req.cookies.token;
    if (!token) {
      return res
        .status(400)
        .json({ error: "Sesja użytkownika nie jest aktywna, zaloguj się!" });
    }
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET!);
    } catch (error) {
      console.error(error);
      return res
        .status(401)
        .json({ error: "Token nie jest aktywny lu stracil ważność" });
    }
    const loggedUserId = decoded.userId;
    const workoutSets = await WorkoutSet.find({
      $or: [{ usersWithAccess: loggedUserId }, { isGlobal: true }],
    });

    return res.status(200).json(workoutSets);
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ error: "Nie udało pobrać się zestawów ćwiczeń" });
  }
});
app.get(
  "/api/getNewWorkoutSetsForMentee/:id",
  async (req: Request, res: Response) => {
    try {
      const token = req.cookies.token;
      const { id: menteeId } = req.params;
      if (!token) {
        return res
          .status(400)
          .json({ error: "Sesja użytkownika nie jest aktywna, zaloguj się!" });
      }
      let decoded;
      try {
        decoded = jwt.verify(token, process.env.JWT_SECRET!);
      } catch (error) {
        console.error(error);
        return res
          .status(401)
          .json({ error: "Token nie jest aktywny lu stracil ważność" });
      }
      const loggedUserId = decoded.userId;
      const workoutSets = await WorkoutSet.find({
        isGlobal: false,
        usersWithAccess: {
          $in: [loggedUserId],
          $nin: [menteeId],
        },
      });

      return res.status(200).json(workoutSets);
    } catch (error) {
      console.error(error);
      return res
        .status(500)
        .json({ error: "Nie udało pobrać się zestawów ćwiczeń" });
    }
  }
);

//Znajomi endpointy:

app.post("/api/friendRequests", async (req: Request, res: Response) => {
  try {
    const token = req.cookies.token;
    if (!token) {
      return res.status(201).json({ error: "Token nieaktywny, zaloguj się!" });
    }
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET!);
    } catch (error) {
      console.error(error);
      return res
        .status(401)
        .json({ error: "Nie udało się zweryfikować użytkownika" });
    }
    const senderId = decoded.userId;
    const { recipientId } = req.body;

    const existingRequest = await FriendRequest.findOne({
      sender: senderId,
      recipient: recipientId,
      status: "pending",
    });
    if (existingRequest) {
      return res
        .status(400)
        .json({ error: "Zaproszenie zostało już wysłane!" });
    }
    const newRequest = new FriendRequest({
      sender: senderId,
      recipient: recipientId,
    });
    await newRequest.save();
    return res.status(201).json({ message: "Zaproszenie wysłane", newRequest });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ error: "Nie udało się wysłać zaproszenia do znajomych." });
  }
});

app.get("/api/myRequests", async (req: Request, res: Response) => {
  try {
    const token = req.cookies.token;
    if (!token) {
      return res
        .status(401)
        .json({ error: "Brak aktywnego tokenu, zaloguj się!" });
    }
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET!);
    } catch (error) {
      return res
        .status(401)
        .json({ error: "Nie udało się zweryfikować użytkownika" });
    }
    const myId = decoded.userId;

    const { status = "pending" } = req.query;

    const requests = await FriendRequest.find({
      status: status,
      $or: [{ sender: myId }, { recipient: myId }],
    })
      .populate("sender", "login name surname")
      .populate("recipient", "login name surname");

    return res.status(200).json(requests);
  } catch (error) {
    console.error("Błąd przy pobieraniu zaproszeń użytkownika", error);
    return res.status(500).json({ error: "Nie udało się pobrać zaproszeń" });
  }
});

app.get("/api/getFriendRequests", async (req: Request, res: Response) => {
  try {
    const token = req.cookies.token;
    if (!token) {
      return res
        .status(401)
        .json({ error: "Brak aktywnego tokenu, zaloguj się!" });
    }
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET!);
    } catch (error) {
      return res
        .status(401)
        .json({ error: "Nie udało się zweryfikować użytkownika" });
    }
    const recipientId = decoded.userId;

    const requests = await FriendRequest.find({
      recipient: recipientId,
      status: "pending",
    }).populate("sender", "login name surname");

    return res.status(200).json(requests);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Nie udało się pobrać zaproszeń" });
  }
});

app.post("/api/requestResponse/:id", async (req: Request, res: Response) => {
  try {
    const token = req.cookies.token;
    if (!token) {
      return res
        .status(401)
        .json({ error: "Nie znaleziono tokenu, zaloguj się!" });
    }
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET!);
    } catch (error) {
      return res
        .status(401)
        .json({ error: "Nie udało się zweryfikować użytkownika" });
    }
    const userId = decoded.userId;
    const { id } = req.params;
    const { action } = req.body;

    const friendRequest = await FriendRequest.findById(id);
    if (!friendRequest) {
      return res.status(404).json({ error: "Zaproszenie nie istnieje" });
    }
    if (friendRequest.recipient.toString() !== userId) {
      return res.status(403).json({ error: "Brak uprawnień" });
    }
    if (action === "accept") {
      friendRequest.status = "accepted";
    } else if (action === "rejected") {
      friendRequest.status = "rejected";
    } else {
      return res.status(400).json({ error: "Niepoprawna akcja" });
    }
    await friendRequest.save();

    return res.status(200).json({
      message: `Zaproszenie ${action === "accept" ? "zaakceptowane" : "odrzucone"}`,
      friendRequest,
    });
  } catch (error) {
    console.error("Błąd podczas aktualizowania zaproszenia", error);
    return res
      .status(500)
      .json({ error: "Nie udało się zaktualizować zaproszenia" });
  }
});

app.get("/api/getFriends", async (req: Request, res: Response) => {
  try {
    const token = req.cookies.token;
    if (!token) {
      return res.status(401).json({ error: "Nieaktywny token, zaloguj się!" });
    }
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET!);
    } catch (error) {
      return res
        .status(401)
        .json({ error: "Nie udało się zweryfikować użytkownika" });
    }
    const userId = decoded.userId;

    const friends = await FriendRequest.find({
      $or: [{ sender: userId }, { recipient: userId }],
      status: "accepted",
    }).populate("sender recipient", "login name surname");

    const friendsList = friends.map((rel) => {
      if (rel.sender._id.toString() === userId) {
        return rel.recipient;
      } else {
        return rel.sender;
      }
    });

    return res.status(200).json({ friendsList });
  } catch (error) {
    console.error("Błąd przy pobieraniu listy znajomych", error);
    return res
      .status(500)
      .json({ error: "Nie udało pobrać się listy znajomych." });
  }
});
app.get("/api/getUserFriends/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ error: "Nie przekazano ID użytkownika!" });
    }

    const friends = await FriendRequest.find({
      $or: [{ sender: id }, { recipient: id }],
      status: "accepted",
    }).populate("sender recipient", "login name surname");

    const friendsList = friends.map((rel) => {
      if (rel.sender._id.toString() === id) {
        return rel.recipient;
      } else {
        return rel.sender;
      }
    });
    return res.status(200).json({ friendsList });
  } catch (error) {
    console.error(
      "Nie udało się pobrać informacji o znajomych użytkownika",
      error
    );
    return res.status(500).json({
      error: "Wystąpił błąd podczas pobierania znajomych użytkownika.",
    });
  }
});

//relacje trener podopieczny

app.post("/api/trainerRelations", async (req: Request, res: Response) => {
  try {
    const token = req.cookies.token;
    if (!token) {
      return res
        .status(401)
        .json({ error: "Nie udało się zweryfikować użytkownika" });
    }
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET!);
    } catch (error) {
      return res
        .status(401)
        .json({ error: "Użytkownik niezalogowany, lub jego sesja wygasła" });
    }

    const traineeId = decoded.userId;

    const { trainerId, months } = req.body;

    const now = new Date();
    let endDate = null;
    if (months) {
      endDate = new Date(now.getTime() + months * 30 * 24 * 60 * 60 * 1000);
    }

    const newRelation = new TrainerTraineeRelations({
      trainerId,
      traineeId,
      startDate: now,
      endDate,
      status: "pending",
    });

    await newRelation.save();

    return res
      .status(201)
      .json({ message: "Zaproszenie wysłane", newRelation });
  } catch (error) {
    res.status(500).json({ error: "Błąd serwera" });
    console.error("Wystąpił problem podczas wysyłania zaproszenia", error);
  }
});

app.patch(
  "/api/trainerRelationsResponse/:id",
  async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const { action } = req.body;
      const relation = await TrainerTraineeRelations.findById(id);
      if (!relation)
        return res.status(404).json({ error: "Nie znaleziono relacji" });
      if (relation.status === "pending") {
        if (action === "accept") {
          relation.status = "active";
        } else if (action === "reject") {
          relation.status = "rejected";
        }
        await relation.save();
        return res.json({
          message: `Relacja zaktualizowana ${relation.status}`,
          relation,
        });
      }
      if (relation.status === "active" && action === "cancel") {
        relation.status = "canceled";
        await relation.save();
        return res.json({ message: "Relacja anulowana", relation });
      }
      res.json({ message: "Brak akcji do wykonania" });
    } catch (error) {
      res.status(500).json({ error: "Błąd Serwera" });
      console.error("Wystąpił błąd podczas wykonywania akcji", error);
    }
  }
);
app.get("/api/getTrainerRelations", async (req: Request, res: Response) => {
  try {
    const token = req.cookies.token;
    if (!token) return res.status(401).json({ error: "Brak aktywnego tokenu" });

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET!);
    } catch (error) {
      return res.status(401).json({ error: "Token nieprawidłowy" });
    }

    const myId = decoded.userId;

    const trainerRelations = await TrainerTraineeRelations.find({
      status: "pending",
      $or: [{ trainerId: myId }, { traineeId: myId }],
    })
      .populate("trainerId", "login name surname roles")
      .populate("traineeId", "login name surname roles");

    res.status(200).json(trainerRelations);
  } catch (error) {
    console.error("Błąd przy pobieraniu relacji trenerskich:", error);
    res.status(500).json({ error: "Błąd serwera" });
  }
});
app.get("/api/getTrainers", async (req: Request, res: Response) => {
  try {
    const token = req.cookies.token;
    if (!token) {
      return res.status(401).json({ error: "Nieaktywny token, zaloguj się!" });
    }
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET!);
    } catch (error) {
      return res
        .status(401)
        .json({ error: "Nie udało się zweryfikować użytkownika" });
    }
    const userId = decoded.userId;

    const trainers = await TrainerTraineeRelations.find({
      traineeId: userId,
      status: "active",
    })
      .populate("trainerId", "login name surname roles")
      .populate("traineeId", "login name surname roles");

    return res.status(200).json(trainers);
  } catch (error) {
    console.error("Błąd przy pobieraniu listy trenerów", error);
    return res
      .status(500)
      .json({ error: "Nie udało pobrać się listy trenerów." });
  }
});
app.get("/api/getTrainees", async (req: Request, res: Response) => {
  try {
    const token = req.cookies.token;
    if (!token) {
      return res.status(401).json({ error: "Nieaktywny token, zaloguj się!" });
    }
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET!);
    } catch (error) {
      return res
        .status(401)
        .json({ error: "Nie udało się zweryfikować użytkownika" });
    }
    const userId = decoded.userId;

    const trainees = await TrainerTraineeRelations.find({
      trainerId: userId,
      status: "active",
    })
      .populate("trainerId", "login name surname roles")
      .populate("traineeId", "login name surname roles");

    return res.status(200).json(trainees);
  } catch (error) {
    console.error("Błąd przy pobieraniu listy podopiecznych", error);
    return res
      .status(500)
      .json({ error: "Nie udało pobrać się listy podopiecznych." });
  }
});
app.get(
  "/api/trainerRelationsRequests",
  async (req: Request, res: Response) => {
    try {
      const token = req.cookies.token;
      if (!token)
        return res.status(401).json({ error: "Brak aktywnego tokenu" });

      let decoded;
      try {
        decoded = jwt.verify(token, process.env.JWT_SECRET!);
      } catch (error) {
        return res.status(401).json({ error: "Token nieprawidłowy" });
      }

      const myId = decoded.userId;

      const trainerRequests = await TrainerTraineeRelations.find({
        status: "pending",
        trainerId: myId,
      })
        .populate("trainerId", "login name surname roles")
        .populate("traineeId", "login name surname roles");

      res.status(200).json(trainerRequests);
    } catch (error) {
      console.error("Błąd przy pobieraniu relacji trenerskich:", error);
      res.status(500).json({ error: "Błąd serwera" });
    }
  }
);

cron.schedule("0 * * * *", async () => {
  try {
    const now = new Date();
    const result = await TrainerTraineeRelations.updateMany(
      { status: "active", endDate: { $ne: null, $lte: now } },
      { status: "expired" }
    );
    console.log(
      `Cron zaktualizował: ${result.modifiedCount} relacji na expired`
    );
  } catch (error) {
    console.error("Błąd podczas aktualizacji relacji (cron):", error);
  }
});

app.options("/api/register", cors());
app.options("/api/login", cors());
app.use("/uploads", express.static(path.join(__dirname, "./uploads")));

app.listen(port, () => {
  console.log(`Serwer działa na porcie ${port}`);
});
