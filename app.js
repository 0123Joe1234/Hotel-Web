// Global variables
let userId = null;
let isAdmin = false;

// Sample hotel data
const hotels = [
    {
        id: 1,
        name: 'Mena House Hotel',
        location: 'Giza',
        country: 'Egypt',
        description: 'Historic luxury hotel with pyramid views',
        rating: 5,
        image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945',
        amenities: ['Pool', 'Spa', 'Restaurant', 'Pyramid View'],
        priceRange: {
            min: 4500,
            max: 8500
        }
    },
    {
        id: 2,
        name: 'Winter Palace',
        location: 'Luxor',
        country: 'Egypt',
        description: 'Victorian palace with Nile River views',
        rating: 5,
        image: 'https://images.unsplash.com/photo-1582719508461-905c673771fd',
        amenities: ['Pool', 'Historic Tours', 'Fine Dining', 'Nile View'],
        priceRange: {
            min: 3800,
            max: 7200
        }
    },
    {
        id: 3,
        name: 'Four Seasons Nile Plaza',
        location: 'Cairo',
        country: 'Egypt',
        description: 'Luxury hotel with stunning Nile views',
        rating: 5,
        image: 'https://images.unsplash.com/photo-1578683010236-d716f9a3f461',
        amenities: ['Pool', 'Spa', 'Fine Dining', 'River View'],
        priceRange: {
            min: 5500,
            max: 12000
        }
    },
    {
        id: 4,
        name: 'Steigenberger Hotel',
        location: 'Luxor',
        country: 'Egypt',
        description: 'Elegant hotel on the banks of the Nile',
        rating: 5,
        image: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb',
        amenities: ['Spa', 'Pool', 'Fine Dining', 'River View'],
        priceRange: {
            min: 2800,
            max: 5500
        }
    },
    {
        id: 5,
        name: 'The Oberoi Zahra',
        location: 'Aswan',
        country: 'Egypt',
        description: 'Luxury Nile Cruiser with stunning views',
        rating: 5,
        image: 'https://images.unsplash.com/photo-1551918120-9739cb430c6d',
        amenities: ['River View', 'Spa', 'Gourmet Dining', 'Pool'],
        priceRange: {
            min: 4200,
            max: 9000
        }
    },
    {
        id: 6,
        name: 'Marriott Mena House',
        location: 'Giza',
        country: 'Egypt',
        description: 'Historic hotel with pyramid views',
        rating: 5,
        image: 'https://images.unsplash.com/photo-1469796466635-455ede028aca',
        amenities: ['Pool', 'Spa', 'Pyramid View', 'Gardens'],
        priceRange: {
            min: 3500,
            max: 7500
        }
    },
    {
        id: 7,
        name: 'Sofitel Legend Old Cataract',
        location: 'Aswan',
        country: 'Egypt',
        description: 'Victorian luxury on the Nile',
        rating: 5,
        image: 'https://images.unsplash.com/photo-1548574505-5e239809ee19',
        amenities: ['River View', 'Spa', 'Fine Dining', 'Pool'],
        priceRange: {
            min: 4000,
            max: 8500
        }
    },
    {
        id: 8,
        name: 'Kempinski Nile Hotel',
        location: 'Cairo',
        country: 'Egypt',
        description: 'Modern luxury in the heart of Cairo',
        rating: 5,
        image: 'https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9',
        amenities: ['Spa', 'Rooftop Pool', 'Fine Dining', 'City View'],
        priceRange: {
            min: 2500,
            max: 5000
        }
    },
    {
        id: 9,
        name: 'Baron Palace Sahl Hasheesh',
        location: 'Hurghada',
        country: 'Egypt',
        description: 'Beachfront resort with luxury amenities',
        rating: 4,
        image: 'https://images.unsplash.com/photo-1564501049412-61c2a3083791',
        amenities: ['Beach', 'Pool', 'Spa', 'Water Sports'],
        priceRange: {
            min: 2200,
            max: 4500
        }
    },
    {
        id: 10,
        name: 'Hilton Luxor Resort',
        location: 'Luxor',
        country: 'Egypt',
        description: 'Modern resort with ancient views',
        rating: 5,
        image: 'https://images.unsplash.com/photo-1549109786-eb80da56e693',
        amenities: ['Nile View', 'Spa', 'Infinity Pools', 'Temple Views'],
        priceRange: {
            min: 2800,
            max: 6000
        }
    },
    {
        id: 11,
        name: 'Burj Al Arab',
        location: 'Dubai',
        country: 'UAE',
        description: 'Iconic sail-shaped luxury hotel',
        rating: 5,
        image: 'https://images.unsplash.com/photo-1582719508461-905c673771fd',
        amenities: ['Private Beach', 'Helipad', 'Spa', 'Infinity Pool'],
        priceRange: {
            min: 8000,
            max: 15000
        }
    },
    {
        id: 12,
        name: 'Emirates Palace',
        location: 'Abu Dhabi',
        country: 'UAE',
        description: 'Opulent palace hotel with private beach',
        rating: 5,
        image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945',
        amenities: ['Private Beach', 'Marina', 'Spa', 'Palace Tours'],
        priceRange: {
            min: 6000,
            max: 12000
        }
    },
    {
        id: 13,
        name: 'Ritz-Carlton Riyadh',
        location: 'Riyadh',
        country: 'Saudi Arabia',
        description: 'Palatial luxury in the heart of Riyadh',
        rating: 5,
        image: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb',
        amenities: ['Royal Spa', 'Fine Dining', 'Indoor Pool', 'Gardens'],
        priceRange: {
            min: 5500,
            max: 10000
        }
    },
    {
        id: 14,
        name: 'Four Seasons Casablanca',
        location: 'Casablanca',
        country: 'Morocco',
        description: 'Oceanfront luxury with Atlantic views',
        rating: 5,
        image: 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa',
        amenities: ['Ocean View', 'Spa', 'Fine Dining', 'Beach Access'],
        priceRange: {
            min: 3200,
            max: 7000
        }
    },
    {
        id: 15,
        name: 'Royal Mansour Marrakech',
        location: 'Marrakech',
        country: 'Morocco',
        description: 'Traditional Moroccan palace hotel',
        rating: 5,
        image: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4',
        amenities: ['Private Riads', 'Spa', 'Gardens', 'Fine Dining'],
        priceRange: {
            min: 4500,
            max: 9000
        }
    },
    {
        id: 16,
        name: 'Four Seasons Amman',
        location: 'Amman',
        country: 'Jordan',
        description: 'Luxury hotel with city views',
        rating: 5,
        image: 'https://images.unsplash.com/photo-1549638441-b787d2e11f14',
        amenities: ['City View', 'Spa', 'Fine Dining', 'Pool'],
        priceRange: {
            min: 2800,
            max: 6000
        }
    },
    {
        id: 17,
        name: 'Kempinski Hotel Ishtar',
        location: 'Dead Sea',
        country: 'Jordan',
        description: 'Luxury resort on the Dead Sea',
        rating: 5,
        image: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d',
        amenities: ['Dead Sea Access', 'Spa', 'Multiple Pools', 'Restaurants'],
        priceRange: {
            min: 3200,
            max: 7500
        }
    },
    {
        id: 18,
        name: 'Four Seasons Beirut',
        location: 'Beirut',
        country: 'Lebanon',
        description: 'Modern luxury with Mediterranean views',
        rating: 5,
        image: 'https://images.unsplash.com/photo-1564501049412-61c2a3083791',
        amenities: ['Sea View', 'Rooftop Pool', 'Spa', 'Fine Dining'],
        priceRange: {
            min: 3000,
            max: 6500
        }
    },
    {
        id: 19,
        name: 'The Pearl-Qatar',
        location: 'Doha',
        country: 'Qatar',
        description: 'Luxury hotel on artificial island',
        rating: 5,
        image: 'https://images.unsplash.com/photo-1549109786-eb80da56e693',
        amenities: ['Private Beach', 'Marina View', 'Spa', 'Fine Dining'],
        priceRange: {
            min: 4500,
            max: 9000
        }
    },
    {
        id: 20,
        name: 'Shangri-La Muscat',
        location: 'Muscat',
        country: 'Oman',
        description: 'Beachfront resort with traditional architecture',
        rating: 5,
        image: 'https://images.unsplash.com/photo-1576675784201-0e142b423952',
        amenities: ['Private Beach', 'Traditional Spa', 'Water Sports', 'Gardens'],
        priceRange: {
            min: 3500,
            max: 7500
        }
    },
    {
        id: 21,
        name: 'The Residence Tunis',
        location: 'Tunis',
        country: 'Tunisia',
        description: 'Mediterranean luxury resort',
        rating: 5,
        image: 'https://images.unsplash.com/photo-1566665797739-1674de7a421a',
        amenities: ['Beach Access', 'Golf Course', 'Spa', 'Fine Dining'],
        priceRange: {
            min: 2500,
            max: 5500
        }
    },
    {
        id: 22,
        name: 'Four Seasons Bahrain Bay',
        location: 'Manama',
        country: 'Bahrain',
        description: 'Modern luxury on private island',
        rating: 5,
        image: 'https://images.unsplash.com/photo-1445019980597-93fa8acb246c',
        amenities: ['Private Island', 'Beach', 'Spa', 'Fine Dining'],
        priceRange: {
            min: 4000,
            max: 8500
        }
    }
];

