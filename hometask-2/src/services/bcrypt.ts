import bcrypt from 'bcrypt';

const saltRounds = 10;

export const getHashAsync = async (value: string) => bcrypt.hash(value, saltRounds);

export const isHashMatch = async (value: string, valueHash: string) => bcrypt.compare(value, valueHash);
