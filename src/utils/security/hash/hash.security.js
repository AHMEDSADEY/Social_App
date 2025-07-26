import bcrypt from "bcrypt"
export const genrateHash = ({plainText="" ,salt = process.env.saltRound} = {})=>{
  const hashData = bcrypt.hashSync(plainText , parseInt(salt))
  return hashData
}
export const genrateCompare = ({plainText="" ,hashValue = ""} = {})=>{
  const compareData = bcrypt.compareSync(plainText , hashValue)
  return compareData
}