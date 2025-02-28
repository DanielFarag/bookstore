# BookStore

## Live Url
- [ ] [Live url](http://iti-bookstore.s3-website-us-east-1.amazonaws.com/).

## Tasks

### **User Authentication and Authorization**
- [ ] Users can register, log in, and log out.
- [ ] Use JWT for authentication and authorization.
- [ ] Implement role-based access control (e.g., admin vs. regular user).

### Design RESTful endpoints for:
- [ ] User management (register, login, profile update).
- [ ] Book management (CRUD operations for books, accessible only to admins).
- [ ] Cart management (add/remove books, view cart).
- [ ] Order management (place orders, view order history).
- [ ] Review management (submit, view, update, delete reviews).

### **Database Schema **
- [ ] Users (name, email, password, role).
- [ ] Books (title, author, price, description, stock, reviews, image(url or name)).
- [ ] Orders (user, books, total price, status).
- [ ] Reviews (user, book, rating, review, createdAt).
- [ ] ERD Required

### **Middleware**
- [ ] Implement custom middleware for:
- [ ] Authentication + middleware (verify JWT).
- [ ] Error handling (centralized error handling middleware).
- [ ] Logging (log requests to a file using `fs` or a logging library like `winston`).

### **Advanced Features**
- [ ] Use `bcrypt.js` to hash passwords before saving them to the database.
- [ ] Implement pagination and filtering for the book list API.
- [ ] Use transactions to handle order placement (e.g., reduce book stock and create an order in a single transaction).

### **File Handling**
- [ ] Allow admins to upload book covers using `multer` (research required) or online CDN.
- [ ] Serve static files (e.g., book covers) using Express.

### **Validation**
- [ ] Use Mongoose validations for:
- [ ] User input (e.g., email format, password strength).
- [ ] Book data (e.g., price must be positive, stock must be an integer).
- [ ] Review data (e.g., rating must be between 1 and 5, review text must not exceed 500 characters).

- [ ] Use Schema validation like (Joi, Ajv, etc...)

---

## General Remarks
- [x] Any pagination needs to be server-side pagination.
- [x] Think about model relations.
- [x] Think about what needs to be indexed in your models.
- [x] Deploy your work to the web. (Use heroku and atlas).
- [x] Share your work on Linkedin, brand yourself.
- [x] Lint your projects.

## BONUS
- [x] Use idP. (register, login with google and Facebook).
- [x] In-App Notification.





## Additional Features for Research
1. **Payment Integration**
   - Integrate a payment gateway (e.g., Stripe or PayPal) to handle payments during checkout.
   - Research how to securely handle payment information.

2. **Email Notifications**
   - Send email notifications to users when they register, place an order, or when their order status changes.
   - Use a library like `nodemailer` for sending emails.

3. **Deployment**
   - Deploy the application to a cloud platform (e.g., Heroku, AWS, or Vercel).
   - Research how to configure environment variables for production.

4. **Caching**
   - Implement caching for frequently accessed data (e.g., book list) using Redis or in-memory caching.

5. **WebSockets**
   - Use WebSockets to implement real-time features (e.g., notify admins when a new order is placed).


---


3. **Documentation**
   - A README file explaining how to set up and run the project.
 4. **Presentation**
   - A presentation demonstrating the project features and discussing the technologies used.
   - A demo of the application with a walkthrough of the codebase.

---

## Topics Covered
- Web servers, HTTP/HTTPS, and RESTful APIs.
- Node.js, Express.js, and MongoDB.
- Authentication, authorization, and error handling.
- Advanced topics like payment integration, email notifications, and deployment.

---

## Topics for Research
- Payment gateway integration.
- Email notifications using `nodemailer`.
- Uploading Files with Multer.
- Running Cron Jobs (node-cron).
- Logging with Winston & Morgan.
- OAuth2 and Social Login (Google, GitHub, Facebook).
- Rate Limiting with express-rate-limit.
- Caching with Redis.
- Full text search.
- Role-Based Access Control (RBAC).
- Access Control Lists (ACLs).
- Session Management (express-session, connect-mongo).
- Single Active Session Restriction.
- Real-time features with WebSockets.
- Deployment to cloud platforms.


## Documents
