import * as Yup from "yup";

export const jenisCutiCreateSchema = Yup.object({
    nama: Yup.string().required("nama is required"),
    min: Yup.date().required("min is required"),
    max: Yup.number().required("max is required"),
    kondisi: Yup.string().required("kondisi is required"),
    dokumen: Yup.number().required("dokumen is required"),
})

export const jenisCutiUpdateSchema = Yup.object({
    id: Yup.string().required("id is required"),
    nama: Yup.string().required("nama is required"),
    min: Yup.date().required("min is required"),
    max: Yup.number().required("max is required"),
    kondisi: Yup.string().required("kondisi is required"),
    dokumen: Yup.number().required("dokumen is required"),
})