import { Warehouse } from "../../models/Warehouse";


export  abstract class IWareHouseRepo 
{

    abstract create(data: Partial<Warehouse>): Promise<Warehouse | any>;
    abstract   findByNameAndCompany(name: string, companyId: number): Promise<any>;
    abstract findById(id: number): Promise<Warehouse | null>;
    abstract getById(warehouseId: string,): Promise<any | null> 
    abstract findAll(dataclean:any,notcleandata:any): Promise<any[]>

    abstract findAllFiltredByName(dataclean:any,notcleandata:any): Promise<any[]>
    abstract findByCompanyId(companyId: number): Promise<Warehouse[]>;
    abstract getWarehouseById(warehouseId: number,  user?: any): Promise<any>;
    // abstract update(id: number, data: Partial<Warehouse>): Promise<Warehouse | null>;
    // abstract delete(id: number): Promise<void>;
}