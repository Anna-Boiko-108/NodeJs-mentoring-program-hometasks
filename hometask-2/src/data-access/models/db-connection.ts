import { Sequelize } from 'sequelize';

let dbConnection: Sequelize;

export default function getDbConnection() {
    const DBConnectionString = process.env.DB_CONNECTION_STRING;

    if (!dbConnection && DBConnectionString) {
        dbConnection = new Sequelize(DBConnectionString);
    }

    return dbConnection;
}
