import { Entity, Column, PrimaryGeneratedColumn ,ManyToOne,JoinColumn,BaseEntity} from "typeorm"
import { User } from "./User"
import { Issue } from "./Issue"

@Entity()
export class Notification extends BaseEntity {
    @PrimaryGeneratedColumn()
    id!: number

    @Column()
    message!: string

    @ManyToOne(() => Issue, (issue) => issue.notifications)
    issue!: Issue

    @ManyToOne(() => User, (user) => user.notifications)
    user!: User
     
}