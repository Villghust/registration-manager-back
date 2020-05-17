import jwt from 'jsonwebtoken';
import util from 'util';

import authConfig from '../../config/auth.js';

export default async (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        return res.status(401).json({ error: 'Token not provided.' });
    }

    const [, token] = authHeader.split(' ');

    try {
        const decoded = await util.promisify(jwt.verify)(
            token,
            authConfig.secret
        );

        req.userId = decoded.id;
        req.reviewer = decoded.reviewer;

        return next();
    } catch (error) {
        res.status(401).json({ error: 'Invalid token.' });
    }

    return next();
};
