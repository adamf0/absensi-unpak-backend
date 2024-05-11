import "reflect-metadata"
import { Entity, PrimaryGeneratedColumn, Column, Index, OneToOne, JoinColumn, ManyToOne } from "typeorm"
import { JenisCuti } from "./JenisCuti"
import { StatusCuti } from "../../domain/enum/StatusCuti"

@Entity("cuti")
export class Cuti {

    @PrimaryGeneratedColumn({unsigned: true})
    id: number

    @Column({length: 20, type: "varchar", nullable: true})
    nidn: string

    @Column({length: 100, type: "varchar", nullable: true})
    nip: string

    @Column("date")
    tanggal_mulai: string

    @Column("date")
    tanggal_akhir: string

    @Column("int")
    lama_cuti: number

    @Column("text")
    tujuan: string

    @Column("int",{unsigned: true, unique: false})
    jenisCutiId: number

    @Column({type: "text", nullable: true})
    dokumen: string

    @Column({
        type: "enum",
        enum: StatusCuti,
        default: StatusCuti.Default,
    })
    status: string

    @Column({type: "text", nullable: true})
    catatan: string

    @ManyToOne(() => JenisCuti, jenisCuti => jenisCuti.cuti, {
        eager: true,
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
    })
    @JoinColumn()
    JenisCuti: JenisCuti
}
