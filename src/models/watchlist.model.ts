import { Model, DataTypes } from 'sequelize';
import sequelize from '../config/database';
import User from './user.model';

class WatchList extends Model {
  public id!: number;
  public userId!: number;
  public symbols!: string[];
  public readonly user?: User;
}

WatchList.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    user_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      references: {
        model: 'User',
        key: 'id',
      },
      unique:true
    },
    symbols: {
      type: DataTypes.ARRAY(DataTypes.STRING),
    },
  },
  {
    sequelize,
    modelName: 'WatchList',
    tableName: 'watchlist', // Your actual table name
  }
);

export default WatchList;