import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';
import { User } from '@prisma/client';
import { BaseService } from '@/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';
import { StockMetricsResponse, StockMetricsForFrontend, StockMetricsRequest } from '@/stock/dto';

@Injectable()
export class StockService extends BaseService<User> {
  protected readonly modelName = 'user';

  constructor(
    protected readonly prisma: PrismaService,
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {
    super(prisma);
  }

  async addTickerToWishlist(userId: string, ticker: string): Promise<User> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      // This should ideally not happen if the user is authenticated via JWT
      throw new NotFoundException('User not found');
    }

    // Normalize ticker to uppercase for consistency
    const normalizedTicker = ticker.toUpperCase();

    if (user.wishlist.includes(normalizedTicker)) {
      throw new ConflictException('Ticker already exists in wishlist');
    }

    return this.prisma.user.update({
      where: { id: userId },
      data: {
        wishlist: {
          push: normalizedTicker, // Add the ticker to the array
        },
      },
    });
  }

  async removeTickerFromWishlist(userId: string, ticker: string): Promise<User> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      // This should ideally not happen if the user is authenticated via JWT
      throw new NotFoundException('User not found');
    }

    // Normalize ticker to uppercase for consistency
    const normalizedTicker = ticker.toUpperCase();

    if (!user.wishlist.includes(normalizedTicker)) {
      throw new NotFoundException('Ticker not found in wishlist');
    }

    const updatedWishlist = user.wishlist.filter(
      (item) => item !== normalizedTicker,
    );

    return this.prisma.user.update({
      where: { id: userId },
      data: {
        wishlist: updatedWishlist,
      },
    });
  }

  /**
   * Fetches detailed metrics for all tickers in a user's wishlist
   * from the external stock metrics API
   * @param userId The ID of the user
   * @returns Restructured stock metrics for easier frontend consumption
   */
  async getWishlistMetrics(userId: string): Promise<StockMetricsForFrontend> {
    // 1. Get the user's wishlist
    const user = await this.findById(userId);
    
    // Exit early if wishlist is empty
    if (!user.wishlist.length) {
      return {
        success: true,
        stocks: [],
      };
    }

    // 2. Determine which URL to use based on environment
    const nodeEnv = this.configService.get('NODE_ENV') || 'development';
    let baseUrl: string;
    
    if (nodeEnv === 'production') {
      baseUrl = this.configService.get('WISHLIST_URL_PROD') || '';
    } else {
      baseUrl = this.configService.get('WISHLIST_URL_DEV') || '';
    }
    
    if (!baseUrl) {
      throw new Error('Stock metrics API URL not configured properly');
    }

    const apiUrl = `${baseUrl}/multi_stock_metrics`;
    console.log(`Using stock metrics API URL: ${apiUrl}`);

    // 3. Prepare the request payload
    const payload: StockMetricsRequest = {
      company_inputs: user.wishlist,
    };

    try {
      // 4. Make the API call
      const response = await firstValueFrom(
        this.httpService.post<StockMetricsResponse>(apiUrl, payload)
      );
      
      const apiResponse = response.data;
      
      // 5. Restructure the data for the frontend
      return this.restructureStockMetricsForFrontend(apiResponse);
    } catch (error) {
      console.error('Error fetching stock metrics:', error.message);
      throw new Error(`Failed to fetch stock metrics: ${error.message}`);
    }
  }

  /**
   * Restructures the API response data into a format that's easier
   * for the frontend to consume (flattened array with descriptive metrics)
   * @param apiResponse Original API response
   * @returns Restructured data
   */
  private restructureStockMetricsForFrontend(apiResponse: StockMetricsResponse): StockMetricsForFrontend {
    // Metric descriptions for context
    const metricDescriptions = {
      PE: 'Price-to-Earnings Ratio - Valuation relative to earnings',
      PB: 'Price-to-Book Ratio - Valuation relative to book value',
      PS: 'Price-to-Sales Ratio - Valuation relative to revenue',
      PEG: 'Price/Earnings-to-Growth Ratio - Valuation accounting for growth',
      ROE: 'Return on Equity - Profitability relative to shareholder equity',
      RSI: 'Relative Strength Index - Momentum indicator (0-100)',
      MACDLine: 'Moving Average Convergence/Divergence - Trend strength indicator',
    };

    // Transform the data
    const stocks = Object.entries(apiResponse.data).map(([ticker, data]) => {
      // If the stock lookup failed, return a simplified error object
      if (!data.success) {
        return {
          ticker,
          success: false,
          error: data.error,
          metrics: [],
        };
      }

      // For successful lookups, format all the metrics consistently
      const metrics = [
        {
          name: 'P/E',
          value: data.PE || null,
          description: metricDescriptions.PE,
        },
        {
          name: 'P/B',
          value: data.PB || null,
          description: metricDescriptions.PB,
        },
        {
          name: 'P/S',
          value: data.PS || null,
          description: metricDescriptions.PS,
        },
        {
          name: 'PEG',
          value: data.PEG || null,
          description: metricDescriptions.PEG,
        },
        {
          name: 'ROE',
          value: data.ROE || null,
          description: metricDescriptions.ROE,
        },
        {
          name: 'RSI',
          value: data.RSI || null,
          description: metricDescriptions.RSI,
        },
        {
          name: 'MACD',
          value: data.MACDLine || null,
          description: metricDescriptions.MACDLine,
        },
      ];

      return {
        ticker,
        currentPrice: data.currentPrice,
        metrics,
        success: true,
      };
    });

    return {
      success: apiResponse.success,
      stocks,
    };
  }
}
