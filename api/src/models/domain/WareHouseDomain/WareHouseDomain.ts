export default class WareHouseDomain {
    private id?: number;
    private name!: string;
    private location!: string;
    private companyId!: number;
    private isActive: boolean = true;
  
    constructor(props?: {
      id?: number;
      name: string;
      location: string;
      companyId: number;
      isActive?: boolean;
    }) {
      if (props) {
        this.id = props.id;
        this.setName(props.name);
        this.setLocation(props.location);
        this.setCompanyId(props.companyId);
        this.isActive = props.isActive ?? true;
      }
    }
  
    // =====================
    // SETTERS (Business Rules)
    // =====================
  
    public setName(name: string) {
      if (!name || name.trim().length < 2) {
        throw new Error("Warehouse name is invalid");
      }
      this.name = name;
    }
  
    public setLocation(location: string) {
      if (!location || location.trim().length < 2) {
        throw new Error("Location is invalid");
      }
      this.location = location;
    }
  
    public setCompanyId(companyId: number) {
      if (!companyId || isNaN(companyId)) {
        throw new Error("Invalid companyId");
      }
      this.companyId = companyId;
    }
  
    // =====================
    // BEHAVIOR 
    // =====================
  
    public deactivate() {
      this.isActive = false;
    }
  
    public activate() {
      this.isActive = true;
    }
  
    // =====================
    // GETTERS
    // =====================
  
    public get getId() {
      return this.id;
    }
  
    public get getName() {
      return this.name;
    }
  
    public get getLocation() {
      return this.location;
    }
  
    public get getCompanyId() {
      return this.companyId;
    }
  
    public get getIsActive() {
      return this.isActive;
    }
  
    // =====================
    // SERIALIZE (DTO output)
    // =====================
  
    public toJSON() {
      return {
        id: this.id,
        name: this.name,
        location: this.location,
        companyId: this.companyId,
        isActive: this.isActive,
      };
    }
  }