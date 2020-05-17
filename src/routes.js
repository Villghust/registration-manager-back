import { Router } from 'express';

import SessionController from './app/controllers/SessionController';
import UserController from './app/controllers/UserController';
import TeamController from './app/controllers/TeamController';

import authMiddleware from './app/middlewares/auth';
import roleMiddleware from './app/middlewares/role';

const routes = new Router();

routes.post('/users', UserController.store);
routes.post('/sessions', SessionController.store);

routes.use(authMiddleware);

routes.post('/teams', TeamController.store);

routes.use(roleMiddleware);

routes.put('/teams/:team_id', TeamController.update);
routes.delete('/teams/:team_id', TeamController.delete);

export default routes;
