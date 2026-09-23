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
    companyCnpj: process.env.SEED_COMPANY_CNPJ,
    companyName: process.env.SEED_COMPANY_NAME,
    adminEmail: process.env.SEED_ADMIN_EMAIL,
    adminPassword: process.env.SEED_ADMIN_PASSWORD,
    adminName: process.env.SEED_ADMIN_NAME,
  },
});
