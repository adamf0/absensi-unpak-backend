import "reflect-metadata"
import { Entity, PrimaryGeneratedColumn, Column, Index } from "typeorm"

@Entity("izin")
@Index(['nidn', 'tanggal_pengajuan'], { unique: true }) //index ganda
export class Izin {

    @PrimaryGeneratedColumn({unsigned: true})
    id: number

    @Column({length: 20, type: "varchar"})
    nidn: string

    @Column("date")
    tanggal_pengajuan: string

    @Column("text")
    tujuan: string
}
