import UserType from '../enum/UserTypeEnum.js';

export default async (req, res, next) => {
    if (req.userType === UserType.ADMIN || req.userType === UserType.REVIEWER) {
        return next();
    }

    return res.status(403).json({ message: 'Forbidden' });
};
