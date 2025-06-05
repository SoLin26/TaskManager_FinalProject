import jwt from 'jsonwebtoken';

const authenticate = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ message: 'Kein Token gefunden, Zugriff verweigert' });
  }

  const [scheme, token] = authHeader.split(' ');

  if (scheme !== 'Bearer' || !token) {
    return res.status(401).json({ message: 'Ungültiges Tokenformat' });
  }

  try {
    const secret = process.env.JWT_SECRET;
    const decoded = jwt.verify(token, secret);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Token ungültig oder abgelaufen' });
  }
};


export default authenticate;
