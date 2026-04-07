import { FilterCenterDto } from '../dto';
import { timezoneHelper } from '../../../../../../common/helpers';

export function filterCenter(dto: FilterCenterDto): any {
  const {
    search,
    modality,
    president_id,
    directive_id,
    members_min,
    members_max,
    president_age_min,
    president_age_max,
    ...pagination
  } = dto;
  const where: any = {
    deleted_at: null,
  };
  if (search) {
    where.OR = [
      { name: { contains: search, mode: 'insensitive' } },
      { code: { contains: search, mode: 'insensitive' } },
      {
        president: {
          dni: { contains: search },
        },
      },
      {
        president: {
          name: { contains: search, mode: 'insensitive' },
        },
      },
      {
        president: {
          lastname: { contains: search, mode: 'insensitive' },
        },
      },
    ];
  }
  if (modality) where.modality = modality;
  if (president_id) where.president_id = president_id;
  if (directive_id) where.directive_id = directive_id;
  if (members_min || members_max) {
    where.members = {
      ...(members_min && { gte: Number(members_min) }),
      ...(members_max && { lte: Number(members_max) }),
    };
  }
  if (president_age_min || president_age_max) {
    const now = timezoneHelper();
    where.president = where.president || {};
    if (president_age_min)
      where.president.birthday = {
        ...(where.president.birthday || {}),
        lte: new Date(
          now.getFullYear() - Number(president_age_min),
          now.getMonth(),
          now.getDate(),
        ),
      };
    if (president_age_max)
      where.president.birthday = {
        ...(where.president.birthday || {}),
        gte: new Date(
          now.getFullYear() - Number(president_age_max) - 1,
          now.getMonth(),
          now.getDate() + 1,
        ),
      };
  }
  return {
    where,
    pagination: {
      ...pagination,
    },
  };
}
