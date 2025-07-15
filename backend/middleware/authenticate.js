import jwt from 'jsonwebtoken';

const authenticate = (req, res, next) => {
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({ message: 'Kein Token gefunden, Zugriff verweigert' });
  }




  try {
    const secret = process.env.JWT_SECRET;
    const decoded = jwt.verify(token, secret);
    req.user = decoded;
    next();
  } catch (err) {
    console.log(err);
    
    return res.status(401).json({ message: 'Token ungültig oder abgelaufen' });
  }
};


export default authenticate;