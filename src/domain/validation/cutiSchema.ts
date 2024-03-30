import * as Yup from "yup";

export const cutiCreateSchema = Yup.object({
    nidn: Yup.string().required("this is required"),
    tanggal_pengajuan: Yup.date().required("this is required"),
    lama_cuti: Yup.number().required("this is required"),
    tujuan: Yup.string().required("this is required"),
    jenis_cuti: Yup.number().required("this is required"),
})

export const cutiUpdateSchema = Yup.object({
    id: Yup.string().required("this is required"),
    nidn: Yup.string().required("this is required"),
    tanggal_pengajuan: Yup.date().required("this is required"),
    lama_cuti: Yup.number().required("this is required"),
    tujuan: Yup.string().required("this is required"),
    jenis_cuti: Yup.number().required("this is required"),
})