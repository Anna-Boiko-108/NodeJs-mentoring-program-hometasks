import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';

dotenv.config();

export const config = {
    PORT: process.env.PORT || 3000,
    DB_CONNECTION_STRING: process.env.DB_CONNECTION_STRING,
    JWT_SECRET: process.env.JWT_SECRET as jwt.Secret
};
