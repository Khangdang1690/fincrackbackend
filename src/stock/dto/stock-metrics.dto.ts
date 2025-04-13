// DTO for a single stock's metrics
export interface StockMetric {
  ticker: string;
  currentPrice?: number;
  PE?: number;
  PB?: number;
  PS?: number;
  PEG?: number;
  ROE?: number;
  RSI?: number;
  MACDLine?: number;
  success: boolean;
  error?: string;
}

// DTO for the API response
export interface StockMetricsResponse {
  success: boolean;
  data: {
    [ticker: string]: StockMetric;
  };
}

// DTO for the restructured data for frontend
export interface StockMetricsForFrontend {
  success: boolean;
  stocks: {
    ticker: string;
    currentPrice?: number;
    metrics: {
      name: string;
      value: number | null;
      description: string;
    }[];
    success: boolean;
    error?: string;
  }[];
}

// DTO for the API request
export interface StockMetricsRequest {
  company_inputs: string[];
} 