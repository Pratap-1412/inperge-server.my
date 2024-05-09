// transaction.model.ts
import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/database';
import User from './user.model';

class Transaction extends Model {
  public id!: number;
  public user_id!: number;
  public transaction_type!: string;
  public amount!: number;
  public transaction_date!: Date;
  public description!: string | null;
  public asset!: string | null;
  
  public readonly user?: User; 
}

Transaction.init(
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
    transaction_type: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    amount: {
      type: DataTypes.DECIMAL,
      allowNull: false,
    },
    transaction_date: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    description: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    asset: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    sequelize, // Pass your Sequelize instance
    modelName: 'Transaction',
    tableName: 'transactions',
    timestamps: true, // Add timestamps (createdAt and updatedAt)
  }
);

// Define the association between Transaction and User models
Transaction.belongsTo(User, { foreignKey: 'user_id', as: 'user' });

export default Transaction;