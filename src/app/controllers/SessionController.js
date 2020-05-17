import * as Yup from 'yup';

import jwt from 'jsonwebtoken';

import Cryptography from '../../lib/Cryptography.js';

import User from '../schemas/User.js';

import authConfig from '../../config/auth.js';

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

        const isPasswordValid = await Cryptography.compare(
            password,
            user.password_hash
        );

        if (!isPasswordValid) {
            return res.status(401).json({ error: 'Incorrect Password' });
        }

        const { _id, name, reviewer, course, team } = user;

        return res.status(201).json({
            user: { _id, name, email, reviewer, course, team },
            token: jwt.sign({ _id, reviewer }, authConfig.secret, {
                expiresIn: authConfig.expiresIn,
            }),
        });
    }
}

export default new SessionController();
