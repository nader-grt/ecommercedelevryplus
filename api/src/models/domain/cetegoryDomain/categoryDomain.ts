import ProductDomain from "../productDoman/ProductDomain";

export interface ICategoryResponseDomain {
  categoryId: number;
  name: string;
}

export default class CategoryDomain {
  private name: string = "";
  private categoryId: number = 0;

  // ⚠️ نخليه optional للاستعمال فقط (مش source of truth)
  private products: ProductDomain[] = [];

  constructor(props?: {
    name?: string;
    products?: ProductDomain[];
    categoryId?: number;
  }) {
    this.name = props?.name?.trim() ?? "";

    if (props?.categoryId && props.categoryId > 0) {
      this.categoryId = props.categoryId;
    }

    // optional (debug/use only)
    if (props?.products) {
      this.products = props.products;
    }
  }

  //  validation method
  validateName() {
    if (!this.name || this.name.trim().length < 2) {
      throw new Error("Category name must be at least 2 characters");
    }
  }

  // ⚠️ نحافظ عليه لكن نوضح أنه مش مسؤولية domain
  addProduct(productName: string, categoryId: number) {
    if (!productName.trim()) {
      throw new Error("Product name is required");
    }

    if (this.products.some((p) => p.getName === productName)) {
      throw new Error("Product already exists in category");
    }

    const product = new ProductDomain({
      name: productName,
      price: 0,
      nameImage: "",
      categoryId: categoryId,
    });

    this.products.push(product);

    return product;
  }

  // static factory (clean)
  // static reCreateCategory(props?: { name: string; id: number }) {
  //   if (!props) return null;

  //   return new CategoryDomain({
  //     name: props.name,
  //     categoryId: props.id,
  //   });
  // }

  static reCreateCategory(props: { name: string; id: number }) {
    if (!props?.id) {
      throw new Error("Invalid category data from DB");
    }
  
    return new CategoryDomain({
      name: props.name,
      categoryId: props.id,
    });
  }

  // ❗ مهم: ما تعتمدش على products array
  canBeDeleted(productCount: number) {
    if (productCount > 0) {
      throw new Error("Category has products");
    }
  }

  // ✅ getters (نخليهم بما أنك تحب structure)
  public get getName(): string {
    return this.name;
  }

  public set setName(value: string) {
    this.name = value?.trim();
  }

  public get getCategoryId(): number {
    return this.categoryId;
  }

  public set setCategoryId(value: number) {
    if (value > 0) {
      this.categoryId = value;
    }
  }

  // ✅ response mapper
  public getToResponseCategory(): ICategoryResponseDomain {
    return {
      categoryId: this.categoryId,
      name: this.name,
    };
  }

  // 🔥 typing fix
  public GetAllCategoriesByName(
    data: { id: number; name: string }[]
  ): ICategoryResponseDomain[] {
    return data.map((e) => ({
      categoryId: e.id,
      name: e.name,
    }));
  }
} 