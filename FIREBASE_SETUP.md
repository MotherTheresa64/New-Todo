# Firebase Database Setup Guide

## Database Structure

Your Firebase Firestore database will have the following structure:

```
users/
  {userId}/
    tasks/
      {taskId}/
        - title: string
        - description: string
        - date: string (YYYY-MM-DD)
        - startTime: string (HH:MM)
        - endTime: string (HH:MM)
        - progress: number (0-100)
        - category: string
        - isUrgent: boolean
        - subtasks: array
          - id: string
          - title: string
          - completed: boolean
        - teamMembers: array (optional)
        - userId: string
        - createdAt: timestamp
        - updatedAt: timestamp
```

## Firebase Console Setup

### 1. Enable Firestore Database
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project: `purpletodo-2f042`
3. In the left sidebar, click **"Firestore Database"**
4. Click **"Create database"**
5. Choose **"Start in test mode"** (we'll add security rules later)
6. Select a location (choose the closest to your users)
7. Click **"Done"**

### 2. Set Up Security Rules
1. In Firestore Database, click the **"Rules"** tab
2. Replace the default rules with the content from `firestore.rules`
3. Click **"Publish"**

### 3. Enable Authentication Methods
1. In the left sidebar, click **"Authentication"**
2. Click **"Get started"**
3. Go to **"Sign-in method"** tab
4. Enable the following providers:
   - **Email/Password**: Click "Enable" and save
   - **Google**: Click "Enable", add your support email, and save

### 4. Configure Google Sign-In (Optional)
1. In Google provider settings, add your authorized domains
2. For local development, add: `localhost`
3. For production, add your domain (e.g., `your-app.vercel.app`)

## Database Indexes (Automatic)

Firestore will automatically create the following indexes when needed:
- `users/{userId}/tasks` collection with `date` field
- `users/{userId}/tasks` collection with `isUrgent` field
- `users/{userId}/tasks` collection with `createdAt` field

## Security Features

### User Isolation
- Each user can only access their own tasks
- Tasks are stored under `users/{userId}/tasks/{taskId}`
- Security rules ensure users can't access other users' data

### Authentication Required
- All database operations require authentication
- Unauthenticated users cannot read or write data
- Users can only access their own user document and tasks

## Data Validation

The app includes the following data validation:
- **Task Title**: Required, non-empty string
- **Date**: Required, valid date format (YYYY-MM-DD)
- **Progress**: Number between 0-100
- **Subtask Title**: Required, non-empty string
- **User ID**: Automatically set to current user's ID

## Testing the Setup

### 1. Test Authentication
1. Run the app locally: `npm start`
2. Try signing up with email/password
3. Try signing in with Google
4. Verify you can sign out

### 2. Test Database Operations
1. Create a new task
2. Edit an existing task
3. Add subtasks to a task
4. Mark subtasks as complete
5. Delete a task
6. Verify data persists after page refresh

### 3. Test User Isolation
1. Sign in with one account
2. Create some tasks
3. Sign out and sign in with a different account
4. Verify you don't see the other user's tasks

## Production Deployment

### 1. Update Security Rules
Before deploying to production, update the security rules to be more restrictive:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
      
      match /tasks/{taskId} {
        allow read, write: if request.auth != null && request.auth.uid == userId;
      }
    }
  }
}
```

### 2. Set Up Custom Domain (Optional)
1. In Authentication > Settings > Authorized domains
2. Add your production domain
3. Update Google OAuth settings if using Google sign-in

### 3. Monitor Usage
1. In Firebase Console, check **"Usage"** tab
2. Monitor read/write operations
3. Set up billing alerts if needed

## Troubleshooting

### Common Issues

1. **"Permission denied" errors**
   - Check that security rules are published
   - Verify user is authenticated
   - Ensure user ID matches document path

2. **"Missing or insufficient permissions"**
   - Check that Firestore is enabled
   - Verify authentication is working
   - Check browser console for detailed errors

3. **Data not persisting**
   - Check network connectivity
   - Verify Firestore is in the correct region
   - Check browser console for errors

4. **Google sign-in not working**
   - Verify Google provider is enabled
   - Check authorized domains include your domain
   - Ensure popup blockers are disabled

### Debug Mode
To enable debug logging, add this to your browser console:
```javascript
localStorage.setItem('firebase:debug', '*');
```

## Cost Optimization

### Firestore Pricing
- **Read operations**: $0.06 per 100,000 reads
- **Write operations**: $0.18 per 100,000 writes
- **Delete operations**: $0.02 per 100,000 deletes

### Optimization Tips
1. Use pagination for large task lists
2. Implement offline caching
3. Batch operations when possible
4. Use indexes efficiently

## Backup Strategy

### Automatic Backups
Firestore provides automatic backups, but you can also:
1. Export data manually from Firebase Console
2. Use Firebase Admin SDK for automated backups
3. Set up Cloud Functions for scheduled backups

This setup ensures your todo app is secure, scalable, and user-specific! 🚀 