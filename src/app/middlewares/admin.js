import UserType from '../enum/UserTypeEnum.js';

export default async (req, res, next) => {
    if (req.userType === UserType.ADMIN) {
        return next();
    }

    return res.status(403).json({ message: 'Forbidden' });
};