// Currency conversion rates (based on EGP - Updated to real market rates)
const exchangeRates = {
    EGP: 1,
    USD: 0.0324, // 1 USD = ~30.86 EGP
    EUR: 0.0299, // 1 EUR = ~33.44 EGP
    GBP: 0.0258, // 1 GBP = ~38.76 EGP
    JPY: 4.6429, // 1 EGP = ~0.215 JPY
    AED: 0.1190  // 1 AED = ~8.40 EGP
};

let currentCurrency = 'EGP';

// Function to convert price to selected currency
function convertPrice(priceInEGP) {
    const rate = exchangeRates[currentCurrency];
    const convertedPrice = priceInEGP * rate;
    return formatPrice(convertedPrice, currentCurrency);
}

// Function to format price with currency symbol
function formatPrice(price, currency) {
    const symbols = {
        EGP: 'E£',
        USD: '$',
        EUR: '€',
        GBP: '£',
        JPY: '¥',
        AED: 'د.إ'
    };
    
    // Round to appropriate decimal places
    let formattedPrice;
    switch(currency) {
        case 'JPY':
            formattedPrice = Math.round(price);
            break;
        case 'EGP':
            formattedPrice = Math.round(price);
            break;
        default:
            formattedPrice = Math.round(price * 100) / 100;
    }
    
    return `${symbols[currency]}${formattedPrice.toLocaleString()}`;
}

