import { changePassword } from '@/lib/users';
import { withErrorHandling } from '@/lib/withErrorHandling';

function getSessionUserId(request: Request): string | null {
    const cookieHeader = request.headers.get('cookie') ?? '';
    const match = cookieHeader.match(/(?:^|;\s*)session=([^;]+)/);
    return match ? decodeURIComponent(match[1]) : null;
}

export const POST = withErrorHandling(async (request: Request) => {
    // อ่าน userId จาก session cookie (ไม่ใช่จาก request body) เพื่อป้องกัน IDOR
    const sessionUserId = getSessionUserId(request);
    const body = await request.json();
    const result = await changePassword(sessionUserId, body);
    return Response.json(result, { status: 200 });
});
