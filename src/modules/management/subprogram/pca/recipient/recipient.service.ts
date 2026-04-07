import { BadRequestException, Injectable } from '@nestjs/common';
import { Recipient } from '@prisma/client';
import {
  CreateRecipientDto,
  FilterRecipientDto,
  UpdateRecipientDto,
} from './dto';
import { PrismaService } from '../../../../../prisma/prisma.service';
import {
  paginationHelper,
  parseDate,
  timezoneHelper,
} from '../../../../../common/helpers';
import { filterRecipient } from './helpers';
import { ObservationService } from 'src/common/services/observation.service';

@Injectable()
export class RecipientService {
  constructor(private readonly prisma: PrismaService,
  private readonly observationService: ObservationService,
  ) {}

  async create(dto: CreateRecipientDto): Promise<Recipient> {
    const { birthday, registered_at, ...res } = dto;
    const recipient = await this.prisma.recipient.create({
      data: {
        ...res,
        ...(birthday && { birthday: parseDate(birthday) }),
        ...(registered_at && { registered_at: parseDate(registered_at) }),
        created_at: timezoneHelper(),
        updated_at: timezoneHelper(),
      },
    });
    return await this.getRecipientById(recipient.id);
  }

  async findAll(dto: FilterRecipientDto): Promise<any> {
    const { where, pagination } = filterRecipient(dto);
    return paginationHelper(
      this.prisma.recipient,
      {
        where,
        orderBy: { lastname: 'asc' },
      },
      pagination,
    );
  }

  async findOne(id: string): Promise<Recipient> {
    return await this.getRecipientById(id);
  }

  async update(id: string, dto: UpdateRecipientDto): Promise<Recipient> {
    await this.getRecipientById(id);
    const { observation,birthday, registered_at, ...res } = dto;
    await this.prisma.recipient.update({
      data: {
        ...res,
        ...(birthday && { birthday: parseDate(birthday) }),
        ...(registered_at && { registered_at: parseDate(registered_at) }),
        updated_at: timezoneHelper(),
      },
      where: { id },
    });
    await this.observationService.syncObservation(
      id,
      observation,
      'recipient',
    )
    return await this.getRecipientById(id);
  }

  async toggleDelete(id: string): Promise<any> {
    const recipient = await this.getRecipientById(id, true);
    const inactive = recipient.deleted_at;
    const deleted_at = inactive ? null : timezoneHelper();
    await this.prisma.recipient.update({
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

  private async getRecipientById(
    id: string,
    toogle: boolean = false,
  ): Promise<any> {
    const recipient = await this.prisma.recipient.findUnique({
      where: { id },
    });
    if (!recipient) throw new BadRequestException('Beneficiario no encontrado');
    if (recipient.deleted_at && !toogle)
      throw new BadRequestException('Beneficiario eliminado');
    return recipient;
  }
}
