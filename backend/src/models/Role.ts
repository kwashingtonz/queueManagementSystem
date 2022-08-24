import { Entity, Column, PrimaryGeneratedColumn,OneToMany,BaseEntity } from "typeorm"
import { User } from "./User"

@Entity()
export class Role extends BaseEntity{
    @PrimaryGeneratedColumn()
    id!: number

    @Column()
    userType!: string

    @OneToMany(() => User, (user) => user.role)
    user!: User
}