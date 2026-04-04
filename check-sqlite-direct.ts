import { createClient } from "@libsql/client";

async function main() {
    const client = createClient({ url: "file:dev.db" });
    try {
        const result = await client.execute("SELECT count(*) as count FROM Band");
        console.log("Total Bands in SQLite:", result.rows[0].count);
        
        const bands = await client.execute("SELECT name FROM Band");
        console.log("Bands in SQLite:", bands.rows.map(r => r.name));
    } catch (e) {
        console.error("Error:", e.message);
    }
}

main();
