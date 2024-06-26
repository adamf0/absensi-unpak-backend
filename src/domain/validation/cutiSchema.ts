import * as Yup from "yup";

export const cutiCreateSchema = Yup.object({
    nidn: Yup.string().nullable().optional(),
    nip: Yup.string().nullable().optional(),
    tanggal_mulai: Yup.date().required("tanggal_mulai is required"),
    tanggal_akhir: Yup.date().required("tanggal_akhir is required"),
    lama_cuti: Yup.number().required("lama_cuti is required"),
    tujuan: Yup.string().required("tujuan is required"),
    jenis_cuti: Yup.number().required("jenis_cuti is required"),
})

export const cutiUpdateSchema = Yup.object({
    id: Yup.string().required("id is required"),
    nidn: Yup.string().nullable().optional(),
    nip: Yup.string().nullable().optional(),
    tanggal_mulai: Yup.date().required("tanggal_mulai is required"),
    tanggal_akhir: Yup.date().required("tanggal_akhir is required"),
    lama_cuti: Yup.number().required("lama_cuti is required"),
    tujuan: Yup.string().required("tujuan is required"),
    jenis_cuti: Yup.number().required("jenis_cuti is required"),
})

export const cutiApprovalSchema = Yup.object({
    id: Yup.string().required("id is required"),
    type: Yup.string().required("type is required"),
})