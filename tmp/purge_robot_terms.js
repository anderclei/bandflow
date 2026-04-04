const fs = require('fs');
const path = require('path');

const replacements = [
  [/PROTOCOLO/g, 'REGISTRO'],
  [/TIMESTAMP/g, 'DATA E HORA'],
  [/OPERACIONAL/g, 'GERAL'],
  [/NODO/g, 'LOCAL'],
  [/GEO_LOCALIZAÇÃO/g, 'LOCAL'],
  [/GEO_/g, ''],
  [/PIPELINE/g, 'VENDAS'],
  [/VOLUMETRIA/g, 'TOTAL'],
  [/SINCRONIZAÇÃO/g, 'ATUALIZAÇÃO'],
  [/SINCRONISMO/g, 'ATUALIZAÇÃO'],
  [/LOGÍSTICA/g, 'LOGÍSTICA'], // Keeping logistics but maybe simpler?
  [/INICIALIZAÇÃO/g, 'INÍCIO'],
  [/EFETIVAR/g, 'SALVAR'],
  [/ABORTAR_AÇÃO/g, 'CANCELAR'],
  [/CONFIGURAÇÃO_SISTEMÁTICA/g, 'CONFIGURAÇÃO'],
  [/_OPERACIONAL/g, ''],
  [/_PROTOCOLO/g, ''],
  [/STATUS_/g, ''],
  [/GEO_DATA/g, 'DADOS LOCAIS'],
  [/HUB/g, 'CENTRAL'],
  [/_SISTEMÁTICO/g, ''],
  [/LOG_DESLOCAMENTO/g, 'VIAGEM'],
  [/LOG_/g, ''],
  [/Identificação_de_entidades/gi, 'Cadastro'],
  [/PNR_LOCALIZADOR/g, 'CÓDIGO'],
];

function walk(dir) {
  const files = fs.readdirSync(dir);
  files.forEach(file => {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      if (file !== 'node_modules' && file !== '.next') {
        walk(fullPath);
      }
    } else if (file.endsWith('.tsx') || file.endsWith('.ts')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      let changed = false;
      replacements.forEach(([regex, replacement]) => {
        if (regex.test(content)) {
          content = content.replace(regex, replacement);
          changed = true;
        }
      });
      if (changed) {
        // Clean up double underscores and leading/trailing underscores
        content = content.replace(/_+/g, ' ');
        fs.writeFileSync(fullPath, content);
        console.log(`Updated: ${fullPath}`);
      }
    }
  });
}

walk('./src');
