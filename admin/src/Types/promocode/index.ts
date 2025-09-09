export interface PromocodeType {
    _id?: string;
    name: string;
    code: string;
    startDate: string | null;
    endDate: string | null;
    freeShipping: boolean;
    usedQuantity?: number;
    discountType: string;
    discountValue: number | null;
    status: boolean;
    categories: string[] | null;
    minimumSpend: number | null;
    perLimit: number | null;
    perCustomer: number | null;
}