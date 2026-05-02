import { adaptCreateUserAddress, adaptGetManyUserAddresses, adaptList, adaptListCategories, adaptListCompanies, adaptListProductByCategory, adaptListProducts, adaptObject,adaptOneCompany,adaptOneWarehouse,adaptUpdateProductWithVariant,adaptUpdateUserAddress,adaptUserAddresses, buildProductFormData } from "../../apiAdapter";
import { httpclientService } from "../../auth/httpclientService/httpclientService";
import { buildProductFormDataProvider } from "../../shared/utils/buildFormData";


const apiUrl = "http://localhost:4000/api";

const dataProvider: any = {
  getList: async (resource:any, params:any) => {

    console.log(resource,"params",params)
    
    const { page = 1, perPage = 10 } = params.pagination || {};
  const { field = "id", order = "ASC" } = params.sort || {};
  const filter = params.filter || {};

  let url = "";
  const categoryId = filter.categoryId;
  if (resource === "products") {


    if (categoryId) {
      url = `${apiUrl}/products/${categoryId}/categories`;
    } else {
      url = `${apiUrl}/products`;
    }
  } else {
    const query = {
      page,
      perPage,
      sort: field,
      order,
      filter: JSON.stringify(filter),
    };
    url = `${apiUrl}/${resource}?${new URLSearchParams(query).toString()}`;
  }

  const { json } = await httpclientService(url);


  if (resource === "companies") {
    return adaptListCompanies(json);
  }

  //  =========================
  //  ADD THIS BLOCK HERE
  //  =========================
  if (resource === "owners") {
    const records = json?.data || [];

    return {
      data: records.map((item: any) => ({
        ...item,
        id: item.id,
      })),
      total: records.length,
    };
  }

  if (resource === "categories") {
    const query = {
      page,
      perPage,
      sort: field,
      order,
      filter: JSON.stringify(filter),
    };
  
    const url = `${apiUrl}/categories?${new URLSearchParams(query).toString()}`;
  
    const { json } = await httpclientService(url);
  
    return adaptListCategories(json);
  }

  if (resource === "products") {

    if (categoryId) {

     // console.log("******** by category")
    return adaptListProductByCategory(json);
    } else {
      return adaptListProducts(json);
    }
    
  }
   
      if(resource === "usersAddress")
      {
        const { json } = await httpclientService(
          `${apiUrl}/${resource}`
        );

        console.log("jsssssson ",json)
        return adaptUserAddresses(json)

      }
  return adaptList(json);
    },

  getOne: async (resource: any, params: any) => {
   
    if (resource === "categories") {
      const { json } = await httpclientService(
        `${apiUrl}/categories/${params.id}`,
        {
          credentials: "include",
        }
      );
    
      return {
        data: {
          id: json.data.categoryId,  //  FIX
          name: json.data.name,
        },
      };
    }

    // =========================
    //  PRODUCTS / ID FIX
    // =========================
    if (resource === "products") {
      const { json } = await httpclientService(
        `${apiUrl}/products/${params.id}`
      );
  
      return adaptUpdateProductWithVariant(json);
    }
   
    //warehouse one 
    if (resource === "warehouses") {
      const { json } = await httpclientService(
        `${apiUrl}/warehouses/${params.id}`
      );
    
      return adaptOneWarehouse(json);
    }

    if (resource === "inventories") {

      //  HERE
      const urlParams = new URLSearchParams(window.location.search);
  
      const variantId = urlParams.get("variantId");
      const warehouseId = urlParams.get("warehouseId");
  
      const query = new URLSearchParams();
  
      if (variantId) query.append("variantId", variantId);
      if (warehouseId) query.append("warehouseId", warehouseId);
  
      const url = `${apiUrl}/${resource}/${params.id}?${query.toString()}`;
  
      const { json } = await httpclientService(url);
  
      return adaptObject(json.data);
    }
  

    
   
    if (resource === "companies") {
        
      console.log("*****  ", `${apiUrl}/${resource}/${params.id}`)
      const { json } = await httpclientService(
        `${apiUrl}/${resource}/${params.id}`
      );
      return adaptOneCompany(json);
    }

               
    const { json } = await httpclientService(
      `${apiUrl}/${resource}/${params.id}`
    );
    return adaptObject(json);
  },

  getMany: async (resource: string, params: { ids: number[] }) => {
    try {
      const { json } = await httpclientService(
        `${apiUrl}/${resource}?ids=${params.ids.join(",")}`
      );
  
      let dataArray: any[] = [];
  
      // =========================
      // normalize response
      // =========================
      if (Array.isArray(json.data)) {
        dataArray = json.data;
      } else if (json.data && typeof json.data === "object") {
        dataArray = [json.data];
      }
  
      // =========================
      // FIX: ensure id exists
      // =========================
      const normalized = dataArray.map((item: any) => ({
        ...item,
        id:
          item.id ??
          item.categoryId ??
          item.orderId ??
          item.userId ??
          item.email ??
          null,
      }));
  
      // =========================
      // validate safely (no crash)
      // =========================
      const valid = normalized.filter((item) => item.id !== null);
  
      if (valid.length !== normalized.length) {
        console.warn(
          `getMany warning: some ${resource} items missing id`,
          normalized
        );
      }
  
      return { data: valid };
    } catch (error) {
      console.error("getMany error:", error);
      return { data: [] };
    }
  },

  getManyReference: async (resource: any, params: any) => {

    if (resource === "usersAddress") {
      //addresses
      const url = `${apiUrl}/usersAddress/${params.id}`;
  
      const { json } = await httpclientService(url);
  
      // return {
      //   data: json.data || json,
      //   total: (json.data || json).length,
      // };

      return adaptGetManyUserAddresses(json)
    }
    const { json } = await httpclientService(
      `${apiUrl}/${resource}?${params.target}=${params.id}`
    );
    return { data: json.data, total: json.total };
  },

  create: async (resource: any, params: any) => {
    if (resource === "categories") {
      const { json } = await httpclientService(`${apiUrl}/categories`, {
        method: "POST",
        body: JSON.stringify(params.data),
        credentials: "include",
      });
    
      //  FIX: correct deep structure
      const record = json?.data?.data;
    
      if (!record?.id) {
        console.error(" BAD CATEGORY RESPONSE:", json);
        throw new Error("Missing category id in response");
      }
    
      return {
        data: {
          id: record.id,
          name: record.name,
        },
      };
    }
   
    if (resource === "products") {
      const url = `${apiUrl}/products`;
  
      const { variants = [], imageName, ...productData } = params.data;
  
      const formData = new FormData();
  
      Object.entries(productData).forEach(([key, value]) => {
        if (value !== undefined && value !== null && typeof value !== "object") {
          formData.append(key, String(value));
        }
      });
  
      // variants
      formData.append("variants", JSON.stringify(variants));
  
      // image (IMPORTANT FIX)
      if (imageName instanceof File) {
        formData.append("imageName", imageName);
      }
  
      const { json } = await httpclientService(url, {
        method: "POST",
        body: formData,
      });
  
      return adaptObject(json);
    }
  

    if (resource.toLowerCase().includes("useraddress")) {
      const url = `${apiUrl}/usersAddress`;
  
     
  
      const { json } = await httpclientService(url, {
        method: "POST",
        body: JSON.stringify(params.data),
      });
  
    

      const adapted = adaptCreateUserAddress(json);
  
     
      const addr = json?.data?.addresses?.[0];

    return {
      data: {
        id: addr?.id, 
        userId: addr?.userId,
        street: addr?.street,
        city: addr?.city,
        country: addr?.country,
        zipCode: addr?.zipCode,
      },
    };
      //return adapted; //
    }
  
    // default
    const { json } = await httpclientService(`${apiUrl}/${resource}`, {
      method: "POST",
      body: JSON.stringify(params.data),
    });
  
    return adaptObject(json);
    //return { data: json };
  },

  update: async (resource: any, params: any) => {
    console.log("updatedd product variant ")
    const url = `${apiUrl}/${resource}/${params.id}`;
    if (resource === "userAddresses") {
      console.log("fffffffffff ",params.data)
      const url = `${apiUrl}/usersAddress/${params.id}`;
  
     
      const { json } = await httpclientService(url, {
        method: "PUT",
        body: JSON.stringify(params.data),
        credentials: "include"
      });
  
    
      return adaptUpdateUserAddress(json);
    }

    // =========================
    //  Category 
    // =========================
    if (resource === "categories") {
      const { json } = await httpclientService(
        `${apiUrl}/categories/${params.id}`,
        {
          method: "PUT",
          body: JSON.stringify(params.data),
          credentials: "include",
        }
      );
    
      return {
        data: {
          id: params.id,
          ...params.data,
        },
      };
    }
    // =========================
    //  PRODUCTS (IMAGE + VARIANTS)
    // =========================
  
  
    if (resource === "products") {
      const formData = buildProductFormDataProvider(params.data);
    
      const { json } = await httpclientService(
        `${apiUrl}/products/${params.id}`,
        {
          method: "PUT",
          body: formData,
        }
      );
    
      return adaptObject(json);
    }


    // if (resource === "products") {
    //   const data = params.data;
    
    //   console.log("🔥 REAL DATA:", data);
    
    //   const formData = new FormData();
    
    //   // ===============================
    //   // 🔹 SAFE FIELDS
    //   // ===============================
    //   formData.append("name", (data.name ?? "").toString().trim());
    //   formData.append("price", String(data.price ?? 0));
    //   formData.append("categoryId", String(data.categoryId ?? ""));
    //   formData.append("supplierId", String(data.supplierId ?? ""));
    //   formData.append("type", data.type ?? "VARIABLE");
    
    //   // ===============================
    //   // 🔥 VARIANTS (FIX IMPORTANT)
    //   // ===============================
    //   const variants =
    //     typeof data.variants === "string"
    //       ? data.variants
    //       : JSON.stringify(data.variants ?? []);
    
    //   formData.append("variants", variants);
    
    //   // ===============================
    //   // 🔥 IMAGE FIX (react-admin format)
    //   // ===============================
    //   const file = data?.image?.rawFile;
    
    //   if (file instanceof File) {
    //     formData.append("imageName", file);
    //   }
    
    //   const { json } = await httpclientService(
    //     `${apiUrl}/products/${params.id}`,
    //     {
    //       method: "PUT",
    //       body: formData,
    //     }
    //   );
    
    //   console.log(" SERVER RESPONSE:", json);
    
    //   return adaptObject(json);
    // }

    const { json } = await httpclientService(
      `${apiUrl}/${resource}/${params.id}`,
      {
        method: "PUT",
        body: JSON.stringify(params.data),
      }
    );

    return adaptObject(json);
    // return { data: json };
  },

  updateMany: async (resource: any, params: any) => {
    const { json } = await httpclientService(`${apiUrl}/${resource}`, {
      method: "PUT",
      body: JSON.stringify(params.ids),
    });
    return { data: json }; // array
  },

  delete: async (resource: any, params: any) => {

    if (resource === "categories") {
      console.log(" pppppppppppp  " ,params)
      const { json } = await httpclientService(
        `${apiUrl}/${resource}/${params.id}`,
        {
          method: "DELETE",
        }
      );
    
      return {
        data: {
          id: params.id,
          status: json.status,
          message: json.message,
          data: json.data,
        },
      };
    }


    const { json } = await httpclientService(
      `${apiUrl}/${resource}/${params.id}`,
      {
        method: "DELETE",
      }
    );
    return adaptObject(json);
  },

  deleteMany: async (resource: any, params: any) => {
    const { json } = await httpclientService(`${apiUrl}/${resource}`, {
      method: "DELETE",
      body: JSON.stringify(params.ids),
    });
    return { data: json };
  },

};

export default dataProvider;