// Function to convert price to currency format
function convertPrice(price) {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'EGP'
    }).format(price);
}

// Function to create a hotel card
function createHotelCard(hotel) {
    const hotelCard = document.createElement('div');
    hotelCard.className = 'hotel-card';
    hotelCard.innerHTML = `
        <div class="hotel-image">
            <img src="${hotel.image}" alt="${hotel.name}">
            <button class="favorite-btn" onclick="toggleFavorite(${hotel.id})">
                <i class="fas fa-heart"></i>
            </button>
        </div>
        <div class="hotel-info">
            <h3>${hotel.name}</h3>
            <p class="location">${hotel.location}, ${hotel.country}</p>
            <p class="rating">Rating: ${hotel.rating} ⭐</p>
            <p class="price-range">$${hotel.priceRange.min} - $${hotel.priceRange.max} per night</p>
            <p class="description">${hotel.description}</p>
            <div class="amenities">
                ${hotel.amenities.map(amenity => `<span class="amenity">${amenity}</span>`).join('')}
            </div>
            <button class="btn-view-rooms" onclick="viewRooms(${hotel.id})">View Rooms</button>
        </div>
    `;
    return hotelCard;
}

// Function to display hotels
function displayHotels(hotels) {
    const container = document.getElementById('hotelContainer');
    container.innerHTML = ''; // Clear existing hotels

    if (hotels.length === 0) {
        container.innerHTML = '<p class="no-results">No hotels found matching your criteria</p>';
        return;
    }

    hotels.forEach(hotel => {
        const card = document.createElement('div');
        card.className = 'hotel-card';
        card.innerHTML = `
            <div class="hotel-image">
                <img src="${hotel.image}" alt="${hotel.name}">
                <button class="favorite-btn" onclick="toggleFavorite(${hotel.id})">
                    <i class="fas fa-heart"></i>
                </button>
            </div>
            <div class="hotel-info">
                <h3>${hotel.name}</h3>
                <p class="location"><i class="fas fa-map-marker-alt"></i> ${hotel.location}, ${hotel.country}</p>
                <div class="rating">${generateStarRating(hotel.rating)}</div>
                <p class="price-range">From ${formatPrice(hotel.priceRange.min)} per night</p>
                <p class="description">${hotel.description}</p>
                <div class="amenities">
                    ${hotel.amenities.map(amenity => `
                        <span class="amenity"><i class="fas fa-check"></i> ${amenity}</span>
                    `).join('')}
                </div>
                <button onclick="viewRooms(${hotel.id})" class="btn-view-rooms">View Rooms</button>
            </div>
        `;

        // Check if hotel is favorited
        checkFavoriteStatus(hotel.id, card.querySelector('.favorite-btn i'));
        
        container.appendChild(card);
    });
}

// Function to generate star rating
function generateStarRating(rating) {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    let stars = '';
    
    for (let i = 0; i < fullStars; i++) {
        stars += '<i class="fas fa-star"></i>';
    }
    
    if (hasHalfStar) {
        stars += '<i class="fas fa-star-half-alt"></i>';
    }
    
    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
        stars += '<i class="far fa-star"></i>';
    }
    
    return stars;
}

// Function to format price
function formatPrice(price) {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD'
    }).format(price);
}

// Function to fetch and display hotels
async function fetchHotels() {
    try {
        const response = await fetch('http://localhost:555/hotels');
        if (!response.ok) {
            throw new Error('Failed to fetch hotels');
        }
        const hotels = await response.json();
        displayHotels(hotels);
    } catch (error) {
        console.error('Error:', error);
    }
}

// Call fetchHotels when the page loads
document.addEventListener('DOMContentLoaded', fetchHotels);

// Function to handle search
async function handleSearch(event) {
    event.preventDefault();
    const searchQuery = document.getElementById('searchInput').value.toLowerCase();
    const selectedCountry = document.getElementById('countrySelect').value;
    
    const response = await fetch('http://localhost:555/hotels');
    const hotels = await response.json();
    
    const filteredHotels = hotels.filter(hotel => {
        const matchesSearch = 
            hotel.name.toLowerCase().includes(searchQuery) ||
            hotel.location.toLowerCase().includes(searchQuery);
            
        const matchesCountry = 
            !selectedCountry || 
            hotel.country === selectedCountry;
            
        return matchesSearch && matchesCountry;
    });
    
    displayHotels(filteredHotels);
}

