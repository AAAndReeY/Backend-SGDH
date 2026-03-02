import { BadRequestException, Injectable } from '@nestjs/common';
import { Coordinator } from '@prisma/client';
import * as xlsx from 'xlsx';
import {
  CreateCoordinatorDto,
  FilterCoordinatorDto,
  UpdateCoordinatorDto,
} from './dto';
import { PrismaService } from '../../../../../prisma/prisma.service';
import { filterCoordinator } from './helpers';
import {
  paginationHelper,
  timezoneHelper,
} from '../../../../../common/helpers';
import { ObservationService } from 'src/common/services/observation.service';

@Injectable()
export class CoordinatorService {
  constructor(private readonly prisma: PrismaService,
  private readonly observationService: ObservationService,
  ) {}

  async create(dto: CreateCoordinatorDto): Promise<Coordinator> {
    const coordinator = await this.prisma.coordinator.create({
      data: {
        ...dto,
        created_at: timezoneHelper(),
        updated_at: timezoneHelper(),
      },
    });
    return await this.getCoordinatorById(coordinator.id);
  }

  async findAll(dto: FilterCoordinatorDto): Promise<any> {
    const { where, pagination } = filterCoordinator(dto);
    return paginationHelper(
      this.prisma.coordinator,
      {
        where,
        orderBy: { lastname: 'asc' },
      },
      pagination,
    );
  }

  async findOne(id: string): Promise<Coordinator> {
    return await this.getCoordinatorById(id);
  }

  async update(id: string, dto: UpdateCoordinatorDto): Promise<Coordinator> {
    await this.getCoordinatorById(id);
    const { observation, ...res } = dto
    await this.prisma.coordinator.update({
      data: {
        ...dto,
        updated_at: timezoneHelper(),
      },
      where: { id },
    });
    await this.observationService.syncObservation(
      id,
      observation,
      'coordinator',
    )
    return await this.getCoordinatorById(id);
  }

  async toggleDelete(id: string): Promise<any> {
    const coordinator = await this.getCoordinatorById(id, true);
    const inactive = coordinator.deleted_at;
    const deleted_at = inactive ? null : timezoneHelper();
    await this.prisma.coordinator.update({
      data: {
        updated_at: timezoneHelper(),
        deleted_at,
      },
      where: { id },
    });
    return {
      action: inactive ? 'Restore' : 'Delete',
      id,
    };
  }

  async upload(file: Express.Multer.File) {
    const count = await this.prisma.coordinator.count();
    if (count > 0)
      throw new BadRequestException('Solo se puede realizar una vez');
    const workbook = xlsx.read(file.buffer, { type: 'buffer' });
    const sheetName = workbook.SheetNames[0];
    const rows = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName]);
    const data = rows.map((row: any) => {
      return {
        name: row.name,
        lastname: row.lastname ?? row.name,
        dni: row.dni ? String(row.dni) : null,
        phone: row.phone ? String(row.phone) : null,
        birthday: row.birthday ? String(row.birthday) : null,
        created_at: timezoneHelper(),
        updated_at: timezoneHelper(),
      };
    });
    await this.prisma.coordinator.createMany({ data });
    return { success: true };
  }

  private async getCoordinatorById(
    id: string,
    toogle: boolean = false,
  ): Promise<any> {
    const coordinator = await this.prisma.coordinator.findUnique({
      where: { id },
    });
    if (!coordinator)
      throw new BadRequestException('Coordinador no encontrado');
    if (coordinator.deleted_at && !toogle)
      throw new BadRequestException('Coordinador eliminado');
    return coordinator;
  }
}
