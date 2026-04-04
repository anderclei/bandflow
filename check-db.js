const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('dev.db');

db.serialize(() => {
    db.all("SELECT name FROM sqlite_master WHERE type='table'", (err, tables) => {
        if (err) {
            console.error('Erro ao listar tabelas:', err.message);
        } else {
            console.log('Tabelas no banco:', tables.map(t => t.name).join(', '));

            if (tables.some(t => t.name === 'Band')) {
                db.all("SELECT name FROM Band", (err, bands) => {
                    if (err) {
                        console.error('Erro ao ler Band:', err.message);
                    } else {
                        console.log('Bandas encontradas:', bands);
                    }
                    db.close();
                });
            } else {
                console.log('Tabela Band nao encontrada.');
                db.close();
            }
        }
    });
});
