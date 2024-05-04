import * as Yup from "yup";

export const claimAbsenCreateSchema = Yup.object({
    absenId: Yup.string().required("absen is required"),
    catatan: Yup.string().nullable().optional(),
})

export const claimAbsenUpdateSchema = Yup.object({
    id: Yup.string().required("id is required"),
    absenId: Yup.string().required("absen is required"),
    catatan: Yup.string().nullable().optional(),
})

export const claimAbsenApprovalSchema = Yup.object({
    id: Yup.string().required("id is required"),
    type: Yup.string().required("type is required"),
})