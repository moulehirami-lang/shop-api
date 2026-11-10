import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Category } from '../categories/entities/category.entity.js';
import { Product } from './entities/product.entity.js';
import { ProductsService } from './products.service.js';

describe('ProductsService', () => {
  let service: ProductsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductsService,
        ...[Product, Category].map((entity) => ({
          provide: getRepositoryToken(entity),
          useValue: {},
        })),
      ],
    }).compile();

    service = module.get<ProductsService>(ProductsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
