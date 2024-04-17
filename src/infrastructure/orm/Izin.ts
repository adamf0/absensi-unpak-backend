import "reflect-metadata"
import { Entity, PrimaryGeneratedColumn, Column, Index, JoinColumn, OneToOne, ManyToOne } from "typeorm"
import { StatusIzin } from "../../domain/enum/StatusIzin"
import { JenisIzin } from "./JenisIzin"

@Entity("izin")
@Index(['nidn', 'tanggal_pengajuan']) //index ganda
export class Izin {

    @PrimaryGeneratedColumn({unsigned: true})
    id: number

    @Column({length: 20, type: "varchar"})
    nidn: string

    @Column("date")
    tanggal_pengajuan: string

    @Column("text")
    tujuan: string

    @Column("int",{unsigned: true, unique: false})
    jenisIzinId: number

    @Column({type: "text", nullable: true})
    dokumen: string

    @Column({
        type: "enum",
        enum: StatusIzin,
        default: StatusIzin.Default,
    })
    status: string

    @Column({type: "text", nullable: true})
    catatan: string

    @ManyToOne(() => JenisIzin, jenisCuti => jenisCuti.izin, {
        eager: true,
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
    })
    @JoinColumn()
    JenisIzin: JenisIzin
}
