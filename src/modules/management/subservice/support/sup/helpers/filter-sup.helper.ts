import { FilterSupDto } from '../dto';
import { SearchDto } from '../../../../../../common/dto';
import { Prisma } from '@prisma/client';

export const filterSup = (dto: FilterSupDto) => {
  const { district, populated, dni, ...pagination } = dto as FilterSupDto & SearchDto & Record<string, any>;

  const where: Prisma.SupWhereInput = {
    ...(district && { district: { contains: district, mode: 'insensitive' } }),
    ...(populated && { populated: { contains: populated, mode: 'insensitive' } }),
    ...(dni && { dni: { contains: dni, mode: 'insensitive' } }),
  };

  return { where, pagination };
};