// app/api/comments/[id]/route.ts
import { editComment, deleteComment } from '@/lib/commentService';
import { withErrorHandling } from '@/lib/withErrorHandling';

function getSessionUserId(request: Request): string | null {
    const cookieHeader = request.headers.get('cookie') ?? '';
    const match = cookieHeader.match(/(?:^|;\s*)session=([^;]+)/);
    return match ? decodeURIComponent(match[1]) : null;
}

type Ctx = { params: Promise<{ id: string }> };

export const PATCH = withErrorHandling(async (request: Request, ctx) => {
    const { params } = ctx as Ctx;
    const { id } = await params;
    const sessionUserId = getSessionUserId(request);
    const body = await request.json();
    const updated = await editComment(id, body, sessionUserId);
    return Response.json({ ok: true, item: updated });
});

export const DELETE = withErrorHandling(async (request: Request, ctx) => {
    const { params } = ctx as Ctx;
    const { id } = await params;
    const sessionUserId = getSessionUserId(request);
    await deleteComment(id, sessionUserId);
    return Response.json({ ok: true, message: 'ลบความคิดเห็นสำเร็จ' });
});
