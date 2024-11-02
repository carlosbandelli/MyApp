export interface Product {
  id: number;
  name: string;
}
export interface List {
  id: number;
  name: string | null;
  products: Product[];
  totalValue: number;
  userId: number;
}
