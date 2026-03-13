const express = require("express")

const router = express.Router()

const userController = require("../controllers/user.controller")
const auth = require("../middleware/auth.middleware")
const { requireRole } = require("../middleware/role.middleware")


// authentication
router.post("/register", userController.register)
router.post("/login", userController.login)


// profile routes
router.get("/profile", auth, userController.getProfile)
router.put("/profile", auth, userController.updateProfile)
router.delete("/profile", auth, userController.deleteProfile)


// admin routes - Admin: CRUD Hall Owners; Hall Owner: view/delete customers
router.get("/", auth, requireRole("admin", "hall_owner"), userController.getAllUsers)
router.get("/hall-owners", auth, requireRole("admin"), userController.getHallOwners)
router.post("/hall-owners", auth, requireRole("admin"), userController.createHallOwner)
router.get("/:id", auth, requireRole("admin", "hall_owner"), userController.getUserById)
router.put("/:id", auth, requireRole("admin", "hall_owner"), userController.updateUserById)
router.delete("/:id", auth, requireRole("admin", "hall_owner"), userController.deleteUserById)

module.exports = router