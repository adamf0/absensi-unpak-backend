import "reflect-metadata"
import { Entity, Column, PrimaryGeneratedColumn} from "typeorm"

@Entity("pengguna")
export class Pengguna {

    @PrimaryGeneratedColumn()
    id: number

    @Column({length: 100, type: "varchar"})
    username: string

    @Column({length: 100, type: "varchar"})
    password: string

    @Column({length: 50, type: "varchar"})
    level: string

    @Column()
    status: string
}