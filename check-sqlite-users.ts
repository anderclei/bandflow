import { createClient } from "@libsql/client";

async function main() {
    const client = createClient({ url: "file:dev.db" });
    try {
        const result = await client.execute("SELECT count(*) as count FROM User");
        console.log("Total Users in SQLite:", result.rows[0].count);
        
        const users = await client.execute("SELECT email, isSuperAdmin FROM User");
        console.log("Users in SQLite:", users.rows.map(r => ({ email: r.email, isSuperAdmin: r.isSuperAdmin })));
    } catch (e) {
        console.error("Error:", e.message);
    }
}

main();
