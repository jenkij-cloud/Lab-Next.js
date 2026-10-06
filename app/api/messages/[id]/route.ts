import { editMessage, removeMessage } from '@/lib/messageService';
import { withErrorHandling } from '@/lib/withErrorHandling';

export function getSessionUserId(request: Request): string {
    const cookieHeader = request.headers.get('cookie') ?? '';
    const match = cookieHeader.match(/(?:^|;\s*)session=([^;]+)/);
    return match ? decodeURIComponent(match[1]) : '';
}

type Ctx = { params: Promise<{ id: string }> };

export const PATCH = withErrorHandling(async (request: Request, ctx) => {
    const { params } = ctx as Ctx;
    const { id } = await params;
    const sessionUserId = getSessionUserId(request); // อ่าน cookie session
    const updates = await request.json();
    const updated = await editMessage(id, updates, sessionUserId);
    return Response.json({ ok: true, item: updated });
});

export const DELETE = withErrorHandling(async (request: Request, ctx) => {
    const { params } = ctx as Ctx;
    const { id } = await params;
    const deleted = await removeMessage(id);
    if (!deleted) {
        return Response.json({ error: 'ไม่พบข้อความนี้' }, { status: 404 });
    }
    return Response.json({ ok: true }, { status: 200 });
});
