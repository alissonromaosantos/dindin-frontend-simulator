# DinDin

![](./.github/dindin.png)

Este é um projeto de uma aplicação financeira desenvolvido em React.js utilizando Vite como bundler. O objetivo do projeto é fornecer funcionalidades para o gerenciamento de transações e usuários em uma aplicação web.

## Tecnologias Utilizadas

- React.js: Biblioteca JavaScript para construção de interfaces de usuário.
- Vite: Um build tool rápido para projetos JavaScript modernos.
- Axios: Biblioteca JavaScript para fazer requisições HTTP.
- React Router DOM: Biblioteca para gerenciamento de rotas no React.
- date-fns: Biblioteca para manipulação de datas em JavaScript.

## Funcionalidades

### 1. Cadastrar Usuário

- Permite ao usuário criar uma nova conta.
- Requisita informações como nome de usuário, email e senha.
- Validação dos campos para garantir a integridade dos dados.

### 2. Logar Usuário

- Permite ao usuário autenticar-se no sistema com suas credenciais.
- Requisita o email e a senha do usuário.
- Validação das credenciais fornecidas.

### 3. Deslogar Usuário

- Permite ao usuário sair da sua sessão atual.
- Remove o token de autenticação armazenado no cliente.

### 4. Cadastrar Nova Transação

- Permite ao usuário adicionar uma nova transação.
- Requisita informações como título, descrição, data, categoria e valor.
- Validação dos campos para garantir a integridade dos dados.

### 5. Edição de Transação

- Permite ao usuário editar os detalhes de uma transação existente.
- Requisita as informações atualizadas para título, descrição, data, categoria e valor.
- Validação dos campos para garantir a integridade dos dados.

### 6. Exclusão de Transação

- Permite ao usuário excluir uma transação existente.
- Requisita a confirmação do usuário antes de excluir a transação.

### 7. Listagem de Transações

- Apresenta ao usuário uma tabela contendo todas as transações cadastradas.
- Exibe informações como título, descrição, data, categoria e valor.
- Ordena a tabela por data, permitindo visualizar as transações mais recentes primeiro.
- Oferece a opção de filtrar a tabela por categoria, exibindo apenas as transações relacionadas à categoria selecionada.

### 8. Resumo de Transações

- Fornece um resumo estatístico das transações cadastradas.
- Exibe o total de receitas, o total de despesas e o saldo atual.
- Calcula automaticamente com base nos valores das transações.

### 9. Editar Perfil do Usuário

- Permite ao usuário editar suas informações de perfil.
- Requisita as informações atualizadas, como nome de usuário, email e senha.
- Validação dos campos para garantir a integridade dos dados.

## Instruções de Instalação e Execução

1. Clone o repositório para o seu ambiente local.
2. Certifique-se de ter o Node.js e o npm instalados.
3. No diretório raiz do projeto, execute o comando `npm install` para instalar as dependências.
4. Após a instalação, execute o comando `npm run dev` para iniciar o servidor de desenvolvimento.
5. Acesse a aplicação no navegador através do endereço `http://localhost:5173/`.

&copy; MIT LICENSE

Feito com ❤️ por Alisson Romão Santos
