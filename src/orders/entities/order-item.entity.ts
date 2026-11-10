import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import type { Relation } from 'typeorm';
import type { CustomerOrder } from './customer-order.entity.js';
import type { Product } from '../../products/entities/product.entity.js';

@Entity('order_items')
export class OrderItem {
  @PrimaryGeneratedColumn() id: number;
  @Column('int') quantity: number;
  @Column('decimal', { precision: 10, scale: 2 }) unitPrice: string;

  @ManyToOne('CustomerOrder', (o: CustomerOrder) => o.items, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'orderId' })
  order: Relation<CustomerOrder>;
  @Column() orderId: number;

  @ManyToOne('Product', (p: Product) => p.items, { onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'productId' })
  product: Relation<Product>;
  @Column() productId: number;
}
