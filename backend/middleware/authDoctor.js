import jwt from "jsonwebtoken";

const authDoctor = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: "Not Authorized. Login Again",
      });
    }

    const token = authHeader.split(" ")[1];

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Not Authorized. Login Again",
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.body = req.body || {};
    req.body.docId = decoded.id;

    next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      console.log("Doctor token expired");
    } else {
      console.log("Doctor auth error:", error.message);
    }

    return res.status(401).json({
      success: false,
      message: "Not Authorized. Login Again",
    });
  }
};

export default authDoctor;