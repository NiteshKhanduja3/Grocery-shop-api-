const router = require("express").Router();
const {
  signUp,
  veryFyOtp,
  login,
  getUser,
  updateUser,
  deleteUser,
  updateAddress,
} = require("../Controllers/UserContoller");

router.route("/signup").post(signUp);

router.route("/signup/verify").post(veryFyOtp);

router.route("/login/verify").post(login);

// user Routes
router
  .route("/:id")
  .get(getUser)
  .put(updateUser)
  .delete(deleteUser)

  //   add new address
  .patch(updateAddress);

module.exports = router;
