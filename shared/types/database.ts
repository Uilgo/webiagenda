/**
 * Tipo Database que define a estrutura dos tipos do banco de dados,
 * incluindo o perfil do usuário. Segue o padrão para tipagem de tabelas.
 */
export type Database = {
  public: {
    Profile: Profile;
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