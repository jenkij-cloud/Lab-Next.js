import { prisma } from './prisma';

export async function addTodo(data: { title: string; completed?: boolean }) {
    return prisma.todo.create({
        data: {
            title: data.title,
            completed: data.completed ?? false,
        },
    });
}

export async function getTodos() {
    return prisma.todo.findMany({
        orderBy: { createdAt: 'desc' },
    });
}

export async function updateTodo(id: string, updates: Partial<{ title: string; completed: boolean }>) {
    return prisma.todo.update({
        where: { id },
        data: updates,
    });
}

export async function deleteTodo(id: string) {
    return prisma.todo.delete({
        where: { id },
    });
}
