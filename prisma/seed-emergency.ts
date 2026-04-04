import { prisma } from '../src/lib/prisma';
import bcrypt from 'bcryptjs';

async function main() {
    console.log('Verificando bandas...');
    const bands = await prisma.band.findMany();
    console.log('Bandas encontradas:', bands.map(b => ({ id: b.id, name: b.name })));

    const targetUsers = [
        { email: 'anderclei@gmail.com', name: 'Anderclei Super Admin', isSuperAdmin: true },
        { email: 'andercleidesigner@gmail.com', name: 'Julianna Fagundes Designer', isSuperAdmin: false },
        { email: 'teste@bandademo.com.br', name: 'Banda Demo Teste', isSuperAdmin: false }
    ];

    const passwordHash = await bcrypt.hash('123456', 10);

    for (const u of targetUsers) {
        console.log(`Verificando/Criando usuario: ${u.email}`);
        const user = await prisma.user.upsert({
            where: { email: u.email },
            update: {
                name: u.name,
                isSuperAdmin: u.isSuperAdmin,
                password: passwordHash,
                licenseStatus: 'ACTIVE'
            },
            create: {
                email: u.email,
                name: u.name,
                isSuperAdmin: u.isSuperAdmin,
                password: passwordHash,
                licenseStatus: 'ACTIVE',
                maxBands: u.isSuperAdmin ? 100 : 5
            }
        });
        console.log(`Usuario ${user.email} (ID: ${user.id}) pronto.`);

        // Vincular a bandas se necessario
        if (u.email === 'andercleidesigner@gmail.com') {
            const juliannaBand = bands.find(b => b.name.toLowerCase().includes('julianna'));
            if (juliannaBand) {
                await prisma.member.upsert({
                    where: { userId_bandId: { userId: user.id, bandId: juliannaBand.id } },
                    update: { role: 'ADMIN' },
                    create: { userId: user.id, bandId: juliannaBand.id, role: 'ADMIN' }
                });
                console.log(`Usuario vinculado a banda: ${juliannaBand.name}`);
            }
        } else if (u.email === 'teste@bandademo.com.br') {
            const demoBand = bands.find(b => b.name.toLowerCase().includes('demo'));
            if (demoBand) {
                await prisma.member.upsert({
                    where: { userId_bandId: { userId: user.id, bandId: demoBand.id } },
                    update: { role: 'ADMIN' },
                    create: { userId: user.id, bandId: demoBand.id, role: 'ADMIN' }
                });
                console.log(`Usuario vinculado a banda: ${demoBand.name}`);
            }
        }
    }
}

main()
    .catch(e => {
        console.error('Erro no script:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
