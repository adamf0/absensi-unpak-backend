import "reflect-metadata"
import { Entity, PrimaryGeneratedColumn, Column } from "typeorm"
import { UserRole } from "../../domain/enum/UserRole"
import { Dosen } from "./Dosen"

@Entity("user")
export class User {

    @PrimaryGeneratedColumn({unsigned: true})
    id: number

    @Column({length: 20, type: "varchar"})
    username: string

    @Column("text")
    password: string

    @Column({length: 200, type: "varchar"})
    nama: string

    @Column({
        type: "enum",
        enum: UserRole,
        default: UserRole.Default,
    })
    level: string

    @Column({length: 50, type: "varchar", unique: false})
    NIDN: string

    // @OneToOne(() => Dosen, Dosen => Dosen.User, { //masih bermasalah relasi beda koneksi
    //     eager: true,
    //     onDelete: "CASCADE",
    //     onUpdate: "CASCADE",
    // })
    // @JoinColumn({ name: "NIDN" })
    // Dosen: Dosen
}
