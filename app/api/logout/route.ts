export async function POST() {
 const res = Response.json({ ok: true });
 // ลบ cookie session โดยตั้ง Max-Age=0
 res.headers.set('Set-Cookie', 'session=; Path=/; HttpOnly; Max-Age=0');
 return res;
}
