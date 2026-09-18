import { Body, Controller, Delete, Get, NotFoundException, Param, Post, UseGuards } from '@nestjs/common';
import { StorefrontService } from './storefront.service.js';
import { StorefrontCustomerGuard } from './storefront-customer.guard.js';
import { CurrentStorefrontCustomer } from './current-storefront-customer.decorator.js';
import { CreateStorefrontSessionDto } from './dto/create-session.dto.js';
import { StorefrontAddItemDto } from './dto/add-item.dto.js';
import { StorefrontApplyDiscountDto } from './dto/apply-discount.dto.js';
import { StorefrontCheckoutDto } from './dto/checkout.dto.js';
import type { Customer } from '../generated/prisma/client.js';

/**
 * Public-facing storefront API — the only endpoints in this backend a
 * shopper's browser can call directly. Every other controller in the app
 * requires an admin JWT (see JwtAuthGuard), which a public storefront cannot
 * use. Identity here is a guest customer token, not an admin session.
 */
@Controller('storefront')
export class StorefrontController {
  constructor(private readonly storefrontService: StorefrontService) {}

  @Post('session')
  createSession(@Body() dto: CreateStorefrontSessionDto) {
    return this.storefrontService.createSession(dto);
  }

  @Get('cart')
  @UseGuards(StorefrontCustomerGuard)
  getCart(@CurrentStorefrontCustomer() customer: Customer) {
    return this.storefrontService.getCart(customer);
  }

  @Post('cart/items')
  @UseGuards(StorefrontCustomerGuard)
  addItem(@CurrentStorefrontCustomer() customer: Customer, @Body() dto: StorefrontAddItemDto) {
    return this.storefrontService.addItem(customer, dto);
  }

  @Delete('cart/items/:itemId')
  @UseGuards(StorefrontCustomerGuard)
  removeItem(@CurrentStorefrontCustomer() customer: Customer, @Param('itemId') itemId: string) {
    return this.storefrontService.removeItem(customer, itemId);
  }

  @Post('cart/discount')
  @UseGuards(StorefrontCustomerGuard)
  applyDiscount(@CurrentStorefrontCustomer() customer: Customer, @Body() dto: StorefrontApplyDiscountDto) {
    return this.storefrontService.applyDiscount(customer, dto.code);
  }

  @Delete('cart/discount')
  @UseGuards(StorefrontCustomerGuard)
  removeDiscount(@CurrentStorefrontCustomer() customer: Customer) {
    return this.storefrontService.removeDiscount(customer);
  }

  @Post('checkout')
  @UseGuards(StorefrontCustomerGuard)
  checkout(@CurrentStorefrontCustomer() customer: Customer, @Body() dto: StorefrontCheckoutDto) {
    return this.storefrontService.checkout(customer, dto);
  }

  @Get('orders')
  @UseGuards(StorefrontCustomerGuard)
  findMyOrders(@CurrentStorefrontCustomer() customer: Customer) {
    return this.storefrontService.findMyOrders(customer);
  }

  @Get('orders/:id')
  @UseGuards(StorefrontCustomerGuard)
  async findMyOrder(@CurrentStorefrontCustomer() customer: Customer, @Param('id') id: string) {
    const order = await this.storefrontService.findMyOrder(customer, id);
    if (!order) {
      throw new NotFoundException(`Order ${id} not found`);
    }
    return order;
  }
}
