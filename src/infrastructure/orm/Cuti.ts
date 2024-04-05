import "reflect-metadata"
import { Entity, PrimaryGeneratedColumn, Column, Index, OneToOne, JoinColumn } from "typeorm"
import { JenisCuti } from "./JenisCuti"
import { StatusCuti } from "../../domain/enum/StatusCuti"

@Entity("cuti")
export class Cuti {

    @PrimaryGeneratedColumn({unsigned: true})
    id: number

    @Column({length: 20, type: "varchar"})
    nidn: string

    @Column("date")
    tanggal_pengajuan: string

    @Column("int")
    lama_cuti: number

    @Column("text")
    tujuan: string

    @Column("int",{unsigned: true, unique: false})
    jenis_cuti: number

    @Column({type: "text", nullable: true})
    dokumen: string

    @Column({
        type: "enum",
        enum: StatusCuti,
        default: StatusCuti.Default,
    })
    status: string

    @OneToOne(() => JenisCuti, jenisCuti => jenisCuti.cuti, {
        eager: true,
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
    })
    @JoinColumn({ name: "jenis_cuti" })
    JenisCuti: JenisCuti
}
