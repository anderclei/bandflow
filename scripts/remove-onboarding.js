const fs = require('fs');
const path = require('path');

const dir = 'c:/Users/ander/Documents/bandmanager-saas/src/app/dashboard';

function walk(directory) {
    let files = [];
    const items = fs.readdirSync(directory);
    for (const item of items) {
        const fullPath = path.join(directory, item);
        if (fs.statSync(fullPath).isDirectory()) {
            files = files.concat(walk(fullPath));
        } else if (fullPath.endsWith('.tsx')) {
            files.push(fullPath);
        }
    }
    return files;
}

const files = walk(dir);

files.forEach(file => {
    let content = fs.readFileSync(file, 'utf8');
    if (content.includes('redirect("/dashboard/onboarding")')) {
        // Se não há permissão/banda ativa, no momento o dashboard exige 1 banda pra funcionar.
        // O mais seguro é mandar pra home do dashboard ou um erro amigável, mas /dashboard próprio também tem isso.
        // O correto em um SaaS em que o Super Admin cria a banda: se o user não tem banda, manda pro /login.
        content = content.replace(/redirect\("\/dashboard\/onboarding"\);?/g, 'return <div className="p-8 text-center"><h2 className="text-xl">Você ainda não possui um escritório/banda atribuído. Solicite acesso ao suporte.</h2></div>;');
        fs.writeFileSync(file, content);
        console.log('Fixed:', file);
    }
});

// Fix components
const componentFile = 'c:/Users/ander/Documents/bandmanager-saas/src/components/dashboard/BandSelector.tsx';
let componentContent = fs.readFileSync(componentFile, 'utf8');
if (componentContent.includes('href="/dashboard/onboarding"')) {
    componentContent = componentContent.replace(/href="\/dashboard\/onboarding"/g, 'href="#" onClick={(e) => { e.preventDefault(); alert("A criação de bandas é restrita ao administrador do sistema.") }}');
    fs.writeFileSync(componentFile, componentContent);
    console.log('Fixed Component:', componentFile);
}
