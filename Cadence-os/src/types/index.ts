export type NavView = 'dashboard' | 'calendar' | 'task' | 'courses' | 'import';

export interface Course {
    id: string;
    code: string;
    name: string;
    color: string;
    instructor?: string;
    location?: string;
    meetings: {
        dayOfWeek: number;
        startTime: string;
        endTime: string;
    } [];
}

export interface Task {
    id: string;
    courseId?: string;
    title: string;
    dueDate: string;
    status: 'todo' | 'in_progress' | 'completed';
    type: 'assigment' | 'exam' | 'quiz' | 'reminder';
}

export interface SmartReader {
    id: string;
    title: string;
    triggerDate: string; // YYYY-MM-DD
    isCompleted: boolean;
    isAutoFenerated?: boolean;
}