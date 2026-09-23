import { Body, Controller, Delete, Get, Param, Post, UseGuards } from '@nestjs/common';
import { CartService } from './cart.service.js';
import { AddCartItemDto } from './dto/add-cart-item.dto.js';
import { ApplyDiscountDto } from './dto/apply-discount.dto.js';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard.js';
import { PermissionsGuard } from '../../common/guards/permissions.guard.js';
import { RequirePermissions } from '../../common/decorators/permissions.decorator.js';

@Controller('customers/:customerId/cart')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Get()
  @RequirePermissions('orders.view')
  async getCart(@Param('customerId') customerId: string) {
    const cart = await this.cartService.getOrCreateForCustomer(customerId);
    return this.cartService.priceCart(cart.id);
  }

  @Post('items')
  @RequirePermissions('orders.create')
  async addItem(@Param('customerId') customerId: string, @Body() dto: AddCartItemDto) {
    const cart = await this.cartService.getOrCreateForCustomer(customerId);
    await this.cartService.addItem(cart.id, dto.variantId, dto.quantity, dto.configuration, dto.designVersionId);
    return this.cartService.priceCart(cart.id);
  }

  @Delete('items/:itemId')
  @RequirePermissions('orders.create')
  async removeItem(@Param('customerId') customerId: string, @Param('itemId') itemId: string) {
    await this.cartService.removeItem(itemId);
    const cart = await this.cartService.getOrCreateForCustomer(customerId);
    return this.cartService.priceCart(cart.id);
  }

  @Post('discount')
  @RequirePermissions('orders.create')
  async applyDiscount(
    @Param('customerId') customerId: string,
    @Body() dto: ApplyDiscountDto,
  ) {
    const cart = await this.cartService.getOrCreateForCustomer(customerId);
    return this.cartService.applyDiscount(cart.id, dto.code);
  }

  @Delete('discount')
  @RequirePermissions('orders.create')
  async removeDiscount(@Param('customerId') customerId: string) {
    const cart = await this.cartService.getOrCreateForCustomer(customerId);
    return this.cartService.removeDiscount(cart.id);
  }
}
