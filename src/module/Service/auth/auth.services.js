import { providerType, rolesType } from "../../../DB/model/User.model.js";
import {
  decoded,
  genrateToken,
  genrateVrifay,
  tokenTypes,
} from "../../../utils/security/token/token.security.js";
import { User } from "../../../DB/model/User.model.js";
import { emailEvent } from "../../../utils/email/emailevent.js";
import { successResponse } from "../../../utils/response/successResponse.js";
import {
  genrateCompare,
  genrateHash,
} from "../../../utils/security/hash/hash.security.js";
import jwt from "jsonwebtoken";
import {OAuth2Client} from 'google-auth-library';
  import * as dbServices from "../../../DB/db.services.js"

export const signUp = async (req, res, next) => {
  const { userName, email, password } = req.body;
  // const user = await User.findOne({ email });
  const user = await dbServices.findOne({model:User , filter:{ email }});
  if (user) {
    return next(new Error("Email is Already Exists !", { cause: 409 }));
  }
  const passwordHash = genrateHash({ plainText: password });
  const userData = await User.create({
    userName,
    email,
    password: passwordHash,
  });
  emailEvent.emit("sendConfirmEmail", { email });
  return successResponse({
    res,
    message: "Create Successfully",
    status: 201,
    data: userData,
  });
};
export const confirmEmail = async (req, res, next) => {
  const { email, code } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    return next(new Error("User Not Found !", { cause: 404 }));
  }
  if (user.confirmEmail) {
    return next(new Error("in-valid Account ", { cause: 409 }));
  }
  if (!genrateCompare({ plainText: code, hashValue: user.confirmEmailOTP })) {
    return next(new Error("Not Match Try again ! ", { cause: 400 })); 
  }
  await User.updateOne(
    { email },
    { confirmEmail: true, $unset: { confirmEmailOTP: 0 } }
  );
  return successResponse({ res });
};
  export const refrehToken = async(req,res,next)=>{
    const {authorization} = req.headers
    const user = await decoded({authorization , tokenType:tokenTypes.refreh , next})
    const access_Token = jwt.sign(
      { id: user._id },
      user.role == rolesType.ADMIN
        ? process.env.USER_ACCESS_TOKEN
        : process.env.ADMIN_ACCESS_TOKEN
    );
    const refreh_Token = jwt.sign(
      { id: user._id },
      user.role == rolesType.ADMIN
        ? process.env.ADMIN_REFREH_TOKEN
        : process.env.USER_REFREH_TOKEN,
      { expiresIn: 31536000 }
    );
    return successResponse({ res, data: {token:{access_Token, refreh_Token }} });
  }
