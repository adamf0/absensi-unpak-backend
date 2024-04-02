import { MappingStateInterface } from "../../application/abstractions/MappingStateInterface";
import { InvalidRequest } from "../entity/InvalidRequest";

export class ResultCheckRadius extends MappingStateInterface{
    handle(data:any) {
        this.output = new InvalidRequest("luar_radius",`jaran anda dengan unpak sejauh ${data} meter, itu berada di luar lokasi radius absensi (150 meter)`);
        return this;
    }
}