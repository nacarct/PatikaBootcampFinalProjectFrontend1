export interface Policy{
  policyNo: string;
  insurerId: number;
  insuredId: number;
  productId: number;
  createDate: Date;
  amount: number;
  isPaid: string;
  height: number;
  weight: number;
  relation: string;
}
