import { decryptToken } from "../auth/tokenEncryption"

export const userInfo=()=>{
    let {user_type:usertype,token:Token}=localStorage
    let token=decryptToken(Token)
    return {token,usertype}
}