import { z } from "zod";

/**
 * Common regex/validation rules.
 */
const dateSchema = z.preprocess((arg) => {
  if (typeof arg === "string" || arg instanceof Date) return new Date(arg);
}, z.date());

/**
 * Gigs Schemas
 */
export const CreateGigSchema = z.object({
  title: z.string().min(1, "O título é obrigatório"),
  date: dateSchema,
  location: z.string().min(1, "A localização é obrigatória"),
  fee: z.number().nullable().optional(),
  taxRate: z.number().nullable().optional(),
  taxAmount: z.number().nullable().optional(),
  notes: z.string().optional(),
  setlistId: z.string().nullable().optional(),
  contractorId: z.string().nullable().optional(),
  loadIn: dateSchema.nullable().optional(),
  soundcheck: dateSchema.nullable().optional(),
  showtime: dateSchema.nullable().optional(),
});

export const UpdateGigSchema = CreateGigSchema.extend({
  id: z.string().min(1, "ID do show é obrigatório"),
});

export const CreateGigTaskSchema = z.object({
  gigId: z.string().min(1),
  description: z.string().min(1, "A descrição é obrigatória"),
});

export const ToggleGigTaskSchema = z.object({
  taskId: z.string().min(1),
  isCompleted: z.boolean(),
  gigId: z.string().min(1),
});

export const DeleteGigTaskSchema = z.object({
  taskId: z.string().min(1),
  gigId: z.string().min(1),
});

/**
 * Members Schemas
 */
export const MemberSchema = z.object({
  name: z.string().min(1, "Nome é obrigatório"),
  rg: z.string().optional().nullable(),
  cpf: z.string().optional().nullable(),
  whatsapp: z.string().optional().nullable(),
  position: z.string().optional().nullable(),
  cache: z.preprocess((val) => (val === "" ? null : Number(val)), z.number().nullable().optional()),
  role: z.enum(["ADMIN", "PRODUCER", "FINANCIAL", "ROADIE", "MUSICIAN"]).default("MUSICIAN"),
  selectedFormats: z.array(z.string()).optional().default([]),
});

export const CreateMemberSchema = MemberSchema;

export const UpdateMemberSchema = MemberSchema.extend({
  id: z.string().min(1, "ID do integrante é obrigatório"),
});

export const DeleteMemberSchema = z.object({
  id: z.string().min(1),
});

/**
 * Inventory Schemas
 */
export const CreateEquipmentSchema = z.object({
  name: z.string().min(1, "O nome do equipamento é obrigatório"),
  category: z.string().min(1, "A categoria é obrigatória"),
  brand: z.string().optional().nullable(),
  serialNumber: z.string().optional().nullable(),
  value: z.preprocess((val) => (val === "" || val === null ? null : Number(val)), z.number().nullable().optional()),
  status: z.enum(["AVAILABLE", "IN_USE", "MAINTENANCE", "LOST", "BROKEN"]).default("AVAILABLE"),
  ownerId: z.string().nullable().optional(),
  photoUrl: z.string().optional().nullable(),
  formats: z.array(z.string()).optional().default([]),
});

export const UpdateEquipmentSchema = CreateEquipmentSchema.extend({
  id: z.string().min(1, "ID do equipamento é obrigatório"),
});

export const DeleteEquipmentSchema = z.object({
  id: z.string().min(1),
});

/**
 * Band Schemas
 */
export const UpdateBandSchema = z.object({
  name: z.string().min(1, "O nome da banda é obrigatório"),
  secondaryColor: z.string().optional(),
  imageUrl: z.string().optional().nullable(),
  logoUrl: z.string().optional().nullable(),
  respName: z.string().optional().nullable(),
  respDocument: z.string().optional().nullable(),
  addressStreet: z.string().optional().nullable(),
  addressNumber: z.string().optional().nullable(),
  addressNeighborhood: z.string().optional().nullable(),
  addressZipCode: z.string().optional().nullable(),
  addressCity: z.string().optional().nullable(),
  addressState: z.string().optional().nullable(),
});

export const UpdateEpkSchema = z.object({
  shortBio: z.string().optional().nullable(),
  videoUrl: z.string().optional().nullable(),
  socialLinks: z.string().optional().nullable(),
});

/**
 * Finance Schemas
 */
export const TransactionSchema = z.object({
  id: z.string().optional(),
  description: z.string().min(1, "A descrição é obrigatória"),
  amount: z.preprocess((val) => (val === "" || val === null ? 0 : Number(val)), z.number()),
  type: z.enum(["INCOME", "EXPENSE"]),
  status: z.enum(["PENDING", "PAID", "CANCELLED"]),
  category: z.string().optional().nullable(),
  dueDate: dateSchema.optional().nullable(),
  paymentDate: dateSchema.optional().nullable(),
  receiptUrl: z.string().optional().nullable(),
  isRecurring: z.any().transform(v => !!v).optional(),
  gigId: z.string().optional().nullable(),
});

export const GigExpensesSchema = z.object({
  gigId: z.string().min(1),
  expenses: z.array(z.object({
    description: z.string().min(1),
    amount: z.preprocess((val) => (val === "" || val === null ? 0 : Number(val)), z.number()),
    category: z.string(),
    id: z.string().optional()
  }))
});
