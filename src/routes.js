import { Router } from 'express';

import SessionController from './app/controllers/SessionController';
import UserController from './app/controllers/UserController';
import TeamController from './app/controllers/TeamController';

import authMiddleware from './app/middlewares/auth';

const routes = new Router();

routes.post('/users', UserController.store);
routes.post('/sessions', SessionController.store);

routes.use(authMiddleware);

routes.post('/teams', TeamController.store);
routes.put('/users/:user_id', UserController.update);
routes.put('/teams/:team_id', TeamController.update);
routes.delete('/teams/:team_id', TeamController.delete);

export default routes;
