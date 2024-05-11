import "reflect-metadata"
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from "typeorm"
import { JenisSPPD } from "./JenisSPPD"
import { SPPD } from "./SPPD"

@Entity("sppd_anggota")
export class SPPDAnggota {

    @PrimaryGeneratedColumn({unsigned: true})
    id: number

    @Column("int",{unsigned: true, unique: false})
    sppdId

    @Column({length: 255, type: "varchar", nullable:true})
    nidn:string

    @Column({length: 255, type: "varchar", nullable:true})
    nip:string

    @ManyToOne(() => SPPD, sppd => sppd.anggota, {
        eager: true,
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
    })
    @JoinColumn()
    sppd: SPPD
}