// Add event listener to search form
document.getElementById('searchForm').addEventListener('submit', handleSearch);

// Function to search hotels
async function searchHotels(event) {
    event.preventDefault();
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();
    const selectedCountry = document.getElementById('countrySelect').value;
    
    try {
        const response = await fetch('/hotels');
        const allHotels = await response.json();
        
        let filteredHotels = allHotels;
        
        // Filter by search term
        if (searchTerm) {
            filteredHotels = filteredHotels.filter(hotel => 
                hotel.name.toLowerCase().includes(searchTerm) ||
                hotel.location.toLowerCase().includes(searchTerm) ||
                hotel.description.toLowerCase().includes(searchTerm)
            );
        }
        
        // Filter by country
        if (selectedCountry !== 'all') {
            filteredHotels = filteredHotels.filter(hotel => 
                hotel.country.toLowerCase() === selectedCountry.toLowerCase()
            );
        }
        
        displayHotels(filteredHotels);
    } catch (error) {
        console.error('Error searching hotels:', error);
        alert('Error searching hotels. Please try again.');
    }
}

// Load hotels when page loads
document.addEventListener('DOMContentLoaded', async () => {
    try {
        const response = await fetch('/hotels');
        const hotels = await response.json();
        displayHotels(hotels);
    } catch (error) {
        console.error('Error loading hotels:', error);
        alert('Error loading hotels. Please refresh the page.');
    }
});

// Function to toggle favorite status
async function toggleFavorite(hotelId) {
    if (!isAuthenticated()) {
        alert('Please login to add favorites');
        return;
    }

    try {
        const response = await fetch('/favorites', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${getAuthToken()}`
            },
            body: JSON.stringify({ hotelId })
        });

        if (response.ok) {
            const button = document.querySelector(`[onclick="toggleFavorite(${hotelId})"] i`);
            button.classList.toggle('active');
        }
    } catch (error) {
        console.error('Error toggling favorite:', error);
        alert('Error updating favorites. Please try again.');
    }
}

// Function to check favorite status
async function checkFavoriteStatus(hotelId, heartIcon) {
    if (!isAuthenticated()) return;

    try {
        const response = await fetch(`/favorites/${hotelId}`, {
            headers: {
                'Authorization': `Bearer ${getAuthToken()}`
            }
        });

        if (response.ok) {
            const { isFavorite } = await response.json();
            if (isFavorite) {
                heartIcon.classList.add('active');
            }
        }
    } catch (error) {
        console.error('Error checking favorite status:', error);
    }
}

// Function to show favorites
async function showFavorites() {
    if (!isAuthenticated()) {
        alert('Please login to view favorites');
        return;
    }

    try {
        const response = await fetch('/favorites', {
            headers: {
                'Authorization': `Bearer ${getAuthToken()}`
            }
        });

        if (response.ok) {
            const favorites = await response.json();
            displayHotels(favorites);
        }
    } catch (error) {
        console.error('Error loading favorites:', error);
        alert('Error loading favorites. Please try again.');
    }
}

// Authentication helper functions
function isAuthenticated() {
    return localStorage.getItem('token') !== null;
}

function getAuthToken() {
    return localStorage.getItem('token');
}

// Function to view rooms for a specific hotel
async function viewRooms(hotelId) {
    try {
        const response = await fetch(`/hotels/${hotelId}/rooms`);
        if (!response.ok) {
            throw new Error('Failed to fetch rooms');
        }
        const rooms = await response.json();
        
        // Create modal for rooms
        const modal = document.createElement('div');
        modal.className = 'modal';
        modal.id = 'roomsModal';
        modal.style.display = 'block';
        
        let roomsHtml = `
            <div class="modal-content rooms-content">
                <h2>Available Rooms</h2>
                <div class="rooms-grid">
        `;
        
        rooms.forEach(room => {
            roomsHtml += `
                <div class="room-card">
                    <div class="room-image">
                        <img src="${room.image_url}" alt="${room.name}" onerror="this.src='https://via.placeholder.com/300x200'">
                    </div>
                    <div class="room-info">
                        <h3>${room.name}</h3>
                        <p>${room.description}</p>
                        <div class="room-details">
                            <span><i class="fas fa-user"></i> ${room.capacity} Guests</span>
                            <span><i class="fas fa-dollar-sign"></i> ${room.price} per night</span>
                        </div>
                        <button class="btn-book-room" onclick="bookRoom(${room.id})">
                            Book Now
                        </button>
                    </div>
                </div>
            `;
        });
        
        roomsHtml += `
                </div>
            </div>
        `;
        
        modal.innerHTML = roomsHtml;
        document.body.appendChild(modal);
        
        // Close modal when clicking outside
        modal.onclick = function(event) {
            if (event.target === modal) {
                document.body.removeChild(modal);
            }
        };
    } catch (error) {
        console.error('Error fetching rooms:', error);
        alert('Error loading rooms. Please try again later.');
    }
}

// Function to book a room
async function bookRoom(roomId) {
    try {
        // Create booking modal
        const modal = document.createElement('div');
        modal.className = 'modal';
        modal.style.display = 'block';
        
        const today = new Date().toISOString().split('T')[0];
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        const tomorrowStr = tomorrow.toISOString().split('T')[0];
        
        modal.innerHTML = `
            <div class="modal-content booking-content">
                <h2>Book Your Stay</h2>
                <form id="bookingForm">
                    <div class="form-group">
                        <label for="guestName">Full Name</label>
                        <input type="text" id="guestName" required>
                    </div>
                    <div class="form-group">
                        <label for="guestEmail">Email</label>
                        <input type="email" id="guestEmail" required>
                    </div>
                    <div class="form-group">
                        <label for="checkIn">Check-in Date</label>
                        <input type="date" id="checkIn" min="${today}" required>
                    </div>
                    <div class="form-group">
                        <label for="checkOut">Check-out Date</label>
                        <input type="date" id="checkOut" min="${tomorrowStr}" required>
                    </div>
                    <div class="form-group">
                        <label for="guests">Number of Guests</label>
                        <select id="guests" required>
                            <option value="1">1 Guest</option>
                            <option value="2">2 Guests</option>
                            <option value="3">3 Guests</option>
                            <option value="4">4 Guests</option>
                        </select>
                    </div>
                    <button type="submit" class="btn-book-room">Confirm Booking</button>
                </form>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        // Handle form submission
        const form = document.getElementById('bookingForm');
        form.onsubmit = async (e) => {
            e.preventDefault();
            
            const bookingData = {
                roomId,
                guestName: document.getElementById('guestName').value,
                guestEmail: document.getElementById('guestEmail').value,
                checkIn: document.getElementById('checkIn').value,
                checkOut: document.getElementById('checkOut').value,
                guests: document.getElementById('guests').value
            };
            
            try {
                const response = await fetch('/bookings', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(bookingData)
                });
                
                const result = await response.json();
                
                if (response.ok) {
                    alert(`Booking confirmed! Total price: $${result.totalPrice} for ${result.nights} nights.`);
                    document.body.removeChild(modal);
                } else {
                    alert(result.error || 'Failed to create booking');
                }
            } catch (error) {
                console.error('Error creating booking:', error);
                alert('Error creating booking. Please try again.');
            }
        };
        
        // Close modal when clicking outside
        modal.onclick = function(event) {
            if (event.target === modal) {
                document.body.removeChild(modal);
            }
        };
    } catch (error) {
        console.error('Error showing booking form:', error);
        alert('Error showing booking form. Please try again.');
    }
}

