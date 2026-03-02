import { BadRequestException, Injectable } from '@nestjs/common';
import { Patient } from '@prisma/client';
import { CreatePatientDto, FilterPatientDto, UpdatePatientDto } from './dto';
import { PrismaService } from '../../../../../prisma/prisma.service';
import {
  paginationHelper,
  parseDate,
  timezoneHelper,
} from '../../../../../common/helpers';
import { filterPatient, selectPatient } from './helpers';
import { ObservationService } from 'src/common/services/observation.service';

@Injectable()
export class PatientService {
  constructor(private readonly prisma: PrismaService,
    private readonly observationService: ObservationService
  ) {}
  async create(dto: CreatePatientDto): Promise<Patient> {
    const { start_at, birthday, assignee_birthday, ...res } = dto;
    const patient = await this.prisma.patient.create({
      data: {
        ...res,
        ...(start_at && { start_at: parseDate(start_at) }),
        ...(birthday && { birthday: parseDate(birthday) }),
        ...(assignee_birthday && {
          assignee_birthday: parseDate(assignee_birthday),
        }),
        created_at: timezoneHelper(),
        updated_at: timezoneHelper(),
      },
    });
    return await this.getPatientById(patient.id);
  }

  async findAll(dto: FilterPatientDto): Promise<any> {
    const { where, pagination } = filterPatient(dto);
    const result = await paginationHelper(
      this.prisma.patient,
      {
        where,
        orderBy: { lastname: 'asc' },
        select: selectPatient(true),
      },
      pagination,
    );
    const ids = result.data.map((item) => item.id);
    const generals = await this.prisma.general.findMany({
      where: {
        citizen_id: { in: ids },
        deleted_at: null,
      },
      select: {
        citizen_id: true,
        observation: true,
      },
    });
    const generalMap = new Map(
      generals.map((g) => [g.citizen_id, g.observation]),
    );
    result.data = result.data.map((item) => ({
      ...item,
      observation: generalMap.get(item.id) || null,
    }));
    return result;
  }

  async findOne(id: string): Promise<Patient> {
    return await this.getPatientById(id);
  }

  async update(id: string, dto: UpdatePatientDto): Promise<Patient> {
  await this.getPatientById(id);
  const { start_at, birthday, assignee_birthday, observation, ...res } = dto;
  await this.prisma.patient.update({
    data: {
      ...res,
      ...(start_at && { start_at: parseDate(start_at) }),
      ...(birthday && { birthday: parseDate(birthday) }),
      ...(assignee_birthday && {
        assignee_birthday: parseDate(assignee_birthday),
      }),
      updated_at: timezoneHelper(),
    },
    where: { id },
  });
  await this.observationService.syncObservation(id, observation, 'patient');

  return await this.getPatientById(id);
  }

  async toggleDelete(id: string): Promise<any> {
    const patient = await this.getPatientById(id, true);
    const inactive = patient.deleted_at;
    const deleted_at = inactive ? null : timezoneHelper();
    await this.prisma.patient.update({
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

  private async getPatientById(
    id: string,
    toggle: boolean = false,
  ): Promise<any> {
    const patient = await this.prisma.patient.findUnique({
      where: { id },
      select: selectPatient(),
    });
    if (!patient) throw new BadRequestException('Paciente no encontrado');
    if (patient.deleted_at && !toggle)
      throw new BadRequestException('Paciente eliminado');
    const general = await this.prisma.general.findFirst({
      where: {
        citizen_id: id,
        deleted_at: null,
      },
      select: {
        observation: true,
      },
    });
    return {
      ...patient,
      observation: general?.observation || null,
    };
  }
}
