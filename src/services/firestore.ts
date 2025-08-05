import { 
  collection, 
  doc, 
  getDocs, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where, 
  orderBy,
  serverTimestamp 
} from 'firebase/firestore';
import { db } from '../config/firebase';
import { Task, Subtask } from '../types';

// Collection names
const TASKS_COLLECTION = 'tasks';
const USERS_COLLECTION = 'users';

// Helper function to get user's tasks collection reference
const getUserTasksRef = (userId: string) => {
  return collection(db, USERS_COLLECTION, userId, TASKS_COLLECTION);
};

// Helper function to get a specific task document reference
const getTaskDocRef = (userId: string, taskId: string) => {
  return doc(db, USERS_COLLECTION, userId, TASKS_COLLECTION, taskId);
};

export interface FirestoreTask extends Omit<Task, 'id'> {
  userId: string;
  createdAt: any;
  updatedAt: any;
}

export interface FirestoreSubtask extends Subtask {
  createdAt: any;
}

// Task CRUD operations
export const firestoreService = {
  // Get all tasks for a user
  async getUserTasks(userId: string): Promise<Task[]> {
    try {
      const tasksRef = getUserTasksRef(userId);
      const querySnapshot = await getDocs(tasksRef);
      
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Task[];
    } catch (error) {
      console.error('Error fetching user tasks:', error);
      throw error;
    }
  },

  // Add a new task
  async addTask(userId: string, taskData: Omit<Task, 'id'>): Promise<string> {
    try {
      const tasksRef = getUserTasksRef(userId);
      
      // Filter out undefined values
      const cleanTaskData = Object.fromEntries(
        Object.entries(taskData).filter(([_, value]) => value !== undefined)
      );
      
      const taskWithMetadata = {
        ...cleanTaskData,
        userId,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      } as Omit<FirestoreTask, 'id'>;
      
      const docRef = await addDoc(tasksRef, taskWithMetadata);
      return docRef.id;
    } catch (error) {
      console.error('Error adding task:', error);
      throw error;
    }
  },

  // Update a task
  async updateTask(userId: string, taskId: string, taskData: Partial<Task>): Promise<void> {
    try {
      const taskRef = getTaskDocRef(userId, taskId);
      
      // Filter out undefined values
      const cleanTaskData = Object.fromEntries(
        Object.entries(taskData).filter(([_, value]) => value !== undefined)
      );
      
      await updateDoc(taskRef, {
        ...cleanTaskData,
        updatedAt: serverTimestamp()
      });
    } catch (error) {
      console.error('Error updating task:', error);
      throw error;
    }
  },

  // Delete a task
  async deleteTask(userId: string, taskId: string): Promise<void> {
    try {
      const taskRef = getTaskDocRef(userId, taskId);
      await deleteDoc(taskRef);
    } catch (error) {
      console.error('Error deleting task:', error);
      throw error;
    }
  },

  // Get tasks by date
  async getTasksByDate(userId: string, date: string): Promise<Task[]> {
    try {
      const tasksRef = getUserTasksRef(userId);
      const q = query(
        tasksRef, 
        where('date', '==', date)
      );
      const querySnapshot = await getDocs(q);
      
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Task[];
    } catch (error) {
      console.error('Error fetching tasks by date:', error);
      throw error;
    }
  },

  // Get urgent tasks
  async getUrgentTasks(userId: string): Promise<Task[]> {
    try {
      const tasksRef = getUserTasksRef(userId);
      const q = query(
        tasksRef, 
        where('isUrgent', '==', true)
      );
      const querySnapshot = await getDocs(q);
      
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Task[];
    } catch (error) {
      console.error('Error fetching urgent tasks:', error);
      throw error;
    }
  }
}; 