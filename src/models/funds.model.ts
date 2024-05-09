// funds.model.ts
import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/database';
import User from './user.model';

class Balance extends Model {
  public id!: number;
  public user_id!: number;
  public current_balance!: number;
  public used_balance!: number;
  public updatedAt!: Date;

  // Foreign key association
  public readonly user?: User;
}

Balance.init(
  {
    id: {
      type: DataTypes.BIGINT,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
    },
    user_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      // references: {
      //   model: User,
      //   key: 'id',
      // },
    },
    current_balance: {
      type: DataTypes.DECIMAL,
      allowNull: false,
      defaultValue:50000
    },
    used_balance: {
      type: DataTypes.DECIMAL,
      allowNull: false,
      defaultValue:0
    },
  },
  {
    sequelize,
    modelName: 'Balance',
    tableName: 'balances',
    timestamps: true, 
  }
);

Balance.belongsTo(User, { foreignKey: 'user_id', as: 'user' });

export default Balance;