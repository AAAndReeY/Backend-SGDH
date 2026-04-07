import { BadRequestException, Injectable } from '@nestjs/common';
import { General, Send } from '@prisma/client';
import { FilterGeneralDto } from './dto';
import { PrismaService } from '../../../prisma/prisma.service';
import { filterGeneral } from './helpers';
import { paginationHelper, timezoneHelper } from '../../../common/helpers';
import { ObservationService } from 'src/common/services/observation.service';

@Injectable()
export class GeneralService {
  constructor(private readonly prisma: PrismaService,
  private readonly observationService: ObservationService
  ) {}

  async findAll(dto: FilterGeneralDto): Promise<any> {
    const { where, pagination } = filterGeneral(dto);
    return paginationHelper(
      this.prisma.general,
      {
        where,
        orderBy: { lastname: 'asc' },
        select: {
        id: true,
        name: true,
        lastname: true,
        dni: true,
        phone: true,
        birthday: true,
        sex: true,
        observation: true,
        module: {
          select: {
            name: true,
          },
        },
      }
      },
      pagination,
    );
  }

  async findOne(id: string): Promise<General> {
      return await this.getCitizenById(id);
  }

  async getForMessage() {
    const today = timezoneHelper();
    const month = today.getMonth() + 1;
    const day = today.getDate();
    const general = await this.prisma.$queryRaw<any[]>`
      UPDATE initial.general
      SET send = 'PENDING'
      WHERE deleted_at IS NULL
        AND send IS NULL
        AND EXTRACT(MONTH FROM birthday) = ${month}
        AND EXTRACT(DAY FROM birthday) = ${day}
      RETURNING *
    `;
    return {
      data: general,
      count: general.length,
    };
  }

  async sendMessage(id: string, message: string) {
    const citizen = await this.getCitizenById(id);
    if (citizen.send != Send.PENDING)
      throw new BadRequestException('El mensaje ya ha sido enviado');
    await this.prisma.general.update({
      data: {
        message,
        send: Send.SENT,
        updated_at: timezoneHelper(),
      },
      where: { id },
    });
    return { success: true };
  }

  async answerMessage(id: string, answer: string) {
    const citizen = await this.getCitizenById(id);
    if (citizen.send != Send.SENT)
      throw new BadRequestException('El mensaje ya ha sido respondido');
    await this.prisma.general.update({
      data: {
        answer,
        send: Send.ANSWERED,
        updated_at: timezoneHelper(),
      },
      where: { id },
    });
    return { success: true };
  }

  private async getCitizenById(id: string) {
    const citizen = await this.prisma.general.findFirst({
      where: {
        deleted_at: null,
        OR: [
          { id },
          { citizen_id: id },
          { dni: id },
        ],
      },
    });
    if (!citizen) {
      throw new BadRequestException('Persona no encontrada');
    }
    return citizen;
  }
  
  async updateObservation(citizen_id: string, observation: string) {
    await this.getCitizenById(citizen_id);
    await this.observationService.syncObservation(citizen_id, observation);
    return { success: true };
  }
}