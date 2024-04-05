import "reflect-metadata"
import { Entity, PrimaryGeneratedColumn, Column, Index } from "typeorm"
import { StatusIzin } from "../../domain/enum/StatusIzin"

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

    @Column({
        type: "enum",
        enum: StatusIzin,
        default: StatusIzin.Default,
    })
    status: string
}
