import { customAlphabet } from "nanoid";
const alphabet='0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'
export const nanoid=customAlphabet(alphabet,10)//0~9,a~z,A~Z(去除-和_)  10位数

//使用nanoid@3.3.4----Last commonJs supported version