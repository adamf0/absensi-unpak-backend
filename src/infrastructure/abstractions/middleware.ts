import { Application } from "express";

export interface Middleware {
    apply(app: Application): void;
}