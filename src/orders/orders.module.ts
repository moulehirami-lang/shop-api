import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Client } from '../clients/entities/client.entity.js';
import { Product } from '../products/entities/product.entity.js';
import { CustomerOrder } from './entities/customer-order.entity.js';
import { OrderItem } from './entities/order-item.entity.js';
import { OrdersController } from './orders.controller.js';
import { OrdersService } from './orders.service.js';

@Module({
  imports: [TypeOrmModule.forFeature([CustomerOrder, OrderItem, Product, Client])],
  controllers: [OrdersController],
  providers: [OrdersService],
})
export class OrdersModule {}
