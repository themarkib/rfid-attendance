# RFID Attendance System

This project is an RFID attendance system developed using Node.js, React.js, MySQL, Arduino Uno, RFID Module, and NodeMCU. The system allows for easy tracking and management of attendance using RFID cards.

## Table of Contents

- [Introduction](#introduction)
- [Features](#features)
- [Architecture](#architecture)
- [Requirements](#requirements)
- [Setup](#setup)
  - [Backend Setup](#backend-setup)
  - [Frontend Setup](#frontend-setup)
  - [Hardware Setup](#hardware-setup)
- [Demo](#demo)
- [Usage](#usage)
- [License](#license)

## Introduction

The RFID Attendance System is designed to simplify attendance tracking in schools, offices, or any place where monitoring attendance is necessary. It uses RFID cards to mark attendance and stores the data in a MySQL database, which can be accessed and managed through a web interface.

## Features

- RFID card-based attendance marking
- User-friendly web interface for managing attendance records
- Responsive design for web interface
- Real-time data updating
- Secure and reliable data storage

## Architecture

The system architecture includes the following components:

- **Arduino Uno**: Reads RFID card data.
- **RFID Module**: Scans RFID cards.
- **NodeMCU**: Sends RFID data to the server.
- **Node.js Backend**: Handles data processing and storage.
- **React.js Frontend**: Provides a user interface for managing attendance records.
- **MySQL Database**: Stores attendance data.

## Requirements

- Node.js
- MySQL
- Arduino IDE
- React.js
- Arduino Uno
- RFID Module
- NodeMCU
- RFID Cards

## Setup

### Backend Setup

1. Clone the repository:
   ```
   git clone https://github.com/themarkib/rfid-attendance
   cd rfid-attendance
2. Install backend dependencies:
    ```
    cd backend
    npm install
3. Set up the MySQL database:
    - Create a database named rfid_mysql
    - Import the database schema from the rfid_mysql.sql file:
    ```
    mysql -u yourusername -p rfid_attendance < rfid_mysql.sql
4.  Start the backend server:
    ```
    npm start

### Frontend Setup
1. Install frontend dependencies:
    ```
    cd frontend
    npm install
2. Start the frontend development server:
    ```
    npm start
### Hardware Setup
1. Connect the RFID Module to the Arduino Uno.
2. Upload the Arduino sketch from the arduino directory to the Arduino Uno.
3. Connect the NodeMCU to the Arduino Uno for communication.
4. Upload the NodeMCU sketch from the nodemcu directory to the NodeMCU.

### Demo
Here are some screenshots  of the RFID Attendance System in action:

#### Screenshots

- Dashboard
![image](https://github.com/user-attachments/assets/fa16f195-f416-495b-9fa7-7a0e40267251)

- Users
![image](https://github.com/user-attachments/assets/18bef003-97b6-4955-af3d-58f64596925e)

- Add User Section:
![image](https://github.com/user-attachments/assets/8d849885-76c9-41c7-8ac2-c5a56dec4a68)

- Manage User Section 
![image](https://github.com/user-attachments/assets/45a8e224-5bcc-4bdf-88b5-1ae00816e0ef)


### Usage
1. Ensure all hardware components are connected and powered on.
2. Open the web interface in your browser and start scanning cards:
    ```
    http://localhost:3000
3. Use the interface to manage attendance records.
    ```
    http://localhost:5000 (your reactserver )
    ```
### License
Feel free to customize and use in your project.






