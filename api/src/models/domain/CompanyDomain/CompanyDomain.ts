export default class CompanyDomain {
  private id?: number;
  private name!: string;
  private type!: "SHOP" | "WAREHOUSE" | "HYBRID";
  private ownerId!: number;

  private trade_name?: string;
  private tax_number?: string;
  private registration_number?: string;

  private status: "ACTIVE" | "SUSPENDED" | "DELETED" = "ACTIVE";

  private constructor(props: any) {
    this.id = props.id;
    this.name = props.name;
    this.type = props.type || "SHOP";
    this.ownerId = props.ownerId;

    this.trade_name = props.trade_name;
    this.tax_number = props.tax_number;
    this.registration_number = props.registration_number;

    this.status = props.status ?? "ACTIVE";
  }

  static create(props: any) {
    if (!props.ownerId) throw new Error("Owner is required");
    if (!props.name) throw new Error("Company name is required");

    return new CompanyDomain(props);
  }

  public toPersistence() {
    return {
      name: this.name,
      type: this.type,
      ownerId: this.ownerId,

      trade_name: this.trade_name,
      tax_number: this.tax_number,
      registration_number: this.registration_number,

      status: this.status,
    };
  }

  public toJSON() {
    return {
      id: this.id,
      name: this.name,
      type: this.type,
      ownerId: this.ownerId,

      trade_name: this.trade_name,
      tax_number: this.tax_number,
      registration_number: this.registration_number,

      status: this.status,
    };
  }
}