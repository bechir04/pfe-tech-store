// Types for advanced marketplace features

export type User = {
  id: string;
  name: string;
  email: string;
  isVerified: boolean;
  avatarUrl?: string;
  avatar?: string; // for marketplace seller avatar
  points?: number;
  badges?: string[];
  rating?: number; // for sellers
  verified?: boolean; // for sellers
  sales?: number; // for sellers
};

export type Product = {
  id: string;
  name: string;
  description: string;
  price: number;
  images: string[]; // multiple images
  videoUrl?: string;
  category: string;
  owner?: User; // optional for marketplace
  seller?: {
    id: string;
    name: string;
    avatar: string;
    badges: string[];
    rating: number;
    verified: boolean;
    sales?: number;
  };
  condition: 'new' | 'like new' | 'used' | 'refurbished';
  warranty?: string;
  specs?: { key: string; value: string }[];
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