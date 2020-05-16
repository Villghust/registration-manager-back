import { hash, compare } from 'bcryptjs';

module.exports = {
    hash: async (password) => {
        return await hash(password, 8);
    },

    compare: async (password, passwordHash) => {
        return await compare(password, passwordHash);
    },
};
