import { Router } from 'express';

import SessionController from './app/controllers/SessionController.js';
import UserController from './app/controllers/UserController.js';
import TeamController from './app/controllers/TeamController.js';

import authMiddleware from './app/middlewares/auth.js';
import roleMiddleware from './app/middlewares/role.js';

const routes = new Router();

routes.post('/users', UserController.store);
routes.post('/sessions', SessionController.store);

routes.use(authMiddleware);

routes.post('/teams', TeamController.store);

routes.use(roleMiddleware);

routes.put('/teams/:team_id', TeamController.update);
routes.delete('/teams/:team_id', TeamController.delete);

export default routes;
