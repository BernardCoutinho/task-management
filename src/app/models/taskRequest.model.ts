export interface TaskRequest {
    id?: number;
    title: string;
    description: string;
    completed: boolean;
    userId?: number;
}