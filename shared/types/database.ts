/**
 * Tipo Database que define a estrutura dos tipos do banco de dados,
 * incluindo o perfil do usuário. Segue o padrão para tipagem de tabelas.
 */
export type Database = {
  public: {
    Profile: Profile;
    Especialidades: Especialidades;
  }
}

/**
 * Interface Profile que define a estrutura do perfil do usuário no banco de dados.
 * Inclui campos como ID, datas de criação e atualização, ID do usuário associado,
 * nome e role (papel/permissão).
 */
export interface Profile {
  id: number;
  created_at: string;
  updated_at: string | null;
  user_id: string | null;
  nome: string | null;
  role: string | null;
}

/**
 * Interface Especialidades que define a estrutura da tabela especialidades no banco de dados.
 * Inclui campos como ID, datas de criação e atualização, e o nome da especialidade.
 */
export interface Especialidades {
  id: number;
  created_at: string;
  updated_at: string | null;
  especialidade: string | null;
}