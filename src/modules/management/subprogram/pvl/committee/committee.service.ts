import { BadRequestException, Injectable } from '@nestjs/common';
import { Committee } from '@prisma/client';
import * as xlsx from 'xlsx';
import {
  CreateCommitteeDto,
  FilterCommitteeDto,
  UpdateCommitteeDto,
} from './dto';
import { filterCommitte } from './helpers';
import { PrismaService } from '../../../../../prisma/prisma.service';
import {
  paginationHelper,
  timezoneHelper,
} from '../../../../../common/helpers';

@Injectable()
export class CommitteeService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateCommitteeDto): Promise<Committee> {
    const {
      latitude,
      longitude,
      beneficiaries,
      beneficiaries_foreign,
      members,
      handicappeds,
      ...res
    } = dto;
    const data: any = {
      ...res,
      ...(beneficiaries && { beneficiaries: Number(beneficiaries) }),
      ...(beneficiaries_foreign && {
        beneficiaries_foreign: Number(beneficiaries_foreign),
      }),
      ...(members && { members: Number(members) }),
      ...(handicappeds && { handicappeds: Number(handicappeds) }),
      latitude: Number(latitude),
      longitude: Number(longitude),
      created_at: timezoneHelper(),
      updated_at: timezoneHelper(),
    };
    const committee = await this.prisma.committee.create({ data });
    return this.getCommitteeById(committee.id);
  }

  async findAll(dto: FilterCommitteeDto): Promise<any> {
    const { where, pagination } = filterCommitte(dto);
    return paginationHelper(
      this.prisma.committee,
      {
        where,
        orderBy: { code: 'asc' },
        include: { coordinator: true, couple: true, town: true },
      },
      pagination,
    );
  }

  async findOne(id: string): Promise<Committee> {
    return await this.getCommitteeById(id);
  }

  async update(id: string, dto: UpdateCommitteeDto): Promise<Committee> {
    await this.getCommitteeById(id);
    const {
      latitude,
      longitude,
      beneficiaries,
      beneficiaries_foreign,
      members,
      handicappeds,
      commune,
      ...res
    } = dto;
    const data: any = {
      ...res,
      ...(beneficiaries && { beneficiaries: Number(beneficiaries) }),
      ...(beneficiaries_foreign && {
        beneficiaries_foreign: Number(beneficiaries_foreign),
      }),
      ...(members && { members: Number(members) }),
      ...(handicappeds && { handicappeds: Number(handicappeds) }),
      ...(commune && { commune: Number(commune) }),
      ...(latitude && { latitude: Number(latitude) }),
      ...(longitude && { longitude: Number(longitude) }),
      updated_at: timezoneHelper(),
    };
    await this.prisma.committee.update({
      data,
      where: { id },
    });
    return await this.getCommitteeById(id);
  }

  async toggleDelete(id: string): Promise<any> {
    const committee = await this.getCommitteeById(id, true);
    const inactive = committee.deleted_at;
    const deleted_at = inactive ? null : timezoneHelper();
    await this.prisma.committee.update({
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
    const count = await this.prisma.committee.count();
    if (count > 0)
      throw new BadRequestException('Solo se puede realizar una vez');
    const workbook = xlsx.read(file.buffer, { type: 'buffer' });
    const sheetName = workbook.SheetNames[0];
    const rows = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName]);
    const data = rows.map((row: any) => {
      return {
        code: String(row.code),
        name: row.name,
        address: row.address ?? null,
        latitude: Number(row.latitude),
        longitude: Number(row.longitude),
        beneficiaries: row.beneficiaries ? Number(row.beneficiaries) : 0,
        beneficiaries_foreign: row.beneficiaries_foreign
          ? Number(row.beneficiaries_foreign)
          : 0,
        members: row.members ? Number(row.members) : 0,
        handicappeds: row.handicappeds ? Number(row.handicappeds) : 0,
        commune: row.commune ? Number(row.commune) : 0,
        coordinator: String(row.dni),
        couple: row.couple_id,
        town: row.town_id,
        route: row.route,
        created_at: timezoneHelper(),
        updated_at: timezoneHelper(),
      };
    });
    const result: any = [];
    for (const d of data) {
      const coordinatord = await this.prisma.coordinator.findFirst({
        where: { dni: d.coordinator },
      });
      const coupled = await this.prisma.couple.findFirst({
        where: { name: d.couple },
      });
      const townd = await this.prisma.town.findFirst({
        where: { name: d.town },
      });
      if (!coordinatord || !coupled || !townd)
        throw new BadRequestException('No hay ID');
      const { coordinator, couple, town, ...res } = d;
      result.push({
        coordinator_id: coordinatord.id,
        couple_id: coupled.id,
        town_id: townd.id,
        ...res,
      });
    }
    await this.prisma.committee.createMany({ data: result });
    return { success: true };
  }

  private async getCommitteeById(
    id: string,
    toogle: boolean = false,
  ): Promise<any> {
    const committee = await this.prisma.committee.findUnique({
      where: { id },
    });
    if (!committee) throw new BadRequestException('Comité no encontrado');
    if (committee.deleted_at && !toogle)
      throw new BadRequestException('Comité eliminado');
    return committee;
  }
}
