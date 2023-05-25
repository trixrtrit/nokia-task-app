import { GraphQLError } from "graphql";
import mongoose, { Model } from "mongoose";
import { ApolloServerErrorCode } from '@apollo/server/errors';
/**
 * DataBaseSource is the base class for data sources in this app.
 * db_connection represents the MongoDB database connection.
 * model represents a Generic Model inside the database
 */
export class DataBaseSource {

    private db_connection: mongoose.Connection;
    private model: mongoose.Model<any>;

    constructor(db_connection: mongoose.Connection, model: mongoose.Model<any>) {
        this.db_connection = db_connection;
        this.model = model;
    }

    /**
   * Retrieves all models from the database.
   * @returns A promise that resolves to an array of models that can have the type of our model interfaces.
   * @throws GraphQLError if there is an error while fetching the models.
   */
    async getModels(): Promise<mongoose.Model<any>[]> {
        try {
            const models: mongoose.Model<any>[] | null = await this.model.find()
            return models;
        }
        catch (error) {
            throw new GraphQLError(`Could not fetch data`, {
                extensions: { code: 'BAD_USER_INPUT' },
            });
        }
    }

    /**
   * Retrieves a single model by its ID.
   * @param id The ID of the model to retrieve.
   * @returns A promise that resolves to the retrieved model that will later have the type of the database model.
   * @throws GraphQLError if the model with the given ID does not exist, or there is an error while fetching the model.
   */
    async getModel(id: string): Promise<mongoose.Model<any>> {
        try {
            const singleModel: mongoose.Model<any> | null = await this.model.findById(id);

            if (!singleModel) {
                throw new GraphQLError(`Entity with id: ${id} does not exist`, {
                    extensions: { code: 'BAD_USER_INPUT' },
                });
            }
            return singleModel;
        }
        catch (error) {
            console.error(`${error.message}`);

            throw new GraphQLError(error.message, {
                extensions: { code: error.extensions.code },
            });
        }
    }

    /**
   * Deletes a model by its ID.
   * @param id The ID of the model to delete.
   * @returns A promise that resolves to the deleted model which will have the type of a given model interface when inherited.
   * @throws GraphQLError if the model with the given ID does not exist, or there is an error while deleting the model.
   */
    async deleteModel(id: string): Promise<mongoose.Model<any>> {
        try {
            const deletedModel: mongoose.Model<any> | null = await this.model.findByIdAndDelete(id);

            if (!deletedModel) {
                throw new GraphQLError(`Entity with id: ${id} does not exist`, {
                    extensions: { code: 'BAD_USER_INPUT' },
                });
            }

            return deletedModel;
        } catch (error) {
            if (error.extensions?.code == ApolloServerErrorCode.BAD_USER_INPUT) {
                console.error(`${error.message}`);

                throw new GraphQLError(error.message, {
                    extensions: { code: error.extensions.code },
                });
            } else {
                throw new GraphQLError('Failed to delete entity.', {
                    extensions: { code: 'INTERNAL_SERVER_ERROR' },
                });
            }
        }
    }
}