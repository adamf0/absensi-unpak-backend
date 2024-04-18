import * as Yup from "yup";

export const jenisIzinCreateSchema = Yup.object({
    nama: Yup.string().required("nama is required"),
})

export const jenisIzinUpdateSchema = Yup.object({
    id: Yup.string().required("id is required"),
    nama: Yup.string().required("nama is required"),
})