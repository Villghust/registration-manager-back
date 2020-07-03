import Yup from 'yup';

import UserType from '../enum/UserTypeEnum.js';

import Team from '../schemas/Team.js';
import User from '../schemas/User.js';

class TeamController {
    async store(req, res) {
        const schema = Yup.object().shape({
            name: Yup.string().required(),
            user_list: Yup.array(
                Yup.object().shape({
                    email: Yup.string().required(),
                })
            ).required(),
        });

        if (!(await schema.isValid(req.body))) {
            return res.status(400).json({ error: 'Validation fails' });
        }

        const { name, user_list } = req.body;

        const team = await Team.findOne({ name });

        if (team) {
            return res.status(422).json({
                error: 'Team already exists',
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

        let userList = [];

        for (const user of user_list) {
            const u = await User.findOne({ email: user.email });

            if (!u) {
                return res.status(404).json({
                    error: `Competitor with email '${user.email}' not found`,
                });
            }

            if (u.user_type === UserType.REVIEWER) {
                return res
                    .status(422)
                    .json({ error: 'Reviewers cannot be on teams' });
            }

            if (u.user_type === UserType.ADMIN) {
                return res
                    .status(422)
                    .json({ error: 'Admins cannot be on teams' });
            }

            if (u.team) {
                return res.status(422).json({
                    error: 'You cannot choose an competitor from another team',
                });
            }

            const { name, email, course } = u;

            userList.push({ name, email, course });
        }

        const isValid = userList.find(
            (user) => user.course !== userList[0].course
        );

        if (!isValid) {
            return res.status(422).json({
                error:
                    'The team must be created with at least two members of different courses',
            });
        }

        const { id, ratings } = await Team.create({
            name,
            user_list: userList,
        });

        for (const user of userList) {
            await User.findOneAndUpdate(
                { email: user.email },
                { team: req.body.name }
            );
        }

        return res.status(201).json({ id, name, userList, ratings });
    }

    async list(req, res) {
        const teams = await Team.find({}).sort({ name: 'asc' });

        return res.status(200).json({ teams });
    }

    async patchUserList(req, res) {
        const schema = Yup.object().shape({
            user_list: Yup.array(
                Yup.object().shape({
                    email: Yup.string().required(),
                })
            ).required(),
        });

        if (!(await schema.isValid(req.body))) {
            return res.status(400).json({ error: 'Validation fails' });
        }

        const { team_id } = req.params;

        const team = await Team.findById(team_id);

        if (!team) {
            return res.status(404).json({
                error: `Team with id '${team_id}' not found`,
            });
        }

        const { user_list } = req.body;

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

        let userList = [];

        for (const user of user_list) {
            const u = await User.findOne({ email: user.email });

            if (!u) {
                return res.status(404).json({
                    error: `User with email '${user.email}' not found`,
                });
            }

            if (u.user_type === UserType.REVIEWER) {
                return res
                    .status(422)
                    .json({ error: 'Reviewers cannot be on teams' });
            }

            if (u.user_type === UserType.ADMIN) {
                return res
                    .status(422)
                    .json({ error: 'Admins cannot be on teams' });
            }

            const { name, email, course } = u;

            userList.push({ name, email, course });
        }

        const isValid = userList.find(
            (user) => user.course !== userList[0].course
        );

        if (!isValid) {
            return res.status(422).json({
                error:
                    'The team need at least two members of different courses',
            });
        }

        await Team.findByIdAndUpdate(team_id, { user_list: userList });

        const { name } = await Team.findById(team_id);

        return res
            .status(200)
            .json({ _id: team_id, name, user_list: userList });
    }

    async patchRating(req, res) {
        const schema = Yup.object().shape({
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

        const { team_id } = req.params;

        const team = await Team.findById(team_id);

        if (!team) {
            return res.status(404).json({
                error: `Team with id '${team_id}' not found`,
            });
        }

        const reviewer_id = req.userId;

        const {
            software,
            process,
            pitch,
            innovation,
            team_formation,
        } = req.body.rating;

        const newRating = {
            reviewer_id,
            software,
            process,
            pitch,
            innovation,
            team_formation,
        };

        let ratings = [];

        if (team.ratings.length > 0) {
            const exist = team.ratings.find(
                (r) => r.reviewer_id === reviewer_id
            );

            if (exist) {
                ratings = team.ratings.map((r) => {
                    if (r.reviewer_id === reviewer_id) {
                        return Object.assign(r, newRating);
                    }

                    return r;
                });
            } else {
                ratings = team.ratings;
                ratings.push(newRating);
            }

            await Team.findByIdAndUpdate(team_id, { ratings });

            return res.status(200).json({
                _id: team_id,
                name: team.name,
                user_list: team.user_list,
                ratings,
            });
        }

        ratings.push(newRating);

        await Team.findByIdAndUpdate(team_id, { ratings });

        return res.status(200).json({
            _id: team_id,
            name: team.name,
            user_list: team.user_list,
            ratings,
        });
    }

    async delete(req, res) {
        const team = await Team.findById(req.params.team_id);

        if (!team) {
            return res.status(404).json({ error: 'Team not found' });
        }

        for (const user of team.user_list) {
            await User.findOneAndUpdate({ email: user.email }, { team: null });
        }

        await Team.deleteOne({ _id: req.params.team_id });

        return res.status(200).send();
    }
}

export default new TeamController();
