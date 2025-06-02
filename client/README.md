# Student Peer-to-Peer Marketplace

## Week 1: Setup
- Initialized MERN project with client and server folders.
- Installed Node.js, MongoDB (local), and dependencies.
- Set up Express backend and React frontend.
- Tested at `http://localhost:5000` (backend) and `http://localhost:3000` (frontend).

## Week 2: Backend Development
- Created MongoDB schemas: user.js, Product.js, Message.js.
- Implemented authentication routes: /api/auth/signup, /api/auth/login.
- Added @collegeitm.ac.in email validation.
- Added JWT middleware for protected routes (/api/auth/protected).
- Fixed JSON parsing and protected route errors.
- Tested with Postman and verified in MongoDB Compass (retail.users).

## Week 3: Backend Development
- Implemented product routes with Multer for image uploads (/api/products/*).
- Fixed 'No token, authorization denied' in product creation.
- Fixed 'TypeError: Cannot destructure property email' in signup.
- Debugged empty array in GET /api/products.
- Implemented messaging routes with auth protection (/api/messages/*).
- Added real-time messaging with Socket.io, tested with HTML client.
- Fully tested all routes with Postman and Socket.io, verified in Compass (retail.users, retail.products, retail.messages).