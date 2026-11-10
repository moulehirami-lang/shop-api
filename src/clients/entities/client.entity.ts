import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import type { CustomerOrder } from '../../orders/entities/customer-order.entity.js';

@Entity('clients')
export class Client {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  fullName: string;

  @Column({ unique: true })
  email: string;

  @OneToMany('CustomerOrder', (order: CustomerOrder) => order.client)
  orders: CustomerOrder[];
}
