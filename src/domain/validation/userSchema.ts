import * as Yup from "yup";

export const userCreateSchema = Yup.object({
    username: Yup.string().required("this is required"),
    password: Yup.date().required("this is required"),
    level: Yup.string().required("this is required"),
})

export const userUpdateSchema = Yup.object({
    id: Yup.string().required("this is required"),
    username: Yup.string().required("this is required"),
    password: Yup.date().required("this is required"),
    level: Yup.string().required("this is required"),
})