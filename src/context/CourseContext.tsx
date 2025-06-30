import React, { createContext, useContext, ReactNode } from 'react';
import { Course, CourseItem, MCQAttempt, UserProgress } from '../types';
import { useLocalStorage } from '../hooks/useLocalStorage';

interface CourseContextType {
  courses: Course[];
  userProgress: UserProgress[];
  
  // Course management
  addCourse: (course: Omit<Course, 'id' | 'createdAt' | 'updatedAt' | 'items' | 'totalDuration'>) => string;
  updateCourse: (id: string, updates: Partial<Course>) => void;
  deleteCourse: (id: string) => void;
  getCourse: (id: string) => Course | undefined;
  
  // Course item management
  addCourseItem: (courseId: string, item: Omit<CourseItem, 'id' | 'courseId' | 'createdAt' | 'order'>) => void;
  updateCourseItem: (courseId: string, itemId: string, updates: Partial<CourseItem>) => void;
  deleteCourseItem: (courseId: string, itemId: string) => void;
  reorderCourseItems: (courseId: string, items: CourseItem[]) => void;
  
  // Progress tracking
  markItemComplete: (courseId: string, itemId: string) => void;
  recordMCQAttempt: (courseId: string, questionId: string, selectedOptions: string[], isCorrect: boolean) => void;
  getUserProgress: (courseId: string) => UserProgress | undefined;
  
  // File upload simulation
  uploadFile: (file: File) => Promise<string>;
}

const CourseContext = createContext<CourseContextType | undefined>(undefined);

export function CourseProvider({ children }: { children: ReactNode }) {
  const [courses, setCourses] = useLocalStorage<Course[]>('courses', []);
  const [userProgress, setUserProgress] = useLocalStorage<UserProgress[]>('userProgress', []);

  const addCourse = (courseData: Omit<Course, 'id' | 'createdAt' | 'updatedAt' | 'items' | 'totalDuration'>) => {
    const newCourse: Course = {
      ...courseData,
      id: crypto.randomUUID(),
      createdAt: new Date(),
      updatedAt: new Date(),
      items: [],
      totalDuration: 0,
    };
    setCourses(prev => [...prev, newCourse]);
    return newCourse.id;
  };

  const updateCourse = (id: string, updates: Partial<Course>) => {
    setCourses(prev => prev.map(course => 
      course.id === id 
        ? { ...course, ...updates, updatedAt: new Date() }
        : course
    ));
  };

  const deleteCourse = (id: string) => {
    setCourses(prev => prev.filter(course => course.id !== id));
    setUserProgress(prev => prev.filter(progress => progress.courseId !== id));
  };

  const getCourse = (id: string) => courses.find(course => course.id === id);

  const addCourseItem = (courseId: string, itemData: Omit<CourseItem, 'id' | 'courseId' | 'createdAt' | 'order'>) => {
    setCourses(prev => prev.map(course => {
      if (course.id === courseId) {
        const newItem: CourseItem = {
          ...itemData,
          id: crypto.randomUUID(),
          courseId,
          createdAt: new Date(),
          order: course.items.length,
        };
        
        const updatedItems = [...course.items, newItem];
        const totalDuration = updatedItems.reduce((sum, item) => sum + (item.duration || 0), 0);
        
        return {
          ...course,
          items: updatedItems,
          totalDuration,
          updatedAt: new Date(),
        };
      }
      return course;
    }));
  };

  const updateCourseItem = (courseId: string, itemId: string, updates: Partial<CourseItem>) => {
    setCourses(prev => prev.map(course => {
      if (course.id === courseId) {
        const updatedItems = course.items.map(item => 
          item.id === itemId ? { ...item, ...updates } : item
        );
        const totalDuration = updatedItems.reduce((sum, item) => sum + (item.duration || 0), 0);
        
        return {
          ...course,
          items: updatedItems,
          totalDuration,
          updatedAt: new Date(),
        };
      }
      return course;
    }));
  };

  const deleteCourseItem = (courseId: string, itemId: string) => {
    setCourses(prev => prev.map(course => {
      if (course.id === courseId) {
        const updatedItems = course.items.filter(item => item.id !== itemId);
        const totalDuration = updatedItems.reduce((sum, item) => sum + (item.duration || 0), 0);
        
        return {
          ...course,
          items: updatedItems,
          totalDuration,
          updatedAt: new Date(),
        };
      }
      return course;
    }));
  };

  const reorderCourseItems = (courseId: string, items: CourseItem[]) => {
    setCourses(prev => prev.map(course => {
      if (course.id === courseId) {
        const reorderedItems = items.map((item, index) => ({ ...item, order: index }));
        return {
          ...course,
          items: reorderedItems,
          updatedAt: new Date(),
        };
      }
      return course;
    }));
  };

  const markItemComplete = (courseId: string, itemId: string) => {
    setUserProgress(prev => {
      const existingProgress = prev.find(p => p.courseId === courseId);
      const course = getCourse(courseId);
      
      if (!course) return prev;
      
      if (existingProgress) {
        const updatedCompletedItems = existingProgress.completedItems.includes(itemId)
          ? existingProgress.completedItems
          : [...existingProgress.completedItems, itemId];
        
        const progressPercentage = (updatedCompletedItems.length / course.items.length) * 100;
        
        return prev.map(p => 
          p.courseId === courseId 
            ? { 
                ...p, 
                completedItems: updatedCompletedItems,
                progressPercentage,
                lastAccessedAt: new Date()
              }
            : p
        );
      } else {
        const newProgress: UserProgress = {
          courseId,
          completedItems: [itemId],
          mcqAttempts: [],
          lastAccessedAt: new Date(),
          progressPercentage: (1 / course.items.length) * 100,
        };
        return [...prev, newProgress];
      }
    });
  };

  const recordMCQAttempt = (courseId: string, questionId: string, selectedOptions: string[], isCorrect: boolean) => {
    setUserProgress(prev => {
      const existingProgress = prev.find(p => p.courseId === courseId);
      const newAttempt: MCQAttempt = {
        questionId,
        selectedOptions,
        isCorrect,
        attemptedAt: new Date(),
      };
      
      if (existingProgress) {
        return prev.map(p => 
          p.courseId === courseId 
            ? { 
                ...p, 
                mcqAttempts: [...p.mcqAttempts, newAttempt],
                lastAccessedAt: new Date()
              }
            : p
        );
      } else {
        const newProgress: UserProgress = {
          courseId,
          completedItems: [],
          mcqAttempts: [newAttempt],
          lastAccessedAt: new Date(),
          progressPercentage: 0,
        };
        return [...prev, newProgress];
      }
    });
  };

  const getUserProgress = (courseId: string) => {
    return userProgress.find(p => p.courseId === courseId);
  };

  const uploadFile = async (file: File): Promise<string> => {
    // Simulate file upload - in real app, this would upload to a server
    return new Promise((resolve) => {
      setTimeout(() => {
        const mockUrl = URL.createObjectURL(file);
        resolve(mockUrl);
      }, 1000);
    });
  };

  return (
    <CourseContext.Provider value={{
      courses,
      userProgress,
      addCourse,
      updateCourse,
      deleteCourse,
      getCourse,
      addCourseItem,
      updateCourseItem,
      deleteCourseItem,
      reorderCourseItems,
      markItemComplete,
      recordMCQAttempt,
      getUserProgress,
      uploadFile,
    }}>
      {children}
    </CourseContext.Provider>
  );
}

export function useCourses() {
  const context = useContext(CourseContext);
  if (context === undefined) {
    throw new Error('useCourses must be used within a CourseProvider');
  }
  return context;
}