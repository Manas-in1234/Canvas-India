import { Injectable } from '@nestjs/common';
import { randomBytes } from 'node:crypto';
import { PrismaService } from '../database/prisma.service.js';
import { CartService } from '../commerce/cart/cart.service.js';
import { OrdersService } from '../commerce/orders/orders.service.js';
import { CreateStorefrontSessionDto } from './dto/create-session.dto.js';
import { StorefrontAddItemDto } from './dto/add-item.dto.js';
import { StorefrontCheckoutDto } from './dto/checkout.dto.js';
import type { Customer } from '../generated/prisma/client.js';

@Injectable()
export class StorefrontService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly cartService: CartService,
    private readonly ordersService: OrdersService,
  ) {}

  /**
   * Creates a guest customer identified only by an opaque token — no
   * password, no email verification. This is a deliberately minimal guest
   * checkout identity, not a real account system (scope for that is future
   * work if the client wants persistent customer logins).
   */
  async createSession(dto: CreateStorefrontSessionDto) {
    const guestToken = randomBytes(32).toString('hex');

    const customer = await this.prisma.customer.create({
      data: {
        name: dto.name,
        email: dto.email,
        phone: dto.phone,
        isGuest: true,
        guestToken,
      },
    });

    return { customerToken: guestToken, customerId: customer.id };
  }

  async getCart(customer: Customer) {
    const cart = await this.cartService.getOrCreateForCustomer(customer.id);
    return this.cartService.priceCart(cart.id);
  }

  async addItem(customer: Customer, dto: StorefrontAddItemDto) {
    const cart = await this.cartService.getOrCreateForCustomer(customer.id);
    await this.cartService.addItem(cart.id, dto.variantId, dto.quantity, dto.configuration, dto.designVersionId);
    return this.cartService.priceCart(cart.id);
  }

  async removeItem(customer: Customer, itemId: string) {
    await this.cartService.removeItem(itemId);
    const cart = await this.cartService.getOrCreateForCustomer(customer.id);
    return this.cartService.priceCart(cart.id);
  }

  async applyDiscount(customer: Customer, code: string) {
    const cart = await this.cartService.getOrCreateForCustomer(customer.id);
    return this.cartService.applyDiscount(cart.id, code);
  }

  async removeDiscount(customer: Customer) {
    const cart = await this.cartService.getOrCreateForCustomer(customer.id);
    return this.cartService.removeDiscount(cart.id);
  }

  async checkout(customer: Customer, dto: StorefrontCheckoutDto) {
    const cart = await this.cartService.getOrCreateForCustomer(customer.id);
    return this.ordersService.createFromCart(customer.id, cart.id, dto.addresses);
  }

  async findMyOrders(customer: Customer) {
    return this.prisma.order.findMany({
      where: { customerId: customer.id },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findMyOrder(customer: Customer, orderId: string) {
    const order = await this.ordersService.findOne(orderId);
    if (order.customerId !== customer.id) {
      // Deliberately identical to a 404 rather than 403 — avoids confirming
      // to an anonymous caller that an order ID belonging to someone else exists.
      return null;
    }
    // Never echo the customer's own guestToken (their session secret) back
    // inside an order payload, even though it's technically their own value.
    const { guestToken: _guestToken, ...customerWithoutToken } = order.customer;
    return { ...order, customer: customerWithoutToken };
  }
}
