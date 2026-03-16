




 export default function normalizeRecords(records: any[]): any[] {
    return records.map(record => {
      const id =
        record.id ??          //   id
        record.categoryId ??  // categories
        record.orderId ??     // orders
        record.email ??       // users without id
        Object.values(record)[0]; // : 
  
      return { ...record, id };
    });
  }


  

export const extractData = (json: any) => {
  if (json && json.data !== undefined) {
    return json.data;
  }
  return json;
};

export const adaptList = (json: any) => {
  const records = extractData(json);

  return {
    data: records,
    total: records.length,
  };
};

export const adaptListProducts = (json: any) => {
  // حماية من undefined
  const products = json?.data?.data || [];

  // إذا لا يوجد منتجات → ترجع data فارغة بدون crash
  const records = products.map((p: any, index: number) => ({
    id: index + 1,
    name: p.nameProduct || "",
    price: p.priceProdust || 0,
    urlImage: p.urlImage || "",
    categoryId: p.CategoryId || null,
    supplierId: p.supplierId || null,
  }));

  return {
    data: records,
    total: records.length,
  };
};

export const adaptListProductByCategory = (json: any) => {

  const products = json?.data?.products || [];

 
  const records = products.map((p: any, index: number) => ({
    id: index + 1,
    name: p.nameProduct || "",
    price: p.priceProdust || 0,
    urlImage: p.urlImage || "",
    categoryId: p.CategoryId || null,
    supplierId: p.supplierId || null,
  }));

  return {
    data: records,
    total: records.length,
  };
};

export const adaptObject = (json: any) => {
  const record = extractData(json);

  return {
    data: record,
  };
};