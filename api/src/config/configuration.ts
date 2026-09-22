export default () => ({
  port: parseInt(process.env.PORT ?? '3000', 10),
  database: {
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT ?? '5432', 10),
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    synchronize: process.env.DB_SYNCHRONIZE === 'true',
  },
  jwt: {
    secret: process.env.JWT_SECRET ?? 'servicecontrol-dev-secret',
    expiresIn: process.env.JWT_EXPIRES_IN ?? '8h',
  },
  seed: {
    companyCnpj: process.env.SEED_COMPANY_CNPJ ?? '11222333000181',
    companyName: process.env.SEED_COMPANY_NAME ?? 'Empresa Seed',
    adminEmail: process.env.SEED_ADMIN_EMAIL ?? 'admin@servicecontrol.com.br',
    adminPassword: process.env.SEED_ADMIN_PASSWORD ?? 'admin123',
    adminName: process.env.SEED_ADMIN_NAME ?? 'Administrador',
  },
});
