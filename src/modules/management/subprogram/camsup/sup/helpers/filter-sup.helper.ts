import { FilterSupDto } from '../dto';

export function filterSup(dto: FilterSupDto): any {
  const { search, district, populated, phone, ...pagination } = dto;
  const where: any = { deleted_at: null };

  if (search)
    where.OR = [
      { name: { contains: search, mode: 'insensitive' } },
      { lastname: { contains: search, mode: 'insensitive' } },
      { dni: { contains: search, mode: 'insensitive' } },
    ];

  if (district)
    where.district = { contains: district, mode: 'insensitive' };

  if (populated)
    where.populated = { contains: populated, mode: 'insensitive' };

  if (phone === true) {
    where.AND = [
      ...(where.AND || []),
      {
        NOT: [
          { phone: null },
          { phone: '' },
        ],
      },
    ];
  }

  if (phone === false) {
    where.AND = [
      ...(where.AND || []),
      {
        OR: [
          { phone: null },
          { phone: '' },
        ],
      },
    ];
  }

  return {
    where,
    pagination: { ...pagination },
  };
}