// Function to get user's bookings
async function getMyBookings() {
    try {
        const response = await authenticatedFetch('http://localhost:555/bookings/user');
        if (response.ok) {
            const bookings = await response.json();
            const bookingsList = document.getElementById('bookingsList');
            if (bookings.length === 0) {
                bookingsList.innerHTML = '<p>No bookings found.</p>';
            } else {
                bookingsList.innerHTML = bookings.map(booking => `
                    <div class="booking-card">
                        <h3>${booking.hotelName}</h3>
                        <p>Room: ${booking.roomType}</p>
                        <p>Check-in: ${new Date(booking.checkIn).toLocaleDateString()}</p>
                        <p>Check-out: ${new Date(booking.checkOut).toLocaleDateString()}</p>
                        <p>Total Price: $${booking.totalPrice}</p>
                        <p>Status: ${booking.status}</p>
                    </div>
                `).join('');
            }
        }
    } catch (error) {
        console.error('Error fetching bookings:', error);
    }
}

// Function to handle user logout
function logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    localStorage.removeItem('isAdmin');
    window.location.href = '/';
}

// Login function
async function login(event) {
    event.preventDefault();
    
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;

    try {
        const response = await fetch('/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password })
        });

        const data = await response.json();

        if (response.ok) {
            localStorage.setItem('token', data.token);
            localStorage.setItem('userName', data.name);
            alert('Login successful!');
            window.location.href = '/'; // Redirect to home page
        } else {
            alert(data.error || 'Login failed');
        }
    } catch (error) {
        console.error('Login error:', error);
        alert('Error during login. Please try again.');
    }
}

// Register function
async function register(event) {
    event.preventDefault();
    
    const name = document.getElementById('registerName').value;
    const email = document.getElementById('registerEmail').value;
    const password = document.getElementById('registerPassword').value;

    try {
        const response = await fetch('/auth/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ name, email, password })
        });

        const data = await response.json();

        if (response.ok) {
            alert('Registration successful! Please login.');
            // Switch to login form
            document.getElementById('loginForm').style.display = 'block';
            document.getElementById('registerForm').style.display = 'none';
        } else {
            alert(data.error || 'Registration failed');
        }
    } catch (error) {
        console.error('Registration error:', error);
        alert('Error during registration. Please try again.');
    }
}

