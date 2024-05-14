import "reflect-metadata"
import { Entity, PrimaryGeneratedColumn, Column, OneToOne, OneToMany, JoinColumn, ManyToOne, ManyToMany, JoinTable } from "typeorm"
import { JenisSPPD } from "./JenisSPPD"
import { SPPDAnggota } from "./SPPDAnggota"

@Entity("sppd")
export class SPPD {

    @PrimaryGeneratedColumn({unsigned: true})
    id: number

    @Column({length: 255, type: "varchar", nullable:true})
    nidn:string

    @Column({length: 255, type: "varchar", nullable:true})
    nip:string

    @Column("int",{unsigned: true, unique: false})
    jenisSppdId:number
    
    @Column({length: 255, type: "varchar"})
    tujuan: string

    @Column("date")
    tanggal_berangkat:string

    @Column("date")
    tanggal_kembali:string
    
    @Column({type: "text", nullable: true})
    keterangan:string

    @ManyToOne(() => JenisSPPD, sppd => sppd.sppd, {
        eager: true,
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
    })
    @JoinColumn()
    jenisSppd: JenisSPPD

    @OneToMany(() => SPPDAnggota, anggota => anggota.sppd,{
    })
    @JoinColumn()
    anggota: SPPDAnggota[]
}
