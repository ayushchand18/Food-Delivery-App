# MEALIO - Food Ordering Website

Mealio is a modern food delivery web application designed with a unique group ordering feature. Along with standard food ordering, users can create a group order session and share a link with friends or colleagues. Each participant can add their preferred items, and the group creator can then import all selections into their cart and place a single order for everyone. This makes Mealio especially convenient for office lunches, family meals, or group hangouts, ensuring a seamless and collaborative food ordering experience.

## Demo

- User Panel: [https://food-delivery-app-beta-eight.vercel.app/]
- Admin Panel: [https://food-delivery-website-xeh7.vercel.app/]

## Features

- User Panel
- Admin Panel
- JWT Authentication
- Password Hashing with Bcrypt
- Stripe Payment Integration
- Login/Signup
- Logout
- Add to Cart
- Place Order
- Order Management
- Products Management
- Filter Food Products
- Login/Signup
- Authenticated APIs
- REST APIs
- Role-Based Identification
- Beautiful Alerts

## Run Locally

Clone the project

```bash
    git clone https://github.com/ayushchand18/Food-Delivery-Website
```
Go to the project directory

```bash
    cd Food-Delivery-Website
```
Install dependencies (frontend)

```bash
    cd frontend
    npm install
```
Install dependencies (admin)

```bash
    cd admin
    npm install
```
Install dependencies (backend)

```bash
    cd backend
    npm install
```
Setup Environment Vaiables

```Make .env file in "backend" folder and store environment Variables
  JWT_SECRET=YOUR_SECRET_TEXT
  MONGO_URL=YOUR_DATABASE_URL
  STRIPE_SECRET_KEY=YOUR_KEY
 ```

Setup the Frontend and Backend URL
   - App.jsx in Admin folder
      const url = YOUR_BACKEND_URL
     
  - StoreContext.js in Frontend folder
      const url = YOUR_BACKEND_URL

  - orderController in Backend folder
      const frontend_url = YOUR_FRONTEND_URL 

Start the Backend server

```bash
    npm start
```

Start the Frontend server

```bash
    npm run dev
```

## Tech Stack
* [React](https://reactjs.org/)
* [Node.js](https://nodejs.org/en)
* [Express.js](https://expressjs.com/)
* [Mongodb](https://www.mongodb.com/)
* [Stripe](https://stripe.com/)
* [JWT-Authentication](https://jwt.io/introduction)
* [Multer](https://www.npmjs.com/package/multer)



If you have any feedback, please reach out to me [here](https://www.linkedin.com/in/ayush-chand-46000722a)
