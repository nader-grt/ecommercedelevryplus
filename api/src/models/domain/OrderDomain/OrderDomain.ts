import { stringToDate } from "../../../util/conversionDateString";
import { STATUS } from "../../Order";
import OrderItemDomain from "../OrderItemDomain/OrderItemDomain";

export enum PAYMENT_STATUS {
    UNPAID = 'unpaid',
    PARTIAL = 'partial',
    PAID = 'paid',
  }

export default class OrderDomain
{

    
private  orderDate!:Date;
 private customerId!:number;
private status!: STATUS;  
private totalAmountOrder!:number ;
private paymentStatus!: PAYMENT_STATUS;
private paidAmount!: number;
private companyId!: number | any;

 
  private items: OrderItemDomain[] = [];

   

                            constructor(customerId: number,    companyId?: number
                            ) {
                                this.customerId = customerId;
                                this.orderDate = new Date();
                                this.status = STATUS.PENDING;
                                this.paymentStatus = PAYMENT_STATUS.UNPAID;
                                this.paidAmount = 0;
                                this.companyId = companyId;

                            }


                            // static reBuildOrderInit(props: {
                            //   id: number;
                            //   customerId: number;
                            //   status: STATUS;
                            //   paymentStatus: PAYMENT_STATUS;
                            //   paidAmount: number;
                            //   orderDate: Date;
                            // }) {
                            //   const order = new OrderDomain(props.customerId);
                            
                            //   order.status = props.status;
                            //   order.paymentStatus = props.paymentStatus;
                            //   order.paidAmount = props.paidAmount;
                            //   order.orderDate = props.orderDate;
                            
                            //   return order;
                            // }


                            static reBuildOrderInit(props: {

                              id:number;
                          
                              customerId:number;
                          
                              companyId?:number;
                          
                              status:STATUS;
                          
                              paymentStatus:PAYMENT_STATUS;
                          
                              paidAmount:number;
                          
                              orderDate:Date;
                          
                          }) {
                          
                              const order =
                                  new OrderDomain(
                                      props.customerId,
                                      props.companyId
                                  );
                          
                              order.status = props.status;
                          
                              order.paymentStatus = props.paymentStatus;
                          
                              order.paidAmount = props.paidAmount;
                          
                              order.orderDate = props.orderDate;
                          
                              return order;
                          }
                                                
                    // addItem( productId: number, name: string, quantity: number, price: number ) 
                    // {

                    //     if (this.status !== STATUS.PENDING) {
                    //     throw new Error("cannot add items after payment");
                    //     }

                    //     if (quantity <= 0) {
                    //     throw new Error("quantity must be greater than zero");
                    //     }

                    //     this.items.push( new OrderItemDomain(productId, name, quantity, price) );
                    // }
                    addItem( productId: number, name: string, quantity: number, price: number, variantId: number ) 
                    {
                    
                        if (this.status !== STATUS.PENDING) {
                        throw new Error("cannot add items after payment");
                        }
                    
                        if (quantity <= 0) {
                        throw new Error("quantity must be greater than zero");
                        }
                    
                        this.items.push( new OrderItemDomain(productId, name, quantity, price, variantId) );
                    }

                    validateBeforeSave() {
                        if (this.items.length === 0) {
                        throw new Error("cannot create order without items");
                        }
                        // 
                    }

                     

                        payMoeny(amount: number ,totalDB:number) {
                          console.log("amounttttt   ",amount)
                       
                          
                            if (amount <= 0) {
                              throw new Error("payment amount must be greater than zero");
                            }
                          
                            this.paidAmount += amount;
                          
                            const total = totalDB;
                          

                            console.log("total paidAmount  ",total ,this.paidAmount)
                            if (this.paidAmount < total) {
                              this.paymentStatus = PAYMENT_STATUS.PARTIAL;
                            } else if (this.paidAmount === total) {
                              this.paymentStatus = PAYMENT_STATUS.PAID;
                              this.status = STATUS.PAID;
                            } else {
                              throw new Error("paid amount exceeds total order amount");
                            }
                          }

                          markAsShipped() {
                            // if (this.paymentStatus !== PAYMENT_STATUS.PAID) {
                            //   throw new Error("order must be paid before shipping");
                            // }
                          
                            if (this.status !== STATUS.PENDING && this.status !== STATUS.PAID) {
                              throw new Error("order cannot be shipped in current state");
                            }
                          
                            console.log("22222222222222 ssssssssshippedddddddddddd  ")
                            this.status = STATUS.SHIPPED;
                        }

                        markAsDelivered() {
                            if (this.status !== STATUS.SHIPPED) {
                            throw new Error("order must be shipped before delivery");
                            }
            
                            this.status = STATUS.DELIVERED;
                        }

                        cancelOrder() {
                            if (this.status === STATUS.DELIVERED) {
                            throw new Error("cannot cancel delivered order");
                            }

                            this.status = STATUS.CANCELLED;
                        }

                        getTotalAmount(): number {
                            let total = 0;
                            for (const item of this.items) {
                            total += item.getTotalPrice();
                            }
                            this.totalAmountOrder = total
                            return  this.totalAmountOrder;
                        }

                        /**
                         private  orderDate!:Date;
 private customerId!:number;
private status!: STATUS;  
                         */

               public get GetCustmerId():number
               {

                return this.customerId ;
               }
               public get GetOrderDate():Date
               {
                 return (this.orderDate)
               }
               public get GetStatusOrder():any
               {
                 return (this.status)
               }

               //totalAmountOrder

               public get GettotalAmountOrder():any
               {
                 return (this.getTotalAmount())
               }
               public get GetItems():any
               {
                return this.items ;
               }
               public getItems(): OrderItemDomain[] {
                return this.items;
            }

               public get GetPaymentStatus() {
                return this.paymentStatus;
              }
              
              public get GetPaidAmount() {
                return this.paidAmount;
              }

              public get GetCompanyId(): number {
                return this.companyId;
            }
}