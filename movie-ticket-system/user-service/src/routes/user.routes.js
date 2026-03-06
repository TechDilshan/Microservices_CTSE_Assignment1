const express = require("express")

const router = express.Router()

const userController = require("../controllers/user.controller")
const auth = require("../middleware/auth.middleware")


// authentication
router.post("/register", userController.register)
router.post("/login", userController.login)


// profile routes
router.get("/profile", auth, userController.getProfile)
router.put("/profile", auth, userController.updateProfile)
router.delete("/profile", auth, userController.deleteProfile)


// admin routes
router.get("/", userController.getAllUsers)
router.get("/:id", userController.getUserById)
router.put("/:id", userController.updateUserById)
router.delete("/:id", userController.deleteUserById)

module.exports = router