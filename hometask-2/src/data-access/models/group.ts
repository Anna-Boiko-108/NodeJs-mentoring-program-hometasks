import {
    DataTypes,
    Model,
    InferAttributes,
    InferCreationAttributes
} from 'sequelize';
import { Permission } from '../types';

import getDbConnection from './db-connection';

export interface GroupModelFields
    extends Model<
        InferAttributes<GroupModelFields>,
        InferCreationAttributes<GroupModelFields>
    > {
    id: string;
    name: string;
    permission: Array<Permission>;
}

export function getGroupModel() {
    const groupModel = getDbConnection().define<GroupModelFields>(
        'Group',
        {
            id: {
                type: DataTypes.UUID,
                primaryKey: true,
                allowNull: false,
                unique: true
            },
            name: {
                type: DataTypes.STRING,
                allowNull: false,
                unique: true
            },
            permission: {
                type: DataTypes.ARRAY(DataTypes.ENUM('READ', 'WRITE', 'DELETE', 'SHARE', 'UPLOAD_FILES')),
                allowNull: false
            }
        },
        {
            tableName: 'groups',
            timestamps: false
        }
    );

    return groupModel;
}
