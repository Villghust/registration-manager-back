import jwt from 'jsonwebtoken';
import Yup from 'yup';

import authConfig from '../../config/auth.js';

import { compare } from '../../lib/Cryptography.js';

import User from '../schemas/User.js';

class SessionController {
    async store(req, res) {
        const schema = Yup.object().shape({
            email: Yup.string().email().required(),
            password: Yup.string().required(),
        });

        if (!(await schema.isValid(req.body))) {
            return res.status(400).json({
                error: 'You must type a valid user email and password',
            });
        }

        const { email, password } = req.body;

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        const isPasswordValid = await compare(password, user.password_hash);

        if (!isPasswordValid) {
            return res.status(401).json({ error: 'Incorrect Password' });
        }

        const { id, name, user_type, course, team } = user;

        return res.status(201).json({
            user: { id, name, email, user_type, course, team },
            token: jwt.sign({ id, user_type }, authConfig.secret, {
                expiresIn: authConfig.expiresIn,
            }),
        });
    }
}

export default new SessionController();