// Check if user is logged in
function checkLoginStatus() {
    const token = localStorage.getItem('token');
    const userName = localStorage.getItem('userName');
    const loginBtn = document.getElementById('loginBtn');
    const registerBtn = document.getElementById('registerBtn');
    const logoutBtn = document.getElementById('logoutBtn');
    const userNameDisplay = document.getElementById('userNameDisplay');

    if (token && userName) {
        if (loginBtn) loginBtn.style.display = 'none';
        if (registerBtn) registerBtn.style.display = 'none';
        if (logoutBtn) logoutBtn.style.display = 'block';
        if (userNameDisplay) {
            userNameDisplay.style.display = 'block';
            userNameDisplay.textContent = `Welcome, ${userName}!`;
        }
    } else {
        if (loginBtn) loginBtn.style.display = 'block';
        if (registerBtn) registerBtn.style.display = 'block';
        if (logoutBtn) logoutBtn.style.display = 'none';
        if (userNameDisplay) userNameDisplay.style.display = 'none';
    }
}

// Logout function
function logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('userName');
    checkLoginStatus();
    window.location.href = '/';
}

// Add event listeners when document loads
document.addEventListener('DOMContentLoaded', function() {
    checkLoginStatus();
    
    // Login form submit
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', login);
    }

    // Register form submit
    const registerForm = document.getElementById('registerForm');
    if (registerForm) {
        registerForm.addEventListener('submit', register);
    }

    // Logout button click
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', logout);
    }
});

// Initialize the page
document.addEventListener('DOMContentLoaded', () => {
    // Set minimum date for check-in and check-out
    const today = new Date().toISOString().split('T')[0];
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const tomorrowStr = tomorrow.toISOString().split('T')[0];

    const checkInInput = document.getElementById('checkIn');
    const checkOutInput = document.getElementById('checkOut');
    if (checkInInput && checkOutInput) {
        checkInInput.min = today;
        checkOutInput.min = tomorrowStr;

        checkInInput.addEventListener('change', () => {
            const nextDay = new Date(checkInInput.value);
            nextDay.setDate(nextDay.getDate() + 1);
            checkOutInput.min = nextDay.toISOString().split('T')[0];
            if (checkOutInput.value && checkOutInput.value <= checkInInput.value) {
                checkOutInput.value = nextDay.toISOString().split('T')[0];
            }
        });
    }

    // Check authentication status
    if (isAuthenticated()) {
        userId = localStorage.getItem('userId');
        isAdmin = localStorage.getItem('isAdmin') === 'true';
        document.getElementById('userSection').style.display = 'block';
        document.getElementById('loginLink').style.display = 'none';
    }

    // Load initial hotel grid
    const hotelGrid = document.getElementById('hotelGrid');
    if (hotelGrid) {
        hotelGrid.innerHTML = hotels.map(hotel => createHotelCard(hotel)).join('');
    }

    // Load user's bookings if on the bookings page
    const bookingsList = document.getElementById('bookingsList');
    if (bookingsList) {
        getMyBookings();
    }

    // Add currency selector event listener
    const currencySelector = document.getElementById('currencySelector');
    if (currencySelector) {
        currencySelector.addEventListener('change', (e) => {
            currentCurrency = e.target.value;
            // Refresh the hotel display to show new currency
            const hotelGrid = document.getElementById('hotelGrid');
            if (hotelGrid) {
                hotelGrid.innerHTML = hotels.map(hotel => createHotelCard(hotel)).join('');
            }
        });
    }
});

// Room data for each hotel
const hotelRooms = {
    1: [ // Mena House Hotel
        {
            id: 1,
            name: 'Pyramid View Room',
            type: 'Deluxe',
            description: 'Luxurious room with direct pyramid views',
            capacity: 2,
            amenities: ['King Bed', 'Balcony', 'Mini Bar', 'Free WiFi'],
            images: [
                'https://images.unsplash.com/photo-1611892440504-42a792e24d32',
                'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b'
            ],
            pricePerNight: 5500
        },
        {
            id: 2,
            name: 'Garden View Suite',
            type: 'Suite',
            description: 'Spacious suite overlooking lush gardens',
            capacity: 3,
            amenities: ['King Bed', 'Living Room', 'Garden View', 'Butler Service'],
            images: [
                'https://images.unsplash.com/photo-1591088398332-8a7791972843',
                'https://images.unsplash.com/photo-1590490360182-c33d57733427'
            ],
            pricePerNight: 7500
        }
    ],
    2: [ // Winter Palace
        {
            id: 3,
            name: 'Nile View Room',
            type: 'Deluxe',
            description: 'Elegant room with panoramic Nile views',
            capacity: 2,
            amenities: ['Queen Bed', 'River View', 'Mini Bar', 'High-Speed WiFi'],
            images: [
                'https://images.unsplash.com/photo-1618773928121-c32242e63f39',
                'https://images.unsplash.com/photo-1590490360182-c33d57733427'
            ],
            pricePerNight: 4500
        }
    ],
    11: [ // Burj Al Arab
        {
            id: 4,
            name: 'Deluxe Suite',
            type: 'Suite',
            description: 'Two-story suite with panoramic ocean views',
            capacity: 4,
            amenities: ['Butler Service', 'Private Bar', 'Jacuzzi', 'Ocean View'],
            images: [
                'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b',
                'https://images.unsplash.com/photo-1590490360182-c33d57733427'
            ],
            pricePerNight: 12000
        }
    ]
};

