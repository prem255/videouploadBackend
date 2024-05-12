const jwt = require("jsonwebtoken");
const {
  validateEmail,
  sendResponse,
  bcryptString,
  compareHash,
} = require("../helper/commonfunction");
const { jwtSecret } = require("../config");
const User = require("../models/user");

const login = async (req, res) => {
  try {
    let { email, password } = req.body;

    if (!email || !password)
      return sendResponse(res, 400, "Incomplete Request");
    if (!validateEmail(email)) return sendResponse(res, 400, "Invalid Email");
    password = password.trim();
    if (password.length > 8)
      return sendResponse(res, 400, "Password shall be of 8 characters.");
    let searchBody = { email };
    let user = await User.findOne(searchBody);
    console.log(user)
    if (user) {
      if (compareHash(password, user.password))
        return sendResponse(res, 403, "Invalid Credentials");
      else {
        const token = jwt.sign({ email: user.email, isLogin: 1 }, jwtSecret);
        return sendResponse(res, 200, "Logged in successfully", { token });
      }
    } else {
      let encPass = await bcryptString(password);
      const newUser = new User({ email, password: encPass });
      await newUser.save();
      const token = jwt.sign({ email: email, isLogin: 1 }, jwtSecret);
      return sendResponse(res, 200, "Logged in successfully", { token });
    }

    //  else return sendResponse(res, 404, "User not found");
  } catch (error) {
    console.log("error while login", error);
    return sendResponse(res, 500, "Internal server error.");
  }
};

const forgetpassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) return sendResponse(res, 400, "Incomplete Request");
    if (!validateEmail(email)) return sendResponse(res, 400, "Invalid Email");

    let searchBody = { query: { term: { email: email } } };

    let user = await findUsingElk(userIndex, searchBody);

    if (user.length !== 0) {
      user = user[0];
    } else return sendResponse(res, 404, "User not found");
  } catch (error) {
    console.log("error in forgot password", error);
    return sendResponse(res, 500, "Internal server error.");
  }
};

module.exports = { login };
