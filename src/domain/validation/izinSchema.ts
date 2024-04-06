import * as Yup from "yup";

export const izinCreateSchema = Yup.object({
    nidn: Yup.string().required("this is required"),
    tanggal_pengajuan: Yup.date().required("this is required"),
    tujuan: Yup.string().required("this is required"),
})

export const izinUpdateSchema = Yup.object({
    id: Yup.string().required("this is required"),
    nidn: Yup.string().required("this is required"),
    tanggal_pengajuan: Yup.date().required("this is required"),
    tujuan: Yup.string().required("this is required"),
})

export const izinApprovalSchema = Yup.object({
    id: Yup.string().required("this is required"),
    type: Yup.string().required("this is required"),
})