// DOM Elements
document.addEventListener('DOMContentLoaded', function() {
    const searchForm = document.getElementById('searchForm');
    const searchInput = document.getElementById('searchInput');
    const countrySelect = document.getElementById('countrySelect');
    const hotelContainer = document.getElementById('hotelContainer');
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');

    // Event Listeners
    searchForm.addEventListener('submit', handleSearch);

    // Functions
    async function fetchHotels() {
        try {
            const response = await fetch('/hotels');
            if (!response.ok) {
                throw new Error('Failed to fetch hotels');
            }
            const data = await response.json();
            renderHotels(data);
        } catch (error) {
            console.error('Error fetching hotels:', error);
            hotelContainer.innerHTML = '<p>Error loading hotels. Please try again later.</p>';
        }
    }

    function handleSearch(event) {
        event.preventDefault();
        const searchTerm = searchInput.value.toLowerCase();
        const selectedCountry = countrySelect.value;

        fetch('/hotels')
            .then(response => response.json())
            .then(hotels => {
                const filteredHotels = hotels.filter(hotel => {
                    const matchesSearch = hotel.name.toLowerCase().includes(searchTerm) ||
                                        hotel.location.toLowerCase().includes(searchTerm);
                    const matchesCountry = !selectedCountry || hotel.country === selectedCountry;
                    return matchesSearch && matchesCountry;
                });
                renderHotels(filteredHotels);
            })
            .catch(error => {
                console.error('Error searching hotels:', error);
                hotelContainer.innerHTML = '<p>Error searching hotels. Please try again later.</p>';
            });
    }

    function renderHotels(hotels) {
        hotelContainer.innerHTML = '';
        
        if (!hotels || hotels.length === 0) {
            hotelContainer.innerHTML = '<p>No hotels found matching your criteria.</p>';
            return;
        }
        
        hotels.forEach(hotel => {
            const amenitiesArray = hotel.amenities ? hotel.amenities.split(',') : [];
            const card = document.createElement('div');
            card.className = 'hotel-card';
            
            card.innerHTML = `
                <div class="hotel-image">
                    <img src="${hotel.image_url || 'https://via.placeholder.com/300x200'}" alt="${hotel.name}" onerror="this.src='https://via.placeholder.com/300x200'">
                </div>
                <div class="hotel-info">
                    <h3>${hotel.name}</h3>
                    <div class="location">
                        <i class="fas fa-map-marker-alt"></i> ${hotel.location}, ${hotel.country}
                    </div>
                    <div class="rating">
                        ${getRatingStars(hotel.rating)}
                    </div>
                    <div class="price-range">
                        $${hotel.price_min} - $${hotel.price_max} per night
                    </div>
                    <div class="amenities">
                        ${amenitiesArray.map(amenity => `
                            <span class="amenity">${amenity.trim()}</span>
                        `).join('')}
                    </div>
                    <button class="btn-view-rooms" onclick="viewRooms(${hotel.id})">
                        View Rooms
                    </button>
                </div>
            `;
            
            hotelContainer.appendChild(card);
        });
    }

    function getRatingStars(rating) {
        const fullStars = Math.floor(rating);
        const hasHalfStar = rating % 1 >= 0.5;
        let stars = '';
        
        for (let i = 0; i < fullStars; i++) {
            stars += '<i class="fas fa-star"></i>';
        }
        
        if (hasHalfStar) {
            stars += '<i class="fas fa-star-half-alt"></i>';
        }
        
        const emptyStars = 5 - Math.ceil(rating);
        for (let i = 0; i <emptyStars; i++) {
            stars += '<i class="far fa-star"></i>';
        }
        
        return stars;
    }

    // Auth Functions
    window.login = async function(event) {
        event.preventDefault();
        const email = document.getElementById('loginEmail').value;
        const password = document.getElementById('loginPassword').value;

        try {
            const response = await fetch('/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email, password })
            });

            if (response.ok) {
                loginForm.style.display = 'none';
                alert('Login successful!');
            } else {
                alert('Invalid credentials');
            }
        } catch (error) {
            console.error('Error logging in:', error);
            alert('Error logging in. Please try again.');
        }
    };

    window.register = async function(event) {
        event.preventDefault();
        const name = document.getElementById('registerName').value;
        const email = document.getElementById('registerEmail').value;
        const password = document.getElementById('registerPassword').value;

        try {
            const response = await fetch('/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ name, email, password })
            });

            if (response.ok) {
                registerForm.style.display = 'none';
                alert('Registration successful! Please login.');
                showLoginForm();
            } else {
                alert('Registration failed');
            }
        } catch (error) {
            console.error('Error registering:', error);
            alert('Error registering. Please try again.');
        }
    };

    window.showLoginForm = function() {
        loginForm.style.display = 'block';
    };

    window.showRegisterForm = function() {
        registerForm.style.display = 'block';
    };

    window.viewRooms = async function(hotelId) {
        try {
            const response = await fetch(`/hotels/${hotelId}/rooms`);
            if (!response.ok) {
                throw new Error('Failed to fetch rooms');
            }
            const rooms = await response.json();
            
            // Create modal for rooms
            const modal = document.createElement('div');
            modal.className = 'modal';
            modal.id = 'roomsModal';
            modal.style.display = 'block';
            
            let roomsHtml = `
                <div class="modal-content rooms-content">
                    <h2>Available Rooms</h2>
                    <div class="rooms-grid">
            `;
            
            rooms.forEach(room => {
                roomsHtml += `
                    <div class="room-card">
                        <div class="room-image">
                            <img src="${room.image_url}" alt="${room.name}" onerror="this.src='https://via.placeholder.com/300x200'">
                        </div>
                        <div class="room-info">
                            <h3>${room.name}</h3>
                            <p>${room.description}</p>
                            <div class="room-details">
                                <span><i class="fas fa-user"></i> ${room.capacity} Guests</span>
                                <span><i class="fas fa-dollar-sign"></i> ${room.price} per night</span>
                            </div>
                            <button class="btn-book-room" onclick="bookRoom(${room.id})">
                                Book Now
                            </button>
                        </div>
                    </div>
                `;
            });
            
            roomsHtml += `
                    </div>
                </div>
            `;
            
            modal.innerHTML = roomsHtml;
            document.body.appendChild(modal);
            
            // Close modal when clicking outside
            modal.onclick = function(event) {
                if (event.target === modal) {
                    document.body.removeChild(modal);
                }
            };
        } catch (error) {
            console.error('Error fetching rooms:', error);
            alert('Error loading rooms. Please try again later.');
        }
    };

    window.bookRoom = async function(roomId) {
        try {
            // Create booking modal
            const modal = document.createElement('div');
            modal.className = 'modal';
            modal.style.display = 'block';
            
            const today = new Date().toISOString().split('T')[0];
            const tomorrow = new Date();
            tomorrow.setDate(tomorrow.getDate() + 1);
            const tomorrowStr = tomorrow.toISOString().split('T')[0];
            
            modal.innerHTML = `
                <div class="modal-content booking-content">
                    <h2>Book Your Stay</h2>
                    <form id="bookingForm">
                        <div class="form-group">
                            <label for="guestName">Full Name</label>
                            <input type="text" id="guestName" required>
                        </div>
                        <div class="form-group">
                            <label for="guestEmail">Email</label>
                            <input type="email" id="guestEmail" required>
                        </div>
                        <div class="form-group">
                            <label for="checkIn">Check-in Date</label>
                            <input type="date" id="checkIn" min="${today}" required>
                        </div>
                        <div class="form-group">
                            <label for="checkOut">Check-out Date</label>
                            <input type="date" id="checkOut" min="${tomorrowStr}" required>
                        </div>
                        <div class="form-group">
                            <label for="guests">Number of Guests</label>
                            <select id="guests" required>
                                <option value="1">1 Guest</option>
                                <option value="2">2 Guests</option>
                                <option value="3">3 Guests</option>
                                <option value="4">4 Guests</option>
                            </select>
                        </div>
                        <button type="submit" class="btn-book-room">Confirm Booking</button>
                    </form>
                </div>
            `;
            
            document.body.appendChild(modal);
            
            // Handle form submission
            const form = document.getElementById('bookingForm');
            form.onsubmit = async (e) => {
                e.preventDefault();
                
                const bookingData = {
                    roomId,
                    guestName: document.getElementById('guestName').value,
                    guestEmail: document.getElementById('guestEmail').value,
                    checkIn: document.getElementById('checkIn').value,
                    checkOut: document.getElementById('checkOut').value,
                    guests: document.getElementById('guests').value
                };
                
                try {
                    const response = await fetch('/bookings', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify(bookingData)
                    });
                    
                    const result = await response.json();
                    
                    if (response.ok) {
                        alert(`Booking confirmed! Total price: $${result.totalPrice} for ${result.nights} nights.`);
                        document.body.removeChild(modal);
                    } else {
                        alert(result.error || 'Failed to create booking');
                    }
                } catch (error) {
                    console.error('Error creating booking:', error);
                    alert('Error creating booking. Please try again.');
                }
            };
            
            // Close modal when clicking outside
            modal.onclick = function(event) {
                if (event.target === modal) {
                    document.body.removeChild(modal);
                }
            };
        } catch (error) {
            console.error('Error showing booking form:', error);
            alert('Error showing booking form. Please try again.');
        }
    };
    
    // Close modals when clicking outside
    window.onclick = function(event) {
        if (event.target === loginForm) {
            loginForm.style.display = 'none';
        }
        if (event.target === registerForm) {
            registerForm.style.display = 'none';
        }
    };

    // Initialize
    fetchHotels();
});
