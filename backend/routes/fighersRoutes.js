import express from "express";
import fs from "fs";

const router = express.Router();
const SECRET_KEY = "super_secret_for_testing"; // store in .env for real app

// Simulate DB by reading local users.json
const getFighters = () => {
  const data = fs.readFileSync("./data/fighters.json", "utf8");
  return JSON.parse(data);
};

router.get("/fighters", async(req, res) => {
    const fighters = getFighters();
    res.json(fighters);
})

// --- LOGIN ---
// router.post("/login", async (req, res) => {
//   const { userName, password } = req.body;
//   const users = getFighters();

//   const user = users.find(
//     (u) => u.userName.toLowerCase() === userName.toLowerCase()
//   );

//   if (!user) {
//     return res.status(401).json({ message: "Invalid username or password" });
//   }

//   const isValid = await bcrypt.compare(password, user.passwordHash);
//   if (!isValid) {
//     return res.status(401).json({ message: "Invalid username or password" });
//   }

//   // ✅ Create JWT token
//   const token = jwt.sign(
//     {
//       id: user.id,
//       displayName: user.displayName,
//       role: user.role,
//     },
//     SECRET_KEY,
//     { expiresIn: "1h" }
//   );

//   res.json({ displayName: user.displayName, token });
// });

// // --- REGISTER ---
// router.post("/register", async (req, res) => {
//   const { userName, password, displayName } = req.body;
//   const users = getUsers();

//   if (users.some((u) => u.userName.toLowerCase() === userName.toLowerCase())) {
//     return res.status(400).json({ message: "Username already exists" });
//   }

//   const passwordHash = await bcrypt.hash(password, 10);

//   const newUser = {
//     id: users.length + 1,
//     userName,
//     displayName,
//     passwordHash,
//     role: "User",
//   };

//   users.push(newUser);
//   fs.writeFileSync("./data/users.json", JSON.stringify(users, null, 2));

//   const token = jwt.sign(
//     {
//       id: newUser.id,
//       displayName: newUser.displayName,
//       role: newUser.role,
//     },
//     SECRET_KEY,
//     { expiresIn: "1h" }
//   );

//   res.json({ displayName: newUser.displayName, token });
// });

export default router;
