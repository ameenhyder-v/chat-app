import jwt from 'jsonwebtoken'

export const generateToken = (userId, res) => {
    const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
        expiresIn: "7d",
    });

    const isProduction = process.env.NODE_ENV === "production";
    res.cookie("jwToken", token, {
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        httpOnly: true,
        sameSite: isProduction ? "none" : "strict", // "none" required for cross-origin in prod
        secure: isProduction,
    });
    
    return token;
}