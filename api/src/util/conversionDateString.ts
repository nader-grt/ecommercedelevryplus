
export  function dateToStringDMY(date: Date): string {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
  
    return `${day}-${month}-${year}`;
  }

  
 export  function stringToDate(dateStr: string): Date {
    return new Date(dateStr);
  }
  

 export function sanitizeProductVariant(dto: any) {
    return {
      name: (dto.name || "").replace(/^"+|"+$/g, "").trim(),
      price: dto.price ? Number(dto.price) : 0,
      categoryId: Number(dto.categoryId),
      supplierId: dto.supplierId ? Number(dto.supplierId) : null,
    };
  }