# Middle Eastern Luxury Hotel Booking System

A comprehensive hotel booking platform specializing in luxury hotels across the Middle East.

## Features

- **User Authentication**
  - Secure registration and login
  - JWT-based authentication
  - Password hashing with bcrypt

- **Hotel Management**
  - Browse hotels by country and city
  - View detailed hotel information
  - Real-time room availability
  - High-quality hotel and room images

- **Booking System**
  - Real-time availability checking
  - Secure payment processing with Stripe
  - Booking confirmation emails
  - View booking history

- **Multi-Currency Support**
  - Support for 6 currencies (EGP, USD, EUR, GBP, JPY, AED)
  - Real-time currency conversion
  - Localized price formatting

- **Review System**
  - Rate and review hotels
  - View user reviews and ratings
  - Sort hotels by rating

## Technologies Used

- **Frontend**
  - HTML5
  - CSS3
  - JavaScript (ES6+)
  - Font Awesome for icons
  - Google Fonts

- **Backend**
  - Node.js
  - Express.js
  - SQLite3 for database
  - JWT for authentication
  - bcrypt for password hashing

- **APIs & Services**
  - Stripe for payments
  - Nodemailer for emails
  - Currency conversion API

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/hotel-booking-system.git
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a .env file with your configuration:
   ```
   JWT_SECRET=your_jwt_secret
   STRIPE_SECRET_KEY=your_stripe_secret_key
   SMTP_HOST=your_smtp_host
   SMTP_USER=your_smtp_user
   SMTP_PASS=your_smtp_password
   ```

4. Start the server:
   ```bash
   npm start
   ```

5. Access the application at:
   ```
   http://localhost:555
   ```

## Database Schema

- **Users**
  - id (PRIMARY KEY)
  - name
  - email (UNIQUE)
  - password
  - created_at

- **Hotels**
  - id (PRIMARY KEY)
  - name
  - location
  - country
  - description
  - amenities
  - rating
  - image_url

- **Rooms**
  - id (PRIMARY KEY)
  - hotel_id (FOREIGN KEY)
  - room_type_id (FOREIGN KEY)
  - room_number

- **Bookings**
  - id (PRIMARY KEY)
  - user_id (FOREIGN KEY)
  - room_id (FOREIGN KEY)
  - check_in
  - check_out
  - guests
  - total_price
  - status
  - created_at

- **Reviews**
  - id (PRIMARY KEY)
  - user_id (FOREIGN KEY)
  - hotel_id (FOREIGN KEY)
  - rating
  - comment
  - created_at

## API Endpoints

### Authentication
- POST /auth/register - Register new user
- POST /auth/login - User login

### Hotels
- GET /hotels - Get all hotels
- GET /hotels/:id - Get hotel details
- GET /hotels/:id/rooms - Get hotel rooms
- GET /hotels/:id/reviews - Get hotel reviews

### Bookings
- POST /bookings - Create new booking
- GET /bookings - Get user bookings
- GET /bookings/:id - Get booking details

### Reviews
- POST /reviews - Create new review
- GET /reviews - Get user reviews

### Payments
- POST /payment - Process payment

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a new Pull Request

## License

This project is licensed under the MIT License.

## Contact

For any queries, please reach out to [your-email@example.com]
