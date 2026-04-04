const { prisma } = require('@/lib/prisma');
const bcrypt = require('bcryptjs');

module.exports = async function apply() {
    console.log("Not running manually, using Server Action format inside super-admin.ts instead");
};
