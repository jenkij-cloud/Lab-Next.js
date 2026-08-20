type Handler = (req: Request, ctx: any) => Promise<Response>;

export function withErrorHandling(handler: Handler): Handler {
    return async (req, ctx) => {
        try {
            return await handler(req, ctx);
        } catch (err) {
            console.error('API Error:', err);
            const status = (err as any).status ?? 500; // ← อ่าน status จาก Custom Error
            return Response.json({ error: (err as Error).message }, { status });
        }
    };
}
