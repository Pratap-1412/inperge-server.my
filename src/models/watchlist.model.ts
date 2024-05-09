import { Model, DataTypes } from 'sequelize';
import sequelize from '../config/database';
import User from './user.model';

class WatchList extends Model {
  public id!: number;
  public user_id!: number;
  public stocks!: string[];
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
      // references: {
      //   model: 'User',
      //   key: 'id',
      // },
      unique:true
    },
    stocks: {
      type: DataTypes.ARRAY(DataTypes.JSON),
    },
  },
  {
    sequelize,
    modelName: 'WatchList',
    tableName: 'watchlist',
  }
);

export default WatchList;