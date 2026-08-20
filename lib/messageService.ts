import * as MessageModel from './messages';
import { Prisma } from '@prisma/client';

export async function createMessage(data: { name: string; email: string; message: string }) {
    if (!data.name || !data.email || !data.message) throw new Error('ข้อมูลไม่ครบ');
    try {
        return await MessageModel.addMessage(data);
    } catch (err) {
        if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === 'P2002') {
            throw new Error('อีเมลนี้ถูกใช้แล้ว');
        }
        throw err;
    }
}

export async function listMessages() {
    return await MessageModel.getMessages();
}

export async function getMessageById(id: string) {
    const messages = await MessageModel.getMessages();
    return messages.find((m) => m.id === id) ?? null;
}

export async function editMessage(id: string, updates: object) {
    try {
        return await MessageModel.updateMessage(id, updates);
    } catch (err) {
        if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === 'P2025') {
            return null; // ให้ Controller เดิมตอบ 404 เหมือน Week 8
        }
        throw err;
    }
}

export async function removeMessage(id: string) {
    return await MessageModel.deleteMessage(id);
}