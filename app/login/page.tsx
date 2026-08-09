'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setError('');
        const res = await fetch('/api/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password }),
        });

        if (!res.ok) { setError('เข้าสู่ระบบไม่สําเร็จ'); return; }
        window.location.href = '/dashboard'; // ← ใช้ full reload เพื่อให้ cookie ถูกส่งผ่าน middleware
    }

    return (
        <main className="p-8 max-w-sm">
            <h1 className="text-2xl font-bold mb-4">เข้าสู่ระบบ</h1>
            <form onSubmit={handleSubmit} className="space-y-3">
                <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="อีเมล"
                    className="border p-2 w-full rounded"
                />
                <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="รหัสผ่าน"
                    className="border p-2 w-full rounded"
                />
                {error && <p className="text-red-600 text-sm">{error}</p>}
                <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded w-full hover:bg-blue-700 transition">
                    ล็อกอิน
                </button>
            </form>
        </main>
    );
}
