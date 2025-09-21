# 📅 WebIAgenda - Sistema de Agendamento Inteligente

> Sistema moderno e intuitivo para gerenciamento de agendamentos, desenvolvido com Nuxt 4 e Vue 3

![Nuxt](https://img.shields.io/badge/Nuxt-4.1.2-00DC82?style=for-the-badge&logo=nuxt.js&logoColor=white)
![Vue.js](https://img.shields.io/badge/Vue.js-3.5.21-4FC08D?style=for-the-badge&logo=vue.js&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)

## 🚀 Sobre o Projeto

O **WebIAgenda** é uma solução completa para gerenciamento de agendamentos, oferecendo uma interface moderna e responsiva para facilitar o controle de compromissos, eventos e reservas. Desenvolvido com as mais recentes tecnologias web, o sistema prioriza performance, usabilidade e escalabilidade.

### ✨ Principais Funcionalidades

- 📋 **Gerenciamento de Agendamentos**: Criação, edição e exclusão de compromissos
- 📊 **Dashboard Intuitivo**: Visão geral dos agendamentos e estatísticas
- 👥 **Gestão de Usuários**: Sistema completo de autenticação e autorização
- 🎨 **Interface Moderna**: Design responsivo com suporte a tema claro/escuro
- 📱 **Mobile First**: Totalmente otimizado para dispositivos móveis
- 🔔 **Notificações**: Sistema de alertas e lembretes
- 📈 **Relatórios**: Análises e métricas detalhadas
- 🔒 **Segurança**: Implementação de melhores práticas de segurança

## 🛠️ Tecnologias Utilizadas

### Frontend
- **[Nuxt 4](https://nuxt.com/)** - Framework Vue.js full-stack
- **[Vue 3](https://vuejs.org/)** - Framework JavaScript progressivo
- **[TypeScript](https://www.typescriptlang.org/)** - Superset tipado do JavaScript
- **[Tailwind CSS](https://tailwindcss.com/)** - Framework CSS utilitário
- **[Heroicons](https://heroicons.com/)** - Biblioteca de ícones SVG

### Ferramentas de Desenvolvimento
- **Vue Toastification** - Sistema de notificações
- **Vue Router** - Roteamento para Vue.js
- **ESLint & Prettier** - Linting e formatação de código

## 📦 Instalação e Configuração

### Pré-requisitos

- Node.js (versão 18 ou superior)
- npm, pnpm, yarn ou bun

### Instalação

1. **Clone o repositório**
```bash
git clone https://github.com/seu-usuario/webiagenda.git
cd webiagenda
```

2. **Instale as dependências**
```bash
# npm
npm install

# pnpm
pnpm install

# yarn
yarn install

# bun
bun install
```

3. **Configure as variáveis de ambiente**
```bash
cp .env.example .env
```

4. **Inicie o servidor de desenvolvimento**
```bash
# npm
npm run dev

# pnpm
pnpm dev

# yarn
yarn dev

# bun
bun run dev
```

O aplicativo estará disponível em `http://localhost:3000`

## 🏗️ Estrutura do Projeto

```
webiagenda/
├── app/
│   ├── components/          # Componentes Vue reutilizáveis
│   │   ├── ui/             # Componentes base do design system
│   │   ├── layout/         # Componentes de layout
│   │   └── shared/         # Componentes compartilhados
│   ├── composables/        # Composables Vue organizados por categoria
│   │   ├── core/          # Composables fundamentais (auth, api)
│   │   ├── ui/            # Composables de interface
│   │   └── utils/         # Utilitários diversos
│   ├── features/          # Arquitetura baseada em features
│   │   ├── auth/          # Autenticação e autorização
│   │   ├── dashboard/     # Dashboard principal
│   │   ├── scheduling/    # Gerenciamento de agendamentos
│   │   └── profile/       # Perfil do usuário
│   ├── layouts/           # Layouts das páginas
│   ├── pages/             # Páginas da aplicação
│   ├── plugins/           # Plugins do Nuxt
│   └── stores/            # Gerenciamento de estado (Pinia)
├── public/                # Arquivos estáticos
└── shared/                # Tipos e utilitários compartilhados
```

## 🚀 Scripts Disponíveis

```bash
# Desenvolvimento
npm run dev          # Inicia servidor de desenvolvimento

# Produção
npm run build        # Build para produção
npm run preview      # Preview do build de produção

# Utilitários
npm run generate     # Gera site estático
npm run postinstall  # Prepara o Nuxt após instalação
```

## 🎨 Design System

O projeto utiliza um design system consistente baseado em:

- **Cores**: Paleta de cores semânticas com suporte a temas
- **Tipografia**: Hierarquia tipográfica bem definida
- **Componentes**: Biblioteca de componentes reutilizáveis
- **Espaçamento**: Sistema de espaçamento consistente
- **Responsividade**: Breakpoints otimizados para todos os dispositivos

## 🔧 Configuração de Desenvolvimento

### Extensões Recomendadas (VS Code)

- Vue Language Features (Volar)
- TypeScript Vue Plugin (Volar)
- Tailwind CSS IntelliSense
- ESLint
- Prettier

### Padrões de Código

O projeto segue padrões rigorosos de qualidade:

- **Composition API**: Uso exclusivo da Composition API do Vue 3
- **TypeScript**: Tipagem rigorosa em todo o código
- **Tailwind CSS**: Uso exclusivo do Tailwind para estilização
- **Arquitetura por Features**: Organização modular do código
- **Clean Code**: Princípios de código limpo e legível

## 🤝 Contribuição

Este projeto é desenvolvido seguindo as melhores práticas de desenvolvimento:

1. **Commits Semânticos**: Uso de conventional commits
2. **Code Review**: Revisão obrigatória de código
3. **Testes**: Cobertura de testes automatizados
4. **Documentação**: Documentação clara e atualizada

## 🔒 Segurança

- Validação rigorosa de dados de entrada
- Sanitização de conteúdo
- Proteção contra ataques XSS e CSRF
- Autenticação e autorização robustas
- Criptografia de dados sensíveis

## 📱 Compatibilidade

- ✅ Chrome (últimas 2 versões)
- ✅ Firefox (últimas 2 versões)
- ✅ Safari (últimas 2 versões)
- ✅ Edge (últimas 2 versões)
- ✅ Dispositivos móveis (iOS/Android)

## 🚀 Deploy

O projeto está configurado para deploy em:

- **Vercel** (recomendado)
- **Netlify**
- **Servidor próprio**

```bash
# Build para produção
npm run build

# Preview local do build
npm run preview
```

## 📊 Performance

- ⚡ **Lighthouse Score**: 95+ em todas as métricas
- 🎯 **Core Web Vitals**: Otimizado para excelente UX
- 📦 **Bundle Size**: Otimizado com code splitting
- 🔄 **SSR/SSG**: Renderização otimizada

## 📞 Suporte

Para dúvidas técnicas ou sugestões:

- 📧 **Email**: igorelias.pro@gmail.com
- 💼 **LinkedIn**: [Igor Elias de Lima](https://www.linkedin.com/in/igor-elias-de-lima/)
- 🐛 **Issues**: Utilize as issues do GitHub

---

## 📄 Licença e Copyright

**Copyright © 2025 Igor Elias**

Este código é disponibilizado exclusivamente para fins de portfólio e demonstração profissional.

### 🚫 Restrições de Uso

- É expressamente proibido copiar, usar, modificar, distribuir ou vender este código, total ou parcialmente, sem autorização expressa por escrito do autor
- O acesso público a este repositório tem apenas o objetivo de visualização do trabalho realizado por recrutadores e profissionais da área
- Nenhum direito de uso é concedido além da visualização e análise do conteúdo
- Este projeto é protegido por direitos autorais e leis de propriedade intelectual

### 📞 Contato

Para dúvidas, solicitações de uso comercial ou propostas de colaboração:

**Desenvolvedor**: Igor Elias  
**Contato**: https://www.linkedin.com/in/igor-elias-de-lima/

### ⚖️ Aviso Legal

O uso não autorizado deste código pode resultar em ações legais. Este projeto serve como demonstração de habilidades técnicas e não deve ser utilizado para fins comerciais sem permissão.
