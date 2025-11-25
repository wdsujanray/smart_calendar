Develop By: wdsujanray
Website: https://sujanchandraray.netlify.app
Support Email: sujanray1435@gmail.com
Developer Name: Sujan Chandra Ray
# smart_calendar
Smart Calendar with Interval Scheduling Algorithm
# Smart Calendar - Intelligent Event Management System 🗓️

A comprehensive smart calendar application with advanced interval scheduling algorithm to prevent event overlaps and optimize time management.

![Smart Calendar](https://img.shields.io/badge/Smart-Calendar-brightgreen)
![PHP](https://img.shields.io/badge/PHP-7.4+-blue)
![MySQL](https://img.shields.io/badge/MySQL-5.7+-orange)
![JavaScript](https://img.shields.io/badge/JavaScript-ES6+-yellow)

## 🌟 Live Demo
🚀 [Try Smart Calendar Live](https://yourdomain.com)  
*(Replace with your actual deployment URL)*

## 📸 Screenshots

| Dashboard | Calendar View | Event Management |
|-----------|---------------|------------------|
| ![Dashboard](screenshots/dashboard.png) | ![Calendar](screenshots/calendar.png) | ![Events](screenshots/events.png) |

## ✨ Key Features

### 🎯 Smart Scheduling
- **Interval Scheduling Algorithm** - Prevents event overlaps automatically
- **Conflict Detection** - Real-time time slot conflict identification
- **Optimal Slot Suggestions** - Intelligent recommendations for available time slots
- **Multi-Event Support** - Multiple events per day with proper time management

### 👥 User Management
- **User Registration & Login** - Secure authentication system
- **Personalized Profiles** - Custom user profiles with photo uploads
- **Event Ownership** - Users can only manage their own events
- **Preferences** - Customizable notification and display settings

### 📅 Calendar Features
- **Multiple Views** - Month, Week, and List views
- **Event Categories** - Festival, National Holiday, Religious, Cultural, Personal
- **System Events** - Pre-loaded festivals and holidays (2024-2050)
- **Quick Add** - One-click event creation from calendar

### 🤖 AI Assistant
- **Intelligent Chatbot** - "Ana/Anova" AI assistant for event planning
- **Smart Suggestions** - Event planning and scheduling recommendations
- **Conflict Resolution** - Help with resolving scheduling conflicts

### 🎨 User Experience
- **Responsive Design** - Works perfectly on desktop, tablet, and mobile
- **Modern UI/UX** - Clean, intuitive interface with smooth animations
- **Real-time Updates** - Instant synchronization across all views
- **Visual Indicators** - Color-coded events and conflict warnings

## 🚀 Quick Start

### Prerequisites
- Web server (Apache/Nginx)
- PHP 7.4 or higher
- MySQL 5.7 or higher
- Modern web browser

### Installation Steps

1. **Clone the Repository**
   ```bash
   git clone https://github.com/yourusername/smart_calendar.git
   cd smart_calendar
   # Method 1: Import SQL file
mysql -u your_username -p your_database < smart_calendar.sql

# Method 2: Use setup script
php setup_database.php

3. Configuration
// Update db_connection.php with your credentials
define('DB_SERVER', 'localhost');
define('DB_USERNAME', 'your_username');
define('DB_PASSWORD', 'your_password');
define('DB_NAME', 'your_database');

4. File Permissions
chmod 755 uploads/
chmod 644 *.php
🏗️ Project Structure
smart_calendar/
├── 📁 css/                    # Stylesheets
├── 📁 js/                     # JavaScript modules
├── 📁 php/                    # Backend PHP API
├── 📁 uploads/                # User uploaded files
├── 📁 screenshots/            # Project screenshots
│
├── 🔧 db_connection.php       # Database configuration
├── 🔧 smart_calendar.sql      # Database schema
├── 🔧 setup_database.php      # Database initialization
│
├── 🎯 index.html             # Main application
├── 🎯 login.php              # Authentication handler
├── 🎯 register.php           # User registration
├── 🎯 save_event.php         # Event management API
├── 🎯 get_events.php         # Events retrieval API
├── 🎯 delete_event.php       # Event deletion API
├── 🎯 update_profile.php     # Profile management
│
├── 📄 README.md              # Project documentation
├── 📄 package.json           # Dependencies (if any)
└── 📄 deploy.sh              # Deployment script

🔧 API Endpoints
Endpoint	Method	Description
/login.php	POST	User authentication
/register.php	POST	User registration
/save_event.php	POST	Create/update events
/get_events.php	GET	Retrieve user events
/delete_event.php	POST	Delete events
/update_profile.php	POST	Update user profile
/update_photo.php	POST	Upload profile photo
/get_system_events.php	GET	Get system events
💾 Database Schema
Main Tables
users - User accounts and profiles

events - User-created events

system_events - Pre-loaded festivals and holidays

user_preferences - User settings and preferences

🧠 Interval Scheduling Algorithm
The core intelligence of Smart Calendar:

javascript
// Example of conflict detection
function hasTimeOverlap(newEvent, existingEvents) {
    const newStart = new Date(`${newEvent.date}T${newEvent.startTime}`);
    const newEnd = new Date(`${newEvent.endDate}T${newEvent.endTime}`);
    
    return existingEvents.some(existingEvent => {
        const existingStart = new Date(`${existingEvent.date}T${existingEvent.startTime}`);
        const existingEnd = new Date(`${existingEvent.endDate}T${existingEvent.endTime}`);
        
        return newStart < existingEnd && newEnd > existingStart;
    });
}
🎨 Customization
Adding New Event Categories
javascript
// In your event form
const categories = [
    'festival', 'national', 'religious', 
    'cultural', 'personal', 'business', 'meeting'
];
Modifying Color Scheme
css
: root {
    --primary: #138808;    /* Green */
    --secondary: #ff9933;  /* Orange */
    --accent: #9c27b0;     /* Purple */
    --danger: #ef4444;     /* Red */
}
🚀 Deployment
Manual Deployment
Upload all files to your web server

Import database schema

Configure database connection

Set proper file permissions

Using Deployment Script
bash
chmod +x deploy.sh
./deploy.sh
🐛 Troubleshooting
Common Issues
Database Connection Error

bash
# Check MySQL service
sudo systemctl status mysql
# Verify credentials in db_connection.php
File Upload Issues

bash
# Set proper permissions
chmod 755 uploads/
# Check PHP upload limits in php.ini
JavaScript Errors

Check browser console (F12)

Ensure all files are loaded properly

Verify PHP endpoints are accessible

Debug Mode
Enable debug mode in db_connection.php:

php
define('DEBUG_MODE', true);
🤝 Contributing
We welcome contributions! Please follow these steps:

Fork the repository

Create a feature branch (git checkout -b feature/AmazingFeature)

Commit your changes (git commit -m 'Add some AmazingFeature')

Push to the branch (git push origin feature/AmazingFeature)

Open a Pull Request

Development Guidelines
Follow existing code style

Add comments for complex logic

Test thoroughly before submitting

Update documentation as needed

📄 License
This project is licensed under the MIT License - see the LICENSE file for details.

🙏 Acknowledgments
Font Awesome for beautiful icons

Unsplash for stock images

Modern CSS techniques and layouts

PHP Community for robust backend solutions

📞 Support
📧 Email: sujanray1435@gmail.com
📧 Email: suchar@mirgonj.com

🐛 Issues: GitHub Issues

💬 Discussions: GitHub Discussions

🔮 Future Enhancements
Mobile app development

Calendar sharing features

Advanced analytics

Integration with external calendars

Recurring events support

Email notifications

Multi-language support
