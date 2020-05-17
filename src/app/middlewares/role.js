export default async (req, res, next) => {
    if (req.reviewer) {
        return next();
    }

    return res.status(403).json({ message: 'Forbidden' });
};
