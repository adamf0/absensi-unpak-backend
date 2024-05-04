import "reflect-metadata"
import { Entity, PrimaryGeneratedColumn, Column, JoinColumn, OneToOne } from "typeorm"
import { Absen } from "./Absen"
import { StatusClaimAbsen } from "../../domain/enum/StatusClaimAbsen"

@Entity("claim_absen")
export class ClaimAbsen {

    @PrimaryGeneratedColumn({unsigned: true})
    id: number

    @Column("int",{unsigned: false, unique: false})
    absenId: number

    @Column({type: "text", nullable: true})
    catatan: string

    @Column({type: "text", nullable: true})
    dokumen: string

    @Column({
        type: "enum",
        enum: StatusClaimAbsen,
        default: StatusClaimAbsen.Default,
    })
    status: string

    @OneToOne(() => Absen, Absen => Absen.ClaimAbsen, {
        eager: true,
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
    })
    @JoinColumn()
    Absen: Absen
}
