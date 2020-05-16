import * as Yup from 'yup';

import Cryptography from '../../lib/Cryptography';

import User from '../schemas/User';

class UserController {
    async store(req, res) {
        const schema = Yup.object().shape({
            name: Yup.string().required(),
            email: Yup.string().email().required(),
            password: Yup.string().required().min(6),
            reviewer: Yup.boolean(),
            course: Yup.when('reviewer', (reviewer) =>
                reviewer ? Yup.nullable() : Yup.string().required()
            ),
        });

        if (!(await schema.isValid(req.body))) {
            return res.status(400).json({ error: 'Validation fails' });
        }

        const { name, email, password, reviewer, course, team } = req.body;

        const userExists = await User.findOne({ email });

        if (userExists) {
            return res.status(400).json({ error: 'User already exists' });
        }

        const password_hash = await Cryptography.hash(password);

        const { _id } = await User.create({
            name,
            email,
            password_hash,
            reviewer,
            course,
            team,
        });

        return res
            .status(201)
            .json({ _id, name, email, reviewer, course, team });
    }

    async update(req, res) {
        // TODO
        return res.status(200).json('ok');
    }
}

export default new UserController();
