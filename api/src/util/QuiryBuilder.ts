import { Op } from "sequelize";

class QueryBuilder {
  query: any;
  model: any;

  filterQuery: any = {};
  sortQuery: any = [];
  pagination: any = {};

  constructor(query: any, model: any) {
    this.query = query;
    this.model = model;
  }

  // filter() {
  //   if (this.query.filter) {
  //     this.filterQuery = { ...this.query.filter };
  //   }

  //   return this;
  // }


// filter() {
//   const filter = this.query.filter || {};
//   const where: any = {};


 
//   Object.keys(filter).forEach((key) => {
//     const value = filter[key];

//     if (value === undefined || value === null || value === "") return;

//     //  CASE 1: string → LIKE
//     if (typeof value === "string") {
//       where[key] = {
//         [Op.like]: `%${value}%`,
//       };
//     }

//     //  CASE 2: number → exact
//     else if (typeof value === "number") {
//       where[key] = value;
//     }

//     //  CASE 3: boolean
//     else if (typeof value === "boolean") {
//       where[key] = value;
//     }

//     // CASE 4: object (operators مستقبلاً)
//     else if (typeof value === "object") {
//       where[key] = value;
//     }
//   });

//   this.filterQuery = where;

//   return this;
// }
filter() {
  let filter = this.query.filter || {};

  // ✅ FIX 1: handle string JSON (أهم إصلاح)
  if (typeof filter === "string") {
    try {
      filter = JSON.parse(filter);
    } catch (error) {
      console.error("Invalid filter JSON:", filter);
      filter = {};
    }
  }

  // ✅ FIX 2: تأكد إنه object
  if (typeof filter !== "object" || Array.isArray(filter)) {
    this.filterQuery = {};
    return this;
  }

  const where: any = {};

  Object.keys(filter).forEach((key) => {
    let value = filter[key];

    //  skip empty values
    if (value === undefined || value === null || value === "") return;

    // CASE 1: string → LIKE
    if (typeof value === "string") {
      where[key] = {
        [Op.like]: `%${value.trim()}%`,
      };
    }

    // CASE 2: number → exact
    else if (typeof value === "number") {
      where[key] = value;
    }

    //  CASE 3: boolean → exact
    else if (typeof value === "boolean") {
      where[key] = value;
    }

    //  CASE 4: object → operators (pro level )
    else if (typeof value === "object") {
      const operatorsMap: any = {
        gte: Op.gte,
        lte: Op.lte,
        gt: Op.gt,
        lt: Op.lt,
        ne: Op.ne,
        eq: Op.eq,
        like: Op.like,
      };

      where[key] = {};

      Object.keys(value).forEach((op) => {
        if (operatorsMap[op]) {
          where[key][operatorsMap[op]] =
            op === "like" ? `%${value[op]}%` : value[op];
        }
      });
    }
  });

  this.filterQuery = where;

  return this;
}

  sort() {
    if (this.query.sort) {
      const field = this.query.sort;
      const order = this.query.order || "ASC";

      this.sortQuery = [field, order];
    }

    return this;
  }

  paginate() {
    const page = parseInt(this.query.page) || 1;
    const limit = parseInt(this.query.perPage) || 10;

    const offset = (page - 1) * limit;

    this.pagination = { limit, offset };

    return this;
  }

  build() {
    return {
      where: this.filterQuery,

      order: this.sortQuery.length ? [this.sortQuery] : undefined,

      limit: this.pagination.limit,
      offset: this.pagination.offset,
    };
  }
}

export default QueryBuilder;
