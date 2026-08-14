
import { Transaction } from "sequelize";

export default class InvoiceService
{
    async generateInvoiceNumber(
        transaction?: Transaction
      ): Promise<string> {
    
        const timestamp = Date.now();
    
        return `INV-${timestamp}`;
      }

      
}