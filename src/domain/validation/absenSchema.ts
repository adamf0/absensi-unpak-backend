import * as Yup from "yup";

export const absenMasukSchema = Yup.object({
    nidn: Yup.string().required("nidn is required"),
    tanggal: Yup.date().required("tanggal is required"),
    absen_masuk: Yup.string().required("absen_masuk is required"),
    // lat: Yup.number().required("this is required").min(-90).max(90),
    // long: Yup.number().required("this is required").min(-180).max(180),
})

export const absenKeluarSchema = Yup.object({
    nidn: Yup.string().required("nidn is required"),
    tanggal: Yup.date().required("tanggal is required"),
    absen_keluar: Yup.string().required("absen_keluar is required"),
})