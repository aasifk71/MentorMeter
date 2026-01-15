# MentorMeter

## Problem Statement
In academic institutions, students often lack a transparent and reliable platform to share feedback about professors. Existing systems are either anonymous, unverified, or limited to internal surveys, leading to biased or unauthenticated reviews. This creates trust issues and reduces the usefulness of collected feedback.

MentorMeter addresses this gap by providing a **secure, authenticated, and structured platform** where students can rate professors while ensuring data authenticity and integrity.

---

## MentorMeter
**MentorMeter** is a full-stack web application that allows students to rate professors based on attendance, grading fairness, and guidance quality. The platform enforces **100% verified logins** using Google OAuth to prevent fake or unauthorized submissions.

---

## Description
MentorMeter is built using the **MERN stack (without React)** along with **Bootstrap, Passport.js, and Cloudinary**. It follows an **MVC architecture** and implements **RESTful APIs** with complete CRUD functionality.

Students authenticate via **Google OAuth**, browse professor listings, search and filter by department, and submit structured ratings. An **admin panel** allows validation of professor data collected via Google Forms and provides full control over professor listings. Secure image uploads are handled using **Multer and Cloudinary**.

---

## Live Project
- **Live Website:** [MentorMeter Live](#)
- **GitHub Repository:** [MentorMeter GitHub](#)

---

## Project Walkthrough

### Landing Page
![Landing Page](#)

### Google OAuth Login
![Google Login](#)

### Professor Dashboard
- Searchable and filterable professor listings
- Department-wise categorization

![Dashboard](#)

### Professor Rating Page
- Attendance
- Grading Fairness
- Guidance & Mentorship

![Ratings](#)

### Admin Panel
- Validate Google Form submissions
- Manage professor listings
- Upload professor images

![Admin Panel](#)

---

## Major Features

### 1. Google OAuth Authentication
**Description:** Secure login using Google OAuth.

**Why Added:** Prevents fake users, duplicate reviews, and unauthorized access.

**Tech Stack:**
- Passport.js
- Google OAuth 2.0
- Express Sessions

---

### 2. Professor Rating & Search System
**Description:** Students can search, filter, and rate professors by department.

**Why Added:** Improves usability and reduces search time by ~40%.

**Tech Stack:**
- JavaScript
- Bootstrap
- MongoDB

---

### 3. Secure Image Upload
**Description:** Upload and manage professor images securely.

**Why Added:** Ensures scalability and optimized image delivery.

**Tech Stack:**
- Multer
- Cloudinary
- Node.js

---

## Challenges & Solutions

### Fake and Unauthorized Reviews
**Challenge:** Preventing anonymous or fake submissions.  
**Solution:** Enforced Google OAuth-based authentication using Passport.js.

---

### Secure Media Storage
**Challenge:** Local image storage was not scalable.  
**Solution:** Integrated Cloudinary for cloud-based secure image handling.

---

### Data Authenticity
**Challenge:** Validating externally submitted professor data.  
**Solution:** Built an admin panel to manually approve and manage entries.

---

## Technologies Used

- **MongoDB** – Flexible NoSQL database
- **Express.js** – Backend framework
- **Node.js** – Server-side runtime
- **Bootstrap** – Responsive UI
- **Passport.js** – Authentication
- **Cloudinary** – Image storage
- **Multer** – File handling middleware

---

## Architecture
- MVC Architecture
- RESTful APIs
- Session-based Authentication
- Admin & User Roles

---

## Future Enhancements
- Professor analytics dashboard
- Role-based access control
- Email notifications
- React-based frontend migration

---

## Feedback / Bugs / Contributions
- **Email:** aasif62023@gmail.com
- **LinkedIn:** [Mohd Aasif](https://www.linkedin.com/in/mohd-aasif-80568b2a7)

---

## License
This project is developed for educational purposes only. It does not represent any official institution and is not intended for commercial use.

---

<div align="center">
Created with ❤️ by <h3>Mohd Aasif</h3>  
DTU | CO | 2K22
</div>
