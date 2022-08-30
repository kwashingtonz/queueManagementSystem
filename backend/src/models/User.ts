import { Entity, Column, PrimaryGeneratedColumn, ManyToOne,OneToMany,BaseEntity} from "typeorm"
import { Role } from "./Role"
import { Counter } from "./Counter"
import { Issue } from "./Issue"
import { Notification } from "./Notification"
import * as bcrypt from 'bcryptjs';


@Entity()
export class User extends BaseEntity {
    @PrimaryGeneratedColumn()
    id : number

    @Column()
    username : string

    @Column()
    password : string

    @ManyToOne(() => Role, (role) => role.user)
    role : Role

    @OneToMany(() => Counter, (counter) => counter.user)
    counters : Counter[]

    @OneToMany(() => Issue, (issue) => issue.user) 
    issues : Issue[]

    @OneToMany(() => Notification, (notification) => notification.user) 
    notifications : Notification[]

    async encryptPassword(password: string):Promise<string> {
        const salt = await bcrypt.genSalt(10);
        return bcrypt.hash(password,salt);
      }
    
      async validatePassword(password:string): Promise<boolean> {
          return await bcrypt.compare(password,this.password);
      }
}