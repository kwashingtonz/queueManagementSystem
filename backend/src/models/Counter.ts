import { Entity, Column, PrimaryGeneratedColumn,OneToMany,ManyToOne, BaseEntity, JoinColumn } from "typeorm"
import { User } from "./User"
import { Issue } from "./Issue"


@Entity()
export class Counter extends BaseEntity {
    @PrimaryGeneratedColumn()
    id : number

    @Column()
    counterNum : number

    @Column({default:true})
    isOnline : boolean

    @Column()
    currentNum : number

    @Column()
    nextNum : number

    @ManyToOne(() => User, (user) => user.counters)
    user : User

    @OneToMany(() => Issue, (issue) => issue.counter) 
    issues : Issue[]
}