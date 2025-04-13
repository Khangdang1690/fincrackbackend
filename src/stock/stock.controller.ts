import { Controller, Post, Delete, Get, Body, UseGuards, Param, HttpCode, HttpStatus } from '@nestjs/common';
import { StockService } from './stock.service';
import { JwtAuthGuard } from '@/auth/guard';
import { GetUser } from '@/auth/decorator';
import { User } from '@prisma/client';
import { TickerDto, StockMetricsForFrontend } from '@/stock/dto';
import { BaseController } from '@/common';

@UseGuards(JwtAuthGuard)
@Controller('stock')
export class StockController extends BaseController<User> {
  constructor(private readonly stockService: StockService) {
    super(stockService);
  }

  /**
   * Fetch metrics for all stocks in the user's wishlist
   */
  @Get('wishlist/metrics')
  async getWishlistMetrics(
    @GetUser() user: User,
  ): Promise<StockMetricsForFrontend> {
    console.log(`Fetching metrics for wishlist - User ID: ${user.id}`);
    return this.stockService.getWishlistMetrics(user.id);
  }

  @Post('wishlist')
  @HttpCode(HttpStatus.OK)
  async addToWishlist(
    @GetUser() user: User,
    @Body() tickerDto: TickerDto,
  ): Promise<User> {
    console.log(`Add to wishlist request: User ${user.id}, Ticker ${tickerDto.ticker}`);
    return this.stockService.addTickerToWishlist(user.id, tickerDto.ticker);
  }

  @Delete('wishlist/:ticker')
  @HttpCode(HttpStatus.OK)
  async removeFromWishlist(
    @GetUser() user: User,
    @Param('ticker') ticker: string,
  ): Promise<User> {
    if (!ticker || !/^[A-Z0-9.-]+$/i.test(ticker)) {
      throw new Error('Invalid ticker format in URL parameter.');
    }
    console.log(`Remove from wishlist request: User ${user.id}, Ticker ${ticker}`);
    return this.stockService.removeTickerFromWishlist(user.id, ticker);
  }
  
}
