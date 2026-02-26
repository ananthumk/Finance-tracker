import { NextApiRequest } from "next";
import jwt from 'jsonwebtoken'

export function signToken(payload: object){
    return jwt.sign(payload, process.env.JWT_SECRET_TOKEN , {expiresIn: '7d'})
}

export function verifyToken(token?: string) {
    if (!token) return null
    try {
        return jwt.verify(token, process.env.JWT_SECRET_TOKEN) as any
    } catch (error) {
        return null
    }
}

export function getToken(req: NextApiRequest){
    const auth = req.headers.authorization
    if (!auth) return null
    const token = auth.split(' ')
    if( token.length === 2 && token[0] === 'Bearer' ) return token[1]
    return null
}
