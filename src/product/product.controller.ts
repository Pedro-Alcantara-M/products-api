import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { ProductService } from './product.service';
import { Product } from './schemas/products.schema';
import { AuthGuard } from '@nestjs/passport';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ObjectId } from 'mongoose';

@Controller('product')
export class ProductController {
  constructor(private productsService: ProductService) {}

  @Post()
  @UseGuards(AuthGuard())
  async createProduct(
    @Body()
    product: CreateProductDto,
  ): Promise<Product> {
    return this.productsService.create(product);
  }
  @Get()
  @UseGuards(AuthGuard())
  async findAll(): Promise<Product[]> {
    return this.productsService.findAll();
  }

  @Put(':id')
  @UseGuards(AuthGuard())
  async updateProduct(
    @Param('id')
    id: ObjectId,
    @Body()
    product: Partial<UpdateProductDto>,
  ): Promise<Product> {
    return this.productsService.updateById(id, product);
  }

  @Delete(':id')
  @UseGuards(AuthGuard())
  async deleteProduct(
    @Param('id')
    id: ObjectId,
  ): Promise<{ deleted: boolean }> {
    return this.productsService.deleteById(id);
  }
}
