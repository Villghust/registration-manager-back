import * as Yup from 'yup';

import Team from '../schemas/Team.js';
import User from '../schemas/User.js';

class TeamController {
    async store(req, res) {
        const schema = Yup.object().shape({
            name: Yup.string().required(),
            user_list: Yup.array(
                Yup.object().shape({
                    name: Yup.string().required(),
                    email: Yup.string().required(),
                    course: Yup.string().required(),
                })
            ).required(),
        });

        if (!(await schema.isValid(req.body))) {
            return res.status(400).json({ error: 'Validation fails' });
        }

        const { name, user_list } = req.body;

        const isValid = user_list.find(
            (user) => user.course !== user_list[0].course
        );

        if (!isValid) {
            return res.status(422).json({
                error:
                    'The team must be created with at least two members of different courses',
            });
        }

        let hasSameUser;

        for (let i = 1; i < user_list.length; i++) {
            hasSameUser = user_list[0].email === user_list[i].email;
        }

        if (hasSameUser) {
            return res.status(422).json({
                error:
                    'You cannot create a team with more than one of the same person',
            });
        }

        for (const user of user_list) {
            const { reviewer } = await User.findById(user.id);

            if (reviewer) {
                return res
                    .status(422)
                    .json({ error: 'Reviewers cannot be on teams' });
            }
        }

        const { _id, rating } = await Team.create({ name, user_list });

        for (const user of user_list) {
            await User.findByIdAndUpdate(user.id, { team: req.body.name });
        }

        return res.status(201).json({ _id, name, user_list, rating });
    }

    async update(req, res) {
        const schema = Yup.object().shape({
            user_list: Yup.array(
                Yup.object().shape({
                    name: Yup.string().required(),
                    email: Yup.string().required(),
                    course: Yup.string().required(),
                })
            ).nullable(),
            rating: Yup.object()
                .shape({
                    software: Yup.number().min(0).max(5),
                    process: Yup.number().min(0).max(5),
                    pitch: Yup.number().min(0).max(5),
                    innovation: Yup.number().min(0).max(5),
                    team_formation: Yup.number().min(0).max(5),
                })
                .nullable(),
        });

        if (!(await schema.isValid(req.body))) {
            return res.status(400).json({ error: 'Validation fails' });
        }

        const { user_list } = req.body;

        const isValid = user_list.find(
            (user) => user.course !== user_list[0].course
        );

        if (!isValid) {
            return res.status(422).json({
                error:
                    'The team need at least two members of different courses',
            });
        }

        let hasSameUser;

        for (let i = 1; i < user_list.length; i++) {
            hasSameUser = user_list[0].email === user_list[i].email;
        }

        if (hasSameUser) {
            return res.status(422).json({
                error:
                    'You cannot create a team with more than one of the same person',
            });
        }

        for (const user of user_list) {
            const { reviewer } = await User.findById(user.id);

            if (reviewer) {
                return res
                    .status(422)
                    .json({ error: 'Reviewers cannot be on teams' });
            }
        }

        const { team_id } = req.params;

        await Team.findByIdAndUpdate(team_id, req.body);

        const { name, rating } = await Team.findById(team_id);

        return res.status(200).json({ _id: team_id, name, user_list, rating });
    }

    async delete(req, res) {
        const { user_list } = await Team.findById(req.params.team_id);

        for (const user of user_list) {
            await User.findByIdAndUpdate(user.id, { team: null });
        }

        await Team.deleteOne({ _id: req.params.team_id });

        return res.status(200).send();
    }
}

export default new TeamController();
