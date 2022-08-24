import { Entity, Column, PrimaryGeneratedColumn,OneToMany,ManyToOne,BaseEntity } from "typeorm"
import { Counter } from "./Counter"
import { User } from "./User"
import { Notification } from "./Notification"

@Entity()
export class Issue extends BaseEntity{
    @PrimaryGeneratedColumn()
    id!: number

    @Column({
        length: 100,
    })
    name!: string

    @Column()
    telephone!: number

    @Column()
    email!: string

    @Column("text")
    issue!: string

    @Column()
    queueNo!: number

    @Column({default:false})
    isCalled!: Boolean

    @Column({default:false})
    isDone!: Boolean

    @ManyToOne(() => User, (user) => user.issues)
    user!: User

    @ManyToOne(() => Counter, (counter) => counter.issues)
    counter!: Counter

    @OneToMany(() => Notification, (notification) => notification.issue) 
    notifications!: Notification[]
}