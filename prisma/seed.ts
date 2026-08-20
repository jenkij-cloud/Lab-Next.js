import 'dotenv/config';
import { prisma } from '../lib/prisma';

async function main() {
    await prisma.message.createMany({
        data: [
            { name: 'Alice', email: 'a@tsu.ac.th', message: 'สวัสดี' },
            { name: 'Bob', email: 'b@tsu.ac.th', message: 'Hello' },
        ],
    });

    await prisma.todo.createMany({
        data: [
            { title: 'ซื้อของเข้าบ้าน', completed: false },
            { title: 'ทำการบ้าน Prisma', completed: true },
            { title: 'ส่ง Workshop Week 9', completed: false },
        ],
    });
}

main();
