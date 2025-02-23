# MonkSpaceAI - Employee Shift Management System

## Overview
MonkSpaceAI is a modern web application designed to streamline employee shift management and scheduling. The system provides separate interfaces for administrators and employees, allowing efficient shift planning and availability management.

## Business Features

### For Admins
- View employee availability in an intuitive dashboard
- Assign shifts to available employees

### For Employees
- Submit availability preferences
- View assigned shifts
- Minimum 4-hour availability blocks
- Personal dashboard with schedule overview

## Technology Stack

### Frontend
- React.js
- React Router for navigation
- JWT for authentication
- Modern responsive design
- Custom styling with inline CSS

### Backend Integration
- RESTful API integration (using node/express js)
- JWT token-based authentication
- Real-time data synchronization by using MongoDB
- Timezone support using Moment.js

## Components

### Core Components
1. **Home** (`Home.js`)
   - Landing page with login/register options
   - Clean, minimalist interface

2. **Authentication** (`Login.js`, `Register.js`)
   - User registration with role selection
   - Secure login system
   - Role-based access control

3. **Admin Dashboard** (`AdminDash.js`)
   - Employee availability overview
   - Shift assignment interface
   - Weekly schedule management

4. **Employee Dashboard** (`EmployeeDash.js`)
   - Availability submission
   - Shift schedule view
   - Time constraint validation

5. **Navigation** (`Navbar.js`)
   - Role-based navigation
   - Session management
   - Logout functionality

## Installation

1. Clone the repository:
```bash
git clone https://github.com/BhavyaAnand0911/MonkSpaceAI.git
```

2. Install dependencies:
```bash
cd MonkSpaceAI/frontend
npm install

cd MonSpaceAI/backend
npm install
```

3. Start the development server:
```bash
npm start

node index.js
```

## Usage

### Admin
1. Login with admin credentials
2. View employee availability on the dashboard
3. Create and assign shifts based on availability
4. Monitor weekly schedules

### Employee
1. Login with employee credentials
2. Submit availability for upcoming days
3. View assigned shifts
4. Check current schedule

## Key Features

### Availability Management
- Minimum 4-hour availability blocks
- 7-day advance scheduling
- Real-time updates
- Timezone support

### Shift Assignment
- Conflict prevention
- Availability verification
- Instant confirmation
- Schedule overview

## Development Guidelines

### Code Structure
- Component-based three-tier architecture 
- Separate routing logic
- Consistent styling approach
- Deployment grade file structure and code structure 

## Security Features
- JWT-based authentication 
- Role-based access control
- Secure password handling by hashing 

## Working
### API Endpoints
- Registering the user hits the /api/auth/register route to register the user
- Login page hits the /api/auth/login route
### Admin Dashboard
- admin details are fetched using api/admin/profile endpoint
- employee availability is fetched by hitting api/admin/availabilit endpoint
- Shifts are created by sending a POST request on api/admin/shifts endpoint
### Employee Dashboard
- Assigned shifts are fetched by hitting api/employee/shifts?userId=${userId} endpoint
- Added availabilities are fetched by hitting api/employee/availability/user/${userId} endpoint
- New availabilities are added by sending a POST request on api/employee/availability endpoint

## Project Demo
### Home page
![image](https://github.com/user-attachments/assets/c3cfc8ca-2b58-49ca-939c-9bf3ac472c57)
### Register page
![image](https://github.com/user-attachments/assets/a546cca7-7a6e-44b1-866a-ba7c615895a2)
### Login page
![image](https://github.com/user-attachments/assets/dd9f562b-caf3-4a31-b34e-fcce898e541c)
### Admin Dashboard
![image](https://github.com/user-attachments/assets/c85d404f-196c-4d80-b505-0ead7f944d81)
### Employee Dashboard
![image](https://github.com/user-attachments/assets/0902e87d-2ebd-4d82-a81a-274b2553ebe3)

