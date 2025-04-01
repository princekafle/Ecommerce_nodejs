import User from "../models/User.js";
import bcrypt from "bcryptjs";

import ResetPassword from "../models/ResetPassword.js";
// yesma vayeko data chai user through req.body bata aauxa 
const login = async (data) => {
    // yesle chai user bata aako email ra phone snga databaseko email ra phone match garxa
  const user = await User.findOne({
    $or: [{ email: data.email }, { phone: data.phone }],
  });

  if (!user) {
    throw {
      statusCode: 404,
      message: "User not found.",
    };
  }
// yesle chai user bata aako password ra database ma vako hashed password check garxa
  const isPasswordMatch = bcrypt.compareSync(data.password, user.password);

  if (!isPasswordMatch) {
    throw {
      statusCode: 400,
      message: "Incorrect email or password.",
    };
  }

  return user;
};

const register = async (data) => {
  const user = await User.findOne({
    $or: [{ email: data.email }, { phone: data.phone }],
  });

  if (user) {
    throw {
      statusCode: 409,
      message: "User already exists.",
    };
  }

// bcrypt.hashSync(data.password) le password lai hash garxa 
  const hashedPassword = bcrypt.hashSync(data.password);

  // yesle chai database ma user create garxa jasma chai hased password hunxa instead of original password
  return await User.create({
    address: data.address,
    name: data.name,
    phone: data.phone,
    email: data.email,
    password: hashedPassword,
    roles: data.roles,
  });
};

const forgotPassword = async (email) => {
  const user = await User.findOne({ email });

  if (!user) {
    throw {
      statusCode: 404,
      message: "User not found.",
    };
  }

  const otp = Math.floor(Math.random() * 1000000);

  await ResetPassword.create({
    userId: user?._id,
    token: otp,
  });

  // Send email to user
  // {{apiUrl}}/api/auth/reset-password/:userId?token=<otp>

  return { message: "Reset password link has been sent" }; 
  // yespaxi hamro database ma token ra user id save sahit aru data save hunxa 
};

const resetPassword = async (userId, token, password) => {
  // yesle chai ResetPassword collection ko yesto data find garxa jasma userId ra token match garxa
  const data = await ResetPassword.findOne({
    userId, // user id match garxa req bata aako ra database ma vako , if yo duitai condition ok xa vane resetpassword model ma vako specific id vako user data return garxa 
    expiresAt: { $gt: Date.now() }, // yesle chai ahile ko date bata 5 minute paxi ko date samma check garxa
  });
// database ma vako token ra user bata aako token match garxa
  if (!data || data.token !== token) {
    throw {
      statusCode: 400,
      message: "Invalid token.",
    };
  }

  if (data.isUsed) {
    throw {
      statusCode: 400,
      message: "Token already used.",
    };
  }

  const hashedPassword = bcrypt.hashSync(password);

  await User.findByIdAndUpdate(userId, {
    password: hashedPassword,
  });

  await ResetPassword.findByIdAndUpdate(data._id, {
    isUsed: true,
  });

  return { message: "Password reset successful." };
};

export default { login, register, forgotPassword, resetPassword };