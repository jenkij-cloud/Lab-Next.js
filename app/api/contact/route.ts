import { createMessage, listMessages } from '@/lib/messageService';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search') ?? '';
    const sort = searchParams.get('sort'); // ?sort=newest หรือ ?sort=oldest

    const all = listMessages();
    
    // 1. กรองข้อมูล (Filter)
    let result = search
        ? all.filter((m) => m.name.includes(search) || m.message.includes(search))
        : [...all];

    // 2. จัดเรียงข้อมูล (Sort)
    if (sort === 'newest') {
        result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    } else if (sort === 'oldest') {
        result.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
    }

    return Response.json({ messages: result });
}

export async function POST(request: Request) {
    const body = await request.json();
    try {
        const saved = createMessage(body);
        return Response.json({ ok: true, item: saved }, { status: 201 });
    } catch (err) {
        return Response.json({ error: (err as Error).message }, { status: 400 });
    }
}
