import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { Client } from '../clients/entities/client.entity.js';
import { Product } from '../products/entities/product.entity.js';
import { CreateOrderDto } from './dto/create-order.dto.js';
import { CustomerOrder } from './entities/customer-order.entity.js';
import { OrderItem } from './entities/order-item.entity.js';

@Injectable()
export class OrdersService {
  constructor(
    private readonly dataSource: DataSource,
    @InjectRepository(CustomerOrder)
    private readonly orders: Repository<CustomerOrder>,
  ) {}

  // Transaction : verifie le stock, decremente, calcule le total
  create(dto: CreateOrderDto) {
    return this.dataSource.transaction(async (m) => {
      const client = await m.findOneBy(Client, { id: dto.clientId });
      if (!client) throw new NotFoundException('Client introuvable');

      let total = 0;
      const items: OrderItem[] = [];
      for (const it of dto.items) {
        const product = await m.findOne(Product, {
          where: { id: it.productId },
          lock: { mode: 'pessimistic_write' },
        });
        if (!product) throw new NotFoundException(`Produit ${it.productId} introuvable`);
        if (product.stock < it.quantity)
          throw new BadRequestException(`Stock insuffisant pour ${product.name}`);
        product.stock -= it.quantity;
        await m.save(product);
        total += Number(product.price) * it.quantity;
        items.push(m.create(OrderItem, { product, quantity: it.quantity, unitPrice: product.price }));
      }

      const order = await m.save(
        m.create(CustomerOrder, { client, total: total.toFixed(2) }),
      );
      for (const i of items) i.order = order;
      await m.save(items);
      return m.findOne(CustomerOrder, {
        where: { id: order.id },
        relations: { client: true, items: { product: true } },
      });
    });
  }

  findAll() {
    return this.orders.find({ relations: { client: true, items: { product: true } } });
  }

  async findOne(id: number) {
    const o = await this.orders.findOne({
      where: { id },
      relations: { client: true, items: { product: true } },
    });
    if (!o) throw new NotFoundException('Commande introuvable');
    return o;
  }
}
