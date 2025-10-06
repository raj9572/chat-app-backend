import bcrypt from 'bcryptjs'
import { User } from "../model/userModel.js"
import jwt from 'jsonwebtoken'





//! Register 
export const register = async (req, res) => {
    try {
        const { email, fullName, username, password, confirmPassword, gender } = req.body

        if ([email, username, fullName, password, confirmPassword, gender].some((field) => field?.trim() === "")) {
            return res.status(400).json({ message: "All fields are required" })
        }

        //if atleast one is required then 
        // if(!email  && !username){
        //      return res.status(400).json({ message: "email or username is required" })
        // }

        if (password !== confirmPassword) {
            return res.status(400).json({ message: "Password do not match" })
        }

        const user = await User.findOne({
            $or: [{ username }, { email }]
        })


        if (user) {
            return res.status(400).json({ message: "username or email already exist try again" })
        }


        const hashedPassword = await bcrypt.hash(password, 10)

        // profile photo

        const maleProfilePhoto = `https://avatar.iran.liara.run/public/boy?username=${username}`
        const femaleProfilePhoto = `https://avatar.iran.liara.run/public/girl?username=${username}`

        await User.create({
            email,
            fullName,
            username,
            password: hashedPassword,
            profilePhoto: gender === "male" ? maleProfilePhoto : femaleProfilePhoto,
            gender
        })


        return res.json({ message: "account create success", success: true })

    } catch (error) {

        return res.status(500).json({ message: "error while create user" })

    }

}


//! Login

export const login = async (req, res) => {
    try {
        const { email, username, password } = req.body;
        if (!username && !email) {
            return res.status(400).json({ message: "username or  required" });
        };
        const user = await User.findOne({
            $or: [{ username }, { email }]
        });
        if (!user) {
            return res.status(400).json({
                message: "User does not exist",
                success: false
            })
        };
        const isPasswordMatch = await bcrypt.compare(password, user.password);
        if (!isPasswordMatch) {
            return res.status(400).json({
                message: "Incorrect username or password",
                success: false
            })
        };
        const tokenData = {
            userId: user._id
        };

        const token = await jwt.sign(tokenData, process.env.JWT_SECRET_KEY, { expiresIn: '1y' });

        return res.status(200)
            .cookie("token", token, { maxAge: 1 * 24 * 60 * 60 * 1000, httpOnly: true, sameSite: 'strict' })
            .json({
                user: {
                    _id: user._id,
                    email: user.email,
                    username: user.username,
                    fullName: user.fullName,
                    profilePhoto: user.profilePhoto
                },
                token
            });

    } catch (error) {
        return res.status(500).json({ message: "error while login user" })
    }
}


export const logout = (req, res) => {
    try {
        return res.status(200)
            .cookie("token", "", { maxAge: 0 })
            .json({ message: "user logged out" })
    } catch (error) {
        return res.status(500).json({ message: "error while logout " })
    }
}


export const getOtherUsers = async (req, res) => {
    try {
        const loggedInUserId = req.id
        const otherUsers = await User.find({ _id: { $ne: loggedInUserId } }).select("-password")
        return res.status(200).json(otherUsers)
    } catch (error) {
        return res.status(500).json({ message: "error while getOther user" })
    }
}