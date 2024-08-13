class QueryFeatures {
  constructor(mongooseQuery, requestQuery) {
    this.query = mongooseQuery;
    this.requestQuery = requestQuery;

    this.reservedQueries = ["fields", "page", "limit", "search", "sort"];
    this.pagination = {};
  }

  /**
   * @description Select specific fields in return document
   * @example /api?fields=title, desc -> "title desc"
   * @returns {this}
   */
  projection() {
    const { fields } = this.requestQuery;

    if (fields) this.query.select(fields.split(", ").join(" "));
    else this.query.select("-__v");

    return this;
  }

  /**
   * @description Sort the result of documents
   * @example /api?sort=-price, rate -> -price rate (highest rate, low rate)
   * @returns {this}
   */
  sort() {
    const { sort } = this.requestQuery;

    if (sort) this.query.sort(sort.split(", ").join(" "));
    else this.query.sort("-createdAt"); // reently added

    return this;
  }

  /**
   * @description Search on document with specified key
   * @example /api?search=Vinland saga
   * @param  {...any} keys the fields you want to search in it
   * @returns {this}
   */
  search(...keys) {
    const { search: searchTerm } = this.requestQuery;
    if (!searchTerm) return this;

    this.query.find({
      $or: keys.map((key) => ({
        [key]: { $regex: `/\b${searchTerm}\b/i` },
      })),
    });

    return this;
  }

  /**
   * @description Filter the documents with specified queries
   * @example /api?price[gte]=100&price[lte]=200&rate=2
   * @returns {this}
   */
  filter() {
    let queries = { ...this.requestQuery };

    // delete reserved queries from queries e.g (fields, page, limit, search, sort)
    for (const query of this.reservedQueries) {
      delete queries[query];
    }

    // now queries has only the filters e.g (price, rate, ...)

    // convert the queries to string to replace the gte, lte, gt, lt with $gte, $lte, $gt, $lt
    const _queries_string = JSON.stringify(queries).replace(
      /\b(gte|lte|gt|lt)\b/g,
      (match) => `$${match}`
    );

    // convert the queries string to object
    queries = JSON.parse(_queries_string);

    this.query.find(queries);

    return this;
  }

  async paginate() {
    const { page, limit } = this.requestQuery;
    const skip = (page - 1) * limit;

    const allDocuments = await this.query.clone().countDocuments();

    this.query.limit(limit).skip(skip);

    const pagination = {
      totalPages: Math.ceil(allDocuments / limit),
      get nextPage() {
        return page < this.totalPages ? page + 1 : null;
      },
      get prevPage() {
        return page > 1 ? page - 1 : null;
      },
    };

    this.pagination = pagination;

    return this;
  }

  async all() {
    return await this.search("title").filter().sort().projection().paginate();
  }
}

export default QueryFeatures;
