# Student Manager CRUD Application

A modern Single Page Application (SPA) for managing student records with authentication and role-based access control.

## Features

- 🔐 **Authentication System** with role-based access (Admin/User)
- 👥 **Complete CRUD Operations** for student management
- 🆔 **Sequential ID System** starting from 0
- 🎨 **Modern UI** with responsive design
- 🚨 **SweetAlert2 Integration** for user feedback
- 📊 **Data Validation** and error handling
- 🔍 **Search and Filter** capabilities
- 📤 **Export to CSV** functionality

## Tech Stack

- **Frontend**: Vanilla JavaScript (ES6+), HTML5, CSS3
- **Build Tool**: Vite
- **Backend**: JSON Server (Mock API)
- **UI Library**: SweetAlert2
- **Architecture**: SPA with modular services

## Installation

1. Clone the repository
2. Install dependencies:
   \`\`\`bash
   npm install
   \`\`\`

## Development

Start both the JSON server and Vite dev server:
\`\`\`bash
npm start
\`\`\`

Or run them separately:
\`\`\`bash
# Start JSON server (port 3000)
npm run server

# Start Vite dev server (port 5173)
npm run dev
\`\`\`

## Build

Build for production:
\`\`\`bash
npm run build
\`\`\`

Preview production build:
\`\`\`bash
npm run preview
\`\`\`

## Default Credentials

- **Administrator**: 
  - Username: `admin`
  - Password: `admin123`
  - Access: Full CRUD operations

- **Regular User**: 
  - Username: `user`
  - Password: `user123`
  - Access: Read-only access

## Project Structure

\`\`\`
├── index.html          # Main HTML file
├── script.js           # Main application logic
├── services.js         # CRUD services and API calls
├── style.css           # Styles
├── db.json            # JSON Server database
├── users.html         # Users list template
├── newuser.html       # User form template
├── about.html         # About page template
├── package.json       # Dependencies and scripts
├── vite.config.js     # Vite configuration
└── README.md          # Documentation
\`\`\`

## API Endpoints

- `GET /users` - Get all users
- `GET /users/:id` - Get user by ID
- `POST /users` - Create new user
- `PUT /users/:id` - Update user
- `DELETE /users/:id` - Delete user

## User Roles

### Administrator
- View all students
- Create new students
- Edit existing students
- Delete students
- Access to all navigation items

### Regular User
- View students list only
- No create/edit/delete permissions
- Limited navigation access

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

MIT License
