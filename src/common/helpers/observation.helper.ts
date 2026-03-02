export async function syncObservationToGeneral(
  prisma: any,
  citizen_id: string,
  observation?: string,
) {
  if (observation === undefined) return;

  await prisma.general.updateMany({
    where: {
      citizen_id,
      deleted_at: null,
    },
    data: {
      observation,
    },
  });
}