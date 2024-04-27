import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/database';

class Plans extends Model {
  public id!: number;
  public amount!: number;
  public name!: string;
  public price!: string;
  public no_of_trades!: number;
  public no_of_day_trade_history!: number;
  public equity_option_and_future!: boolean;
  public basket_order!: boolean;
  public advance_option_chain!: boolean;
  public option_analyzer!: boolean;
  public equity_screener!: boolean;
  public daywise_summary!: boolean;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Plans.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },    
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue:"Basic",
    },     
    price: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue:0,
    },
    amount: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue:50000,
    },
    no_of_trades: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue:5
    },
    no_of_day_trade_history: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue:1
    },
    equity_option_and_future: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    basket_order: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    advance_option_chain: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    option_analyzer: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    equity_screener: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    daywise_summary: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
  },
  {
    sequelize,
    modelName: 'Plans',
    tableName: 'plans',
    timestamps: true,
  }
);

export default Plans;