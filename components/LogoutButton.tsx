'use client';

export default function LogoutButton({ className }: { className?: string }) {
 async function handleLogout() {
 await fetch('/api/logout', { method: 'POST' });
 // ใช้ window.location.href เพื่อบังคับให้โหลดหน้าใหม่ทั้งหมด (ให้ Server Component layout.tsx เห็นว่า cookie หายไปแล้ว)
 window.location.href = '/login'; 
 }

 return (
 <button
 onClick={handleLogout}
 className={className || "px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors text-sm"}
 >
 ออกจากระบบ
 </button>
 );
}
