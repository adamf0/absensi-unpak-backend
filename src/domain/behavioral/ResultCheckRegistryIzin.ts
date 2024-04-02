import { MappingStateInterface } from "../../application/abstractions/MappingStateInterface";
import { InvalidRequest } from "../entity/InvalidRequest";

export class ResultCheckRegistryIzin extends MappingStateInterface{
    handle(data:any) {
        this.output = new InvalidRequest("terdaftar_izin",`hari ini anda sudah izin dengan tujuan "${data.tujuan}"`);
        return this;
    }
}