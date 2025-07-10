// Types for advanced marketplace features

export type User = {
  id: string;
  name: string;
  email: string;
  isVerified: boolean;
  avatarUrl?: string;
  points?: number;
  badges?: string[];
};

export type Product = {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  owner: User;
  diagnostics?: ProductDiagnostics;
  priceHistory?: PriceHistoryEntry[];
  reviews?: Review[];
  questions?: Question[];
  tradeOffers?: TradeOffer[];
};

export type ProductDiagnostics = {
  reportUrl?: string; // PDF or image
  summary?: string; // Text summary
  uploadedAt: string;
};

export type TradeOffer = {
  id: string;
  fromUser: User;
  toUser: User;
  offeredProduct?: Product;
  requestedProduct: Product;
  cashAdjustment?: number;
  status: 'pending' | 'accepted' | 'rejected' | 'countered';
  createdAt: string;
};

export type Question = {
  id: string;
  productId: string;
  user: User;
  text: string;
  answer?: string;
  answeredBy?: User;
  createdAt: string;
};

export type Review = {
  id: string;
  productId: string;
  user: User;
  rating: number;
  comment: string;
  createdAt: string;
};

export type PriceHistoryEntry = {
  date: string;
  price: number;
};

export type Gamification = {
  userId: string;
  points: number;
  badges: string[];
  history: GamificationEvent[];
};

export type GamificationEvent = {
  id: string;
  type: 'buy' | 'sell' | 'review' | 'answer' | 'trade' | 'login';
  points: number;
  date: string;
  description?: string;
};

export type ChatMessage = {
  id: string;
  from: User;
  to: User;
  text: string;
  sentAt: string;
  productId?: string;
  tradeOfferId?: string;
}; 