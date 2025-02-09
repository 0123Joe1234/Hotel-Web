const express = require('express')
const cors = require('cors');
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt');
const db_access = require('./Db.js')
const db = db_access.db
const cookieParser = require('cookie-parser');
const server = express()
const port = 555
const secret_key = 'DdsdsdKKFDDFDdvfddvxvc4dsdvdsvdb'

server.use(cors({
    origin:"http://localhost:3000",
    credentials:true
}))
server.use(express.json())
server.use(cookieParser())
server.use(express.static('.'))

const generateToken = (id, isAdmin) => {
    return jwt.sign({ id, isAdmin }, secret_key, { expiresIn: '1h' })
}

const verifyToken = (req, res, next) => {
    const token = req.cookies.authToken
    if (!token)
        return res.status(401).send('unauthorized')
    jwt.verify(token, secret_key, (err, details) => {
        if (err)
            return res.status(403).send('invalid or expired token')
        req.userDetails = details
        next()
    })
}

server.post('/user/login', (req, res) => {
    const email = req.body.email
    const password = req.body.password
    db.get(`SELECT * FROM USER WHERE EMAIL=?`, [email], (err, row) => {
        if (err || !row) {
            return res.status(401).send('invalid credentials')
        }
        bcrypt.compare(password, row.PASSWORD, (err, isMatch) => {
            if (err) {
                return res.status(500).send('error comparing password.')
            }
            if (!isMatch) {
                return res.status(401).send('invalid credentials')
            }
            else {
                let userID = row.ID
                let isAdmin = row.ISADMIN
                const token = generateToken(userID, isAdmin)

                res.cookie('authToken', token, {
                    httpOnly: true,
                    sameSite: 'none',
                    secure: true,
                    expiresIn: '1h'
                })
                return res.status(200).json({ id: userID, admin: isAdmin })
            }
        })
    })
})

server.post(`/user/register`, (req, res) => {
    const name = req.body.name
    const email = req.body.email
    const password = req.body.password
    bcrypt.hash(password, 10, (err, hashedPassword) => {
        if (err) {
            return res.status(500).send('error hashing password')
        }
        db.run(`INSERT INTO USER (name,email,password,isadmin) VALUES (?,?,?,?)`, [name, email, hashedPassword, 0], (err) => {
            if (err) {
                return res.status(401).send(err)
            }
            else
                return res.status(200).send(`registration successful`)
        })
    })
})

// Admin: Add new room
server.post(`/rooms/add`, verifyToken, (req, res) => {
    const isAdmin = req.userDetails.isAdmin;
    if (isAdmin !== 1)
        return res.status(403).send("you are not an admin")
    
    const { roomNumber, roomType, pricePerNight, capacity } = req.body
    
    let query = `INSERT INTO ROOM (ROOM_NUMBER, ROOM_TYPE, PRICE_PER_NIGHT, CAPACITY) 
                 VALUES (?, ?, ?, ?)`
    
    db.run(query, [roomNumber, roomType, pricePerNight, capacity], (err) => {
        if (err) {
            console.log(err)
            return res.status(500).send(err)
        }
        return res.status(200).send(`room added successfully`)
    })
})

// Get all available rooms
server.get(`/rooms/available`, (req, res) => {
    const { checkIn, checkOut } = req.query
    
    const query = `
        SELECT * FROM ROOM 
        WHERE ID NOT IN (
            SELECT ROOM_ID FROM BOOKING 
            WHERE (CHECK_IN_DATE <= ? AND CHECK_OUT_DATE >= ?)
            OR (CHECK_IN_DATE <= ? AND CHECK_OUT_DATE >= ?)
            OR (CHECK_IN_DATE >= ? AND CHECK_OUT_DATE <= ?)
        )`
    
    db.all(query, [checkOut, checkIn, checkOut, checkIn, checkIn, checkOut], (err, rooms) => {
        if (err) {
            console.log(err)
            return res.status(500).send(err)
        }
        return res.json(rooms)
    })
})

// Make a booking
server.post(`/bookings/create`, verifyToken, (req, res) => {
    const userId = req.userDetails.id
    const { roomId, checkIn, checkOut, totalPrice } = req.body
    
    const query = `INSERT INTO BOOKING (USER_ID, ROOM_ID, CHECK_IN_DATE, CHECK_OUT_DATE, TOTAL_PRICE) 
                   VALUES (?, ?, ?, ?, ?)`
    
    db.run(query, [userId, roomId, checkIn, checkOut, totalPrice], (err) => {
        if (err) {
            console.log(err)
            return res.status(500).send(err)
        }
        return res.status(200).send(`booking created successfully`)
    })
})

// Get user's bookings
server.get(`/bookings/user`, verifyToken, (req, res) => {
    const userId = req.userDetails.id
    
    const query = `
        SELECT b.*, r.ROOM_NUMBER, r.ROOM_TYPE, r.PRICE_PER_NIGHT 
        FROM BOOKING b 
        JOIN ROOM r ON b.ROOM_ID = r.ID 
        WHERE b.USER_ID = ?
        ORDER BY b.CHECK_IN_DATE DESC`
    
    db.all(query, [userId], (err, bookings) => {
        if (err) {
            console.log(err)
            return res.status(500).send(err)
        }
        return res.json(bookings)
    })
})

// Admin: Get all bookings
server.get(`/bookings/all`, verifyToken, (req, res) => {
    const isAdmin = req.userDetails.isAdmin;
    if (isAdmin !== 1)
        return res.status(403).send("you are not an admin")
    
    const query = `
        SELECT b.*, u.NAME as USER_NAME, r.ROOM_NUMBER, r.ROOM_TYPE 
        FROM BOOKING b 
        JOIN USER u ON b.USER_ID = u.ID 
        JOIN ROOM r ON b.ROOM_ID = r.ID 
        ORDER BY b.CHECK_IN_DATE DESC`
    
    db.all(query, [], (err, bookings) => {
        if (err) {
            console.log(err)
            return res.status(500).send(err)
        }
        return res.json(bookings)
    })
})

server.listen(port, () => {
    console.log(`Server is running on port ${port}`)
    db.serialize(() => {
        db.run(db_access.createUserTable, (err) => {
            if (err)
                console.log("error creating user table " + err)
        });
        db.run(db_access.createRoomTable, (err) => {
            if (err)
                console.log("error creating room table " + err)
        });
        db.run(db_access.createBookingTable, (err) => {
            if (err)
                console.log("error creating booking table " + err)
        });
    })
})
