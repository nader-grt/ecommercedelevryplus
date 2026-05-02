export default function normalizeRecords(records: any[]): any[] {
  return records.map((record) => {
    const id =
      record.id ?? //   id
      record.categoryId ?? // categories
      record.orderId ?? // orders
      record.email ?? // users without id
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

export const adaptCompany = (item: any) => ({
  id: item.id, // must exist for react-admin
  name: item.name,
  type: item.type,
  isActive: Boolean(item.isActive),
  ownerId: item.ownerId,

  // keep full owner for UI (optional but useful)
  owner: item.owner
    ? {
        id: item.owner.id,
        firstName: item.owner.firstName,
        email: item.owner.email,
      }
    : null,
});

export const adaptListCompanies = (json: any) => {
  const records = json?.data ?? [];

  return {
    data: records.map(adaptCompany),
    total: records.length,
  };
};

export const adaptOneCompany = (json: any) => {
  const record = json?.data ?? json;

  return {
    data: adaptCompany(record),
  };
};
// products
export const buildProductFormData = (data: any) => {
  console.log("dataaaaaa  ", data);
  const formData = new FormData();

  const toNumber = (val: any) => {
    if (val === null || val === undefined || val === "") return null;
    const num = Number(val);
    return isNaN(num) ? null : num;
  };

  const price = toNumber(data.price);

  if (data.type != "VARIABLE") {
    formData.append("price", String(data.price));
  } else {
    formData.append("price", price !== null ? String(price) : "");
  }

  formData.append("name", data.name);
  formData.append("type", data.type);
  formData.append("categoryId", String(data.categoryId));

  if (data.type === "VARIABLE") {
    formData.append("variants", JSON.stringify(data.variants || []));
  }

  if (data.image?.rawFile) {
    formData.append("imageName", data.image.rawFile);
  }

  return formData;
};
export const adaptListProducts = (json: any) => {
  const products = json?.data?.data || [];

  const records = products.map((p: any) => ({
    id: p.id, //
    name: p.name|| "",
    price: p.price || 0,
    urlImage: p.urlImage || "",
    categoryId: p.categoryId || null,
    supplierId: p.supplierId || null,
    type: p.type,
    variants: p.variants || [],
  }));

  return {
    data: records,
    total: json?.data?.total || records.length,
  };
};

// export const adaptUserAddresses = (json: any) => {
//   const users = json?.data || [];

//   const records = users.flatMap((user: any) =>
//     user.addresses.map((addr: any, index: number) => ({
//       // id: `${user.id}-${index}`, // id
//       id: `${user.id}`,
//       // userId: user.id,
//       firstName: user.firstName || "",
//       lastName: user.lastName || "",
//       email: user.email || "",
//       phone: user.phone || "",

//       street: addr.street || "",
//       city: addr.city || "",
//       country: addr.country || "",
//       zipCode: addr.zipeCode || 0,
//     }))
//   );

//   return {
//     data: records,
//     total: records.length,
//   };
// };
/*
export const adaptUserAddresses = (json: any) => {
  const users = json?.data || [];

  const records = users.flatMap((user: any) =>
    user.addresses.map((addr: any, index: number) => ({
      id: `${user.id}-${index}`, // ✅ UNIQUE ID per row
      userId: user.id, // optional but useful

      firstName: user.firstName || "",
      lastName: user.lastName || "",
      email: user.email || "",
      phone: user.phone || "",

      street: addr.street || "",
      city: addr.city || "",
      country: addr.country || "",
      zipCode: addr.zipeCode || 0,
    }))
  );

  return {
    data: records,
    total: records.length,
  };
};*/

export const adaptUserAddresses = (json: any) => {
  const users = json?.data || [];

  const map = new Map();

  users.forEach((user: any) => {
    (user.addresses || []).forEach((addr: any) => {
      //  use address.id as unique key
      if (!map.has(addr.id)) {
        map.set(addr.id, {
          id: addr.id, //  stable unique id
          userId: user.id,

          firstName: user.firstName || "",
          lastName: user.lastName || "",
          email: user.email || "",
          phone: user.phone || "",

          street: addr.street || "",
          city: addr.city || "",
          country: addr.country || "",
          zipCode: addr.zipeCode || 0,
        });
      }
    });
  });

  const records = Array.from(map.values());

  return {
    data: records,
    total: records.length,
  };
};
export const adaptCreateUserAddress = (json: any) => {
  const addr = json?.data?.addresses?.[0];

  if (!addr) {
    throw new Error("No address returned from API");
  }

  return {
    data: {
      id: addr.id,
      userId: addr.userId,
      street: addr.street,
      city: addr.city,
      country: addr.country,
      zipCode: addr.zipCode,
    },
  };
};

// userAddressAdapter.ts

export const adaptUpdateUserAddress = (json: any) => {
  const data = json.data;

  return {
    id: data.id,
    addresses:
      data.addresses?.map((addr: any) => ({
        id: addr.id,
        street: addr.street,
        city: addr.city,
        country: addr.country,
        zipCode: addr.zipCode,
        delegation: addr.delegation || "",
        addressSuplementaire: addr.addressSuplementaire || "",
      })) || [],
  };
};

export const adaptGetOneUserAddress = (json: any) => {
  const user = json?.data || json;

  return {
    data: {
      id: user.id, //

      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      phone: user.phone,

      addresses: (user.addresses || []).map((addr: any) => ({
        id: addr.id,
        street: addr.street,
        city: addr.city,
        country: addr.country,

        //
        zipCode: addr.zipCode || addr.zipeCode,

        userId: addr.userId,
      })),
    },
  };
};

export const adaptListProductByCategory1 = (json: any) => {
  const products = json?.data?.products || [];

  const records = products.map((p: any, index: number) => ({
    id: p.id,
    name: p.name || "",
    price: p.price || 0,
    type:p.type || "",
    urlImage: p.urlImage || "",
    categoryId: p.CategoryId || null,
    supplierId: p.supplierId || null,
   
    variants: Array.isArray(p.variants) ? p.variants : [],
  }));

  return {
    data: records,
    total: records.length,
  };
};
/*
export const adaptListProductByCategory = (json: any) => {
  const products = json?.data?.products || [];

  const records = products.map((p: any) => ({
    id: p.id, //  FIX هنا

    name: p.nameProduct || "",
    price: p.priceProduct || 0,
    urlImage: p.urlImage || "",
    categoryId: p.categoryId || null,
    supplierId: p.supplierId || null,
    variants: Array.isArray(p.variants) ? p.variants : [],
  }));

  return {
    data: records,
    total: records.length,
  };
};*/



// this is list with filter by category
export const adaptListProductByCategory = (json: any) => {
  const products = json?.data?.products || [];

  const records = products.map((p: any) => ({
    id: p.id,

    name: p.name,   
    price: p.price, 
    type:p.type || "",
    urlImage: p.urlImage,
    categoryId: p.category?.id ?? null,
    variants: Array.isArray(p.variants) ? p.variants : [],
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

export const adaptGetManyUserAddresses = (json: any) => {
  const user = json?.data;

  const addresses = user?.addresses || [];

  return {
    data: addresses.map((addr: any) => ({
      id: addr.id, //
      userId: user.id,

      street: addr.street,
      city: addr.city,
      country: addr.country,
      delegation: addr.delegation,
      addressSuplementaire: addr.addressSuplementaire,
      zipCode: addr.zipCode || addr.zipeCode,
    })),

    total: addresses.length,
  };
};


const adaptCategory = (cat: any) =>
  cat
    ? {
        id: cat.id,
        name: cat.name,
      }
    : null;
export const adaptUpdateProductWithVariant1 = (json: any) => {
  const record = json?.data;

  if (!record) {
    throw new Error("Invalid product response");
  }

  return {
    data: {
      id: record.id,
      name: record.name,
      price: record.price,
      urlImage: record.urlImage,
      categoryId: record.categoryId,
      supplierId: record.supplierId,
      type: record.type,

      variants: record.variants || [],

      // FIX: include category properly
      category: record.category
        ? {
            id: record.category.id,
            name: record.category.name,
          }
        : null,
    },
  };
};




export const adaptUpdateProductWithVariant = (json: any) => {
  const record = json?.data;

  if (!record) {
    throw new Error("Invalid product response");
  }

  return {
    data: {
      id: record.id,
      name: record.name,
      price: record.price,
      urlImage: record.urlImage,

      categoryId: record.category?.id ?? record.categoryId,
      categoryName: record.category?.name ?? "",

      supplierId: record.supplierId,
      type: record.type,

  
      variants: Array.isArray(record.variants)
      ? record.variants.map((v:any) => ({
          id: v.id,
          sku: v.sku,
          color: v.color,
          size: v.size,
          price: Number(v.price),
        }))
      : [],
      category: record.category
        ? {
            id: record.category.id,
            name: record.category.name,
          }
        : null,
    },
  };
};








export const adaptListCategories = (json: any) => {
  const raw = json?.data;

  let records: any[] = [];

  // 1: إذا كانت array
  if (Array.isArray(raw)) {
    records = raw;
  }

  // 2: إذا كانت { data: [] }
  else if (Array.isArray(raw?.data)) {
    records = raw.data;
  }

  else if (raw?.category) {
    records = [raw.category];
  }

  return {
    data: records.map((cat: any) => ({
      id: cat.categoryId ?? cat.id,
      name: cat.name,
    })),
    total: records.length,
  };
};




// export const adaptListCategories = (json: any) => {
//   const raw = json?.data;

//   // =========================
//   // CASE 1: backend returns { data: [...] }
//   // =========================
//   let records = [];

//   if (Array.isArray(raw)) {
//     records = raw;
//   } else if (Array.isArray(raw?.data)) {
//     records = raw.data;
//   } else {
//     records = [];
//   }

//   return {
//     data: records.map((cat: any) => ({
//       id: cat.id,
//       name: cat.name,
//     })),
//     total: records.length,
//   };
// };


//warehouse 

export const adaptWarehouses = (json: any) => {
  const records = json?.data || [];

  return {
    data: records.map((w: any) => ({
      id: w.id,
      name: w.name,
      companyId: w.companyId,

      //  flatten relation
      companyName: w.company?.name || null,
      ownerId: w.company?.ownerId || null,
    })),
    total: records.length,
  };
};

export const adaptOneWarehouse = (json: any) => {
  const w = json?.data;

  return {
    data: {
      id: w.id,
      name: w.name,
      companyId: w.companyId,

      companyName: w.company?.name || null,
      ownerId: w.company?.ownerId || null,
    },
  };
};