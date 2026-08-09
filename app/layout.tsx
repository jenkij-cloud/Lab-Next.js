import Link from 'next/link';
import './globals.css';
import type { Metadata } from 'next';
import { cookies } from 'next/headers';
import LogoutButton from '@/components/LogoutButton';

export const metadata: Metadata = {
    title: { template: '%s | My Blog', default: 'My Blog' },
    description: 'บล็อกส่วนตัว สร้างด้วย Next.js + TypeScript',
};

export default async function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const cookieStore = await cookies();
    const isLoggedIn = !!cookieStore.get('session');

    return (
        <html lang="th">
            <body className="bg-gray-50 min-h-screen">
                <nav className="bg-blue-900 text-white px-8 py-4 flex items-center gap-6 shadow-lg">
                    <Link href="/" className="text-xl font-bold text-white hover:text-blue-300">
                        📝 My Blog
                    </Link>
                    <div className="flex gap-4 ml-4">
                        <Link href="/posts" className="hover:text-blue-300 transition-colors">บทความ</Link>
                        <Link href="/users" className="hover:text-blue-300 transition-colors">ผู้ใช้</Link>
                        <Link href="/contact" className="hover:text-blue-300 transition-colors">ติดต่อ</Link>
                        <Link href="/calculator" className="hover:text-blue-300 transition-colors">คำนวณราคา</Link>
                        <Link href="/blog-spa?source=products" className="hover:text-blue-300 transition-colors">Blog SPA</Link>
                        <Link href="/about" className="hover:text-blue-300 transition-colors">เกี่ยวกับ</Link>
                    </div>
                    <div className="ml-auto flex gap-3">
                        {isLoggedIn ? (
                            <>
                                <Link href="/dashboard" className="px-4 py-1.5 bg-blue-600 rounded hover:bg-blue-500 transition-colors text-sm flex items-center">
                                    Dashboard
                                </Link>
                                <LogoutButton className="px-4 py-1.5 border border-red-400 text-red-100 rounded hover:bg-red-500 hover:text-white transition-colors text-sm" />
                            </>
                        ) : (
                            <Link href="/login" className="px-4 py-1.5 border border-white rounded hover:bg-white hover:text-blue-900 transition-colors text-sm flex items-center">
                                เข้าสู่ระบบ
                            </Link>
                        )}
                    </div>
                </nav>
                <div className="max-w-4xl mx-auto py-8 px-4">
                    {children}
                </div>
                <footer className="text-center py-6 text-gray-400 text-sm border-t mt-8">
                    <p>© 2026 My Blog — สร้างด้วย Next.js + TypeScript</p>
                    <p className="mt-1">0214321 Web App Design & Development</p>
                </footer>
            </body>
        </html>
    );
}