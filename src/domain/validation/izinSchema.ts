import * as Yup from "yup";

export const izinCreateSchema = Yup.object({
    nidn: Yup.string().required("nidn is required"),
    tanggal_pengajuan: Yup.date().required("tanggal_pengajuan is required"),
    tujuan: Yup.string().required("tujuan is required"),
    jenis_izin: Yup.number().required("jenis_izin is required"),
})

export const izinUpdateSchema = Yup.object({
    id: Yup.string().required("id is required"),
    nidn: Yup.string().required("nidn is required"),
    tanggal_pengajuan: Yup.date().required("tanggal_pengajuan is required"),
    tujuan: Yup.string().required("tujuan is required"),
    jenis_izin: Yup.number().required("jenis_izin is required"),
})

export const izinApprovalSchema = Yup.object({
    id: Yup.string().required("id is required"),
    type: Yup.string().required("type is required"),
})