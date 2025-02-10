// Get hotel ID from URL parameters
const urlParams = new URLSearchParams(window.location.search);
const hotelId = urlParams.get('hotelId');

// Function to get hotel details
async function getHotelDetails() {
    try {
        const response = await fetch(`/hotels/${hotelId}`);
        const hotel = await response.json();
        
        document.getElementById('hotelName').textContent = hotel.name;
        document.getElementById('hotelLocation').textContent = `${hotel.location}, ${hotel.country}`;
        
        return hotel;
    } catch (error) {
        console.error('Error fetching hotel details:', error);
    }
}

// Function to get room types for the hotel
async function getRoomTypes() {
    try {
        const response = await fetch(`/hotels/${hotelId}/rooms`);
        const rooms = await response.json();
        displayRooms(rooms);
    } catch (error) {
        console.error('Error fetching room types:', error);
    }
}

// Function to display rooms
function displayRooms(rooms) {
    const roomsList = document.getElementById('roomsList');
    roomsList.innerHTML = '';
    
    rooms.forEach(room => {
        const amenities = JSON.parse(room.amenities);
        const card = document.createElement('div');
        card.className = 'room-card';
        
        card.innerHTML = `
            <img src="${room.image_url}" alt="${room.name}" class="room-image">
            <div class="room-details">
                <h3 class="room-name">${room.name}</h3>
                <p>${room.description}</p>
                <div class="room-amenities">
                    ${amenities.map(amenity => `<span class="amenity">${amenity}</span>`).join('')}
                </div>
                <p class="room-price">$${room.price_per_night} per night</p>
                <p>Maximum capacity: ${room.capacity} guests</p>
                <button class="book-btn" onclick="openBookingModal(${room.id})">Book Now</button>
            </div>
        `;
        
        roomsList.appendChild(card);
    });
}

// Booking modal functions
let selectedRoomId = null;

function openBookingModal(roomId) {
    selectedRoomId = roomId;
    const modal = document.getElementById('bookingModal');
    modal.style.display = 'flex';
    
    // Set minimum dates
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('checkInDate').min = today;
    document.getElementById('checkOutDate').min = today;
}

function closeBookingModal() {
    const modal = document.getElementById('bookingModal');
    modal.style.display = 'none';
    selectedRoomId = null;
}

// Handle booking form submission
document.getElementById('bookingForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const checkIn = document.getElementById('checkInDate').value;
    const checkOut = document.getElementById('checkOutDate').value;
    const guests = document.getElementById('guests').value;
    
    try {
        const response = await fetch('/bookings/create', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                hotelId: parseInt(hotelId),
                roomTypeId: selectedRoomId,
                checkIn,
                checkOut,
                guests: parseInt(guests)
            })
        });
        
        const result = await response.json();
        if (result.success) {
            alert('Booking successful!');
            closeBookingModal();
        } else {
            alert(result.message || 'Error creating booking');
        }
    } catch (error) {
        console.error('Error creating booking:', error);
        alert('Error creating booking. Please try again.');
    }
});

// Initialize page
document.addEventListener('DOMContentLoaded', () => {
    getHotelDetails();
    getRoomTypes();
    
    // Update check-out minimum date when check-in is selected
    document.getElementById('checkInDate').addEventListener('change', (e) => {
        document.getElementById('checkOutDate').min = e.target.value;
    });
});