export const login = async (req, res, next) => {
  const { email, password } = req.body;
  // const user = await User.findOne({ email });
  const user = await dbServices.findOne({model:User ,filter:{email}});
  if (!user) {
    return next(new Error("User Not Found !", { cause: 404 }));
  }
  if (!genrateCompare({ plainText: password, hashValue: user.password })) {
    return next(new Error("in-valid Account ", { cause: 409 }));
  }
  const access_Token = jwt.sign(
    { id: user._id },
    user.role == rolesType.ADMIN
      ? process.env.USER_ACCESS_TOKEN
      : process.env.ADMIN_ACCESS_TOKEN
  );
  // const access_Token = genrateToken({
  //   payload: { id: user._id},
  //   signture:
  //     user.role == rolesType.ADMIN
  //       ? process.env.ADMIN_ACCESS_TOKEN
  //       : process.env.USER_ACCESS_TOKEN,
  // });
  const refreh_Token = jwt.sign(
    { id: user._id },
    user.role == rolesType.ADMIN
      ? process.env.ADMIN_REFREH_TOKEN
      : process.env.USER_REFREH_TOKEN,
    { expiresIn: 31536000 }
  );
  // const refreh_Token = genrateToken({
  //   payload: { id: user._id },
  //   signture:
  //     user.role == rolesType.ADMIN
  //       ? process.env.ADMIN_REFREH_TOKEN
  //       : process.env.USER_REFREH_TOKEN,
  //   expireIn: 31536000,
  // });
  return successResponse({ res, data: { access_Token, refreh_Token } });
};
export const loginWithGmail = async (req, res, next) => {
  const {idToken} = req.body;

  const client = new OAuth2Client();
  async function verify() {
    const ticket = await client.verifyIdToken({
        idToken,
        audience: process.env.CLIENTID,  // Specify the WEB_CLIENT_ID of the app that accesses the backend
        // Or, if multiple clients access the backend:
        //[WEB_CLIENT_ID_1, WEB_CLIENT_ID_2, WEB_CLIENT_ID_3]
    });
    const payload = ticket.getPayload();
    return payload
  }
  const payload = await verify()
  if (!payload.email_verified) {
    return next(new Error("In-valid Account !", { cause: 404 }));
  }
  // let user = await User.findOne({ email:payload.email });
  let user = await dbServices.findOne({model:User , filter:{ email:payload.email }});
  if (!user) {
      user = await dbServices.create({
        model:User,
        data:{
            userName:payload.name,
            email:payload.email,
            confirmEmail:payload.email_verified,
            image:payload.picture,
            provider:providerType.GOOGLE
        }
      })
  }
  if(user.provider != providerType.GOOGLE ){
    return next(new Error("In-valid provider , ",{cause:400}))
  }
  const access_Token = jwt.sign(
    { id: user._id },
    user.role == rolesType.ADMIN
      ? process.env.ADMIN_REFREH_TOKEN
      : process.env.USER_REFREH_TOKEN
  );
  // const access_Token = genrateToken({
  //   payload: { id: user._id},
  //   signture:
  //     user.role == rolesType.ADMIN
  //       ? process.env.ADMIN_ACCESS_TOKEN
  //       : process.env.USER_ACCESS_TOKEN,
  // });
  const refreh_Token = jwt.sign(
    { id: user._id },
    user.role == rolesType.ADMIN
      ? process.env.ADMIN_REFREH_TOKEN
      : process.env.USER_REFREH_TOKEN,
    { expiresIn: 31536000 }
  );
  // const refreh_Token = genrateToken({
  //   payload: { id: user._id },
  //   signture:
  //     user.role == rolesType.ADMIN
  //       ? process.env.ADMIN_REFREH_TOKEN
  //       : process.env.USER_REFREH_TOKEN,
  //   expireIn: 31536000,
  // });
  return successResponse({ res,data: {access_Token ,refreh_Token  }  });
};
export const forgotPassword = async (req, res, next) => {
  const { email } = req.body;
  // const user = await User.findOne({ email, isDeleted: false });
  const user = await dbServices.findOne({model:User , filter:{ email, isDeletet: false }});
  if (!user) {
    return next(new Error("In-valid Account", { cause: 404 }));
  }
  if (!user.confirmEmail) {
    return next(
      new Error("Verify your Account First Please !", { cause: 400 })
    );
  }
  emailEvent.emit("ForgotPassword", { id: user._id, email });
  return successResponse({ res });
};
export const validateForgotPassword = async (req, res, next) => {
  const { email, code } = req.body;
  const user =await dbServices.findOne({model:User , filter:{ email, isDeletet: false }});
  if (!user) {
    return next(new Error("In-valid Account", { cause: 404 }));
  }
  if (!user.confirmEmail) {
    return next(
      new Error("Verify your Account First Please !", { cause: 400 })
    );
  }
  if (!genrateCompare({ plainText: code, hashValue: user.resetPasswordOTP })) {
    return next(new Error("In-valid reset Code !", { cause: 400 }));
  }
  return successResponse({ res });
};
export const resetPassword = async (req, res, next) => {
  const { email, code, password } = req.body;
  // const user = await User.findOne({ email, isDeleted: false });
  const user = await dbServices.findOne({model:User , filter:{email, isDeletet: false }});
  if (!user) {
    return next(new Error("In-valid Account", { cause: 404 }));
  }
  if (!user.confirmEmail) {
    return next(
      new Error("Verify your Account First Please !", { cause: 400 })
    );
  }
  if (!genrateCompare({ plainText: code, hashValue: user.resetPasswordOTP })) {
    return next(new Error("In-valid reset Code !", { cause: 400 }));
  }
  // await User.updateOne(
  // //   { email },
  // //   {
  // //     password: genrateHash({ plainText: password }),
  // //     changeCridentialsTime:Date.now(), 
  // //     $unset: { resetPassword: 0 },
  // //   }
  // // );
  await dbServices.updateOne({
    model:User,
    filter:{ email },
    data:{
      password: genrateHash({ plainText: password }),
      changeCridentialsTime:Date.now(), 
      $unset: { resetPassword: 0 },
    }
  }
  );
  return successResponse({ res });
};
