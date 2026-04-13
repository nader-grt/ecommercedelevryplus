export default class VariantDomain {

  private color: string;
  private size: string;
  private price: number;
  private sku!: string;

  constructor(color: string, size: string, price: number,sku?:string) {

    if (!color || !size) {
      throw new Error("Color and size are required");
    }

    if (price <= 0) {
      throw new Error("Variant price must be greater than zero");
    }

    this.color = color;
    this.size = size;
    this.price = price;

   // this.sku = this.generateSKU();
    this.sku = sku ?? this.generateSKU();
  }

  private generateSKU(): string {
    const timestamp = Date.now().toString().slice(-4);

    return `${this.color.toUpperCase()}-${this.size.toUpperCase()}-${timestamp}`;
  }

  public get getSKU(): string {
    return this.sku;
  }

  public get getColor(): string {
    return this.color;
  }

  public get getSize(): string {
    return this.size;
  }

  public get getPrice(): number {
    return this.price;
  }

  public toObject() {
    return {
      color: this.color,
      size: this.size,
      price: this.price,
      sku: this.sku,
    };
  }
}