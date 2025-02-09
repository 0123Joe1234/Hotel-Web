let userId = null;
let isAdmin = false;

function showUserSection() {
    document.getElementById('userSection').style.display = 'block';
    if (isAdmin) {
        document.getElementById('adminSection').style.display = 'block';
    }
}

async function registerUser() {
    const name = document.getElementById('registerName').value;
    const email = document.getElementById('registerEmail').value;
    const password = document.getElementById('registerPassword').value;

    try {
        const response = await fetch('http://localhost:555/user/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ name, email, password })
        });

        if (response.ok) {
            alert('Registration successful! Please login.');
        } else {
            const error = await response.text();
            alert('Registration failed: ' + error);
        }
    } catch (error) {
        alert('Error: ' + error);
    }
}

async function loginUser() {
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;

    try {
        const response = await fetch('http://localhost:555/user/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
            body: JSON.stringify({ email, password })
        });

        if (response.ok) {
            const data = await response.json();
            userId = data.id;
            isAdmin = data.admin === 1;
            showUserSection();
            alert('Login successful!');
        } else {
            const error = await response.text();
            alert('Login failed: ' + error);
        }
    } catch (error) {
        alert('Error: ' + error);
    }
}

async function searchRooms() {
    const checkIn = document.getElementById('checkIn').value;
    const checkOut = document.getElementById('checkOut').value;

    try {
        const response = await fetch(`http://localhost:555/rooms/available?checkIn=${checkIn}&checkOut=${checkOut}`, {
            credentials: 'include'
        });

        if (response.ok) {
            const rooms = await response.json();
            const roomsList = document.getElementById('roomsList');
            roomsList.innerHTML = '';

            rooms.forEach(room => {
                const roomCard = document.createElement('div');
                roomCard.className = 'room-card';
                roomCard.innerHTML = `
                    <h4>Room ${room.ROOM_NUMBER} - ${room.ROOM_TYPE}</h4>
                    <p>Price per night: $${room.PRICE_PER_NIGHT}</p>
                    <p>Capacity: ${room.CAPACITY} person(s)</p>
                    <button onclick="bookRoom(${room.ID}, ${room.PRICE_PER_NIGHT}, '${checkIn}', '${checkOut}')">
                        Book Now
                    </button>
                `;
                roomsList.appendChild(roomCard);
            });
        } else {
            const error = await response.text();
            alert('Failed to fetch rooms: ' + error);
        }
    } catch (error) {
        alert('Error: ' + error);
    }
}

async function bookRoom(roomId, pricePerNight, checkIn, checkOut) {
    const days = Math.ceil((new Date(checkOut) - new Date(checkIn)) / (1000 * 60 * 60 * 24));
    const totalPrice = days * pricePerNight;

    try {
        const response = await fetch('http://localhost:555/bookings/create', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
            body: JSON.stringify({
                roomId,
                checkIn,
                checkOut,
                totalPrice
            })
        });

        if (response.ok) {
            alert('Booking successful!');
            getMyBookings();
        } else {
            const error = await response.text();
            alert('Booking failed: ' + error);
        }
    } catch (error) {
        alert('Error: ' + error);
    }
}

async function getMyBookings() {
    try {
        const response = await fetch('http://localhost:555/bookings/user', {
            credentials: 'include'
        });

        if (response.ok) {
            const bookings = await response.json();
            const bookingsList = document.getElementById('bookingsList');
            bookingsList.innerHTML = '';

            bookings.forEach(booking => {
                const bookingCard = document.createElement('div');
                bookingCard.className = 'booking-card';
                bookingCard.innerHTML = `
                    <h4>Room ${booking.ROOM_NUMBER} - ${booking.ROOM_TYPE}</h4>
                    <p>Check-in: ${new Date(booking.CHECK_IN_DATE).toLocaleDateString()}</p>
                    <p>Check-out: ${new Date(booking.CHECK_OUT_DATE).toLocaleDateString()}</p>
                    <p>Total Price: $${booking.TOTAL_PRICE}</p>
                    <p>Status: ${booking.STATUS}</p>
                `;
                bookingsList.appendChild(bookingCard);
            });
        } else {
            const error = await response.text();
            alert('Failed to fetch bookings: ' + error);
        }
    } catch (error) {
        alert('Error: ' + error);
    }
}

async function addRoom() {
    const roomNumber = document.getElementById('roomNumber').value;
    const roomType = document.getElementById('roomType').value;
    const pricePerNight = document.getElementById('pricePerNight').value;
    const capacity = document.getElementById('capacity').value;

    try {
        const response = await fetch('http://localhost:555/rooms/add', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
            body: JSON.stringify({
                roomNumber,
                roomType,
                pricePerNight,
                capacity
            })
        });

        if (response.ok) {
            alert('Room added successfully!');
            document.getElementById('addRoomForm').reset();
        } else {
            const error = await response.text();
            alert('Failed to add room: ' + error);
        }
    } catch (error) {
        alert('Error: ' + error);
    }
}

async function getAllBookings() {
    try {
        const response = await fetch('http://localhost:555/bookings/all', {
            credentials: 'include'
        });

        if (response.ok) {
            const bookings = await response.json();
            const bookingsList = document.getElementById('allBookingsList');
            bookingsList.innerHTML = '';

            bookings.forEach(booking => {
                const bookingCard = document.createElement('div');
                bookingCard.className = 'booking-card';
                bookingCard.innerHTML = `
                    <h4>Room ${booking.ROOM_NUMBER} - ${booking.ROOM_TYPE}</h4>
                    <p>Guest: ${booking.USER_NAME}</p>
                    <p>Check-in: ${new Date(booking.CHECK_IN_DATE).toLocaleDateString()}</p>
                    <p>Check-out: ${new Date(booking.CHECK_OUT_DATE).toLocaleDateString()}</p>
                    <p>Total Price: $${booking.TOTAL_PRICE}</p>
                    <p>Status: ${booking.STATUS}</p>
                `;
                bookingsList.appendChild(bookingCard);
            });
        } else {
            const error = await response.text();
            alert('Failed to fetch bookings: ' + error);
        }
    } catch (error) {
        alert('Error: ' + error);
    }
}
