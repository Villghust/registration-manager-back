import bcrypt from 'bcryptjs';

module.exports = {
    hash: async (password) => {
        return await bcrypt.hash(password, 8);
    },

    compare: async (password, passwordHash) => {
        return await bcrypt.compare(password, passwordHash);
    },
};
