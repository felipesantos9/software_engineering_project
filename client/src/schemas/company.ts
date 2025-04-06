import { z } from 'zod';

export const userStandardSchema = {
  name: z.string().min(2, 'Nome muito curto'),
  email: z.string().email('Email inválido'),
  password: z.string().min(8, 'A senha é curta demais'),
  confirmPassword: z.string(),
  cnpj: z
      .string()
      .regex(/^\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}$/, 'O formato do CNPJ está incorreto'),
};

export const userRegisterSchema = z
  .object({
    name: userStandardSchema.name,
    email: userStandardSchema.email,
    password: userStandardSchema.password,
    confirmPassword: userStandardSchema.confirmPassword,
    phonenumber: z
    .string()
    .regex(/^\(\d{2}\) \d{5}-\d{4}$/, 'O formato do número está incorreto'),
    cnpj: z
      .string()
      .regex(/^\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}$/, 'O formato do CNPJ está incorreto'),
  })
  .refine(({ password, confirmPassword }) => password === confirmPassword, {
    message: 'As senhas precisam ser iguais.',
    path: ['confirmPassword'],
  });