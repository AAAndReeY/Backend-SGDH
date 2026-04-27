import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const programs = await prisma.program.findMany({ where: { deleted_at: null } });

  if (programs.length === 0) {
    console.error('❌ No hay programas en la base de datos');
    process.exit(1);
  }

  const oldModule = await prisma.module.findFirst({ where: { name: 'general' } });
  if (oldModule) {
    await prisma.module.update({
      where: { id: oldModule.id },
      data: { name: 'Lista General', updated_at: new Date() },
    });
    console.log(`✅ Módulo renombrado: "general" → "Lista General" (${oldModule.id})`);
    return;
  }

  const existing = await prisma.module.findFirst({ where: { name: 'Lista General' } });
  if (existing) {
    console.log(`ℹ️  Módulo "Lista General" ya existe: ${existing.id}`);
    return;
  }

  const modulo = await prisma.module.create({
    data: { name: 'Lista General', program_id: programs[0].id },
  });

  console.log(`✅ Módulo "Lista General" creado: ${modulo.id}`);
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });