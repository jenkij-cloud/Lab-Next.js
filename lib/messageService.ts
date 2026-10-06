import * as MessageModel from './messages';
import { Prisma } from '@prisma/client';
import { messageSchema } from './schemas';
import { ZodError, z } from 'zod';
import { ValidationError, NotFoundError, ForbiddenError } from './errors';

export async function createMessage(raw: unknown) {
    let data;
    try {
        data = messageSchema.parse(raw);
    } catch (err) {
        if (err instanceof ZodError) throw new ValidationError(err.issues[0].message);
        throw err;
    }
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
    const message = messages.find((m) => m.id === id);
    if (!message) {
        throw new NotFoundError('ไม่พบข้อความนี้');
    }
    return message;
}

const updateMessageSchema = z.object({
    message: z.string().min(1, 'ข้อความห้ามเป็นค่าว่าง').max(1000).optional(),
});

export async function editMessage(id: string, updates: unknown, sessionUserId: string) {
    const message = await getMessageById(id); // throw NotFoundError ถ้าไม่พบ (มีอยู่แล้วจาก Week 9)
    if (message.authorId !== sessionUserId) {
        throw new ForbiddenError('คุณไม่มีสิทธิ์แก้ไขข้อความนี้');
    }
    let validatedUpdates: { message?: string };
    try {
        validatedUpdates = updateMessageSchema.parse(updates);
    } catch (err) {
        if (err instanceof ZodError) throw new ValidationError(err.issues[0].message);
        throw err;
    }
    try {
        return await MessageModel.updateMessage(id, validatedUpdates);
    } catch (err) {
        if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === 'P2025') {
            throw new NotFoundError('ไม่พบข้อความนี้');
        }
        throw err;
    }
}

export async function removeMessage(id: string) {
    return await MessageModel.deleteMessage(id);
}