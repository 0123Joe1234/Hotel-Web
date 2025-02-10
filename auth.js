const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { db } = require('./Db');

const secretKey = 'your-secret-key-here'; // In production, use environment variables

// Generate JWT token
const generateToken = (userId, isAdmin) => {
    return jwt.sign({ userId, isAdmin }, secretKey, { expiresIn: '1h' });
};

// Verify JWT token middleware
const verifyToken = (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
        return res.status(401).send('Access token is required');
    }

    try {
        const decoded = jwt.verify(token, secretKey);
        req.user = decoded;
        next();
    } catch (err) {
        return res.status(401).send('Invalid or expired token');
    }
};

// Register new user
const registerUser = async (req, res) => {
    const { name, email, password } = req.body;
    
    try {
        // Hash the password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        
        // Insert user into database
        const query = 'INSERT INTO USER (NAME, EMAIL, PASSWORD, ISADMIN) VALUES (?, ?, ?, 0)';
        db.run(query, [name, email, hashedPassword], (err) => {
            if (err) {
                console.log(err.message);
                return res.status(400).send(err.message);
            }
            res.status(200).send('Registration successful');
        });
    } catch (err) {
        res.status(500).send(err.message);
    }
};

// Login user
const loginUser = async (req, res) => {
    const { email, password } = req.body;
    
    // Get user from database
    db.get('SELECT * FROM USER WHERE EMAIL = ?', [email], async (err, row) => {
        if (err) {
            return res.status(400).send('Invalid credentials');
        }
        
        if (!row) {
            return res.status(401).send('Invalid credentials');
        }
        
        // Compare passwords
        const isMatch = await bcrypt.compare(password, row.PASSWORD);
        if (!isMatch) {
            return res.status(401).send('Invalid credentials');
        }
        
        // Generate JWT token
        const token = generateToken(row.ID, row.ISADMIN === 1);
        res.status(200).json({
            message: 'Login successful',
            token,
            userId: row.ID,
            isAdmin: row.ISADMIN === 1
        });
    });
};

module.exports = {
    verifyToken,
    registerUser,
    loginUser
};
