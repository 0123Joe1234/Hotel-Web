const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const sqlite3 = require('sqlite3').verbose();
const { body, validationResult } = require('express-validator');
const path = require('path');
const nodemailer = require('nodemailer');
const stripe = require('stripe')('your_stripe_secret_key');

const app = express();
const port = 555;

// Middleware
app.use(cors());
app.use(express.json());

// Serve static files
app.use(express.static(path.join(__dirname)));

// Serve index.html for the root route
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Database setup
const db = new sqlite3.Database('hotel.db', (err) => {
    if (err) {
        console.error('Error connecting to database:', err);
    } else {
        console.log('Connected to SQLite database');
        createTables();
        createDefaultUser();
        createAdminUser();
    }
});

// Create tables
function createTables() {
    db.serialize(() => {
        // Create tables
        db.run(`CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            email TEXT UNIQUE NOT NULL,
            password TEXT NOT NULL,
            role TEXT
        )`);

        db.run(`CREATE TABLE IF NOT EXISTS hotels (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            location TEXT NOT NULL,
            country TEXT NOT NULL,
            description TEXT,
            image_url TEXT,
            rating REAL,
            price_min INTEGER,
            price_max INTEGER
        )`);

        db.run(`CREATE TABLE IF NOT EXISTS amenities (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL
        )`);

        db.run(`CREATE TABLE IF NOT EXISTS hotel_amenities (
            hotel_id INTEGER,
            amenity_id INTEGER,
            FOREIGN KEY (hotel_id) REFERENCES hotels (id),
            FOREIGN KEY (amenity_id) REFERENCES amenities (id),
            PRIMARY KEY (hotel_id, amenity_id)
        )`);

        db.run(`
            CREATE TABLE IF NOT EXISTS rooms (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                hotel_id INTEGER,
                name TEXT,
                description TEXT,
                price REAL,
                capacity INTEGER,
                image_url TEXT,
                FOREIGN KEY (hotel_id) REFERENCES hotels(id)
            )
        `);

        db.run(`
            CREATE TABLE IF NOT EXISTS bookings (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                room_id INTEGER,
                guest_name TEXT,
                guest_email TEXT,
                check_in DATE,
                check_out DATE,
                guests INTEGER,
                total_price REAL,
                status TEXT DEFAULT 'confirmed',
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (room_id) REFERENCES rooms(id)
            )
        `);

        // Insert default amenities
        const amenities = [
            'Free WiFi',
            'Swimming Pool',
            'Fitness Center',
            'Spa',
            'Restaurant',
            'Bar',
            'Room Service',
            'Parking',
            'Airport Shuttle',
            'Business Center',
            'Pet Friendly',
            'Beach Access',
            'Mountain View',
            'City View',
            'Garden'
        ];

        amenities.forEach(amenity => {
            db.run('INSERT OR IGNORE INTO amenities (name) VALUES (?)', [amenity]);
        });

        // Insert sample hotels
        const hotels = [
            {
                name: 'Luxury Palace Hotel',
                location: 'Dubai',
                country: 'United Arab Emirates',
                description: 'Experience ultimate luxury in the heart of Dubai.',
                image_url: 'https://images.unsplash.com/photo-1566073771259-6a8506099945',
                rating: 4.8,
                price_min: 500,
                price_max: 1500,
                amenities: ['Free WiFi', 'Swimming Pool', 'Spa', 'Restaurant', 'Bar']
            },
            {
                name: 'Mountain View Resort',
                location: 'Interlaken',
                country: 'Switzerland',
                description: 'Breathtaking views of the Swiss Alps.',
                image_url: 'https://images.unsplash.com/photo-1506059612708-99d6c258160e',
                rating: 4.6,
                price_min: 400,
                price_max: 1200,
                amenities: ['Mountain View', 'Spa', 'Restaurant', 'Fitness Center']
            },
            {
                name: 'Beachfront Paradise',
                location: 'Maui',
                country: 'United States',
                description: 'Direct beach access with stunning ocean views.',
                image_url: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d',
                rating: 4.7,
                price_min: 600,
                price_max: 2000,
                amenities: ['Beach Access', 'Swimming Pool', 'Restaurant', 'Bar']
            },
            {
                name: 'City Center Hotel',
                location: 'Tokyo',
                country: 'Japan',
                description: 'Modern luxury in the heart of Tokyo.',
                image_url: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb',
                rating: 4.5,
                price_min: 300,
                price_max: 800,
                amenities: ['City View', 'Restaurant', 'Business Center', 'Free WiFi']
            },
            {
                name: 'Historic Boutique Hotel',
                location: 'Paris',
                country: 'France',
                description: 'Charming hotel in the romantic city of Paris.',
                image_url: 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa',
                rating: 4.4,
                price_min: 250,
                price_max: 600,
                amenities: ['Room Service', 'Restaurant', 'Bar', 'Garden']
            },
            {
                name: 'Safari Lodge',
                location: 'Nairobi',
                country: 'Kenya',
                description: 'Experience wildlife from your doorstep.',
                image_url: 'https://images.unsplash.com/photo-1611892440504-42a792e24d32',
                rating: 4.9,
                price_min: 800,
                price_max: 2500,
                amenities: ['Swimming Pool', 'Restaurant', 'Safari Tours', 'Garden']
            },
            {
                name: "Mena House Hotel",
                location: "Giza",
                country: "Egypt",
                description: "Luxury hotel with pyramid views",
                image_url: "https://cf.bstatic.com/xdata/images/hotel/max1024x768/350568782.jpg?k=6cd74d3d57e9b5cd6d178df4b1c0c01dd4dcd4b5dd69d2a69f40ac1386c227d4&o=&hp=1",
                rating: 4.8,
                price_min: 2000,
                price_max: 5000,
                amenities: ['Swimming Pool', 'Spa', 'Free WiFi', 'Restaurant', 'Bar']
            },
            {
                name: "Four Seasons Nile Plaza",
                location: "Cairo",
                country: "Egypt",
                description: "Elegant riverside accommodation",
                image_url: "https://cf.bstatic.com/xdata/images/hotel/max1024x768/267647250.jpg?k=c8233ff42c39f9bac99e703900a866dfbad8bcdd6740ba4e594659564e67f191&o=&hp=1",
                rating: 4.9,
                price_min: 2500,
                price_max: 6000,
                amenities: ['Swimming Pool', 'Spa', 'Free WiFi', 'Restaurant', 'Fitness Center']
            },
            {
                name: "Steigenberger Cecil Hotel",
                location: "Alexandria",
                country: "Egypt",
                description: "Historic hotel with Mediterranean views",
                image_url: "https://cf.bstatic.com/xdata/images/hotel/max1024x768/244672090.jpg?k=f3fa47905c5c6da066d9d47e00e93a9304d85f2191b1aa4d3d277165facf82b1&o=&hp=1",
                rating: 4.5,
                price_min: 1500,
                price_max: 3500,
                amenities: ['Free WiFi', 'Restaurant', 'Bar', 'Room Service']
            },
            {
                name: "Marriott Mena House",
                location: "Cairo",
                country: "Egypt",
                description: "Luxury resort with stunning pyramid views",
                image_url: "https://cf.bstatic.com/xdata/images/hotel/max1024x768/351391461.jpg?k=6d4b06af8c58a87040788581f76a4e4edf36ddfb8dd9ef0e8c2b456d3c5404ed&o=&hp=1",
                rating: 4.7,
                price_min: 2200,
                price_max: 5500,
                amenities: ['Swimming Pool', 'Spa', 'Free WiFi', 'Restaurant', 'Bar', 'Fitness Center']
            },
            {
                name: "Sofitel Legend Old Cataract",
                location: "Aswan",
                country: "Egypt",
                description: "Victorian-style hotel on the Nile",
                image_url: "https://cf.bstatic.com/xdata/images/hotel/max1024x768/296748025.jpg?k=6f0b5b2294a6b8c3f5fc5969b9e3dae26a7aa9484c5f054731f0c0e096666503&o=&hp=1",
                rating: 4.9,
                price_min: 3000,
                price_max: 7000,
                amenities: ['Swimming Pool', 'Spa', 'Free WiFi', 'Restaurant', 'Bar', 'Room Service']
            },
            {
                name: "Winter Palace Luxor",
                location: "Luxor",
                country: "Egypt",
                description: "Historic palace with Nile views",
                image_url: "https://cf.bstatic.com/xdata/images/hotel/max1024x768/167745676.jpg?k=0b7fd2898a2c22cc3ab7f4dcf1b5870f76f7d9f812e7f1f4d929dfb13c16e57c&o=&hp=1",
                rating: 4.6,
                price_min: 1800,
                price_max: 4500,
                amenities: ['Swimming Pool', 'Restaurant', 'Bar', 'Garden', 'Room Service']
            }
        ];

        // Insert hotels and their amenities
        hotels.forEach(hotel => {
            db.run(
                `INSERT INTO hotels (name, location, country, description, image_url, rating, price_min, price_max)
                 VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
                [hotel.name, hotel.location, hotel.country, hotel.description, hotel.image_url, hotel.rating, hotel.price_min, hotel.price_max],
                function(err) {
                    if (err) {
                        console.error('Error inserting hotel:', err);
                        return;
                    }

                    const hotelId = this.lastID;
                    hotel.amenities.forEach(amenityName => {
                        db.get('SELECT id FROM amenities WHERE name = ?', [amenityName], (err, amenity) => {
                            if (err || !amenity) {
                                console.error('Error finding amenity:', amenityName);
                                return;
                            }
                            db.run(
                                'INSERT INTO hotel_amenities (hotel_id, amenity_id) VALUES (?, ?)',
                                [hotelId, amenity.id],
                                (err) => {
                                    if (err) {
                                        console.error('Error inserting hotel amenity:', err);
                                    }
                                }
                            );
                        });
                    });
                }
            );
        });

        // Insert sample rooms
        const rooms = [
            {
                hotel_id: 1,
                name: 'Pyramid View Suite',
                description: 'Luxurious suite with breathtaking pyramid views',
                price: 3000,
                capacity: 2,
                image_url: 'https://cf.bstatic.com/xdata/images/hotel/max1024x768/275552249.jpg?k=5f3ca633fb1fa4f9ccf3ee3d67be7473db3d438977471c3fb6f74d67c0b90c54&o=&hp=1'
            },
            {
                hotel_id: 1,
                name: 'Royal Garden Room',
                description: 'Elegant room with garden views',
                price: 2000,
                capacity: 2,
                image_url: 'https://cf.bstatic.com/xdata/images/hotel/max1024x768/275552375.jpg?k=a21b28c4419da36c666a5ed1d3ba816c7c5c1f1e3169f5f4e4f5ade75b9e3f82&o=&hp=1'
            },
            {
                hotel_id: 2,
                name: 'Nile View Suite',
                description: 'Spacious suite with panoramic Nile views',
                price: 3500,
                capacity: 3,
                image_url: 'https://cf.bstatic.com/xdata/images/hotel/max1024x768/267647276.jpg?k=c9233ff42c39f9bac99e703900a866dfbad8bcdd6740ba4e594659564e67f191&o=&hp=1'
            },
            {
                hotel_id: 2,
                name: 'Executive Room',
                description: 'Modern room with city views',
                price: 2500,
                capacity: 2,
                image_url: 'https://cf.bstatic.com/xdata/images/hotel/max1024x768/267647282.jpg?k=11f8b13d6814ef404ce421714303d5d2824567c36c3ad31bf12b5934b3e3b353&o=&hp=1'
            },
            {
                hotel_id: 3,
                name: 'Mediterranean Suite',
                description: 'Classic suite with sea views',
                price: 2500,
                capacity: 2,
                image_url: 'https://cf.bstatic.com/xdata/images/hotel/max1024x768/244672106.jpg?k=d0e8c7ee655a4f8e3c40e4e3c8625ca62dd7dd9a5bb35b81a4ce3bb427491d8e&o=&hp=1'
            },
            {
                hotel_id: 4,
                name: 'Pyramid View Room',
                description: 'Cozy room with pyramid views',
                price: 2200,
                capacity: 2,
                image_url: 'https://cf.bstatic.com/xdata/images/hotel/max1024x768/351391454.jpg?k=6d4b06af8c58a87040788581f76a4e4edf36ddfb8dd9ef0e8c2b456d3c5404ed&o=&hp=1'
            },
            {
                hotel_id: 5,
                name: 'Nile Wing Suite',
                description: 'Victorian-style suite with Nile views',
                price: 4000,
                capacity: 3,
                image_url: 'https://cf.bstatic.com/xdata/images/hotel/max1024x768/296748016.jpg?k=4d0f6c4e2190073b2a3a8276c3c34c2754064ec4bfffe6b2b474b9e8fc96c2e7&o=&hp=1'
            },
            {
                hotel_id: 6,
                name: 'Royal Suite',
                description: 'Historic suite with luxury amenities',
                price: 3500,
                capacity: 2,
                image_url: 'https://cf.bstatic.com/xdata/images/hotel/max1024x768/167745672.jpg?k=0b7fd2898a2c22cc3ab7f4dcf1b5870f76f7d9f812e7f1f4d929dfb13c16e57c&o=&hp=1'
            }
        ];

        rooms.forEach(room => {
            db.run(
                `INSERT INTO rooms (hotel_id, name, description, price, capacity, image_url)
                 VALUES (?, ?, ?, ?, ?, ?)`,
                [room.hotel_id, room.name, room.description, room.price, room.capacity, room.image_url]
            );
        });
    });
}

// Create default user
async function createDefaultUser() {
    const hashedPassword = await bcrypt.hash('Yousef2004', 10);
    db.run(`INSERT OR REPLACE INTO users (email, password, name) VALUES (?, ?, ?)`,
        ['yousofismail2004@gmail.com', hashedPassword, 'Yousef'],
        (err) => {
            if (err) {
                console.error('Error creating default user:', err);
            } else {
                console.log('Default user created successfully');
            }
        }
    );
}

// Create admin user
function createAdminUser() {
    const adminPassword = bcrypt.hashSync('admin123', 10);
    db.run(
        `INSERT OR IGNORE INTO users (name, email, password, role) 
         VALUES (?, ?, ?, ?)`,
        ['Admin', 'admin@admin.com', adminPassword, 'admin']
    );
}

// JWT middleware
function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ error: 'Authentication required' });
    }

    jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key', (err, user) => {
        if (err) {
            return res.status(403).json({ error: 'Invalid token' });
        }
        req.user = user;
        next();
    });
};

// User registration endpoint
app.post('/auth/register', [
    body('name').trim().notEmpty(),
    body('email').isEmail(),
    body('password').isLength({ min: 6 })
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ error: 'Invalid input data' });
    }

    const { name, email, password } = req.body;

    try {
        // Check if user already exists
        db.get('SELECT id FROM users WHERE email = ?', [email], async (err, user) => {
            if (err) {
                return res.status(500).json({ error: 'Database error' });
            }
            if (user) {
                return res.status(400).json({ error: 'Email already registered' });
            }

            // Hash password
            const hashedPassword = await bcrypt.hash(password, 10);

            // Insert new user
            db.run('INSERT INTO users (name, email, password) VALUES (?, ?, ?)',
                [name, email, hashedPassword],
                function(err) {
                    if (err) {
                        return res.status(500).json({ error: 'Error creating user' });
                    }
                    res.status(201).json({ message: 'User registered successfully' });
                }
            );
        });
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// User login endpoint
app.post('/auth/login', [
    body('email').isEmail(),
    body('password').notEmpty()
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ error: 'Invalid input data' });
    }

    const { email, password } = req.body;

    try {
        db.get('SELECT * FROM users WHERE email = ?', [email], async (err, user) => {
            if (err) {
                return res.status(500).json({ error: 'Database error' });
            }
            if (!user) {
                return res.status(401).json({ error: 'Invalid email or password' });
            }

            const validPassword = await bcrypt.compare(password, user.password);
            if (!validPassword) {
                return res.status(401).json({ error: 'Invalid email or password' });
            }

            // Generate JWT token
            const token = jwt.sign(
                { id: user.id, email: user.email },
                process.env.JWT_SECRET || 'your-secret-key',
                { expiresIn: '24h' }
            );

            res.json({
                token,
                name: user.name,
                email: user.email
            });
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// Book a room endpoint
app.post('/bookings', authenticateToken, async (req, res) => {
    const { hotelId, roomId, checkIn, checkOut, guests, totalPrice } = req.body;
    const userId = req.user.id;

    try {
        db.run(
            `INSERT INTO bookings (user_id, hotel_id, room_id, check_in, check_out, guests, total_price, status)
             VALUES (?, ?, ?, ?, ?, ?, ?, 'confirmed')`,
            [userId, hotelId, roomId, checkIn, checkOut, guests, totalPrice],
            function(err) {
                if (err) {
                    console.error('Booking error:', err);
                    return res.status(500).json({ error: 'Error creating booking' });
                }
                
                res.status(201).json({ 
                    message: 'Booking successful!',
                    bookingId: this.lastID 
                });
            }
        );
    } catch (error) {
        console.error('Server error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// Guest booking endpoint
app.post('/guest-bookings', [
    body('hotelId').isNumeric(),
    body('roomId').isNumeric(),
    body('checkIn').isDate(),
    body('checkOut').isDate(),
    body('guests').isNumeric(),
    body('guestName').notEmpty(),
    body('guestEmail').isEmail(),
    body('guestPhone').notEmpty()
], async (req, res) => {
    const { 
        hotelId, 
        roomId, 
        checkIn, 
        checkOut, 
        guests, 
        totalPrice,
        guestName,
        guestEmail,
        guestPhone 
    } = req.body;

    db.run(
        `INSERT INTO bookings (
            hotel_id, room_id, check_in, check_out, 
            guests, total_price, guest_name, guest_email, guest_phone, 
            status
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'pending')`,
        [hotelId, roomId, checkIn, checkOut, guests, totalPrice, guestName, guestEmail, guestPhone],
        function(err) {
            if (err) {
                return res.status(500).json({ error: 'Error creating booking' });
            }
            
            // Send confirmation email
            const emailContent = `
                Dear ${guestName},
                
                Thank you for booking with us! Here are your booking details:
                Booking ID: ${this.lastID}
                Check-in: ${checkIn}
                Check-out: ${checkOut}
                Number of guests: ${guests}
                Total price: ${totalPrice}
                
                Best regards,
                Your Hotel Team
            `;
            
            // Send email logic here (using nodemailer)
            
            res.status(201).json({ 
                bookingId: this.lastID,
                message: 'Booking created successfully! Check your email for confirmation.'
            });
        }
    );
});

// Get user bookings
app.get('/bookings', authenticateToken, (req, res) => {
    const userId = req.user.id;

    db.all('SELECT * FROM bookings WHERE user_id = ? ORDER BY created_at DESC', [userId], (err, bookings) => {
        if (err) {
            return res.status(500).json({ error: 'Error fetching bookings' });
        }
        res.json(bookings);
    });
});

// Review endpoints
app.post('/reviews', authenticateToken, [
    body('hotelId').isNumeric(),
    body('rating').isInt({ min: 1, max: 5 }),
    body('comment').optional().isString()
], (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { hotelId, rating, comment } = req.body;
    const userId = req.user.id;

    db.run(
        'INSERT INTO reviews (user_id, hotel_id, rating, comment) VALUES (?, ?, ?, ?)',
        [userId, hotelId, rating, comment],
        function(err) {
            if (err) {
                return res.status(500).json({ error: 'Error creating review' });
            }
            res.status(201).json({ reviewId: this.lastID });
        }
    );
});

// Get hotel reviews
app.get('/hotels/:hotelId/reviews', (req, res) => {
    const hotelId = req.params.hotelId;

    db.all(
        `SELECT r.*, u.name as user_name 
         FROM reviews r 
         JOIN users u ON r.user_id = u.id 
         WHERE r.hotel_id = ? 
         ORDER BY r.created_at DESC`,
        [hotelId],
        (err, reviews) => {
            if (err) {
                return res.status(500).json({ error: 'Error fetching reviews' });
            }
            res.json(reviews);
        }
    );
});

// Payment endpoint (using Stripe)
app.post('/payment', authenticateToken, async (req, res) => {
    try {
        const { amount, currency, paymentMethodId } = req.body;

        const paymentIntent = await stripe.paymentIntents.create({
            amount,
            currency,
            payment_method: paymentMethodId,
            confirm: true
        });

        res.json({ clientSecret: paymentIntent.client_secret });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get all hotels
app.get('/hotels', (req, res) => {
    db.all(
        `SELECT h.*, GROUP_CONCAT(a.name) as amenities
         FROM hotels h
         LEFT JOIN hotel_amenities ha ON h.id = ha.hotel_id
         LEFT JOIN amenities a ON ha.amenity_id = a.id
         GROUP BY h.id`,
        [],
        (err, rows) => {
            if (err) {
                return res.status(500).json({ error: 'Database error' });
            }
            res.json(rows);
        }
    );
});

// Get specific hotel
app.get('/hotels/:id', (req, res) => {
    const hotelId = req.params.id;
    db.get(
        `SELECT h.*, GROUP_CONCAT(a.name) as amenities
         FROM hotels h
         LEFT JOIN hotel_amenities ha ON h.id = ha.hotel_id
         LEFT JOIN amenities a ON ha.amenity_id = a.id
         WHERE h.id = ?
         GROUP BY h.id`,
        [hotelId],
        (err, row) => {
            if (err) {
                return res.status(500).json({ error: 'Database error' });
            }
            if (!row) {
                return res.status(404).json({ error: 'Hotel not found' });
            }

            const hotel = {
                id: row.id,
                name: row.name,
                location: row.location,
                country: row.country,
                description: row.description,
                image: row.image_url,
                rating: row.rating,
                priceRange: {
                    min: row.price_min,
                    max: row.price_max
                },
                amenities: row.amenities ? row.amenities.split(',') : []
            };

            res.json(hotel);
        }
    );
});

// Get room types for a hotel
app.get('/hotels/:id/rooms', (req, res) => {
    const hotelId = req.params.id;
    db.all('SELECT * FROM rooms WHERE hotel_id = ?', [hotelId], (err, rooms) => {
        if (err) {
            res.status(500).json({ error: 'Database error' });
            return;
        }
        res.json(rooms);
    });
});

// Search available rooms
app.get('/hotels/:id/available-rooms', authenticateToken, (req, res) => {
    const hotelId = req.params.id;
    const checkIn = req.query.checkIn;
    const checkOut = req.query.checkOut;

    const query = `
        SELECT rt.*, COUNT(r.id) as available_rooms
        FROM room_types rt
        JOIN rooms r ON rt.id = r.room_type_id
        WHERE r.hotel_id = ? AND r.id NOT IN (
            SELECT room_id FROM bookings 
            WHERE (check_in <= ? AND check_out >= ?)
            OR (check_in <= ? AND check_out >= ?)
            OR (check_in >= ? AND check_out <= ?)
        )
        GROUP BY rt.id
        HAVING available_rooms > 0`;

    db.all(query, [hotelId, checkOut, checkIn, checkOut, checkIn, checkIn, checkOut], (err, rooms) => {
        if (err) return res.status(500).send(err);
        res.json(rooms);
    });
});

// Add to favorites
app.post('/favorites', authenticateToken, (req, res) => {
    const userId = req.user.id;
    const { hotelId } = req.body;

    db.run(
        'INSERT OR IGNORE INTO favorites (user_id, hotel_id) VALUES (?, ?)',
        [userId, hotelId],
        function(err) {
            if (err) {
                return res.status(500).json({ error: 'Error adding to favorites' });
            }
            res.json({ message: 'Added to favorites' });
        }
    );
});

// Remove from favorites
app.delete('/favorites/:hotelId', authenticateToken, (req, res) => {
    const userId = req.user.id;
    const hotelId = req.params.hotelId;

    db.run(
        'DELETE FROM favorites WHERE user_id = ? AND hotel_id = ?',
        [userId, hotelId],
        function(err) {
            if (err) {
                return res.status(500).json({ error: 'Error removing from favorites' });
            }
            res.json({ message: 'Removed from favorites' });
        }
    );
});

// Get user's favorites
app.get('/favorites', authenticateToken, (req, res) => {
    const userId = req.user.id;

    db.all(
        `SELECT h.* FROM hotels h
         INNER JOIN favorites f ON h.id = f.hotel_id
         WHERE f.user_id = ?
         ORDER BY f.created_at DESC`,
        [userId],
        (err, hotels) => {
            if (err) {
                return res.status(500).json({ error: 'Error fetching favorites' });
            }
            res.json(hotels);
        }
    );
});

// Check if hotel is favorited
app.get('/favorites/:hotelId', authenticateToken, (req, res) => {
    const userId = req.user.id;
    const hotelId = req.params.hotelId;

    db.get(
        'SELECT id FROM favorites WHERE user_id = ? AND hotel_id = ?',
        [userId, hotelId],
        (err, favorite) => {
            if (err) {
                return res.status(500).json({ error: 'Error checking favorite status' });
            }
            res.json({ isFavorite: !!favorite });
        }
    );
});

// Bookings endpoint
app.post('/bookings', (req, res) => {
    const { roomId, guestName, guestEmail, checkIn, checkOut, guests } = req.body;

    // Validate dates
    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (checkInDate < today) {
        return res.status(400).json({ error: 'Check-in date cannot be in the past' });
    }

    if (checkOutDate <= checkInDate) {
        return res.status(400).json({ error: 'Check-out date must be after check-in date' });
    }

    // Check if room is available for the selected dates
    db.get(
        `SELECT r.*, COUNT(b.id) as existing_bookings
        FROM rooms r
        LEFT JOIN bookings b ON r.id = b.room_id
            AND b.status = 'confirmed'
            AND (
                (b.check_in <= ? AND b.check_out > ?) OR
                (b.check_in < ? AND b.check_out >= ?) OR
                (b.check_in >= ? AND b.check_out <= ?)
            )
        WHERE r.id = ?
        GROUP BY r.id`,
        [checkOut, checkIn, checkOut, checkIn, checkIn, checkOut, roomId],
        (err, room) => {
            if (err) {
                console.error('Database error:', err);
                return res.status(500).json({ error: 'Internal server error' });
            }

            if (!room) {
                return res.status(404).json({ error: 'Room not found' });
            }

            if (room.existing_bookings > 0) {
                return res.status(400).json({ error: 'Room is not available for selected dates' });
            }

            if (guests > room.capacity) {
                return res.status(400).json({ error: `Room capacity is ${room.capacity} guests` });
            }

            // Calculate total price
            const nights = Math.ceil((checkOutDate - checkInDate) / (1000 * 60 * 60 * 24));
            const totalPrice = nights * room.price;

            // Create booking
            db.run(
                `INSERT INTO bookings (room_id, guest_name, guest_email, check_in, check_out, guests, total_price)
                VALUES (?, ?, ?, ?, ?, ?, ?)`,
                [roomId, guestName, guestEmail, checkIn, checkOut, guests, totalPrice],
                function(err) {
                    if (err) {
                        console.error('Database error:', err);
                        return res.status(500).json({ error: 'Failed to create booking' });
                    }

                    res.json({
                        message: 'Booking confirmed!',
                        bookingId: this.lastID,
                        totalPrice,
                        nights
                    });
                }
            );
        }
    );
});

// Start server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
