export type Product = {
  id: string;
  priceId: string;
  name: string;
  description: string;
  price: string;
  mode: 'payment' | 'subscription';
  features: string[];
};

export const products: Product[] = [
  {
    id: 'prod_SE3iIbYkURgGDy',
    priceId: 'price_1RJbb0IP1R4GXsCdxlNJwt6J',
    name: 'Startup Logo',
    description: 'Perfect for startups and small businesses. Get a professional, unique logo in minutes.',
    price: '$9.99',
    mode: 'payment',
    features: [
      '5 Logo generations',
      'High-resolution downloads',
      'Commercial use license',
      'Multiple style options',
      'Instant delivery',
      'Lifetime access'
    ]
  }
];