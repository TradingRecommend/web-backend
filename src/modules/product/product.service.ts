import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import Product from 'src/entities/product.entity';
import { In, Repository } from 'typeorm';

@Injectable()
export class ProductService {
  index = 'products';
  constructor(
    @InjectRepository(Product)
    private productRepo: Repository<Product>,
  ) {}

  async search(text: string) {
    console.log('7777777777777777777777');
    return [];
  }

  // async createPost(post: CreatePostDto, user: User) {
  //     const newPost = await this.postsRepository.create({
  //       ...post,
  //       author: user
  //     });
  //     await this.postsRepository.save(newPost);
  //     this.postsSearchService.indexPost(newPost);
  //     return newPost;
  //   }

  async searchForProducts(text: string) {
    const results = await this.search(text);
    const ids = results.map((result) => result.id);
    if (!ids.length) {
      return [];
    }
    return this.productRepo.find({
      where: { id: In(ids) },
    });
  }
}
