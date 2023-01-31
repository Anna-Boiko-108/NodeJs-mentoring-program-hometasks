import {
    Model,
    InferAttributes,
    InferCreationAttributes
} from 'sequelize';

import getDbConnection from './db-connection';
import { getGroupModel } from './group';
import { getUserModel } from './user';

export interface UserGroupModelFields
    extends Model<
        InferAttributes<UserGroupModelFields>,
        InferCreationAttributes<UserGroupModelFields>
    > { }

export async function getUserGroupModel() {
    const User = getUserModel();
    const Group = getGroupModel();

    const userGroupsModel = getDbConnection().define<UserGroupModelFields>(
        'UsersGroup',
        {},
        {
            timestamps: false
        }
    );

    User.belongsToMany(Group, { through: userGroupsModel, foreignKey: 'userId' });
    Group.belongsToMany(User, { through: userGroupsModel, foreignKey: 'groupId' });

    return userGroupsModel;
}
