import Yup from 'yup';

import { hash } from '../../lib/Cryptography.js';

import UserType from '../enum/UserTypeEnum.js';

import User from '../schemas/User.js';

class UserController {
    async store(req, res) {
        const schema = Yup.object().shape({
            name: Yup.string().required(),
            email: Yup.string().email().required(),
            password: Yup.string().required().min(6),
            user_type: Yup.string().oneOf(UserType.values()).required(),
            course: Yup.string().when('user_type', (userType) =>
                userType === UserType.COMPETITOR
                    ? Yup.string().required()
                    : Yup.string().nullable()
            ),
        });

        if (!(await schema.isValid(req.body))) {
            return res.status(400).json({ error: 'Validation fails' });
        }

        const { name, email, password, user_type, course, team } = req.body;

        const userExists = await User.findOne({ email });

        if (userExists) {
            return res.status(422).json({ error: 'User already exists' });
        }

        const password_hash = await hash(password);

        const { id } = await User.create({
            name,
            email,
            password_hash,
            user_type,
            course,
            team,
        });

        return res
            .status(201)
            .json({ id, name, email, user_type, course, team });
    }
}

export default new UserController();
