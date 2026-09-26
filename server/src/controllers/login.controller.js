import pool from "../config/database.js";

const userLogin = async (req, res) => {
    try {
        const { email, password } = req.body;

        // basic validation
        if( !email || !password){
            return res.status(400).json({message: "All fields are important!"})
        }

    }catch (error) {
        res.status(500).json({message: "internal server error", error:error.message})
    }

}

export { userLogin};