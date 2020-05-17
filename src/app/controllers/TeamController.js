import * as Yup from 'yup';

import Team from '../schemas/Team';

class TeamController {
    async store(req, res) {
        const schema = Yup.object().shape({
            name: Yup.string().required(),
            user_list: Yup.array(
                Yup.object.shape({
                    id: Yup.string().required,
                    name: Yup.string().required,
                    email: Yup.string().required,
                    course: Yup.string().required,
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

        const { _id, rating } = await Team.create({ name, user_list });

        return res.status(201).json({ _id, name, user_list, rating });
    }

    async update(req, res) {
        const schema = Yup.object().shape({
            user_list: Yup.array(
                Yup.object.shape({
                    id: Yup.string().required,
                    name: Yup.string().required,
                    email: Yup.string().required,
                    course: Yup.string().required,
                })
            ).required(),
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

        const isValid = user_list.find(
            (user) => user.course !== user_list[0].course
        );

        if (!isValid) {
            return res.status(422).json({
                error:
                    'The team need at least two members of different courses',
            });
        }

        const { team_id } = req.params;

        await Team.findByIdAndUpdate(team_id, req.body);

        const { name, user_list, rating } = Team.findById(team_id);

        return res.status(200).json({ _id: team_id, name, user_list, rating });
    }

    async delete(req, res) {
        await Team.deleteOne(req.params.team_id);

        return res.status(200).send();
    }
}

export default new TeamController();
