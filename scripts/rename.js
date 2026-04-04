const fs = require('fs');
const path = require('path');

const dir = 'c:/Users/ander/Documents/bandmanager-saas';
const regexes = [
    { filter: /\.(tsx?|prisma)$/, search: /BandManager/g, replace: 'BandFlow' },
    { filter: /\.tsx$/, search: />Manager<\/span>/g, replace: '>Flow</span>' }, // for Band<span className="...">Manager</span> patterns
    { filter: /\.tsx$/, search: /bandmanager\.com/g, replace: 'bandflow.com' }, // any website ref
];

function walk(directory) {
    fs.readdirSync(directory).forEach(file => {
        const fullPath = path.join(directory, file);
        if (fullPath.includes('node_modules') || fullPath.includes('.next')) return;
        if (fs.statSync(fullPath).isDirectory()) {
            walk(fullPath);
        } else {
            let content = fs.readFileSync(fullPath, 'utf8');
            let changed = false;
            regexes.forEach(r => {
                if (r.filter.test(fullPath) && r.search.test(content)) {
                    content = content.replace(r.search, r.replace);
                    changed = true;
                }
            });
            if (changed) {
                fs.writeFileSync(fullPath, content);
                console.log('Updated: ' + fullPath);
            }
        }
    });
}
walk(path.join(dir, 'src'));
walk(path.join(dir, 'prisma'));
