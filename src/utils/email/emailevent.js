  import { EventEmitter } from "node:events"
  import { customAlphabet } from "nanoid"
import { genrateHash } from "../security/hash/hash.security.js"
import { User } from "../../DB/model/User.model.js"
import { sendEmail } from "./sendEamail.js"
import { sendEmailTemplate } from "./emailTemplate.js"
import * as dbSerives from "../../DB/db.services.js"
export const emailEvent = new EventEmitter()
export const emailSubject = {
  confirmEmail:"ConfirmEmail",
  resetPassword:"Reset-password",
  updateEmail:"UpdataEmail"
}
  export const sendCode = async ({data = {}, subject=emailSubject.confirmEmail} = {}) =>{
    const {id,email} = data
    const otp = customAlphabet("84371",4)()
    const otpHash = genrateHash({plainText:otp})
    let updateData = {}
    switch (subject) {
      case emailSubject.confirmEmail:
        updateData = {confirmEmailOTP:otpHash}
        break;
      case emailSubject.resetPassword:
        updateData = {resetPasswordOTP:otpHash}
      break
      case emailSubject.updateEmail:
        updateData = {tempUpdateOTP:otpHash}
      break
      default:
        break;
    }
        await dbSerives.updateOne({model:User , filter:{_id:id},data:updateData})
        const html = sendEmailTemplate({code:otp})
      await sendEmail({to:email,subject:'confirm-email',html})
  }
  emailEvent.on("sendConfirmEmail",async (data)=>{
    await sendCode({data})
    })
  emailEvent.on("UpdateEmail",async (data)=>{
    await sendCode({data,subject:emailSubject.updateEmail})
    })
  emailEvent.on("ForgotPassword",async (data)=>{
    await sendCode({data,subject:emailSubject.resetPassword})
    })
