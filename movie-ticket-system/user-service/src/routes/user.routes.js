const express = require("express")

const router = express.Router()

const userController = require("../controllers/user.controller")

const auth = require("../middleware/auth.middleware")


router.post("/register", userController.register)

router.post("/login", userController.login)

router.get("/profile", auth, userController.getUser)

router.put("/profile", auth, userController.updateProfile)

router.delete("/profile", auth, userController.deleteUser)

module.exports = router