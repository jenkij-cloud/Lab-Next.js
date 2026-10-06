// lib/commentService.ts
import { cleanRichText } from './sanitize';
import { prisma } from './prisma';
import { createCommentSchema, updateCommentSchema } from './schemas';
import { ZodError } from 'zod';
import { ValidationError, NotFoundError, ForbiddenError } from './errors';

export async function createComment(raw: unknown, sessionUserId?: string | null) {
    let data;
    try {
        data = createCommentSchema.parse(raw);
    } catch (err) {
        if (err instanceof ZodError) throw new ValidationError(err.issues[0].message);
        throw err;
    }

    // XSS Prevention: ตัด <script>, onerror= ทิ้งก่อนเก็บลงฐานข้อมูลเสมอ
    const safeText = cleanRichText(data.text);

    return prisma.comment.create({
        data: {
            postId: data.postId,
            author: data.author,
            authorId: sessionUserId ?? null,
            text: safeText,
        },
    });
}

export async function getCommentsByPost(postId: string) {
    return prisma.comment.findMany({
        where: { postId },
        orderBy: { createdAt: 'desc' },
    });
}

export async function getCommentById(id: string) {
    const comment = await prisma.comment.findUnique({
        where: { id },
    });
    if (!comment) {
        throw new NotFoundError('ไม่พบความคิดเห็นนี้');
    }
    return comment;
}

export async function editComment(id: string, rawUpdates: unknown, sessionUserId: string | null | undefined) {
    const comment = await getCommentById(id);

    // Authorization: เจ้าของคอมเมนต์เท่านั้นที่แก้ไขได้
    if (!sessionUserId || comment.authorId !== sessionUserId) {
        throw new ForbiddenError('คุณไม่มีสิทธิ์แก้ไขความคิดเห็นนี้');
    }

    let updates;
    try {
        updates = updateCommentSchema.parse(rawUpdates);
    } catch (err) {
        if (err instanceof ZodError) throw new ValidationError(err.issues[0].message);
        throw err;
    }

    // XSS Prevention: Sanitize ข้อความก่อน update เสมอ
    const safeText = cleanRichText(updates.text);

    return prisma.comment.update({
        where: { id },
        data: { text: safeText },
    });
}

export async function deleteComment(id: string, sessionUserId: string | null | undefined) {
    const comment = await getCommentById(id);

    // Authorization: เจ้าของคอมเมนต์เท่านั้นที่ลบได้
    if (!sessionUserId || comment.authorId !== sessionUserId) {
        throw new ForbiddenError('คุณไม่มีสิทธิ์ลบความคิดเห็นนี้');
    }

    await prisma.comment.delete({
        where: { id },
    });

    return true;
}
