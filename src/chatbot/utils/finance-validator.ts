/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { z } from 'zod';
import { zodResponseFormat } from 'openai/helpers/zod';

// Define schema for finance topic validation
// Enhanced schema with specific subcategories
export const FinanceTopicValidator = z.object({
  isFinanceRelated: z.boolean(),
  confidence: z
    .number()
    .min(0)
    .max(1)
    .refine((n) => n >= 0.7, {
      message: 'Confidence must be at least 0.7 for financial topics',
    }),
  topic: z.enum([
    'personal_finance',
    'banking_services',
    'investment',
    'loans_credit',
    'economic_theory',
    'insurance',
    'retirement_planning',
    'taxation',
  ]),
  explanation: z.string().min(20).max(200),
  specificKeywords: z.array(z.string()).min(1).optional(),
});

// Enhanced financial product query with retirement options
export const FinancialProductQuery = z.object({
  productType: z.enum([
    'savings',
    'checking',
    'investment',
    'retirement', // New category
    'loan',
    'mortgage',
    'credit',
    'insurance',
  ]),
  infoType: z.enum([
    'features',
    'rates',
    'requirements',
    'benefits',
    'risks',
    'eligibility',
  ]),
});

// Enhanced tool description with examples
export const financeTools = [
  {
    type: 'function' as const,
    function: {
      name: 'validate_finance_topic',
      description: `Validates financial relevance with subcategorization. Financial topics include:
- Personal finance (budgeting, retirement planning, tax strategies)
- Banking services (accounts, transfers, loans)
- Investments (stocks, bonds, retirement accounts)
- Economic theory (inflation, monetary policy)
- Insurance products (life, health, property)
Examples of non-financial topics: technology, medical advice, general trivia.
Return specific keywords found and confidence score.`,
      parameters: zodResponseFormat(FinanceTopicValidator, 'finance_validator')
        .json_schema.schema,
    },
  },
  {
    type: 'function' as const,
    function: {
      name: 'get_financial_product_info',
      description:
        'Get information about financial products including features, rates, and requirements',
      parameters: zodResponseFormat(
        FinancialProductQuery,
        'financial_product_query',
      ).json_schema.schema,
    },
  },
];

// Added more specific retirement-related keywords
export const financeKeywords = [
  // Banking terms
  'bank',
  'account',
  'deposit',
  'withdraw',
  'transfer',
  'balance',
  'statement',
  'overdraft',
  'atm',
  'branch',
  'online banking',
  'mobile banking',
  'check',
  'cheque',
  'direct deposit',

  // Investment terms
  'investment',
  'stock',
  'bond',
  'mutual fund',
  'etf',
  'portfolio',
  'dividend',
  'capital gain',
  'broker',
  'trading',
  'market',
  'share',
  'equity',
  'asset',
  'security',
  'hedge fund',
  'roth ira',
  '401k',
  '403b',
  'pension',
  'annuity',
  'social security',
  'required minimum distribution',
  'catch-up contribution',
  'hsa',
  'fidelity',
  'vanguard',
  'asset allocation',
  'risk tolerance',
  'tax-advantaged',
  'retirement',
  'compound interest',

  // Loan and credit terms
  'loan',
  'mortgage',
  'interest',
  'apr',
  'credit',
  'debt',
  'collateral',
  'principal',
  'amortization',
  'refinance',
  'foreclosure',
  'down payment',
  'closing costs',
  'credit score',
  'credit report',
  'credit card',
  'credit limit',
  'minimum payment',

  // Personal finance
  'budget',
  'saving',
  'expense',
  'income',
  'tax',
  'insurance',
  'premium',
  'deductible',
  'financial planning',
  'emergency fund',
  'net worth',
  'cash flow',
  'liquidity',

  // Economic terms
  'economy',
  'inflation',
  'recession',
  'gdp',
  'federal reserve',
  'monetary policy',
  'fiscal policy',
  'exchange rate',
  'currency',
  'forex',
  'commodity',
  'supply and demand',

  // Financial institutions
  'bank of america',
  'chase',
  'wells fargo',
  'citibank',
  'capital one',
  'credit union',
  'fintech',
  'financial institution',
  'central bank',
  'fdic',
  'sec',
];

// Simple keyword-based validation as a fallback
export function isFinanceRelatedByKeywords(query: string): boolean {
  const lowerCaseQuery = query.toLowerCase();
  return financeKeywords.some((keyword) =>
    lowerCaseQuery.includes(keyword.toLowerCase()),
  );
}
