import { Prisma } from '@prisma/client';

export function selectPatient(all: boolean = false): Prisma.PatientSelect {
  if (all)
    return {
      id: true,
      doc_num: true,
      name: true,
      lastname: true,
      phone: true,
      start_at: true,
      birthday: true,
      doc_type: true,
      patient_type: true,
      sector: true,
      sex: true,
      census: { select: { id: true, name: true } },
    };
  return {
    id: true,
    doc_num: true,
    name: true,
    lastname: true,
    address: true,
    phone: true,
    center: true,
    delivery: true,
    treatment: true,
    observation: true,
    assignee_doc_num: true,
    assignee_lastname: true,
    assignee_name: true,
    assignee_phone: true,
    hampers: true,
    nutritional_assessment: true,
    text_message: true,
    start_at: true,
    birthday: true,
    assignee_birthday: true,
    created_at: true,
    updated_at: true,
    deleted_at: true,
    doc_type: true,
    patient_type: true,
    sector: true,
    sex: true,
    census: true,
  };
}
