import ApiError from "../services/ApiError.js";
import QueryFeatures from "../services/QueryFeatures.js";

/**
 * @description CRUDRepository class to handle all the CRUD operations
 * @class CRUDRepository
 */
class CRUDRepository {
  constructor(model) {
    this.model = model;
    this.collectionName = this.model.collection.collectionName;
  }

  async create(data) {
    try {
      const document = await this.model.create(data);
      return document;
    } catch (error) {
      throw ApiError.badRequest(
        `Error creating document in ${this.collectionName} collection`
      );
    }
  }

  async read(query = {}) {
    try {
      const mongooseQuery = await new QueryFeatures(
        this.model.find({}).populate("author"),
        query
      ).all();

      const documents = await mongooseQuery.query;

      return documents;
    } catch (error) {
      console.log(error.message);
      throw ApiError.badRequest(
        `Error reading document in ${this.collectionName} collection`
      );
    }
  }

  /**
   * @description Read one document from the collection
   */
  async readOne(id, query = {}) {
    try {
      const document = await this.model.findById(id, query);
      return document;
    } catch (error) {
      throw ApiError.badRequest(
        `Error reading document in ${this.collectionName} collection`
      );
    }
  }

  /**
   * @description Update a document in the collection
   */
  async update(id, data) {
    try {
      const document = await this.model.findByIdAndUpdate(id, data, {
        new: true,
        runValidators: true,
      });

      return document;
    } catch (error) {
      throw ApiError.badRequest(
        `Error updating document in ${this.collectionName} collection`
      );
    }
  }

  /**
   * @description Delete a document from the collection
   */
  async delete(id) {
    try {
      const document = await this.model.findByIdAndDelete(id);

      return document;
    } catch (error) {
      throw ApiError.badRequest(
        `Error deleting document in ${this.collectionName} collection`
      );
    }
  }
}

export default CRUDRepository;
