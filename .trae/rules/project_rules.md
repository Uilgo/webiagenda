---
applyTo: '**'
---

# Guia de Projeto — Nuxt 4 (estrutura + padrões de código)

⚠️ **Atenção**  
Este documento é um **guia baseado em boas práticas e na documentação oficial**.  
**Sempre siga as orientações do desenvolvedor responsável pelo projeto.**  
Não é uma regra imutável — serve como referência para manter consistência, legibilidade e escalabilidade.

---

## 0) Instruções para IA/Assistentes

🤖 **Instruções Específicas para IA:**

- **SEMPRE responda em Português Brasileiro** em todas as interações
- **Aplique o princípio DRY (Don't Repeat Yourself)** - nunca duplique código
- **Reutilize composables, componentes e funções** existentes antes de criar novos
- **Refatore código duplicado** em funções/composables compartilhados
- **Sugira melhorias** de performance e arquitetura quando apropriado
- **Valide consistência** com as regras estabelecidas neste guia
- **Priorize legibilidade** e manutenibilidade do código
- **Sugira nomes descritivos** para funções, composables e componentes
- **Documente código simples e complexos** SEMPRE adicione comentários explicativos em português brasileiro no código gerado e documente a função/propósito de cada bloco de código importante, utilize comentários claros e objetivos resumidos, para não poluir o código com excessos, mas garantir que a lógica seja compreensível
- **Use sempre TypeScript** com tipagem rigorosa, evitando `any` e preferindo `unknown` com type guards
- **SEMPRE use apenas Tailwind CSS** - é PROIBIDO usar Sass, SCSS, CSS modules ou qualquer outro preprocessador CSS. Use apenas classes do Tailwind e CSS nativo quando absolutamente necessário
- **OBRIGATÓRIO: Use APENAS Composition API** - Options API está PROIBIDA no projeto
- **Nunca criar nada sem permissão** nunca crie ou edite algo sem antes confirmar com o desenvolvedor responsável pelo projeto
- **Nunca execute um novo servidor (`npm run dev` ou `pnpm run dev`) para fazer testes** - isso deve ser feito manualmente pelo usuário

---

## 1) Estrutura de pastas (Nuxt 4)

Sempre respeitar a estrutura abaixo ao criar **novos arquivos/pastas**:

```
# Estrutura de arvore Universal Nuxt com Sistema de Features

```
my-nuxt-app/
├── app/
│   ├── assets/                  # fontes, ícones, imagens processadas, CSS global
│   │   ├── styles/             # estilos globais e componentes CSS
│   │   ├── images/             # imagens processadas
│   │   ├── icons/              # ícones SVG e fontes de ícones
│   │   └── fonts/              # fontes customizadas
│   ├── components/
│   │   ├── ui/                 # componentes base reutilizáveis
│   │   │   ├── Button.vue
│   │   │   ├── Input.vue
│   │   │   ├── Modal.vue
│   │   │   ├── Card.vue
│   │   │   ├── Table.vue
│   │   │   ├── Form.vue
│   │   │   ├── Loading.vue
│   │   │   └── ...
│   │   ├── layout/             # componentes de layout
│   │   │   ├── Header.vue
│   │   │   ├── Sidebar.vue
│   │   │   ├── Footer.vue
│   │   │   ├── Navigation.vue
│   │   │   └── Breadcrumbs.vue
│   │   ├── shared/             # componentes compartilhados entre features
│   │   │   ├── DataTable.vue
│   │   │   ├── SearchInput.vue
│   │   │   ├── Pagination.vue
│   │   │   ├── EmptyState.vue
│   │   │   ├── ErrorBoundary.vue
│   │   │   └── ConfirmDialog.vue
│   │   └── providers/          # componentes de contexto/providers
│   │       ├── ThemeProvider.vue
│   │       ├── AuthProvider.vue
│   │       └── NotificationProvider.vue
│   ├── composables/
│   │   ├── core/              # composables fundamentais do sistema
│   │   │   ├── useAuth.ts     # autenticação e autorização
│   │   │   ├── useApi.ts      # cliente HTTP e chamadas API
│   │   │   ├── usePermissions.ts # controle de permissões
│   │   │   └── useSession.ts  # gerenciamento de sessão
│   │   ├── ui/                # composables para interface e interação
│   │   │   ├── useModal.ts    # controle de modais
│   │   │   ├── useToast.ts    # notificações toast
│   │   │   ├── useTheme.ts    # gerenciamento de tema
│   │   │   ├── useDisclosure.ts # show/hide elementos
│   │   │   └── useToggle.ts   # estados booleanos
│   │   ├── data/              # composables para gerenciamento de dados
│   │   │   ├── useQuery.ts    # busca de dados
│   │   │   ├── useMutation.ts # mutações de dados
│   │   │   ├── useCache.ts    # gerenciamento de cache
│   │   │   └── usePagination.ts # paginação
│   │   ├── form/              # composables para formulários
│   │   │   ├── useForm.ts     # gerenciamento de formulários
│   │   │   ├── useValidation.ts # validação de dados
│   │   │   ├── useFieldArray.ts # arrays de campos
│   │   │   └── useFormPersist.ts # persistência de formulários
│   │   ├── async/             # composables para operações assíncronas
│   │   │   ├── useAsync.ts    # operações assíncronas genéricas
│   │   │   ├── useDebounce.ts # debounce de valores
│   │   │   ├── useThrottle.ts # throttle de funções
│   │   │   └── usePolling.ts  # polling automático
│   │   ├── dom/               # composables para interação com DOM
│   │   │   ├── useClickOutside.ts
│   │   │   ├── useKeyboard.ts
│   │   │   ├── useMediaQuery.ts
│   │   │   ├── useWindowSize.ts
│   │   │   └── useScrollPosition.ts
│   │   └── utils/             # composables utilitários diversos
│   │       ├── useLocalStorage.ts
│   │       ├── useCopyToClipboard.ts
│   │       ├── useCounter.ts
│   │       ├── useArray.ts
│   │       └── useInterval.ts
│   ├── features/              # NÚCLEO - Arquitetura por Features
│   │   ├── auth/              # feature de autenticação
│   │   │   ├── components/
│   │   │   │   ├── LoginForm.vue
│   │   │   │   ├── RegisterForm.vue
│   │   │   │   ├── PasswordResetForm.vue
│   │   │   │   ├── AuthTabs.vue
│   │   │   │   └── SocialLogin.vue
│   │   │   ├── composables/
│   │   │   │   ├── useLogin.ts
│   │   │   │   ├── useRegister.ts
│   │   │   │   ├── usePasswordReset.ts
│   │   │   │   └── useSocialAuth.ts
│   │   │   ├── stores/        # stores específicas da feature (opcional)
│   │   │   │   └── authForm.ts
│   │   │   ├── types/         # tipos específicos da feature
│   │   │   │   ├── auth.ts    # tipos de autenticação
│   │   │   │   ├── forms.ts   # tipos de formulários
│   │   │   │   ├── api.ts     # tipos de API
│   │   │   │   └── index.ts   # re-exportações
│   │   │   ├── utils/         # utilitários específicos da feature
│   │   │   │   └── authHelpers.ts
│   │   │   ├── LoginPage.vue
│   │   │   ├── RegisterPage.vue
│   │   │   └── ForgotPasswordPage.vue
│   │   │
│   │   ├── user-management/   # feature de gerenciamento de usuários
│   │   │   ├── components/
│   │   │   │   ├── UserList.vue
│   │   │   │   ├── UserCard.vue
│   │   │   │   ├── UserForm.vue
│   │   │   │   ├── UserFilters.vue
│   │   │   │   ├── UserActions.vue
│   │   │   │   └── UserModal.vue
│   │   │   ├── composables/
│   │   │   │   ├── useUsers.ts
│   │   │   │   ├── useUserActions.ts
│   │   │   │   ├── useUserFilters.ts
│   │   │   │   └── useUserValidation.ts
│   │   │   ├── stores/
│   │   │   │   └── userManagement.ts
│   │   │   ├── types/         # tipos específicos da feature
│   │   │   │   ├── user.ts    # tipos de usuário
│   │   │   │   ├── filters.ts # tipos de filtros
│   │   │   │   ├── actions.ts # tipos de ações
│   │   │   │   └── index.ts   # re-exportações
│   │   │   ├── utils/
│   │   │   │   └── userHelpers.ts
│   │   │   └── UsersPage.vue
│   │   │
│   │   ├── dashboard/         # feature de dashboard
│   │   │   ├── components/
│   │   │   │   ├── StatsCards.vue
│   │   │   │   ├── ChartsGrid.vue
│   │   │   │   ├── ActivityFeed.vue
│   │   │   │   ├── QuickActions.vue
│   │   │   │   └── RecentItems.vue
│   │   │   ├── composables/
│   │   │   │   ├── useDashboardData.ts
│   │   │   │   ├── useStats.ts
│   │   │   │   └── useCharts.ts
│   │   │   ├── stores/
│   │   │   │   └── dashboard.ts
│   │   │   ├── types/         # tipos específicos da feature
│   │   │   │   ├── dashboard.ts # tipos do dashboard
│   │   │   │   ├── stats.ts   # tipos de estatísticas
│   │   │   │   ├── charts.ts  # tipos de gráficos
│   │   │   │   └── index.ts   # re-exportações
│   │   │   └── DashboardPage.vue
│   │   │
│   │   ├── settings/          # feature de configurações
│   │   │   ├── components/
│   │   │   │   ├── GeneralSettings.vue
│   │   │   │   ├── SecuritySettings.vue
│   │   │   │   ├── NotificationSettings.vue
│   │   │   │   ├── ThemeSettings.vue
│   │   │   │   └── SettingsTabs.vue
│   │   │   ├── composables/
│   │   │   │   ├── useSettings.ts
│   │   │   │   ├── useSecuritySettings.ts
│   │   │   │   └── useNotificationSettings.ts
│   │   │   ├── stores/
│   │   │   │   └── settings.ts
│   │   │   ├── types/         # tipos específicos da feature
│   │   │   │   ├── settings.ts # tipos de configurações
│   │   │   │   ├── security.ts # tipos de segurança
│   │   │   │   ├── notifications.ts # tipos de notificações
│   │   │   │   └── index.ts   # re-exportações
│   │   │   └── SettingsPage.vue
│   │   │
│   │   └── profile/           # feature de perfil do usuário
│   │       ├── components/
│   │       │   ├── ProfileView.vue
│   │       │   ├── ProfileForm.vue
│   │       │   ├── AvatarUpload.vue
│   │       │   ├── PasswordChange.vue
│   │       │   └── ProfileTabs.vue
│   │       ├── composables/
│   │       │   ├── useProfile.ts
│   │       │   ├── useProfileUpdate.ts
│   │       │   └── useAvatarUpload.ts
│   │       ├── stores/
│   │       │   └── profile.ts
│   │       ├── types/         # tipos específicos da feature
│   │       │   ├── profile.ts # tipos do perfil
│   │       │   ├── forms.ts   # tipos de formulários
│   │       │   ├── upload.ts  # tipos de upload
│   │       │   └── index.ts   # re-exportações
│   │       ├── ProfilePage.vue
│   │       └── ProfileEditPage.vue
│   ├── layouts/               # layouts de páginas
│   │   ├── default.vue        # layout padrão da aplicação
│   │   ├── admin.vue          # layout administrativo
│   │   ├── auth.vue           # layout de autenticação
│   │   ├── dashboard.vue      # layout de dashboard
│   │   └── minimal.vue        # layout minimalista
│   ├── middleware/            # middlewares de rota
│   │   ├── auth.ts           # verificação de autenticação
│   │   ├── guest.ts          # redirecionamento de usuários logados
│   │   ├── admin.ts          # verificação de permissão admin
│   │   └── rate-limit.ts     # limitação de taxa
│   ├── mocks/                 # dados mock para desenvolvimento e testes
│   │   ├── data/             # dados mock organizados por entidade
│   │   │   ├── users/        # dados de usuários
│   │   │   │   ├── users.json
│   │   │   │   ├── profiles.json
│   │   │   │   └── permissions.json
│   │   │   ├── auth/         # dados de autenticação
│   │   │   │   ├── sessions.json
│   │   │   │   ├── tokens.json
│   │   │   │   └── loginAttempts.json
│   │   │   ├── dashboard/    # dados de dashboard
│   │   │   │   ├── stats.json
│   │   │   │   ├── charts.json
│   │   │   │   └── activities.json
│   │   │   ├── settings/     # dados de configurações
│   │   │   │   ├── appSettings.json
│   │   │   │   ├── userPreferences.json
│   │   │   │   └── notifications.json
│   │   │   └── common/       # dados comuns
│   │   │       ├── countries.json
│   │   │       ├── currencies.json
│   │   │       └── languages.json
│   │   ├── handlers/         # handlers para interceptar chamadas de API
│   │   │   ├── auth.ts      # mock handlers para autenticação
│   │   │   ├── users.ts     # mock handlers para usuários
│   │   │   ├── dashboard.ts # mock handlers para dashboard
│   │   │   └── index.ts     # configuração central dos handlers
│   │   ├── fixtures/        # fixtures para testes específicos
│   │   │   ├── auth.ts      # fixtures de autenticação
│   │   │   ├── users.ts     # fixtures de usuários
│   │   │   └── dashboard.ts # fixtures de dashboard
│   │   ├── generators/      # geradores de dados dinâmicos
│   │   │   ├── userGenerator.ts
│   │   │   ├── dataGenerator.ts
│   │   │   └── fakerHelpers.ts
│   │   ├── utils/           # utilitários para mocks
│   │   │   ├── mockHelpers.ts
│   │   │   ├── dataTransform.ts
│   │   │   └── validation.ts
│   │   ├── config/          # configurações de mock
│   │   │   ├── mockConfig.ts # configurações gerais
│   │   │   ├── apiMock.ts   # configuração de mock de API
│   │   │   └── testMock.ts  # configuração de mock para testes
│   │   └── index.ts         # ponto de entrada principal dos mocks
│   ├── pages/                 # APENAS importações das features
│   │   ├── admin/            # área administrativa
│   │   │   ├── index.vue     # dashboard administrativo
│   │   │   ├── users.vue     # gerenciamento de usuários
│   │   │   ├── settings.vue  # configurações do sistema
│   │   │   └── reports.vue   # relatórios e analytics
│   │   ├── auth/             # autenticação
│   │   │   ├── login.vue     # página de login
│   │   │   ├── register.vue  # página de registro
│   │   │   └── forgot-password.vue # recuperação de senha
│   │   ├── dashboard/        # dashboard do usuário
│   │   │   └── index.vue     # página principal do dashboard
│   │   ├── profile/          # perfil do usuário
│   │   │   ├── index.vue     # visualização do perfil
│   │   │   └── edit.vue      # edição do perfil
│   │   └── index.vue         # página inicial da aplicação
│   ├── plugins/              # plugins do Nuxt
│   │   ├── api.client.ts     # configuração do cliente API
│   │   ├── auth.client.ts    # plugin de autenticação
│   │   ├── toast.client.ts   # plugin de notificações
│   │   └── validation.ts     # plugin de validação
│   ├── stores/               # gerenciamento de estado global (Pinia)
│   │   ├── auth.ts          # estado de autenticação
│   │   ├── user.ts          # dados do usuário
│   │   ├── ui.ts            # estado da interface
│   │   ├── notifications.ts # notificações do sistema
│   │   └── app.ts           # estado geral da aplicação
│   ├── app.vue              # componente raiz da aplicação
│   ├── app.config.ts        # configurações da aplicação
│   └── error.vue            # página de erro global
│
├── shared/                    # recursos compartilhados globalmente
│   ├── types/                # tipos TypeScript organizados por domínio
│   │   ├── entities/         # entidades principais do sistema
│   │   │   ├── user.ts
│   │   │   ├── auth.ts
│   │   │   ├── common.ts
│   │   │   └── index.ts
│   │   ├── api/              # tipos para APIs
│   │   │   ├── requests.ts
│   │   │   ├── responses.ts
│   │   │   ├── errors.ts
│   │   │   └── index.ts
│   │   ├── forms/            # tipos para formulários
│   │   │   ├── auth.ts
│   │   │   ├── user.ts
│   │   │   ├── common.ts
│   │   │   └── index.ts
│   │   ├── ui/               # tipos para componentes UI
│   │   │   ├── components.ts
│   │   │   ├── layouts.ts
│   │   │   └── index.ts
│   │   ├── store/            # tipos para stores
│   │   │   ├── auth.ts
│   │   │   ├── user.ts
│   │   │   └── index.ts
│   │   └── common/           # tipos comuns reutilizáveis
│   │       ├── enums.ts
│   │       ├── unions.ts
│   │       ├── utilities.ts
│   │       └── index.ts
│   ├── constants/            # constantes globais
│   │   ├── api.ts           # URLs e configurações de API
│   │   ├── ui.ts            # constantes de UI (cores, tamanhos, etc.)
│   │   ├── app.ts           # constantes da aplicação
│   │   ├── validation.ts    # mensagens e regras de validação
│   │   └── index.ts         # exportações centralizadas
│   └── schemas/             # schemas de validação
│       ├── auth.ts          # schemas de autenticação
│       ├── user.ts          # schemas de usuário
│       ├── common.ts        # schemas comuns
│       └── index.ts         # exportações centralizadas
│
├── lib/                      # biblioteca de utilitários organizados
│   ├── core/                # configurações e funcionalidades fundamentais
│   │   ├── api.ts           # cliente API e configurações
│   │   ├── env.ts           # validação de variáveis de ambiente
│   │   ├── constants.ts     # constantes do sistema
│   │   ├── config.ts        # configurações gerais
│   │   └── logger.ts        # sistema de logs
│   ├── auth/                # utilitários de autenticação e segurança
│   │   ├── auth.ts          # helpers de autenticação
│   │   ├── permissions.ts   # gestão de permissões
│   │   ├── session.ts       # gerenciamento de sessão
│   │   ├── tokens.ts        # manipulação de tokens
│   │   └── encryption.ts    # criptografia e hash
│   ├── database/            # utilitários de banco de dados
│   │   ├── connection.ts    # conexão com banco
│   │   ├── queries.ts       # queries reutilizáveis
│   │   ├── transactions.ts  # transações
│   │   └── migrations.ts    # helpers para migrações
│   ├── validation/          # validação e sanitização
│   │   ├── validators.ts    # validadores customizados
│   │   ├── sanitizers.ts    # saneadores de dados
│   │   ├── rules.ts         # regras de validação
│   │   └── messages.ts      # mensagens de erro
│   ├── formatters/          # formatadores de dados
│   │   ├── date.ts          # formatação de datas
│   │   ├── currency.ts      # formatação de moeda
│   │   ├── text.ts          # formatação de texto
│   │   ├── phone.ts         # formatação de telefone
│   │   └── address.ts       # formatação de endereços
│   ├── storage/             # persistência e armazenamento
│   │   ├── localStorage.ts  # localStorage helpers
│   │   ├── sessionStorage.ts # sessionStorage helpers
│   │   ├── cookies.ts       # manipulação de cookies
│   │   └── cache.ts         # sistema de cache
│   ├── errors/              # tratamento de erros
│   │   ├── errors.ts        # classes de erro customizadas
│   │   ├── handlers.ts      # handlers de erro
│   │   ├── logging.ts       # log de erros
│   │   └── recovery.ts      # recuperação de erros
│   ├── security/            # segurança e proteção
│   │   ├── csrf.ts          # proteção CSRF
│   │   ├── rateLimit.ts     # rate limiting
│   │   ├── sanitization.ts  # sanitização de entrada
│   │   └── headers.ts       # headers de segurança
│   └── utils/               # utilitários diversos
│       ├── arrays.ts        # utilitários para arrays
│       ├── objects.ts       # utilitários para objetos
│       ├── strings.ts       # utilitários para strings
│       ├── dates.ts         # utilitários para datas
│       ├── numbers.ts       # utilitários para números
│       ├── files.ts         # manipulação de arquivos
│       ├── urls.ts          # manipulação de URLs
│       ├── colors.ts        # utilitários de cores
│       ├── regex.ts         # expressões regulares
│       └── async.ts         # utilitários assíncronos
│
├── content/                 # conteúdo estático (Nuxt Content - opcional)
├── public/                  # arquivos estáticos servidos como raiz
├── server/                  # API server-side (Nitro)
│   ├── api/                # endpoints da API
│   │   ├── auth/           # endpoints de autenticação
│   │   ├── users/          # endpoints de usuários
│   │   ├── upload/         # endpoints de upload
│   │   └── health.get.ts   # endpoint de health check
│   ├── middleware/         # middlewares server-side
│   │   ├── cors.ts        # configuração CORS
│   │   ├── auth.ts        # middleware de autenticação
│   │   └── logging.ts     # middleware de logging
│   ├── plugins/           # plugins server-side
│   └── utils/             # utilitários server-side
│       ├── database.ts    # utilitários de banco
│       ├── email.ts       # sistema de email
│       └── storage.ts     # storage de arquivos
│
├── tests/                  # testes automatizados
│   ├── features/           # testes organizados por features
│   │   ├── auth/          # testes da feature auth
│   │   ├── dashboard/     # testes da feature dashboard
│   │   └── profile/       # testes da feature profile
│   ├── components/         # testes de componentes
│   │   ├── ui/            # testes de componentes UI
│   │   ├── layout/        # testes de layout
│   │   └── shared/        # testes de componentes compartilhados
│   ├── composables/       # testes de composables
│   ├── utils/             # testes de utilitários
│   ├── api/               # testes de API
│   ├── e2e/               # testes end-to-end
│   ├── fixtures/          # dados de teste
│   ├── mocks/             # mocks para testes
│   └── setup.ts           # configuração dos testes
│
├── docs/                   # documentação do projeto
│   ├── features/          # documentação das features
│   ├── components/        # documentação dos componentes
│   ├── api/               # documentação da API
│   ├── deployment/        # guias de deployment
│   └── development/       # guias de desenvolvimento
│
├── .github/               # workflows do GitHub (opcional)
├── .vscode/               # configurações do VS Code (opcional)
├── tailwind.config.ts     # configuração do Tailwind CSS
├── nuxt.config.ts         # configuração principal do Nuxt
├── vitest.config.ts       # configuração de testes
├── eslint.config.js       # configuração do ESLint
├── .env.example           # template de variáveis de ambiente
├── .env                   # variáveis de ambiente (git ignore)
├── .gitignore
├── package.json
└── README.md
```
```

> **Sobre `types`**
>
> - **Projetos pequenos** → pode manter em `app/types`.
> - **Projetos médios/grandes ou com backend** → prefira `shared/types` fora do `app/` para facilitar compartilhamento.

---

## 2) Princípios de arquitetura

### 2.1 Princípios Fundamentais

1. **DRY (Don't Repeat Yourself)**
   - Nunca duplique código - sempre extraia para funções/composables
   - Reutilize componentes, tipos e constantes existentes
   - Refatore imediatamente quando identificar duplicação

2. **Componentizar ao máximo**
   - Componentes pequenos, coesos e reusáveis
   - Nada de lógica de dados dentro de componentes — use **composables**
   - Foque na **responsabilidade única** do componente, não no tamanho

3. **Composables para lógica de domínio**
   - `/app/composables/useX.ts` → busca de dados, regras de negócio, orquestração
   - Componente apenas consome o composable
   - Um composable = uma responsabilidade específica

4. **Responsabilidade única (SRP)**
   - Um arquivo faz **uma única coisa bem feita**
   - Se um arquivo/função perder coesão ou violar SRP, considere quebrá-lo
   - **Qualidade > Quantidade de linhas** - código coeso e bem estruturado é melhor que limites arbitrários

5. **Tipagem TypeScript rigorosa**
   - **NUNCA use `any`** - é proibido em todo o projeto
   - Se não souber o tipo, use `unknown` e faça type guards
   - Sempre tipar: props, emits, retornos de funções, estados, contratos de API
   - Preferir tipagem explícita sobre inferência quando houver ambiguidade

   ```typescript
   // ❌ NUNCA faça isso
   const userData: any = await fetchUser();
   const processData = (data: any) => {
     /* ... */
   };

   // ✅ Sempre faça isso
   const userData: User = await fetchUser();
   const processData = (data: unknown): ProcessedData => {
     if (!isValidUserData(data)) {
       throw new Error("Dados inválidos");
     }
     return transformUserData(data);
   };

   // ✅ Ou use generics quando apropriado
   const processApiResponse = <T>(data: T): ApiResponse<T> => {
     return { data, success: true, timestamp: Date.now() };
   };
   ```

6. **Sempre TypeScript com configuração strict**
   - `lang="ts"` obrigatório nos componentes Vue
   - Tipos globais organizados no `/shared/types`
   - `strict: true` e `noImplicitAny: true` no tsconfig
   - Use type assertions apenas quando absolutamente necessário e com comentário explicativo

### 2.2 Padrão de Camadas

```
UI (components) → Composables (composables) → Services/API (server/api ou SDK)
```

**Regras de ouro:**

- **Componentes** não fazem fetch direto - sempre através de composables
- **Composables** não manipulam DOM - apenas estado e lógica
- **Separação clara** entre lógica de apresentação e lógica de negócio
- **Dados sempre fluem de cima para baixo** (props) e eventos de baixo para cima (emits)

**Exemplo prático:**

```typescript
// ❌ Componente fazendo fetch direto
<script setup lang="ts">
const users = ref<User[]>([])

onMounted(async () => {
  users.value = await $fetch<User[]>('/api/users')
})
</script>

// ✅ Componente usando composable
<script setup lang="ts">
const { users, isLoading, error } = useUsers()
</script>
```

---

## 3) Regras de nomenclatura

### 3.1 Arquivos e Pastas

- **Componentes Vue (`/app/components`)** → **PascalCase**  
  ✅ `UserCard.vue`, `AuthButton.vue`, `ProductModal.vue`  
  ❌ `userCard.vue`, `auth-button.vue`

- **Páginas (`/app/pages`)** → **kebab-case** para URLs amigáveis  
  ✅ `login.vue`, `user-profile.vue`, `forgot-password.vue`  
  ❌ `Login.vue`, `userProfile.vue`, `forgotPassword.vue`

  Para contextos:

  ```
  /app/pages/admin/user-management.vue
  /app/pages/admin/system-settings.vue
  ```

- **Layouts (`/app/layouts`)** → **PascalCase**  
  ✅ `DefaultLayout.vue`, `AdminLayout.vue`, `AuthLayout.vue`

- **Composables (`/app/composables`)** → prefixo `use` + **PascalCase**  
  ✅ `useAuth.ts`, `useCartItems.ts`, `useApiClient.ts`

- **Middlewares (`/app/middleware`)** → **camelCase**  
  ✅ `authGuard.ts`, `adminOnly.ts`, `guestOnly.ts`

- **Utils (`/app/utils`)** → **camelCase**  
  ✅ `formatCurrency.ts`, `validateEmail.ts`, `debounce.ts`

- **Tipos (`/shared/types`)** → **PascalCase** para interfaces/types  
  ✅ `UserDTO.ts`, `ApiResponse.ts`, `ProductEntity.ts`

- **Stores (`/app/stores`)** → **camelCase**  
  ✅ `userStore.ts`, `cartStore.ts`, `appSettings.ts`

### 3.2 Código

- **Variáveis e funções:** `camelCase`
- **Constantes:** `SCREAMING_SNAKE_CASE`
- **Interfaces/Types:** `PascalCase`
- **Componentes em template:** `PascalCase`
- **Props e emits:** `camelCase`
- **Use const** Utilize const sempre que possível. Só use let se a variável for realmente reatribuída.

---

## 4) Padrões de código

### 4.1 Componentes Vue

```vue
<template>
  <div class="user-card">
    <UserAvatar :src="user.avatar" :alt="`${user.name} avatar`" />
    <div class="user-info">
      <h3 class="user-name">{{ user.name }}</h3>
      <p class="user-email">{{ user.email }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { User } from "~/shared/types/entities/User";

// Props tipadas
interface Props {
  user: User;
  showEmail?: boolean;
}

// Props com defaults
const props = withDefaults(defineProps<Props>(), {
  showEmail: true,
});

// Emits tipados
interface Emits {
  click: [user: User];
  hover: [event: MouseEvent];
}

const emit = defineEmits<Emits>();

// Usar composables para lógica
const { formatUserName } = useUserFormatting();
</script>

<style scoped>
/* ⚠️ APENAS Tailwind CSS - SEM Sass/SCSS */
/* Evite CSS customizado - use classes do Tailwind */
</style>
```

### 4.1.1 Regras de CSS/Estilização

**🚫 PROIBIDO:**

- Sass, SCSS, Less ou qualquer preprocessador CSS
- CSS Modules
- CSS-in-JS
- `lang="scss"` ou `lang="sass"` nos components

**✅ PERMITIDO:**

- **Apenas Tailwind CSS** com classes utilitárias
- CSS nativo básico **somente quando absolutamente necessário**
- Customizações via `tailwind.config.ts`

**Exemplo correto:**

```vue
<template>
  <div
    class="flex items-center gap-4 p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow"
  >
    <!-- Conteúdo -->
  </div>
</template>

<style scoped>
/* Apenas CSS nativo básico se necessário */
</style>
```

**❌ Exemplo incorreto:**

```vue
<style scoped lang="scss">
.user-card {
  @apply flex items-center gap-4;

  &:hover {
    @apply shadow-md;
  }
}
</style>
```

<!-- Exemplo de comentário obrigatório em componentes -->
<script setup lang="ts">
/**
 * 📌 useUserFormatting
 *
 * Composable responsável por formatar dados do usuário para exibição.
 * Centraliza lógica de apresentação (ex: nomes, datas) para evitar duplicação.
 * 
 * @returns {Object} Funções de formatação: formatUserName, formatDate
 */
const { formatUserName, formatDate } = useUserFormatting()
</script>

⚠️ Evite `withDefaults` com objetos ou arrays. Use `??` ou `||` após a definição para valores padrão seguros.

💡 Dica: Use `defineSlots` para tipar slots e melhorar DX em componentes complexos.

### 4.2 Composables

```typescript
// composables/useAuth.ts
export const useAuth = () => {
  // Estado reativo
  const user = useState<User | null>("auth.user", () => null);
  const isAuthenticated = computed(() => !!user.value);

  // Métodos
  const login = async (credentials: LoginCredentials): Promise<void> => {
    try {
      const response = await $fetch<AuthResponse>("/api/auth/login", {
        method: "POST",
        body: credentials,
      });

      user.value = response.user;
      await navigateTo("/dashboard");
    } catch (error) {
      throw createError({
        statusCode: 401,
        statusMessage: "Credenciais inválidas",
      });
    }
  };

  const logout = async (): Promise<void> => {
    user.value = null;
    await navigateTo("/login");
  };

  // Retornar apenas o necessário
  return {
    user: readonly(user),
    isAuthenticated,
    login,
    logout,
  };
};
```

### 4.3 Tipos TypeScript - Regras Rígidas

```typescript
// shared/types/entities/User.ts
export interface User {
  readonly id: string;
  readonly name: string;
  readonly email: string;
  readonly avatar?: string;
  readonly createdAt: Date;
  readonly updatedAt: Date;
}

// shared/types/api/AuthTypes.ts
export interface LoginCredentials {
  email: string;
  password: string;
}

export interface AuthResponse {
  user: User;
  token: string;
  expiresIn: number;
}

// Para dados externos não confiáveis, use unknown + type guards
export const isUser = (data: unknown): data is User => {
  return (
    typeof data === "object" &&
    data !== null &&
    "id" in data &&
    "name" in data &&
    "email" in data &&
    typeof (data as Record<string, unknown>).id === "string" &&
    typeof (data as Record<string, unknown>).name === "string" &&
    typeof (data as Record<string, unknown>).email === "string"
  );
};

// Union types para estados bem definidos
export type LoadingState = "idle" | "loading" | "success" | "error";

// Tipos condicionais para APIs dinâmicas
export type ApiResponse<T> =
  | {
      data: T;
      success: true;
      message?: string;
    }
  | {
      data: null;
      success: false;
      error: string;
      code: number;
    };
```

**⚠️ Regras absolutas sobre `any`:**

- **PROIBIDO usar `any`** em qualquer contexto
- Se receber dados externos, use `unknown` + type guards
- Se uma lib externa não tem tipos, crie uma declaration (`.d.ts`)
- ESLint deve ter regra `@typescript-eslint/no-explicit-any: "error"`

---

## 5) Boas práticas específicas

### 5.1 Performance

1. **Lazy Loading de componentes**

   ```vue
   <script setup>
   const HeavyModal = defineAsyncComponent(
     () => import("~/components/HeavyModal.vue")
   );
   </script>
   ```

2. **Computed Properties para cálculos complexos**

   ```typescript
   const expensiveCalculation = computed(() => {
     return items.value.reduce((acc, item) => acc + item.price, 0);
   });
   ```

3. **Evitar watchers desnecessários**

   ```typescript
   // ❌ Evite
   watch(searchTerm, async (newVal) => {
     results.value = await searchAPI(newVal);
   });

   // ✅ Prefira
   const { data: results } = await useLazyAsyncData(
     "search",
     () => searchAPI(searchTerm.value),
     {
       watch: [searchTerm],
     }
   );
   ```

### 5.2 Acessibilidade

1. **Labels e IDs apropriados**
2. **Roles ARIA quando necessário**
3. **Contraste adequado nas cores**
4. **Navegação por teclado**

### 5.3 SEO

1. **useSeoMeta() em cada página**
2. **Structured data quando aplicável**
3. **URLs semânticas**
4. **Imagens com alt text**

### 5.4 Testes

1. **Teste unitário para composables**
2. **Teste de componente para UI crítica**
3. **Teste E2E para fluxos principais**

---

## 6) Convenções de commit

Use **Conventional Commits**:

- `feat:` nova funcionalidade
- `fix:` correção de bug
- `docs:` documentação
- `style:` formatação (sem mudança de lógica)
- `refactor:` refatoração de código
- `test:` adição/modificação de testes
- `chore:` tarefas de build, dependências, etc.

**Exemplos:**

```
feat(auth): adicionar login com Google
fix(cart): corrigir cálculo de desconto
docs(readme): atualizar instruções de instalação
refactor(user): extrair lógica para composable
```

---

## 7) Estrutura de configuração

### 7.1 nuxt.config.ts

```typescript
export default defineNuxtConfig({
  // TypeScript com configuração mais rigorosa
  typescript: {
    strict: true,
    typeCheck: true,
  },

  // ESLint para prevenir uso de 'any'
  eslint: {
    config: {
      rules: {
        "@typescript-eslint/no-explicit-any": "error",
        "@typescript-eslint/no-unsafe-argument": "error",
        "@typescript-eslint/no-unsafe-assignment": "error",
        "@typescript-eslint/no-unsafe-call": "error",
        "@typescript-eslint/no-unsafe-member-access": "error",
        "@typescript-eslint/no-unsafe-return": "error",
      },
    },
  },

  // Modules essenciais
  modules: ["@nuxtjs/tailwindcss", "@pinia/nuxt", "@nuxtjs/eslint-module"],

  // Runtime config
  runtimeConfig: {
    // Privadas (server-only)
    apiSecret: "",

    // Públicas (client + server)
    public: {
      apiBase: "/api",
    },
  },
});
```

---
