import {
    DataTypes,
    Model,
    InferAttributes,
    InferCreationAttributes
} from 'sequelize';

import getDbConnection from './db-connection';

export interface UserModelFields
  extends Model<
    InferAttributes<UserModelFields>,
    InferCreationAttributes<UserModelFields>
  > {
  id: string;
  login: string;
  password: string;
  age: number;
  is_deleted: boolean;
}

export function getUserModel() {
    const userModel = getDbConnection().define<UserModelFields>(
        'User',
        {
            id: {
                type: DataTypes.UUID,
                primaryKey: true,
                allowNull: false,
                unique: true
            },
            login: {
                type: DataTypes.STRING,
                allowNull: false,
                unique: true,
                validate: {
                    len: [3, 30]
                }
            },
            password: {
                type: DataTypes.TEXT,
                allowNull: false
            },
            age: {
                type: DataTypes.INTEGER,
                allowNull: false,
                validate: {
                    max: 130,
                    min: 4
                }
            },
            is_deleted: {
                type: DataTypes.BOOLEAN,
                allowNull: false
            }
        },
        {
            tableName: 'users',
            timestamps: false
        }
    );

    return userModel;
}
