import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Roles } from '../../entities/role.entity';
import RolesGuard from '../auth/guard/roles.guard';
import { ProductService } from './product.service';

@Controller('product')
@ApiTags('Product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Get('search')
  @UseGuards(RolesGuard([Roles.ADMIN, Roles.SYSTEMADMIN, Roles.MEMBER]))
  async searchProducts(@Query() query) {
    const { text } = query;
    return this.productService.searchForProducts(text);
  }
}
