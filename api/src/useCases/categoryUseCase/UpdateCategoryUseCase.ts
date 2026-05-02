import { ICategoryRequest } from "../../controllers/category/UpdateCategoryController";
import CategoryDomain from "../../models/domain/cetegoryDomain/categoryDomain";
import CategoryRepo from "../../repo/categoryRepo/categoryRepo";

export default class UpdateCategoryUseCase {
  private _ReadCategoryUpdate(categoryRequest: ICategoryRequest) {
    const category = new CategoryDomain();

    category.setName = categoryRequest.name;
    //categoryId

    category.setCategoryId = categoryRequest.categoryId;
    return category;
  }

  private usecaseRepo!: CategoryRepo;
  
  constructor(categoryRepo: CategoryRepo) {
    this.usecaseRepo = categoryRepo;
  }

  async execute(dto: ICategoryRequest) {
    const category = await this.usecaseRepo.GetCategoryById(dto.categoryId);
    if (!category) return null;
  
    const existing = await this.usecaseRepo.findByName(dto.name);
  
    if (existing && existing.getCategoryId !== dto.categoryId) {
      throw new Error("Category name already exists");
    }
  
    await this.usecaseRepo.UpdateCategoryById(dto);
  
    const updated = await this.usecaseRepo.GetCategoryById(dto.categoryId);
  
    return updated;
  }
}
