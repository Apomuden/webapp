export interface StockData {
  productName: string;
  uom: string;
  qtyAtHand: number;
  unitCost: number;
  adjustmentMode: string;
  adjustmentQuantity: number;
  expectedValue: number;
  batchNo: string;
  expiryDate: Date;
  reason: string;
}
