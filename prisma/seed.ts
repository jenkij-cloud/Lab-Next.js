import 'dotenv/config';
import bcrypt from 'bcrypt';
import { prisma } from '../lib/prisma';

async function main() {
    await prisma.message.createMany({
        data: [
            { name: 'Alice', email: 'a@tsu.ac.th', message: 'สวัสดี' },
            { name: 'Bob', email: 'b@tsu.ac.th', message: 'Hello' },
        ],
        skipDuplicates: true,
    });

    await prisma.todo.createMany({
        data: [
            { title: 'ซื้อของเข้าบ้าน', completed: false },
            { title: 'ทำการบ้าน Prisma', completed: true },
            { title: 'ส่ง Workshop Week 9', completed: false },
        ],
        skipDuplicates: true,
    });

    const hashed = await bcrypt.hash('1234', 10);
    const user = await prisma.user.upsert({
        where: { email: 'admin@tsu.ac.th' },
        update: { password: hashed },
        create: { email: 'admin@tsu.ac.th', password: hashed },
    });

    console.log('✅ Seed completed successfully:');
    console.log(`   - Messages & Todos seeded (duplicates skipped)`);
    console.log(`   - Admin User ready: ${user.email}`);
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
