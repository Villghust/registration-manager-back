import bcrypt from 'bcryptjs';

export async function hash(password) {
    return await bcrypt.hash(password, 8);
}

export async function compare(password, passwordHash) {
    return await bcrypt.compare(password, passwordHash);
}
