import express from 'express';

import SessionController from './app/controllers/SessionController.js';
import TeamController from './app/controllers/TeamController.js';
import UserController from './app/controllers/UserController.js';

import admin from './app/middlewares/admin.js';
import auth from './app/middlewares/auth.js';
import reviewer from './app/middlewares/reviewer.js';

const routes = new express.Router();

routes.post('/sessions', SessionController.store);
// routes.post('/users', UserController.store); // Usar esta rota pra criar o admin

routes.use(auth);
routes.post('/teams', TeamController.store);
routes.get('/teams', TeamController.list);
routes.put('/teams/:team_id/user-list', TeamController.patchUserList);
routes.put('/teams/:team_id/rating', reviewer, TeamController.patchRating);
routes.delete('/teams/:team_id', admin, TeamController.delete);
routes.post('/users', admin, UserController.store); // Comentar esta rota quando for criar o admin

export default routes;
