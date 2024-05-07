import { Model, DataTypes } from 'sequelize';
import sequelize from '../config/database';

class MarketWatch extends Model {
    public id!: number;
    public symbols!: string;
    public company_name!: string;
    public instrument_type!: string;
    public isin_code!: string;
    public exchange!: string;
    public symbol!: string;
    public name!: string;
    public industry!: number;
    public series!: number;
    public readonly created_at!: Date;
    public readonly updated_at!: Date;
}

MarketWatch.init(
    {
        id: {
            type: DataTypes.BIGINT,
            autoIncrement: true,
            primaryKey: true,
        },
        symbols: {
            type: DataTypes.STRING,
            unique: true,
            allowNull: false,
        },
        company_name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        instrument_type: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        isin_code: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        exchange: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        symbol: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        industry: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        series: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
    },
    {
        sequelize,
        tableName: 'marketwatch',
        timestamps: true,
    }
);

export default MarketWatch;
