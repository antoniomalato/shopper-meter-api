import dotenv from 'dotenv';

// Carregar variáveis de ambiente antes de qualquer importação
dotenv.config();

import { startServer } from './server';

startServer();
