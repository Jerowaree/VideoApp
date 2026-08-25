import * as yup from "yup";

export const loginSchema = yup.object({
  phone: yup
    .string()
    .required("Ingresa tu número de celular")
    .matches(/^\d+$/, "Usa solo números")
    .min(7, "Ingresa al menos 7 números")
    .max(15, "Ingresa máximo 15 números"),
  password: yup
    .string()
    .required("Ingresa tu contraseña")
    .min(8, "Usa al menos 8 caracteres")
    .max(32, "Usa máximo 32 caracteres"),
});

export type LoginFormValues = yup.InferType<typeof loginSchema>;
