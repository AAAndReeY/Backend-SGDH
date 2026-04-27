import { BadRequestException, Injectable } from '@nestjs/common';
import { Sup } from '@prisma/client';
import { CreateSupDto, FilterSupDto, UpdateSupDto } from './dto';
import { PrismaService } from '../../../../../prisma/prisma.service';
import { filterSup } from './helpers';
import { paginationHelper, timezoneHelper } from '../../../../../common/helpers';

@Injectable()
export class SupService {
  constructor(private readonly prisma: PrismaService) {}

  // Obtiene el module_id del módulo SUP en la BD
  private async getSupModuleId(): Promise<string | null> {
    const mod = await this.prisma.module.findFirst({
      where: { name: 'SUP', deleted_at: null },
    });
    return mod?.id ?? null;
  }

  async create(dto: CreateSupDto): Promise<Sup> {
    const existing = await this.prisma.sup.findUnique({
      where: { dni: dto.dni },
    });
    if (existing) throw new BadRequestException('El DNI ya está registrado');

    const sup = await this.prisma.sup.create({
      data: {
        ...dto,
        created_at: timezoneHelper(),
        updated_at: timezoneHelper(),
      },
    });

    // Sincronizar con tabla general
    const moduleId = await this.getSupModuleId();
    if (moduleId) {
      await this.prisma.general.create({
        data: {
          name: sup.name,
          lastname: sup.lastname,
          dni: sup.dni,
          phone: sup.phone ?? null,
          citizen_id: sup.id,
          module_id: moduleId,
          created_at: timezoneHelper(),
          updated_at: timezoneHelper(),
        },
      });
    }

    return await this.getSupById(sup.id);
  }

  async findAll(dto: FilterSupDto): Promise<any> {
    const { where, pagination } = filterSup(dto);
    return paginationHelper(
      this.prisma.sup,
      {
        where,
        orderBy: { lastname: 'asc' },
      },
      pagination,
    );
  }

  async findOne(id: string): Promise<Sup> {
    return await this.getSupById(id);
  }

  async update(id: string, dto: UpdateSupDto): Promise<Sup> {
    await this.getSupById(id);
    await this.prisma.sup.update({
      data: {
        ...dto,
        updated_at: timezoneHelper(),
      },
      where: { id },
    });

    // Sincronizar cambios en tabla general
    const updated = await this.getSupById(id);
    await this.prisma.general.updateMany({
      where: { citizen_id: id, deleted_at: null },
      data: {
        name: updated.name,
        lastname: updated.lastname,
        dni: updated.dni,
        phone: updated.phone ?? null,
        updated_at: timezoneHelper(),
      },
    });

    return updated;
  }

  async toggleDelete(id: string): Promise<any> {
    const sup = await this.getSupById(id, true);
    const inactive = sup.deleted_at;
    const deleted_at = inactive ? null : timezoneHelper();
    await this.prisma.sup.update({
      data: { updated_at: timezoneHelper(), deleted_at },
      where: { id },
    });

    // Sincronizar eliminación/restauración en tabla general
    await this.prisma.general.updateMany({
      where: { citizen_id: id },
      data: { deleted_at, updated_at: timezoneHelper() },
    });

    return { action: inactive ? 'Restore' : 'Delete', id };
  }

  // Migra registros existentes de sup → general (ejecución única)
  async syncToGeneral(): Promise<{ synced: number; skipped: number }> {
    const moduleId = await this.getSupModuleId();
    if (!moduleId) throw new BadRequestException('Módulo SUP no encontrado en la BD');

    // Contar total en sup
    const totalResult = await this.prisma.$queryRaw<[{ count: bigint }]>`
      SELECT COUNT(*) as count FROM camsup.sup
    `;
    const total = Number(totalResult[0].count);
    if (total === 0) return { synced: 0, skipped: 0 };

    // Insertar directo con SQL — ON CONFLICT (dni) DO NOTHING maneja duplicados
    // WHERE NOT EXISTS filtra los que ya tienen citizen_id en general
    const result = await this.prisma.$queryRaw<[{ count: bigint }]>`
      WITH inserted AS (
        INSERT INTO initial.general
          (id, name, lastname, dni, phone, citizen_id, module_id, deleted_at, created_at, updated_at)
        SELECT
          gen_random_uuid()::text,
          s.name,
          s.lastname,
          s.dni,
          s.phone,
          s.id,
          ${moduleId},
          s.deleted_at,
          COALESCE(s.created_at, NOW()),
          NOW()
        FROM camsup.sup s
        WHERE NOT EXISTS (
          SELECT 1 FROM initial.general g WHERE g.citizen_id = s.id
        )
        ON CONFLICT (dni) DO NOTHING
        RETURNING id
      )
      SELECT COUNT(*) as count FROM inserted
    `;

    const synced = Number(result[0].count);
    return { synced, skipped: total - synced };
  }

  private async getSupById(id: string, toggle: boolean = false): Promise<Sup> {
    const sup = await this.prisma.sup.findUnique({ where: { id } });
    if (!sup) throw new BadRequestException('Sup no encontrado');
    if (sup.deleted_at && !toggle)
      throw new BadRequestException('Sup eliminado');
    return sup;
  }
}