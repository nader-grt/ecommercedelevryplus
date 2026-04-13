import { adaptCreateUserAddress, adaptGetManyUserAddresses, adaptGetOneUserAddress, adaptList, adaptListCompanies, adaptListProductByCategory, adaptListProducts, adaptObject,adaptOneCompany,adaptUpdateProductWithVariant,adaptUpdateUserAddress,adaptUserAddresses, buildProductFormData } from "../../apiAdapter";
import { httpclientService } from "../../auth/httpclientService/httpclientService";


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
    console.log("RESOURCE CALLED:", resource, params);
    // =========================
    // 🟢 PRODUCTS / ID FIX
    // =========================
    if (resource === "products") {
      const { json } = await httpclientService(
        `${apiUrl}/products/${params.id}`
      );
  
      return adaptUpdateProductWithVariant(json);
    }
    // if (resource === "inventories") {
    //   const record = params.meta?.record;
  
    //   const variantId = record?.variantId;
    //   const warehouseId = record?.warehouseId;
  
    //   const query = new URLSearchParams();
  
    //   if (variantId) query.append("variantId", variantId);
    //   if (warehouseId) query.append("warehouseId", warehouseId);
  
    //   const url = `${apiUrl}/${resource}/${params.id}?${query.toString()}`;
  
    //   const { json } = await httpclientService(url);
  

    //   return adaptObject(json.data);
    // }



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
  

    // if (resource === "inventories") {
    //   const id = params.id;
  
    //   // IMPORTANT: fallback if meta missing
    //   const recordFromList = params.meta?.record;
  
    //   const variantId = recordFromList?.variantId;
    //   const warehouseId = recordFromList?.warehouseId;
  
    //   const query = new URLSearchParams();
  
    //   if (variantId) query.append("variantId", variantId);
    //   if (warehouseId) query.append("warehouseId", warehouseId);
  
    //   const url = `${apiUrl}/${resource}/${id}?${query.toString()}`;
  
    //   const { json } = await httpclientService(url);
  
    //   return adaptObject(json.data);
    // }
    
    // if (resource === "inventories") {
    //   const variantId = params.meta?.variantId;
    //   const warehouseId = params.meta?.warehouseId;
    
    //   const query = new URLSearchParams();
    
    //   if (variantId) query.append("variantId", variantId);
    //   if (warehouseId) query.append("warehouseId", warehouseId);
    
    //   const url = `${apiUrl}/${resource}/${params.id}?${query.toString()}`;
    
    //   const { json } = await httpclientService(url);
    
    //   return adaptObject(json.data);
    // }

    // if (resource === "inventories") {

    //   console.log(" aaaaaaaaaaaaaaaaeeeeeeeeeeeeeerrrrrrrrrrrrrrttttttttttttt")
    //   const { variantId, warehouseId } = params.meta || {};
    
    //   console.log("***********" ,{ variantId, warehouseId } )
    //   const query = new URLSearchParams();
    
    //   if (variantId) query.append("variantId", variantId);
    //   if (warehouseId) query.append("warehouseId", warehouseId);
    
    //   const url = `${apiUrl}/${resource}/${params.id}?${query.toString()}`;
    

    //   console.log("uuuuuuuuuuuuuu  ",url)
    //   const { json } = await httpclientService(url);
    
    //   //return adaptObject(json.data);
    // }
 
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
      if (Array.isArray(json.data)) {
        dataArray = json.data;
      } else if (json.data && typeof json.data === "object") {
        dataArray = [json.data];
      }

      dataArray = dataArray.map((item) => {
        if (!item.id) {
          throw new Error(
            `getMany: Resource "${resource}" item does not have an id key`
          );
        }
        return item;
      });

      return { data: dataArray };
    } catch (error) {
      console.error("getMany error:", error);
      return { data: [] }; // fallback
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

    console.log("createeeeee ")
       
    if(resource === "products")
    {
      const url = `${apiUrl}/products`;
  
     let  body :any = buildProductFormData(params.data);
       console.log(params.data ,  "   bodyyyyyyyyyy",body)
     const isFormData = body instanceof FormData;
      const { json } = await httpclientService(url, {
        method: "POST",
        body:  isFormData ? body : JSON.stringify(params.data),
      });
      return {
        data: json.data,
      };
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
    console.log(  `${apiUrl}/${resource}/${params.id}`,  "gggggggggggggghhhhhhrrrrrrrrrrrr  ", resource, params, params.id);

    if (resource === "userAddresses") {
      console.log("fffffffffff ",params.data)
      const url = `${apiUrl}/usersAddress/${params.id}`;
  
      console.log("usrllllllllllllll   ",url)
      const { json } = await httpclientService(url, {
        method: "PUT",
        body: JSON.stringify(params.data),
      });
  
      console.log("jjjjjjjjjjjjjjjjjjjjjjj  ",json)
      return adaptUpdateUserAddress(json);
    }

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
  // getAllCategories: async (resource:any, params:any) => {
  //   console.log("object  trftttttttttttttttttttt")
  //   const { json } = await httpclientService(`${apiUrl}/categories/${resource}`, {
  //     method: "DELETE",
  //     body: JSON.stringify(params.ids),
  //   });
  //   return { data: json };
  // },
};

export default dataProvider;
