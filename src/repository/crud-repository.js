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

  async read(query = this.model.find({}), request = {}) {
    try {
      const mongooseQuery = await new QueryFeatures(query, request.query).all();

      return mongooseQuery;
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
  async readOne(id, request = {}) {
    try {
      const document = await this.model.findById(id, request.query);
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
  async update(id, data = {}) {
    const [key, value] = Object.entries(id)[0];
    console.log("Object [id] key:value", key, value);
    try {
      const document = await this.model.findOneAndUpdate(
        {
          [key]: value,
        },
        data,
        {
          new: true,
          runValidators: true,
        }
      );

      return document;
    } catch (error) {
      console.log(error.message);

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
