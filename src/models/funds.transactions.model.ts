// transaction.model.ts
import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/database';
import User from './user.model';
import Plan from './plans.model'; 

class FundsTransaction extends Model {
    public id!: number;
    public user_id!: number;
    public plan_id!: number; // Added plan_id property
    public razorpay_order_id!: string;
    public razorpay_payment_id!: string;
    public description!: string | null;

    public readonly user?: User;
    public readonly plan?: Plan; 
}

FundsTransaction.init(
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
            references: {
                model: User,
                key: 'id',
            },
        },
        plan_id: {
            type: DataTypes.BIGINT,
            allowNull: false,
            references: {
                model: Plan, 
                key: 'id',
            },
        },
        razorpay_order_id: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        razorpay_payment_id: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        description: {
            type: DataTypes.STRING,
            allowNull: true,
        }
    },
    {
        sequelize, // Pass your Sequelize instance
        modelName: 'FundsTransaction',
        tableName: 'fundstransactions',
        timestamps: true, // Add timestamps (createdAt and updatedAt)
    }
);

FundsTransaction.belongsTo(User, { foreignKey: 'user_id', as: 'user' });
FundsTransaction.belongsTo(Plan, { foreignKey: 'plan_id', as: 'plan' }); 

export default FundsTransaction;
