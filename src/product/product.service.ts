import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import mongoose, { Model, ObjectId } from 'mongoose';
import { Product } from './schemas/products.schema';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class ProductService {
  constructor(
    @InjectModel(Product.name)
    private productModel: Model<Product>,
  ) {}

  async create(product: Product): Promise<Product> {
    const data = Object.assign(product);

    const res = await this.productModel.create(data);
    return res;
  }

  async findAll(): Promise<Product[]> {
    return this.productModel.find().lean().exec();
  }

  async findById(id: string): Promise<Product> {
    const isValidId = mongoose.isValidObjectId(id);

    if (!isValidId) {
      throw new BadRequestException('Please enter correct id.');
    }

    const product = await this.productModel.findById(id);

    if (!product) {
      throw new NotFoundException('Product not found.');
    }

    return product;
  }

  async updateById(id: ObjectId, product: Partial<Product>): Promise<Product> {
    return await this.productModel.findByIdAndUpdate(id, product, {
      new: true,
      runValidators: true,
    });
  }

  async deleteById(id: ObjectId): Promise<{ deleted: boolean }> {
    const product = await this.productModel.findById(id);

    if (!product) {
      throw new NotFoundException('Product not found.');
    }

    await this.productModel.findByIdAndDelete(id);
    return { deleted: true };
  }
}
