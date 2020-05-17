export default function permit() {
    return (req, res, next) => {
        req.reviewer ? next() : res.status(403).json({ message: 'Forbidden' });
    };
}
