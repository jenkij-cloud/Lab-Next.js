'use client';
import { useState } from 'react';

export default function PriceCalculator() {
 const [quantity, setQuantity] = useState(1);
 const pricePerItem = 150;
 const total = quantity * pricePerItem; // ← คํานวณสด ไม่ใช่ state

 return (
 <div className="p-8 max-w-sm">
 <h1 className="text-xl font-bold mb-4">Price Calculator</h1>
 <label className="block mb-2 text-sm font-medium">จำนวนสินค้า (ชิ้นละ 150 บาท)</label>
 <input type="number" value={quantity} min={1}
 onChange={(e) => setQuantity(Number(e.target.value))} 
 className="border p-2 rounded w-full mb-4" />
 
 <div className="bg-gray-100 p-4 rounded text-center">
 <p className="text-lg">ราคารวม: <span className="font-bold text-blue-600">{total.toLocaleString()}</span> บาท</p>
 </div>
 </div>
 );
}
