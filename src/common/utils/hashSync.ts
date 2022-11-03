import { hashSync } from 'bcryptjs'

export const useHashSync=(val:string)=>{
    return hashSync(val, 10)
}