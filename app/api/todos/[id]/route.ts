import { getTodoById, editTodo, removeTodo } from '@/lib/todoService';
import { withErrorHandling } from '@/lib/withErrorHandling';

export const GET = withErrorHandling(async (
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) => {
    const { id } = await params;
    const todo = await getTodoById(id);
    return Response.json({ todo }, { status: 200 });
});

export const PATCH = withErrorHandling(async (
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) => {
    const { id } = await params;
    const updates = await request.json();
    const updated = await editTodo(id, updates);
    return Response.json({ ok: true, item: updated }, { status: 200 });
});

export const DELETE = withErrorHandling(async (
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) => {
    const { id } = await params;
    await removeTodo(id);
    return Response.json({ ok: true }, { status: 200 });
});
