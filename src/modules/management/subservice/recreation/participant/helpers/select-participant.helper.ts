import { Prisma } from '@prisma/client';

export function selectParticipant(
  all: boolean = false,
): Prisma.ParticipantSelect {
  if (all)
    return {
      id: true,
      dni: true,
      name: true,
      lastname: true,
      phone: true,
      observation: true,
      sex: true,
      birthday: true,
      workshop: { select: { id: true, name: true } },
    };
  return {
    id: true,
    dni: true,
    name: true,
    lastname: true,
    phone: true,
    observation: true,
    sex: true,
    assignee: true,
    birthday: true,
    created_at: true,
    updated_at: true,
    deleted_at: true,
    workshop: true,
  };
}
