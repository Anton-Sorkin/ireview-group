//REQUIREMENTS
const express = require("express");
const router = express.Router();

//GETS
router.get("/", (req, res) => {
	res.render("admins/adminPage", {
		user: "Admin placeholder",
	});
});

//GETS
router.get("/userList", (req, res) => {
	res.render("admins/adminUserList", {
		users: "anton",
	});
});

//GET SINGLE
router.get("/userList/:id", async (req, res) => {
	const user = await UsersModel.findById(req.params.id).lean();
	res.render("admins/adminUserSingle", user);
});

// LOG OUT
router.post("/log-out", (req, res) => {
	res.cookie("token", "", { maxAge: 0 });
	res.redirect("/");
});

router.post("/userList/:id", async (req, res) => {
	const { username } = req.body;

	UsersModel.deleteOne({ username }, (err, user) => {});
});

//EXPORTS
module.exports = router;
