// src/common/services/observation.service.ts
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { timezoneHelper } from '../helpers';

export type ObservationModel =
  | 'disabled'
  | 'benefited'
  | 'patient'
  | 'president'
  | 'recipient'
  | 'coordinator'
  | 'dependent'
  | 'registered'
  | 'mother'
  | 'neighbors'
  | 'participant';

const ALL_SUB_MODELS: ObservationModel[] = [
  'disabled',
  'benefited',
  'patient',
  'president',
  'recipient',
  'coordinator',
  'dependent',
  'registered',
  'mother',
  'neighbors',
  'participant',
];

@Injectable()
export class ObservationService {
  constructor(private readonly prisma: PrismaService) {}
  async syncObservation(
    citizen_id: string,
    observation?: string,
    subModel?: ObservationModel,
  ) {
    if (observation === undefined) return;
    const now = timezoneHelper();
    await this.prisma.general.updateMany({
      where: { citizen_id, deleted_at: null },
      data: { observation, updated_at: now },
    });
    if (subModel) {
      await (this.prisma[subModel] as any).updateMany({
        where: { id: citizen_id },
        data: { observation, updated_at: now },
      });
      return { success: true };
    } 
    for (const model of ALL_SUB_MODELS) {
        const result = await (this.prisma[model] as any).updateMany({
        where: { id: citizen_id },
        data: { observation, updated_at: now },
        });
        console.log(result.count);
        if (result.count > 0) break;
    }
    return { success: true };
    }
}
