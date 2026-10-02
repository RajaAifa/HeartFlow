import jwt from "jsonwebtoken";

const authAdmin = async (req, res, next) => {
    try {
        console.log("HEADERS:", req.headers); 

        const token = req.headers.atoken || req.headers.aToken;

        console.log("TOKEN:", token); 

        if (!token) {
            return res.json({ success: false, message: "Not Authorized" });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        console.log("DECODED:", decoded); 

        if (!decoded.id) {
            return res.json({ success: false, message: "Invalid token" });
        }

        req.adminId = decoded.id;

        next();

    } catch (error) {
        console.log("AUTH ERROR:", error.message); 
        res.json({ success: false, message: "Invalid or expired token" });
    }
};

export default authAdmin;