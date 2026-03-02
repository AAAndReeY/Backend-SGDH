import { BadRequestException, Injectable } from '@nestjs/common';
import { Participant } from '@prisma/client';
import {
  CreateParticipantDto,
  FilterParticipantDto,
  UpdateParticipantDto,
} from './dto';
import { PrismaService } from '../../../../../prisma/prisma.service';
import {
  paginationHelper,
  parseDate,
  timezoneHelper,
} from '../../../../../common/helpers';
import { filterParticipant, selectParticipant } from './helpers';
import { ObservationService } from 'src/common/services/observation.service';

@Injectable()
export class ParticipantService {
  constructor(private readonly prisma: PrismaService,
  private readonly observationService: ObservationService,
  ) {}

  async create(dto: CreateParticipantDto): Promise<Participant> {
    const { birthday, ...res } = dto;
    const participant = await this.prisma.participant.create({
      data: {
        ...res,
        ...(birthday && { birthday: parseDate(birthday) }),
        created_at: timezoneHelper(),
        updated_at: timezoneHelper(),
      },
    });
    return await this.getParticipantById(participant.id);
  }

  async findAll(dto: FilterParticipantDto): Promise<any> {
    const { where, pagination } = filterParticipant(dto);
    return paginationHelper(
      this.prisma.participant,
      {
        where,
        orderBy: { lastname: 'asc' },
        select: selectParticipant(true),
      },
      pagination,
    );
  }

  async findOne(id: string): Promise<Participant> {
    return await this.getParticipantById(id);
  }

  async update(id: string, dto: UpdateParticipantDto): Promise<Participant> {
    await this.getParticipantById(id);
    const { birthday, ...res } = dto;
    await this.prisma.participant.update({
      data: {
        ...res,
        ...(birthday && { birthday: parseDate(birthday) }),
        updated_at: timezoneHelper(),
      },
      where: { id },
    });
    return await this.getParticipantById(id);
  }

  async toggleDelete(id: string): Promise<any> {
    const participant = await this.getParticipantById(id, true);
    const inactive = participant.deleted_at;
    const deleted_at = inactive ? null : timezoneHelper();
    await this.prisma.participant.update({
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

  private async getParticipantById(
    id: string,
    toggle: boolean = false,
  ): Promise<any> {
    const participant = await this.prisma.participant.findUnique({
      where: { id },
      select: selectParticipant(),
    });
    if (!participant)
      throw new BadRequestException('Participante no encontrado');
    if (participant.deleted_at && !toggle)
      throw new BadRequestException('Participante eliminado');
    return participant;
  }
}
