import CategoryDomain from "../../models/domain/cetegoryDomain/categoryDomain";
import { Category, OrderItem, Product } from "../../models/main";
import CategoryRepoInterface from "./categoryRepoInterface";

export default class CategoryRepo extends CategoryRepoInterface {

  // ======================
  //  FIND BY NAME
  // ======================
  public async findByName(name: string): Promise<CategoryDomain | null> {
    if (!name?.trim()) return null;

    const result = await Category.findOne({
      where: { name: name.trim() },
      raw: true,
    });

    return result
      ? CategoryDomain.reCreateCategory(result)
      : null;
  }

  // ======================
  // CREATE
  // ======================
  public async createCategory(category: {
    name: string;
  }): Promise<CategoryDomain> {

    const name = category?.name?.trim();


    console.log("create categoryyyyy  name  ",name)
    if (!name) {
      throw new Error("Category name is required");
    }

    //  prevent duplicate
    const existing = await this.findByName(name);
    if (existing) {
      throw new Error("Category name already exists");
    }

    const created = await Category.create({ name });

    console.log("cccccccccccc created category ************",created )

    console.log("finnnnnnnn   ",CategoryDomain.reCreateCategory(
      created.get({ plain: true })
    ))
    const plain = created.get({ plain: true });

if (!plain?.id) {
  throw new Error("Failed to create category");
}

return CategoryDomain.reCreateCategory({
  id: plain.id,
  name: plain.name,
});
  
  }

  // ======================
  // GET BY ID
  // ======================
  public async GetCategoryById(id: number): Promise<CategoryDomain | null> {
    if (!id) return null;

    const result = await Category.findByPk(id, { raw: true });

    return result
      ? CategoryDomain.reCreateCategory(result)
      : null;
  }

  // ======================
  // UPDATE
  // ======================
  public async UpdateCategoryById(category: {
    categoryId: number;
    name: string;
  }): Promise<CategoryDomain | null> {

    const t = await Category.sequelize!.transaction();

    try {
      const { categoryId } = category;
      const name = category.name?.trim();

      if (!categoryId || !name) {
        throw new Error("Invalid data");
      }

      //  check exists
      const existingCategory = await Category.findByPk(categoryId, {
        transaction: t,
      });

      if (!existingCategory) {
        await t.rollback();
        return null;
      }

      //  prevent duplicate (except )
      const duplicate = await Category.findOne({
        where: { name },
        transaction: t,
        raw: true,
      });

      if (duplicate && duplicate.id !== categoryId) {
        throw new Error("Category name already exists");
      }

      //  update
      const [affectedRows] = await Category.update(
        { name },
        {
          where: { id: categoryId },
          transaction: t,
        }
      );

      if (affectedRows === 0) {
        throw new Error("Update failed");
      }

      //  get updated
      const updated = await Category.findByPk(categoryId, {
        transaction: t,
        raw: true,
      });

      await t.commit();

      return updated
        ? CategoryDomain.reCreateCategory(updated)
        : null;

    } catch (error) {
      await t.rollback();
      console.log("UpdateCategory error:", error);
      throw error;
    }
  }

  // ======================
  // GET ALL
  // ======================
  public async GetAllCategories(
    filterIds?: number[]
  ): Promise<CategoryDomain[]> {

    const whereClause =
      Array.isArray(filterIds) && filterIds.length > 0
        ? { id: filterIds }
        : undefined;

    const results = await Category.findAll({
      where: whereClause,
      raw: true,
    });

    return results.map((e) =>
      CategoryDomain.reCreateCategory(e)
    ) as CategoryDomain[];
  }

  // ======================
  // DELETE
  // ======================
  public async DeleteCategoryById(id: number): Promise<boolean> {
    if (!id) throw new Error("Invalid id");

    const deleted = await Category.destroy({
      where: { id },
    });

    return deleted > 0;
  }

  public async categoryHasOrders(categoryId: number): Promise<boolean> {
    const item = await OrderItem.findOne({
      include: [
        {
          model: Product,
          as: "product",
          where: { categoryId },
          attributes: ["id"],
        },
      ],
    });
  
    return !!item;
  }


  public async softDeleteCategory(categoryId: number): Promise<void> {
    await Category.update(
      { deletedAt: new Date() },
      { where: { id: categoryId } }
    );
  }


  public async getOrderItemCountByCategoryId(categoryId: number): Promise<number> {
    return await OrderItem.count({
      include: [
        {
          model: Product,
          as: "product",
          where: { categoryId },
          required: true,
        },
      ],
    });
  }
}