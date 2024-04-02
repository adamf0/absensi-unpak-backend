import { MappingStateInterface } from "../../application/abstractions/MappingStateInterface";
import { InvalidRequest } from "../entity/InvalidRequest";

export class ResultCheckRegistryCuti extends MappingStateInterface{
    handle(data:any) {
        this.output = new InvalidRequest("terdaftar_cuti", `hari ini anda masih cuti ${data.JenisCuti.nama}`);
        return this;
    }
}