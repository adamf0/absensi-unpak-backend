import * as Yup from "yup";

export const penggunaCreateSchema = Yup.object({
    username: Yup.string().required("username is required"),
    password: Yup.string().required("password is required"),
    nama: Yup.string().required("nama is required"),
    level: Yup.string().required("level is required"),
})

export const penggunaUpdateSchema = Yup.object({
    id: Yup.string().required("id is required"),
    username: Yup.string().required("username is required"),
    password: Yup.string().required("password is required"),
    nama: Yup.string().required("nama is required"),
    level: Yup.string().required("level is required"),
})