# 🎸 BandManager SaaS - ERP para Músicos

O **BandManager** é um sistema completo de gestão para bandas e artistas independentes. Ele centraliza agenda, finanças, repertório, equipamentos e documentos em uma única plataforma intuitiva.

## 🚀 Principais Funcionalidades

### 📋 Gestão de Shows (Agenda)
- Agendamento de shows com detalhes de cachê, impostos e logística.
- Confirmação de disponibilidade dos integrantes.
- Status de negociações (Deals) no CRM.

### 💰 Financeiro & Royalties
- Controle de receitas e despesas.
- Gestão de vendas de Merchandising.
- Cálculo automático de Royalties e pagamentos de direitos autorais.

### 🎸 Logística & Rider Técnico
- **Mapas de Palco:** Disposição visual dos instrumentos para a equipe de som.
- **Rider Técnico:** Geração automática de PDF com o Input List da banda.
- **Inventário:** Controle patrimonial e de valor de equipamentos.

### 📊 Painel de Performance (Dashboard)
- Indicadores (KPIs) de lucro líquido, valor de equipamento e vendas.
- **Metas & OKRs:** Definição de objetivos de crescimento para a banda.
- **Relatórios Mensais:** Exportação em PDF para prestação de contas.

### ⚡ Ferramentas de Produtividade
- **Busca Global (Ctrl+K):** Encontre qualquer informação instantaneamente.
- **Notificações Inteligentes:** Alertas de shows próximos e documentos a vencer.
- **Ações Rápidas:** Botões no dashboard para as tarefas mais comuns do dia-a-dia.

## 🛠️ Tecnologias
- **Framework:** Next.js 15+ (App Router)
- **Banco de Dados:** Prisma ORM com SQLite (LibSQL)
- **Autenticação:** NextAuth.js (Beta)
- **Estilização:** Tailwind CSS & Shadcn/UI
- **Documentação:** jsPDF para relatórios

## 🔑 Acesso Rápido (Demo)
Para testar as funcionalidades sem precisar de OAuth:
- **E-mail:** `teste@bandademo.com.br`
- **Senha:** `123456`

---

## 🏗️ Como Rodar o Projeto

1. Instale as dependências: `npm install`
2. Configure o banco: `npx prisma db push`
3. Modele os dados iniciais: `npx.cmd tsx prisma/seed.ts`
4. Inicie o servidor: `npm run dev`

---

## 📄 Documentação Interna de Desenvolvimento
Você pode encontrar detalhes das implementações recentes nos seguintes artefatos:
- **[Walkthrough Completo](file:///C:/Users/ander/.gemini/antigravity/brain/26defd70-462a-4654-9bc0-014a93147e73/walkthrough.md)**
- **[Plano de Implementação](file:///C:/Users/ander/.gemini/antigravity/brain/26defd70-462a-4654-9bc0-014a93147e73/implementation_plan.md)**
- **[Lista de Tarefas](file:///C:/Users/ander/.gemini/antigravity/brain/26defd70-462a-4654-9bc0-014a93147e73/task.md)**
