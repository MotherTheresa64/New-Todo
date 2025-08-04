# Modern Todo Application

A beautiful, mobile-responsive todo application built with React, TypeScript, and Tailwind CSS. This application features a dark theme with gradient cards, task progress tracking, calendar view, and modern UI design.

## Features

- 🎨 **Modern Dark Theme** - Beautiful gradient cards and dark UI
- 📱 **Mobile Responsive** - Works perfectly on all device sizes
- 📊 **Task Progress Tracking** - Visual progress indicators and statistics
- 📅 **Calendar Integration** - Monthly calendar view with current day highlighting
- ⚡ **Real-time Updates** - Dynamic task management
- 🎯 **Urgent Tasks** - Priority task highlighting
- 📈 **Progress Visualization** - Circular and linear progress bars

## Screenshots

The application features:
- Header with user greeting and navigation icons
- Large featured task card with progress indicator
- Task progress section with multiple task cards
- Urgent tasks section with "Add new task" button
- Sidebar with calendar and today's tasks
- Mobile-responsive design that adapts to different screen sizes

## Getting Started

### Prerequisites

- Node.js (version 14 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd todo-app
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

4. Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

## Project Structure

```
src/
├── components/          # React components
│   ├── Header.tsx      # Application header
│   ├── TaskCard.tsx    # Reusable task card component
│   ├── TaskProgress.tsx # Task progress section
│   ├── UrgentTasks.tsx # Urgent tasks section
│   ├── Calendar.tsx    # Calendar component
│   └── TodaysTasks.tsx # Today's tasks component
├── data/
│   └── mockData.ts     # Mock data for demonstration
├── types/
│   └── index.ts        # TypeScript type definitions
├── App.tsx             # Main application component
├── index.tsx           # Application entry point
└── index.css           # Global styles and Tailwind CSS
```

## Technologies Used

- **React 18** - Modern React with hooks
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first CSS framework
- **Lucide React** - Beautiful icons
- **date-fns** - Date manipulation utilities

## Mobile Compatibility

The application is fully responsive and includes:

- **Flexible Grid Layout** - Adapts from 1 column on mobile to 4 columns on desktop
- **Touch-Friendly Buttons** - Proper sizing for mobile interaction
- **Readable Typography** - Optimized font sizes for mobile screens
- **Optimized Spacing** - Appropriate padding and margins for mobile
- **Smooth Animations** - Performance-optimized transitions

## Customization

### Colors and Themes

The application uses a dark theme with gradient cards. You can customize the colors by modifying:

- `tailwind.config.js` - Tailwind configuration
- `src/index.css` - Global styles
- Component-specific gradient classes

### Adding New Features

1. **New Task Types**: Extend the `Task` interface in `src/types/index.ts`
2. **Additional Components**: Create new components in `src/components/`
3. **Data Management**: Modify `src/data/mockData.ts` or integrate with a backend

## Available Scripts

- `npm start` - Runs the app in development mode
- `npm run build` - Builds the app for production
- `npm test` - Launches the test runner
- `npm run eject` - Ejects from Create React App (not recommended)

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is open source and available under the [MIT License](LICENSE). 