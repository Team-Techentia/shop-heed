export interface CommonBreadcrumbType {
  title: string;
  parent: string;
}

interface PromocodeType {
  name: string;
  code: string;
  startDate: string;
  endDate: string;
  freeShipping: boolean;
  quantity: number;
  discountType: string;
  discountValue: number;
  status: boolean;
  products: string[];
  categories: string[];
  minimumSpend: number;
  maximumSpend: null;
  perLimit: null;
  perCustomer: number;
}