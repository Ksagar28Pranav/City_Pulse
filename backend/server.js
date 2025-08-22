// server.js
import express from "express";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import cors from "cors";

const app = express();
app.use(express.json());
app.use(cors());

const PORT = 5000;
const JWT_SECRET = "supersecretkey"; 
const MONGO_URI = "mongodb+srv://nakulpise831:nakul1381@cluster0.h4om8.mongodb.net/City_Pulse"; 

const userSchema = new mongoose.Schema({
  username: { type: String, unique: true },
  passwordHash: String,
  role: { type: String, enum: ["citizen", "officer"], default: "citizen" },
  createdAt: { type: Date, default: Date.now },
});
// 
const reportSchema = new mongoose.Schema({
  citizenId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  type: String,
  description: String,
  lat: Number,
  lng: Number,
  status: { type: String, enum: ["not_done", "in_progress", "finished"], default: "not_done" },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

reportSchema.pre("save", function(next) {
  this.updatedAt = new Date();
  next();
});

reportSchema.pre(["updateOne", "findOneAndUpdate"], function(next) {
  this.set({ updatedAt: new Date() });
  next();
});

const User = mongoose.model("User", userSchema);
const Report = mongoose.model("Report", reportSchema);

const auth = (roles = []) => {
  return (req, res, next) => {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ msg: "No token" });

    try {
      const decoded = jwt.verify(token, JWT_SECRET);
      req.user = decoded;
      if (roles.length && !roles.includes(decoded.role)) {
        return res.status(403).json({ msg: "Access denied" });
      }
      next();
    } catch (err) {
      return res.status(401).json({ msg: "Invalid token" });
    }
  };
};

app.post("/auth/signup", async (req, res) => {
  const { username, password, role } = req.body;
  try {
    const hash = await bcrypt.hash(password, 10);
    const newUser = await User.create({ username, passwordHash: hash, role });
    res.json({ msg: "User created", userId: newUser._id });
  } catch (err) {
    res.status(400).json({ msg: "Error: " + err.message });
  }
});

app.post("/auth/login", async (req, res) => {
  const { username, password } = req.body;
  const user = await User.findOne({ username });
  if (!user) return res.status(400).json({ msg: "User not found" });

  const isMatch = await bcrypt.compare(password, user.passwordHash);
  if (!isMatch) return res.status(400).json({ msg: "Invalid credentials" });

  const token = jwt.sign(
    { userId: user._id, role: user.role },
    JWT_SECRET,
    { expiresIn: "1d" }
  );
  res.json({ token, role: user.role });
});

// Citizen: create report
app.post("/reports", auth(["citizen"]), async (req, res) => {
  const { type, description, lat, lng } = req.body;
  const newReport = await Report.create({
    citizenId: req.user.userId,
    type,
    description,
    lat,
    lng,
  });
  res.json(newReport);
});

app.get("/reports/mine", auth(["citizen"]), async (req, res) => {
  const reports = await Report.find({ citizenId: req.user.userId });
  res.json(reports);
});

app.get("/reports", auth(["officer"]), async (req, res) => {
  const reports = await Report.find().populate("citizenId", "username");
  res.json(reports);
});

// Update report status (officers)
app.patch("/reports/:id/status", auth(["officer"]), async (req, res) => {
  const { status } = req.body; // expected: not_done | in_progress | finished
  if (!['not_done','in_progress','finished'].includes(status)) {
    return res.status(400).json({ msg: 'Invalid status' });
  }
  const updated = await Report.findByIdAndUpdate(
    req.params.id,
    { status },
    { new: true }
  ).populate("citizenId", "username");
  if (!updated) return res.status(404).json({ msg: 'Report not found' });
  res.json(updated);
});

// Overdue reports (> 48 hours since creation and not finished)
app.get("/reports/overdue", auth(["officer"]), async (req, res) => {
  const cutoff = new Date(Date.now() - 48 * 60 * 60 * 1000);
  const overdue = await Report.find({
    createdAt: { $lte: cutoff },
    status: { $ne: 'finished' }
  }).populate("citizenId", "username");
  res.json(overdue);
});

mongoose.connect(MONGO_URI)
  .then(() => {
    console.log("MongoDB connected");
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch(err => console.log(err));
