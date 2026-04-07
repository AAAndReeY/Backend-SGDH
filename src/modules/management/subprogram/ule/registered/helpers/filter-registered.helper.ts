import { FilterRegisteredDto } from '../dto';
import { timezoneHelper } from '../../../../../../common/helpers';

export function filterRegistered(dto: FilterRegisteredDto): any {
  const {
    search,
    format,
    level,
    box_id,
    declaration_id,
    enumerator_id,
    urban_id,
    members_min,
    members_max,
    age_min,
    age_max,
    age,
    birthday_day,
    birthday_month,
    phone,
    sex,
    ...pagination
  } = dto;
  const where: any = { deleted_at: null };
  if (search)
    where.OR = [
      { name: { contains: search, mode: 'insensitive' } },
      { lastname: { contains: search, mode: 'insensitive' } },
      { dni: { contains: search } },
      { fsu: { contains: search } },
      { s100: { contains: search } },
    ];
  if (format) where.format = format;
  if (level) where.level = level;
  if (box_id) where.box_id = box_id;
  if (declaration_id) where.declaration_id = declaration_id;
  if (enumerator_id) where.enumerator_id = enumerator_id;
  if (urban_id) where.urban_id = urban_id;
  if (members_min || members_max)
    where.members = {
      ...(members_min && { gte: Number(members_min) }),
      ...(members_max && { lte: Number(members_max) }),
    };
  const today = new Date();
  if (age) {
    const maxDate = new Date(
      today.getFullYear() - Number(age),
      today.getMonth(),
      today.getDate() + 1,
    );
    const minDate = new Date(
      today.getFullYear() - Number(age) - 1,
      today.getMonth(),
      today.getDate() + 1,
    );
    where.birthday = {
      gte: minDate,
      lt: maxDate,
    };
  }
  if (age_min || age_max) {
    const now = timezoneHelper();
    if (age_min)
      where.birthday = {
        ...(where.birthday || {}),
        lte: new Date(
          now.getFullYear() - Number(age_min),
          now.getMonth(),
          now.getDate(),
        ),
      };
    if (age_max)
      where.birthday = {
        ...(where.birthday || {}),
        gte: new Date(
          now.getFullYear() - Number(age_max) - 1,
          now.getMonth(),
          now.getDate() + 1,
        ),
      };
  }
  if (birthday_day) {
    const [monthStr, dayStr] = birthday_day.split('-');
    const m = Number(monthStr) - 1;
    const d = Number(dayStr);
    const ranges: any[] = [];
    for (let year = 1900; year <= 2100; year++)
      ranges.push({
        birthday: {
          gte: new Date(Date.UTC(year, m, d, 0, 0, 0)),
          lte: new Date(Date.UTC(year, m, d, 23, 59, 59)),
        },
      });
    where.AND = [...(where.AND || []), { OR: ranges }];
  }
  if (birthday_month) {
    const m = Number(birthday_month);
    const ranges: any[] = [];
    for (let year = 1900; year <= 2100; year++)
      ranges.push({
        birthday: {
          gte: new Date(Date.UTC(year, m - 1, 1)),
          lt: new Date(Date.UTC(year, m, 1)),
        },
      });
    where.AND = [...(where.AND || []), { OR: ranges }];
  }
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
  if (sex) {
  where.sex = sex;
  }
  return {
    where,
    pagination: {
      ...pagination,
    },
  };
}
