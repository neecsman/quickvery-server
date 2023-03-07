import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from "typeorm";
import { Users } from "./";

@Entity()
export default class Orders {
  @PrimaryGeneratedColumn()
  id: string;

  @Column("jsonb", { nullable: true })
  order_id: string;

  @ManyToOne(() => Users, (users) => users.orderId)
  @JoinColumn({ name: "user_id" })
  userId: string;
}
