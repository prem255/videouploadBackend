const bcrypt = require('bcrypt');
function validateEmail(value, state) {
    // eslint-disable-next-line
    const re = /^[-!#$%&'*+\/0-9=?A-Z^_a-z{|}~](\.?[-!#$%&'*+\/0-9=?A-Z^_a-z`{|}~])*@[a-zA-Z0-9](-*\.?[a-zA-Z0-9])*\.[a-zA-Z](-?[a-zA-Z0-9])+$/;
    if (!re.test(value)) return false;
    else return true;
}
function sendResponse(res, code, msg, data = null) {
    return res.status(code).json({ msg, "data":data })
}


async function compareHash(plainText, hashedText) {
  try {
    const match = await bcrypt.compare(plainText, hashedText);
    return match;
  } catch (error) {
    console.error('Error comparing hash:', error);
    return false;
  }
}

async function bcryptString(plainText) {
  try {
    const saltRounds = 10;
    const salt = await bcrypt.genSalt(saltRounds);
    const hashedText = await bcrypt.hash(plainText, salt);
    return hashedText;
  } catch (error) {
    console.error('Error hashing string:', error);
    return false;
  }
}



module.exports = { validateEmail, sendResponse,bcryptString,compareHash}