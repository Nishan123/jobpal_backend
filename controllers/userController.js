const User = require('../model/User')
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

// Register a new user
const registerUser = async (req, res) => {
    const { first_name, last_name, email, password } = req.body;

    // Validate input
    if (!first_name || !last_name || !email || !password) {
        return res.status(400).json({ error: 'All fields are required' });
    }

    try {
        // Check if the email already exists
        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) {
            return res.status(400).json({ error: 'Email already exists' });
        }

        // Hash the password
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        // Create the user
        const newUser = await User.create({ 
            first_name,
            last_name,
            email,
            password: hashedPassword 
        });

        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to register user' });
    }
};


// Login an existing user
const loginUser = async (req, res) => {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
        return res.status(400).json({ error: 'Email and password are required' });
    }

    try {
        // Find the user by email
        const user = await User.findOne({ where: { email } });
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Verify the password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        // Generate a JWT token
        const token = jwt.sign(
            { 
                id: user.id, 
                email: user.email,
                first_name: user.first_name,
                last_name: user.last_name 
            },
            process.env.JWT_SECRET || 'JKHSDKJBKJSDJSDJKBKSD345345345345',
            { expiresIn: '24h' }
        );

        res.status(200).json({
            message: 'Login successful',
            token,
            user: {
                id: user.id,
                email: user.email,
                first_name: user.first_name,
                last_name: user.last_name
            }
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ error: 'Failed to login user' });
    }
};




const getUser = async (req, res) => {

    try {
        const tests = await User.findAll();
        res.status(200).json(tests);
    }
    catch (error) {
        res.status(500).json({ error: "Failed to Load" })
    }
}
const createUser = async (req, res) => {

    try {
        const { username, password } = req.body;

        //Hash the password
        const newtest = await User.create({ username, password })

        res.status(200).json(newtest);
    }
    catch (error) {
        res.status(500).json({ error: "Failed to Load" })
        console.log(error)
    }
}

const updateUser = async (req, res) => {
    try {
        const userId = req.user.id; // Get user ID from JWT token
        const { first_name, last_name } = req.body;

        // Find the user
        const user = await User.findByPk(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Update user data
        await user.update({
            first_name,
            last_name
        });

        // Generate a new token with updated information
        const token = jwt.sign(
            { 
                id: user.id, 
                email: user.email,
                first_name: user.first_name,
                last_name: user.last_name 
            },
            process.env.JWT_SECRET || 'JKHSDKJBKJSDJSDJKBKSD345345345345',
            { expiresIn: '24h' }
        );

        // Send back updated user data and new token
        res.json({
            message: 'Profile updated successfully',
            token,
            user: {
                id: user.id,
                email: user.email,
                first_name: user.first_name,
                last_name: user.last_name
            }
        });
    } catch (error) {
        console.error('Update error:', error);
        res.status(500).json({ message: 'Failed to update profile' });
    }
};

const changePassword = async (req, res) => {
    try {
        const userId = req.user.id; // Get user ID from JWT token
        const { currentPassword, newPassword } = req.body;

        // Validate input
        if (!currentPassword || !newPassword) {
            return res.status(400).json({ error: 'Current password and new password are required' });
        }

        // Find the user
        const user = await User.findByPk(userId);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Verify current password
        const isMatch = await bcrypt.compare(currentPassword, user.password);
        if (!isMatch) {
            return res.status(401).json({ error: 'Current password is incorrect' });
        }

        // Hash the new password
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(newPassword, saltRounds);

        // Update password
        await user.update({ password: hashedPassword });

        res.json({ message: 'Password updated successfully' });
    } catch (error) {
        console.error('Change password error:', error);
        res.status(500).json({ error: 'Failed to update password' });
    }
};

// const deleteUser = async(req, res)=>{
//     try {
//         const user = await User.findByPk(req.params.id);
//         if (!user) {
//             return res.status(404).json({ message: 'User not found' });
//         }
//         await user.destroy();
//         res.json({ message: 'User deleted' });
//     } catch (err) {
//         res.status(500).json({ error: err.message });
//     }
// }

// module.exports = {createUser, getUser, deleteUser, updateUser}

module.exports = { loginUser, registerUser, getUser, updateUser, changePassword }