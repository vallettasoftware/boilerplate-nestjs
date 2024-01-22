import { DatabaseConfig } from '../database/config/database-config.type';
import { MainConfig } from './main-config.type';

export type AppConfigType = {
  database: DatabaseConfig;
  main: MainConfig;
};
