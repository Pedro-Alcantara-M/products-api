import { Test, TestingModule } from '@nestjs/testing';
import { ProductController } from './product.controller';
import { ProductService } from './product.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Product } from './schemas/products.schema';
import { ObjectId, Types } from 'mongoose';

describe('ProductController', () => {
  let productController: ProductController;
  let productService: ProductService;

  const mockProductService = {
    create: jest.fn(),
    findAll: jest.fn(),
    updateById: jest.fn(),
    deleteById: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProductController],
      providers: [
        {
          provide: ProductService,
          useValue: mockProductService,
        },
      ],
    }).compile();

    productController = module.get<ProductController>(ProductController);
    productService = module.get<ProductService>(ProductService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(productController).toBeDefined();
  });

  describe('createProduct', () => {
    it('should create a new product', async () => {
      const createProductDto: CreateProductDto = {
        name: 'Test Product',
        description: 'Test Description',
        price: 100,
      };

      const createdProduct: Product = {
        ...createProductDto,
      };

      mockProductService.create.mockResolvedValue(createdProduct);

      const result = await productController.createProduct(createProductDto);

      expect(result).toEqual(createdProduct);
      expect(productService.create).toHaveBeenCalledWith(createProductDto);
    });
  });

  describe('findAll', () => {
    it('should return an array of products', async () => {
      const products: Product[] = [
        {
          _id: new Types.ObjectId(),
          name: 'Product 1',
          description: 'Description 1',
          price: 50,
        },
        {
          _id: new Types.ObjectId(),
          name: 'Product 2',
          description: 'Description 2',
          price: 150,
        },
      ];

      mockProductService.findAll.mockResolvedValue(products);

      const result = await productController.findAll();

      expect(result).toEqual(products);
      expect(productService.findAll).toHaveBeenCalled();
    });
  });

  describe('updateProduct', () => {
    it('should update a product by id', async () => {
      const updateProductDto: Partial<UpdateProductDto> = {
        name: 'Updated Product',
        description: 'Updated Description',
        price: 200,
      };

      const updatedProduct: Partial<Product> = {
        _id: new Types.ObjectId(),
        ...updateProductDto,
      };

      const productId = '666265cf8b0b36bea0b747b3' as any;

      mockProductService.updateById.mockResolvedValue(updatedProduct);

      const result = await productController.updateProduct(
        productId,
        updateProductDto,
      );

      expect(result).toEqual(updatedProduct);
      expect(productService.updateById).toHaveBeenCalledWith(
        productId,
        updateProductDto,
      );
    });
  });

  describe('deleteProduct', () => {
    it('should delete a product by id', async () => {
      const productId = '666265cf8b0b36bea0b747b3' as any;

      mockProductService.deleteById.mockResolvedValue({ deleted: true });

      const result = await productController.deleteProduct(
        productId as unknown as ObjectId,
      );

      expect(result).toEqual({ deleted: true });
      expect(productService.deleteById).toHaveBeenCalledWith(productId);
    });
  });
});
