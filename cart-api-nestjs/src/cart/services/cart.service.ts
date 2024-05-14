import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Cart, CartItem } from '../entities';

@Injectable()
export class CartService {
  constructor(
    @InjectRepository(Cart) private cartRepository: Repository<Cart>,
    @InjectRepository(CartItem) private cartItemRepository: Repository<CartItem>
  ) {}

  async findOrCreateByUserId(userId: string): Promise<Cart> {
    let cart = await this.cartRepository.findOne({ where: { userId }, relations: ['items'] });
    if (!cart) {
      cart = this.cartRepository.create({ userId, items: [] });
      cart = await this.cartRepository.save(cart);
    }
    return cart;
  }

  async updateByUserId(userId: string, body: any): Promise<Cart> {
    let cart = await this.cartRepository.findOne({ where: { userId }, relations: ['items'] });
    if (!cart) {
      cart = this.cartRepository.create({ userId, items: [] });
    }
    cart.items = body.items;
    return this.cartRepository.save(cart);
  }

  async removeByUserId(userId: string): Promise<void> {
    await this.cartRepository.delete({ userId });
  }

  async findByUserId(userId: string): Promise<Cart> {
    return this.cartRepository.findOne({ where: { userId }, relations: ['items'] });
  }
}
