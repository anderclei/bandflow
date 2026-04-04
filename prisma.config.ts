import { defineConfig } from '@prisma/config';

export default defineConfig({
    schema: './prisma/schema.prisma',
    datasource: {
        url: process.env.DIRECT_URL || process.env.DATABASE_URL || 'file:./prisma/dev_v7.db',
    },
});
