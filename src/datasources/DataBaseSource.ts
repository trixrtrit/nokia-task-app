import { GraphQLError } from "graphql";
import mongoose, { Model } from "mongoose";
import { ApolloServerErrorCode } from '@apollo/server/errors';

export class DataBaseSource {

    private db_connection: mongoose.Connection;
    private model: mongoose.Model<any>;

    constructor(db_connection: mongoose.Connection, model: mongoose.Model<any>) {
        this.db_connection = db_connection;
        this.model = model;
    }

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