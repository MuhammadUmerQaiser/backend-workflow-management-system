const jwt = require('jsonwebtoken');

const AdminAuth = async (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    const isCustomAuth = token.length < 500;
    let decodedData;

    if (token && isCustomAuth) {
      decodedData = jwt.verify(token, process.env.JWT_SECRET);
      req.userId = decodedData?.id;
    } else {
      decodedData = jwt.decode(token);
      req.userId = decodedData?.sub;
    }

    if (decodedData?.role !== 'Admin') {
      return res.status(403).send({ error: "Access denied. You must have the 'Admin' role." });
    }

    next();
  } catch (error) {
    console.log(error);
    return res.status(401).send({ error: "Please authenticate using a valid token" });
  }
};

module.exports = AdminAuth;
