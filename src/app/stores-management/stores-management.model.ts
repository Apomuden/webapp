export interface StockAdjustmentData {
  id: number;
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

export class StockApprovalData {
  reqData: StockAdjustmentData;
  approvalMode ? = '+';
  approvedQty ? = 0;
}
