import { createMessage, listMessages } from '@/lib/messageService';
import { withErrorHandling } from '@/lib/withErrorHandling';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search') ?? '';
    const sort = searchParams.get('sort'); // ?sort=newest หรือ ?sort=oldest

    const all = await listMessages();
    
    // 1. กรองข้อมูล (Filter)
    let result = search
        ? all.filter((m: any) => m.name.includes(search) || m.message.includes(search))
        : [...all];

    // 2. จัดเรียงข้อมูล (Sort)
    if (sort === 'newest') {
        result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    } else if (sort === 'oldest') {
        result.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
    }

    return Response.json({ messages: result });
}

export const POST = withErrorHandling(async (request: Request) => {
    const body = await request.json();
    const saved = await createMessage(body);
    return Response.json({ ok: true, item: saved }, { status: 201 });
});
