import "reflect-metadata"
import { Entity, PrimaryGeneratedColumn, Column, OneToOne} from "typeorm"
import { SPPD } from "./SPPD"

@Entity("jenis_sppd")
export class JenisSPPD {

    @PrimaryGeneratedColumn({unsigned: true})
    id: number

    @Column({length: 255, type: "varchar"})
    nama: string

    @OneToOne(() => SPPD, sppd => sppd.jenisSppd,{
    })
    sppd: SPPD
}
