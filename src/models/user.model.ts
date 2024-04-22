// user.model.ts
import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/database';

class User extends Model {
  public id!: number;
  public first_name!: string | null;
  public last_name!: string | null;
  public email!: string | null;
  public country_code!: number | null;
  public mobile_no!: number;
  public password!: string;
  public pin!: string;
  public is_registered!: boolean;
  public is_mobile_verified!: boolean;
  public is_email_verified!: boolean;
  public mobile_otp!: string | null; 
  public email_otp!: string | null; 
  public otp_expiry!: Date | null; 
}

User.init(
  {
    id: {
      type: DataTypes.BIGINT,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
    },
    first_name: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    last_name: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: true,
      unique: true,
    },
    country_code: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue:91
    },
    mobile_no: {
      type: DataTypes.BIGINT,
      allowNull: false,
      unique: true,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    pin: {
      type: DataTypes.STRING,
      allowNull: true,
    },is_registered: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue:false
    },
    is_mobile_verified: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue:false
    },
    is_email_verified: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue:false
    },
    mobile_otp: {
      type: DataTypes.STRING, // Store Mobile OTP as string
      allowNull: true,
    },
    email_otp: {
      type: DataTypes.STRING, // Store Email OTP as string
      allowNull: true,
    },
    otp_expiry: {
      type: DataTypes.DATE, // Store OTP expiry time
      allowNull: true,
    },
  },
  {
    sequelize,
    modelName: 'User',
    tableName: 'users',
    timestamps: true,
  }
);

export default User;
