export interface StockTransferProps {
    variantId: number;
    fromWarehouseId: number;
    toWarehouseId: number;
    quantity: number;
  }
  
  
  export default class StockTransferDomain {
  
    private readonly _variantId: number;
    private readonly _fromWarehouseId: number;
    private readonly _toWarehouseId: number;
    private readonly _quantity: number;
  
  
    constructor(props: StockTransferProps) {
  
      if (props.fromWarehouseId === props.toWarehouseId) {
        throw new Error(
          "Source and destination warehouse cannot be the same"
        );
      }
  
  
      if (props.quantity <= 0) {
        throw new Error(
          "Transfer quantity must be greater than zero"
        );
      }
  
  
      this._variantId = props.variantId;
      this._fromWarehouseId = props.fromWarehouseId;
      this._toWarehouseId = props.toWarehouseId;
      this._quantity = props.quantity;
    }
  
  
    get variantId() {
      return this._variantId;
    }
  
  
    get fromWarehouseId() {
      return this._fromWarehouseId;
    }
  
  
    get toWarehouseId() {
      return this._toWarehouseId;
    }
  
  
    get quantity() {
      return this._quantity;
    }
  
  
    canTransfer(sourceAvailable:number):boolean {
  
      return sourceAvailable >= this._quantity;
  
    }
  
  }