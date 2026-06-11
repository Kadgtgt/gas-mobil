import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { User } from '../entities/User';
import { Product } from '../entities/Product';
import { Order } from '../entities/Order';
import { OrderItem } from '../entities/OrderItem';
import { Delivery } from '../entities/Delivery';
import { Cylinder } from '../entities/Cylinder';
import { Accessory } from '../entities/Accessory';
import { Wallet } from '../entities/Wallet';

export const AppDataSource = new DataSource({
  type: 'mysql',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '3306'),
  username: process.env.DB_USERNAME || 'root',
  password: process.env.DB_PASSWORD || '',        // empty string for XAMPP default
  database: process.env.DB_DATABASE || 'gas_mobil',
  synchronize: process.env.NODE_ENV !== 'production',  // auto-creates tables (dev only!)
  logging: process.env.NODE_ENV === 'development',
  entities: [User, Product, Order, OrderItem, Delivery, Cylinder, Accessory, Wallet],
  migrations: ['src/migrations/*.ts'],
  subscribers: ['src/subscribers/*.ts'],
});

export default AppDataSource;