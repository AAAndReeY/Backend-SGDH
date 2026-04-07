import { FilterCommitteeDto } from '../dto';

export function filterCommitte(dto: FilterCommitteeDto): any {
  const {
    search,
    route,
    coordinator_id,
    couple_id,
    town_id,
    beneficiaries_min,
    beneficiaries_max,
    ...pagination
  } = dto;
  const where: any = { deleted_at: null };
  if (search)
    where.OR = [
      { name: { contains: search, mode: 'insensitive' } },
      { code: { contains: search, mode: 'insensitive' } },
      {
        coordinator: {
          dni: { contains: search },
        },
      },
      {
        coordinator: {
          name: { contains: search, mode: 'insensitive' },
        },
      },
      {
        coordinator: {
          lastname: { contains: search, mode: 'insensitive' },
        },
      },
    ];
  if (route) where.route = route;
  if (coordinator_id) where.coordinator_id = coordinator_id;
  if (couple_id) where.couple_id = couple_id;
  if (town_id) where.town_id = town_id;
  if (beneficiaries_min || beneficiaries_max)
    where.beneficiaries = {
      ...(beneficiaries_min && { gte: Number(beneficiaries_min) }),
      ...(beneficiaries_max && { lte: Number(beneficiaries_max) }),
    };
  return {
    where,
    pagination,
  };
}
