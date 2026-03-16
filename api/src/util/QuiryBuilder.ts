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

  filter() {
    if (this.query.filter) {
      this.filterQuery = { ...this.query.filter };
    }

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
