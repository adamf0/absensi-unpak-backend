import "reflect-metadata"
import { Entity, PrimaryGeneratedColumn, Column, Index } from "typeorm"
import { UserRole } from "../../domain/enum/UserRole"

@Entity("user")
export class User {

    @PrimaryGeneratedColumn({unsigned: true})
    id: number

    @Column({length: 20, type: "varchar"})
    username: string

    @Column("text")
    password: string

    @Column({
        type: "enum",
        enum: UserRole,
        default: UserRole.Default,
    })
    level: string
}
