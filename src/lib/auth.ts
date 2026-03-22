import { NextApiRequest } from "next";
import jwt from 'jsonwebtoken'

export function signToken(payload: object){
    const secret = process.env.JWT_SECRET_TOKEN
    if(!secret){
        throw new Error('JWT_SECRET_TOKEN is not defined')
    }
    return jwt.sign(payload, secret , {expiresIn: '7d'})
}

export function verifyToken(token?: string) {
    if (!token) return null
    try {
        const secret =  process.env.JWT_SECRET_TOKEN
        if (!secret){
            throw new Error('JWT_SECRET_TOKEN is not defined')
        }
        return jwt.verify(token, secret) as any
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
