import chalk from 'chalk';
import { Transaction } from "sequelize";
import { Inventorie, Warehouse } from "../../models/main";

export interface OrderItemInput {
    orderItemId: number;
    variantId: number;
    quantity: number;
}

export interface Allocation {
    orderItemId: number;
    warehouseId: number;
    variantId: number;
    quantity: number;
}

// ===================================================
// CUSTOM ERROR
// ===================================================

class WarehouseAllocationError extends Error {
    constructor(
        public readonly code: string,
        message: string,
        public readonly details?: any
    ) {
        super(message);
        this.name = 'WarehouseAllocationError';
    }
}

// ===================================================
// SERVICE - تخصيص المستودع
// ===================================================

export default class ResolveWarehouseForItemService {

    public async executeService(
        companyId: number,
        items: OrderItemInput[],
        transaction: Transaction
    ): Promise<Allocation[]> {

        // ── عنوان البداية ──
        console.log(chalk.cyan.bold('\n═══════════════════════════════════════'));
        console.log(chalk.cyan.bold('  🔍 Warehouse Resolver'));
        console.log(chalk.cyan.bold('═══════════════════════════════════════'));
        
        console.log(chalk.yellow('\n📦 العناصر المطلوبة:'));
        items.forEach(item => {
            console.log(
                chalk.white('   • variantId: ') + 
                chalk.magenta(item.variantId) + 
                chalk.white(' × ') + 
                chalk.magenta(item.quantity)
            );
        });

        // ── STEP 1: جلب المستودعات ──
        const warehouses = await Warehouse.findAll({
            where: { companyId },
            transaction
        });

        console.log(chalk.yellow('\n🏭 المستودعات للشركة ') + chalk.magenta(companyId) + chalk.yellow(': ') + chalk.magenta(warehouses.length));

        if (warehouses.length === 0) {
            console.log(chalk.red.bold('\n❌ لا يوجد مستودعات!'));
            console.log(chalk.gray('   الحل: أنشئ مستودعاً أولاً'));
            
            throw new WarehouseAllocationError(
                'NO_WAREHOUSES',
                `لا يوجد مستودعات للشركة ${companyId}`,
                { companyId }
            );
        }

        warehouses.forEach(w => {
            console.log(
                chalk.green('   ✓ ') + 
                chalk.white('مستودع #') + 
                chalk.magenta(w.id) + 
                chalk.white(': ') + 
                chalk.cyan(w.name || 'بدون اسم')
            );
        });

        // ── STEP 2: فحص كل مستودع ──
        for (const warehouse of warehouses) {
            
            console.log(chalk.yellow('\n┌─────────────────────────────────────┐'));
            console.log(
                chalk.yellow('│ فحص مستودع #') + 
                chalk.magenta(warehouse.id) + 
                chalk.yellow(' (') + 
                chalk.cyan(warehouse.name || 'بدون اسم') + 
                chalk.yellow(')')
            );
            console.log(chalk.yellow('└─────────────────────────────────────┘'));

            const warehouseCheck = await this.checkWarehouseDetailed(
                warehouse.id,
                companyId,
                items,
                transaction
            );

            const canFulfill = warehouseCheck.every(i => i.sufficient);

            if (canFulfill) {
                console.log(chalk.green.bold('\n✅ نجاح! المستودع يمكنه التلبية'));
                console.log(chalk.green('   جاري إنشاء التخصيصات...'));

                return items.map(item => ({
                    orderItemId: item.orderItemId,
                    warehouseId: warehouse.id,
                    variantId: item.variantId,
                    quantity: item.quantity
                }));
            }

            console.log(chalk.red('\n❌ فشل: المستودع لا يمكنه التلبية'));
        }

        // ── STEP 3: لا يوجد مستودع كافٍ ──
        console.log(chalk.red.bold('\n═══════════════════════════════════════'));
        console.log(chalk.red.bold('  🚨 فشل: لا يوجد مستودع كافٍ'));
        console.log(chalk.red.bold('═══════════════════════════════════════'));

        const errorMessage = this.buildErrorMessage(items);
        
        throw new WarehouseAllocationError(
            'NO_WAREHOUSE_CAN_FULFILL',
            errorMessage,
            { companyId, items }
        );
    }

    // ═══════════════════════════════════════════════════
    // PRIVATE: فحص مفصل
    // ═══════════════════════════════════════════════════

    private async checkWarehouseDetailed(
        warehouseId: number,
        companyId: number,
        items: OrderItemInput[],
        transaction: Transaction
    ): Promise<Array<{
        variantId: number;
        required: number;
        found: boolean;
        available?: number;
        sufficient?: boolean;
    }>> {

        const results = [];

        for (const item of items) {
            
            const inventory: any = await Inventorie.findOne({
                where: { warehouseId, companyId, variantId: item.variantId },
                transaction
            });

            if (!inventory) {
                console.log(
                    chalk.red('   ✗ variantId ') + 
                    chalk.magenta(item.variantId) + 
                    chalk.red(': ') + 
                    chalk.white('لا يوجد سجل مخزون')
                );
                
                results.push({
                    variantId: item.variantId,
                    required: item.quantity,
                    found: false
                });
                continue;
            }

            const available = inventory.quantity - inventory.reserved;
            const sufficient = available >= item.quantity;

            console.log(
                chalk.blue('   ℹ variantId ') + 
                chalk.magenta(item.variantId) + 
                chalk.blue(': ') +
                chalk.white('الكمية=') + chalk.yellow(inventory.quantity) +
                chalk.white(' المحجوز=') + chalk.yellow(inventory.reserved) +
                chalk.white(' المتاح=') + (available >= item.quantity ? chalk.green(available) : chalk.red(available)) +
                chalk.white(' المطلوب=') + chalk.yellow(item.quantity)
            );

            if (sufficient) {
                console.log(chalk.green('     ✓ كافٍ'));
            } else {
                console.log(chalk.red('     ✗ غير كافٍ'));
            }

            results.push({
                variantId: item.variantId,
                required: item.quantity,
                found: true,
                available,
                sufficient
            });
        }

        return results;
    }

    // ═══════════════════════════════════════════════════
    // PRIVATE: بناء رسالة الخطأ
    // ═══════════════════════════════════════════════════

    private buildErrorMessage(items: OrderItemInput[]): string {

        const lines: string[] = [];
        
        lines.push(chalk.red.bold('\n📋 ملخص المشكلة:'));
        lines.push(chalk.white('───────────────────────────────────────'));

        items.forEach(item => {
            lines.push(
                chalk.yellow('  • المنتج ') + 
                chalk.magenta(item.variantId) + 
                chalk.yellow(' (مطلوب: ') + 
                chalk.magenta(item.quantity) + 
                chalk.yellow(')')
            );
        });

        lines.push(chalk.white('\n───────────────────────────────────────'));
        lines.push(chalk.cyan('📝 SQL لإصلاح المشكلة:'));
        lines.push(chalk.white('───────────────────────────────────────'));

        items.forEach(item => {
            lines.push(chalk.gray(`-- إضافة مخزون لـ variantId ${item.variantId}:`));
            lines.push(
                chalk.green('INSERT INTO ') + 
                chalk.yellow('Inventories ') + 
                chalk.white('(variantId, warehouseId, quantity, reserved, companyId) ') +
                chalk.green('VALUES ') +
                chalk.magenta(`(${item.variantId}, 1, ${item.quantity + 100}, 0, 29);`)
            );
            lines.push('');
        });

        lines.push(chalk.white('───────────────────────────────────────'));

        return lines.join('\n');
    }
}