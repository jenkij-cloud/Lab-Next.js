// app/api/comments/route.ts
import { createComment, getCommentsByPost } from '@/lib/commentService';
import { withErrorHandling } from '@/lib/withErrorHandling';

function getSessionUserId(request: Request): string | null {
    const cookieHeader = request.headers.get('cookie') ?? '';
    const match = cookieHeader.match(/(?:^|;\s*)session=([^;]+)/);
    return match ? decodeURIComponent(match[1]) : null;
}

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const postId = searchParams.get('postId') ?? '';
    const comments = await getCommentsByPost(postId);
    return Response.json({ comments });
}

export const POST = withErrorHandling(async (request: Request) => {
    const sessionUserId = getSessionUserId(request);
    const body = await request.json();
    const saved = await createComment(body, sessionUserId);
    return Response.json({ ok: true, item: saved }, { status: 201 });
});
