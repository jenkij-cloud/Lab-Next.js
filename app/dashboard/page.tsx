import { getMessages } from '@/lib/messages';
import LogoutButton from '@/components/LogoutButton';

export const dynamic = 'force-dynamic'; // ← บังคับให้ render ใหม่ทุกครั้ง ไม่ cache

export default async function DashboardPage() {
 const messages = await getMessages(); // Server Component — เรียก Model ตรงได้
 
 return (
 <main className="p-8">
 <div className="flex justify-between items-center mb-4">
 <h1 className="text-2xl font-bold text-blue-900">Dashboard </h1>
 <LogoutButton />
 </div>
 <p className="text-gray-700 mb-6">จํานวนข้อความที่ได้รับ: <span className="font-bold text-blue-600">{messages.length}</span></p>

 <h2 className="text-xl font-bold mb-3 text-blue-800">รายการติดต่อที่เข้ามา</h2>
 {messages.length === 0 ? (
 <p className="text-gray-400 italic">ยังไม่มีข้อความ</p>
 ) : (
 <div className="grid gap-4">
 {messages.map((msg) => (
 <div key={msg.id} className="bg-white border border-gray-200 rounded-lg p-5 shadow-sm hover:shadow-md transition-shadow">
 <div className="flex justify-between items-start mb-2">
 <h3 className="font-bold text-blue-800">{msg.name}</h3>
 <span className="text-xs text-gray-400">{new Date(msg.createdAt).toLocaleString('th-TH')}</span>
 </div>
 <p className="text-sm text-gray-500 mb-2">📧 {msg.email}</p>
 <p className="text-gray-700 bg-gray-50 p-3 rounded">{msg.message}</p>
 </div>
 ))}
 </div>
 )}
 </main>
 );
}
