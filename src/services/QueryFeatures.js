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

    if (fields) this.query = this.query.select(fields.split(", ").join(" "));
    else this.query = this.query.select("-__v");

    return this;
  }

  /**
   * @description Sort the result of documents
   * @example /api?sort=-price, rate -> -price rate (highest rate, low rate)
   * @returns {this}
   */
  sort() {
    const { sort } = this.requestQuery;

    if (sort) this.query = this.query.sort(sort.split(", ").join(" "));
    else this.query = this.query.sort("-publishedAt"); // reently added

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

    this.query = this.query.find({
      $or: keys.map((key) => ({
        [key]: { $regex: `.*${searchTerm}.*`, $options: "i" },
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

    // if some query property is array, convert it to $in query
    for (const key in queries) {
      if (queries[key].includes(","))
        queries[key] = { $in: queries[key].split(",") };
    }

    this.query = this.query.find(queries);

    return this;
  }

  async paginate() {
    const { page = 1, limit = 2 } = this.requestQuery;
    const skip = (page > 0 ? page - 1 : 0) * +limit;

    // Log values for debugging
    console.log("Page:", page, "Limit:", limit, "Skip:", skip);

    const allDocuments = await this.query.clone().countDocuments();

    this.query = this.query.skip(skip).limit(+limit);

    const totalPages = Math.ceil(allDocuments / +limit);

    const pagination = {
      totalPages,
      currentPage: +page,
      nextPage: +page < totalPages ? +page + 1 : null,
      prevPage: +page > 1 ? +page - 1 : null,
    };

    this.pagination = pagination;

    console.log("Pagination info:", pagination);

    return this;
  }

  all() {
    return this.filter().search("title").sort().projection().paginate();
  }
}

export default QueryFeatures;
