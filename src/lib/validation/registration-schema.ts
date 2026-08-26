import * as yup from "yup";

export const registrationSchema = yup.object({
  name: yup.string().trim().required("Ingresa tu nombre"),
  phone: yup
    .string()
    .required("Ingresa tu número de celular")
    .matches(/^\d+$/, "Usa solo números")
    .min(7, "Usa entre 7 y 15 números")
    .max(15, "Usa entre 7 y 15 números"),
  password: yup
    .string()
    .required("Ingresa una contraseña")
    .min(8, "Usa al menos 8 caracteres")
    .max(32, "Usa máximo 32 caracteres"),
  confirmation: yup
    .string()
    .required("Confirma tu contraseña")
    .oneOf([yup.ref("password")], "Las contraseñas no coinciden"),
});

export const registrationStepOneSchema = registrationSchema.pick([
  "name",
  "phone",
]);

export type RegistrationValues = yup.InferType<typeof registrationSchema>;
