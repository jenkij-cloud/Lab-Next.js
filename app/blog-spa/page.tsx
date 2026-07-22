'use client'; // ← บรรทัดแรกเสมอ
import { useState, useEffect, Suspense } from 'react';
import type { ExternalItem } from '@/lib/external';
import { useRouter, useSearchParams } from 'next/navigation';
function BlogSpaContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    
    // อ่านค่าเริ่มต้นจาก URL (?source=news&q=keyword&detail=3)
    const rawSource = searchParams.get('source');
    const validSources = ['products', 'news'];
    const isInvalidSource = rawSource !== null && !validSources.includes(rawSource);
    const initialSource = rawSource === 'news' ? 'news' : 'products';
    const initialQuery = searchParams.get('q') ?? '';
    const initialDetail = searchParams.get('detail') ?? null;

    const [items, setItems] = useState<ExternalItem[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [source, setSource] = useState<'products' | 'news'>(initialSource);
    const [searchQuery, setSearchQuery] = useState(initialQuery);
    const [selectedItem, setSelectedItem] = useState<ExternalItem | null>(null);
    const [warning, setWarning] = useState<string | null>(
        isInvalidSource
            ? `"${rawSource}" ไม่ใช่แหล่งข้อมูลที่รองรับ เปลี่ยนไปใช้ Products แทนแล้ว`
            : null
    );

    // ── helper: สร้าง query string แล้วอัปเดต URL ──
    function updateUrl(s: string, q: string, detailId: string | null) {
        const params = new URLSearchParams();
        params.set('source', s);
        if (q) params.set('q', q);
        if (detailId) params.set('detail', detailId);
        router.replace(`/blog-spa?${params.toString()}`);
    }

    function selectSource(s: 'products' | 'news') {
        setSource(s);
        setSelectedItem(null);
        updateUrl(s, searchQuery, null);
    }

    function handleSearch(q: string) {
        setSearchQuery(q);
        updateUrl(source, q, selectedItem?.id ?? null);
    }

    function openDetail(item: ExternalItem) {
        setSelectedItem(item);
        updateUrl(source, searchQuery, item.id);
    }

    function closeDetail() {
        setSelectedItem(null);
        updateUrl(source, searchQuery, null);
    }

    useEffect(() => {
        setIsLoading(true);
        setError(null);
        fetch(`/aggregate?source=${source}`)
            .then((r) => {
                if (!r.ok) throw new Error(`Server ตอบกลับมาด้วยสถานะ ${r.status}`);
                return r.json();
            })
            .then((data: { external: ExternalItem[] }) => {
                setItems(data.external);
                setIsLoading(false);

                // ถ้ามี ?detail=... ใน URL ให้เปิด modal อัตโนมัติ
                if (initialDetail) {
                    const found = data.external.find(
                        (i: ExternalItem) => i.id === initialDetail
                    );
                    if (found) setSelectedItem(found);
                }
            })
            .catch((err) => {
                setError(err.message || 'เกิดข้อผิดพลาดในการโหลดข้อมูล');
                setIsLoading(false);
            });
    }, [source]); // ← ทํางานใหม่ทุกครั้งที่ source เปลี่ยน

    const filteredItems = items.filter((item) =>
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (item.subtitle && item.subtitle.toLowerCase().includes(searchQuery.toLowerCase()))
    );

    return (
        <main className="p-8">
            <h1 className="text-2xl font-bold text-blue-900 mb-6">
                🧩 Blog Aggregator (SPA)
            </h1>

            {/* แจ้งเตือนเมื่อ source ไม่ถูกต้อง */}
            {warning && (
                <div className="mb-6 p-4 bg-yellow-50 border border-yellow-300 text-yellow-800 rounded-lg flex items-start gap-3">
                    <span className="text-xl">⚠️</span>
                    <div className="flex-1">
                        <p className="font-medium">{warning}</p>
                        <p className="text-sm text-yellow-600 mt-1">
                            แหล่งข้อมูลที่ใช้ได้: <strong>products</strong> และ <strong>news</strong>
                        </p>
                    </div>
                    <button
                        onClick={() => setWarning(null)}
                        className="text-yellow-600 hover:text-yellow-800"
                    >
                        ✕
                    </button>
                </div>
            )}
            
            {/* ปุ่ม Tab — วางเหนือ items grid */}
            <div className="flex gap-4 mb-6">
                <button 
                    onClick={() => selectSource('products')}
                    className={`px-4 py-2 rounded-lg font-medium transition-colors ${source === 'products' ? 'bg-blue-600 text-white' : 'bg-gray-100 hover:bg-gray-200 text-gray-800'}`}
                >
                    Products
                </button>
                <button 
                    onClick={() => selectSource('news')}
                    className={`px-4 py-2 rounded-lg font-medium transition-colors ${source === 'news' ? 'bg-blue-600 text-white' : 'bg-gray-100 hover:bg-gray-200 text-gray-800'}`}
                >
                    News
                </button>
            </div>

            {/* ช่องค้นหา */}
            <div className="mb-6">
                <input
                    type="text"
                    placeholder="ค้นหา..."
                    value={searchQuery}
                    onChange={(e) => handleSearch(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow"
                />
            </div>

            {/* === Loading State === */}
            {isLoading ? (
                <div className="grid grid-cols-2 gap-4">
                    {[...Array(4)].map((_, i) => (
                        <div key={i} className="p-4 bg-white rounded-lg border animate-pulse">
                            <div className="h-5 bg-gray-200 rounded w-3/4 mb-3"></div>
                            <div className="h-4 bg-gray-100 rounded w-1/2"></div>
                        </div>
                    ))}
                </div>

            /* === Error State === */
            ) : error ? (
                <div className="text-center py-16 px-4">
                    <div className="text-5xl mb-4">❌</div>
                    <h2 className="text-xl font-bold text-red-700 mb-2">โหลดข้อมูลไม่สําเร็จ</h2>
                    <p className="text-gray-500 mb-6">{error}</p>
                    <button
                        onClick={() => { setError(null); setIsLoading(true); setSource(source); }}
                        className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                    >
                        🔄 ลองใหม่อีกครั้ง
                    </button>
                </div>

            /* === Empty State (ไม่มีข้อมูล หรือ ค้นหาไม่เจอ) === */
            ) : filteredItems.length === 0 ? (
                <div className="text-center py-16 px-4">
                    <div className="text-5xl mb-4">{searchQuery ? '🔍' : '📦'}</div>
                    <h2 className="text-xl font-bold text-gray-700 mb-2">
                        {searchQuery
                            ? `ไม่พบผลลัพธ์สําหรับ "${searchQuery}"`
                            : 'ยังไม่มีข้อมูล'
                        }
                    </h2>
                    <p className="text-gray-400 mb-6">
                        {searchQuery
                            ? 'ลองเปลี่ยนคําค้นหา หรือเปลี่ยนแหล่งข้อมูลดู'
                            : `แหล่งข้อมูล "${source}" ยังไม่มีรายการ`
                        }
                    </p>
                    {searchQuery && (
                        <button
                            onClick={() => handleSearch('')}
                            className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                        >
                            ล้างคําค้นหา
                        </button>
                    )}
                </div>

            /* === แสดงรายการปกติ === */
            ) : (
                <div className="grid grid-cols-2 gap-4">
                    {filteredItems.map((item) => (
                        <div 
                            key={item.id} 
                            className="p-4 bg-white rounded-lg border cursor-pointer hover:shadow-md transition-shadow"
                            onClick={() => openDetail(item)}
                        >
                            <h2 className="font-bold text-blue-800">{item.title}</h2>
                            <p className="text-gray-500 text-sm">{item.subtitle}</p>
                        </div>
                    ))}
                </div>
            )}

            {/* Modal แสดงรายละเอียดเพิ่มเติม */}
            {selectedItem && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50" onClick={() => closeDetail()}>
                    <div className="bg-white rounded-xl p-6 max-w-lg w-full shadow-2xl" onClick={(e) => e.stopPropagation()}>
                        <div className="flex justify-between items-start mb-4">
                            <h2 className="text-xl font-bold text-blue-900 pr-4">{selectedItem.title}</h2>
                            <button 
                                onClick={() => closeDetail()}
                                className="text-gray-500 hover:text-gray-800 bg-gray-100 hover:bg-gray-200 rounded-full w-8 h-8 flex items-center justify-center"
                            >
                                ✕
                            </button>
                        </div>
                        
                        {/* รูปภาพ (ถ้ามี) */}
                        {selectedItem.image && (
                            <div className="mb-4 bg-gray-50 rounded-lg p-4 flex justify-center">
                                <img 
                                    src={selectedItem.image} 
                                    alt={selectedItem.title} 
                                    className="max-h-48 object-contain mix-blend-multiply"
                                />
                            </div>
                        )}
                        
                        <p className="text-gray-600 text-lg mb-6 pb-4 border-b">{selectedItem.subtitle}</p>
                        
                        <div className="flex justify-end">
                            <button 
                                onClick={() => closeDetail()}
                                className="px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                            >
                                ปิด
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </main>
    );
}

export default function BlogSpaPage() {
    return (
        <Suspense fallback={
            <div className="p-8">
                <div className="h-8 bg-gray-200 rounded w-64 mb-6 animate-pulse"></div>
                <div className="grid grid-cols-2 gap-4">
                    {[...Array(4)].map((_, i) => (
                        <div key={i} className="p-4 bg-white rounded-lg border animate-pulse">
                            <div className="h-5 bg-gray-200 rounded w-3/4 mb-3"></div>
                            <div className="h-4 bg-gray-100 rounded w-1/2"></div>
                        </div>
                    ))}
                </div>
            </div>
        }>
            <BlogSpaContent />
        </Suspense>
    );
}
