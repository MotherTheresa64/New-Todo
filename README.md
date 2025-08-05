# Modern Todo Application

A beautiful, mobile-compatible todo application built with React, TypeScript, and Tailwind CSS.

## Features

- 📱 **Mobile-First Design** - Fully responsive across all devices
- 📅 **Interactive Calendar** - Click dates to filter tasks
- ✅ **Subtasks System** - Break down tasks into manageable steps
- 🚨 **Urgent Tasks** - Flag important tasks with priority indicators
- 🎨 **Modern UI** - Clean, intuitive interface with smooth animations
- 📊 **Progress Tracking** - Visual progress indicators for task completion
- 🔄 **Real-time Updates** - Instant task management and status changes

## Tech Stack

- **React 18** - Modern React with hooks
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first styling
- **Lucide React** - Beautiful icons
- **date-fns** - Date manipulation utilities

## Getting Started

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/MotherTheresa64/New-Todo.git
cd New-Todo
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Connect your repository to [Vercel](https://vercel.com)
3. Deploy automatically with zero configuration

### Manual Build

```bash
npm run build
```

The build folder will contain your production-ready application.

## Usage

### Adding Tasks
- Click the "+" button to add a new task
- Set title, description, date due, and time
- Add subtasks to break down complex tasks
- Flag as urgent if needed

### Managing Tasks
- Click any task to edit it
- Toggle subtasks to track progress
- Mark tasks as urgent to move them to priority section
- Delete tasks when completed

### Calendar Navigation
- Click dates on the calendar to filter tasks
- View tasks specific to selected dates
- See urgent tasks with days remaining

## Project Structure

```
src/
├── components/     # Reusable UI components
├── hooks/         # Custom React hooks
├── types/         # TypeScript type definitions
├── data/          # Mock data and utilities
└── App.tsx        # Main application component
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

This project is open source and available under the [MIT License](LICENSE). 