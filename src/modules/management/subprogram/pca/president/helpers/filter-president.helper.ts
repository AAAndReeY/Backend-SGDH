import { FilterPresidentDto } from '../dto';

export function filterPresident(dto: FilterPresidentDto): any {
  const {
    search,
    birthday,
    modality,
    month,
    age,
    age_min,
    age_max,
    phone,
    sex,
    ...pagination
  } = dto;
  const where: any = { deleted_at: null };
  if (search)
    where.OR = [
      { doc_num: { contains: search, mode: 'insensitive' } },
      { name: { contains: search, mode: 'insensitive' } },
      { lastname: { contains: search, mode: 'insensitive' } },
    ];
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
    let gte: any;
    let lte: any;
    if (age_max)
      gte = new Date(
        today.getFullYear() - Number(age_max) - 1,
        today.getMonth(),
        today.getDate() + 1,
      );
    if (age_min)
      lte = new Date(
        today.getFullYear() - Number(age_min),
        today.getMonth(),
        today.getDate(),
      );
    where.birthday = {
      ...(gte && { gte }),
      ...(lte && { lte }),
    };
  }
  if (birthday) {
    const [monthStr, dayStr] = birthday.split('-');
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
  if (month) {
    const m = Number(month);
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
  if (modality)
    where.centers = {
      some: {
        modality: modality,
      },
    };
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
    pagination: { ...pagination },
  };
}
