import * as TodoModel from './todos';
import { ValidationError, NotFoundError } from './errors';
import { Prisma } from '@prisma/client';

export async function createTodo(data: { title: string; completed?: boolean }) {
    if (!data.title || data.title.trim() === '') {
        throw new ValidationError('ชื่องานห้ามเป็นค่าว่าง');
    }
    return await TodoModel.addTodo(data);
}

export async function listTodos() {
    return await TodoModel.getTodos();
}

export async function getTodoById(id: string) {
    const todos = await TodoModel.getTodos();
    const todo = todos.find((t) => t.id === id);
    if (!todo) {
        throw new NotFoundError('ไม่พบงานที่ต้องทำนี้');
    }
    return todo;
}

export async function editTodo(id: string, updates: Partial<{ title: string; completed: boolean }>) {
    if (updates.title !== undefined && updates.title.trim() === '') {
        throw new ValidationError('ชื่องานห้ามเป็นค่าว่าง');
    }
    try {
        return await TodoModel.updateTodo(id, updates);
    } catch (err) {
        if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === 'P2025') {
            throw new NotFoundError('ไม่พบงานที่ต้องทำนี้');
        }
        throw err;
    }
}

export async function removeTodo(id: string) {
    try {
        await TodoModel.deleteTodo(id);
        return true;
    } catch (err) {
        if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === 'P2025') {
            throw new NotFoundError('ไม่พบงานที่ต้องทำนี้');
        }
        throw err;
    }
}
