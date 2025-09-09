import { PromocodeType } from "@/Types";

export const Href = ''
export const ImagePath = "/assets/images";

export const DEFAULT_PROMOCODE_FORM: PromocodeType = {
    name: '',
    code: '',
    startDate: null,
    endDate: null,
    freeShipping: false,
    discountType: '',
    discountValue: null,
    status: false,
    categories: [],
    minimumSpend: null,
    perLimit: null,
    perCustomer: null,
};