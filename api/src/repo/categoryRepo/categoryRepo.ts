import CategoryDomain from "../../models/domain/cetegoryDomain/CategoryDomaun";
import { Category } from "../../models/main";
import categoryRepoInterface from "./categoryRepoInterface";

export interface ICategoryRepo {
  name: string;
}

export default class CategoryRepo extends categoryRepoInterface {
  public async createCategory(category: any): Promise<void> {
    try {

      console.log("object   ",category)
      await Category.create(category);
    } catch (error) {
      console.log(error);
    }
  }

  static async isEmpty(): Promise<boolean> {
    return (await Category.count()) === 0;
  }

  static async FindCategoryById(id: number): Promise<CategoryDomain | any> {
    try {
      const resultCategory: any = await Category.findOne({
        where: { id },
      });
      const categoryResult = new CategoryDomain();

      if (!resultCategory) return null;

      const categoryName = resultCategory.get({ plain: true });
      return CategoryDomain.reCreateCategory(categoryName);
    } catch (error) {
      console.log(error);
    }
  }

  public async GetCategoryById(id: number): Promise<CategoryDomain | any> {
    try {
      const updatedCategory: any = await Category.findOne({ where: { id } });

      if (!updatedCategory) return null;

      return CategoryDomain.reCreateCategory(updatedCategory);
    } catch (error) {
      console.log(error);
    }
  }
  public async UpdateCategoryById(
    category: any
  ): Promise<CategoryDomain | any> {
    const t = await Category.sequelize!.transaction();
    try {
      const { categoryId, name } = category;

      // [affectedCount, affectedRows]
      const [resultCategoryCount] = await Category.update(
        { name },
        {
          where: { id: categoryId },
          transaction: t,
          // returning: true // for fetch all rwos after updated
        }
      );

      const updatedCategory: any = await Category.findOne({
        where: { id: categoryId },
        transaction: t,
        raw: true,
      });

      await t.commit();

      if (!updatedCategory) {
        await t.rollback();
        return null;
      }

      //    console.log("updatedCategory.dataValues  ",updatedCategory.dataValues)

      return CategoryDomain.reCreateCategory(updatedCategory);
    } catch (error) {
      await t.rollback();
      console.log(error);
    }
  }
  public async GetAllCategories(filterIds?:any): Promise<any> {
    try {
      const allCategories = await Category.findAll({
        raw: true,
      });


      const categories = new CategoryDomain();

      console.log( filterIds?.length > 0, "aaaaaaaaaaaaaaaaaannnnnnnnnny ",filterIds)
      if (filterIds?.length > 0) {
        const result = await Category.findAll({
          where: { id: filterIds[0] } ,raw :true
        });
      //  console.log("rrrrrresult ",result)
        /**
          id: 1,
    name: 'Electronics',
         */
        const resultCategory :any = {
          id:result[0].id,
          name:result[0].name
        }
        console.log(" 123 ",resultCategory)
        return result[0]
        // return await Category.findAll({
        //   where: { id: filterIds[0] } 
        // });
      }
      return categories.GetAllCategoriesByName(allCategories);
    } catch (error) {
      console.log(error);
    }
  }

  public async DeleteCategoryById(id: number): Promise<any> {
    try {
      const result = await Category.destroy({
        where: { id: id },
      });

      return result;
    } catch (error) {
      console.log(error);
    }
  }
}
