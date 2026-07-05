import jwt, { verify } from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your_secret_key';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '1d';

export const jwttoken = {
    sign:(payload) =>{
        try{return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
        } catch (error) {
            console.error('Error generating JWT token:', error);
            throw error;
        }
    },
    verify:(token)=>{
        try{return verify(token, JWT_SECRET);
        } catch (error) {
            console.error('Error verifying JWT token:', error);
            throw error;
        }
    }
}