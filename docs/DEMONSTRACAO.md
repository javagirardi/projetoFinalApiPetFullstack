# Validação local dos módulos 2 e 3

Estas contas são fictícias e exclusivas do banco local de demonstração. Não correspondem às credenciais reais do `.env` nem devem ser usadas em produção.

| Perfil | E-mail demonstrativo | Senha demonstrativa |
| --- | --- | --- |
| Equipe | `demo.equipe@lab365petamigo.example` | `DemoEquipe123!` |
| Lar | `demo.lar@lab365petamigo.example` | `DemoLar123!` |

Preparação explícita, após configurar `.env`:

```powershell
npm run db:create
npm run db:migrate
npm run db:seed
npm run db:demo
```

O seed de demonstração só permite o banco `lab365petamigo_modulo4`, recusa ambiente de produção e preserva contas/registros existentes. Ele cria sete pets para observar os cinco estados, com pedidos em análise, entrevista, aprovados, concluídos, recusados e cancelados. Os pedidos e históricos são dados de teste para as consultas e regras dos módulos 2 e 3. As fotos dos exemplos foram recuperadas do projeto anterior; executar novamente db:demo preenche somente fotos ausentes desses registros, preservando fotos já cadastradas.

## Cadastro e sessão

1. Abrir `http://localhost:5173/cadastro`. Tentar enviar vazio e conferir os erros por campo.
2. Usar um e-mail fictício novo, telefone e CEP formatados. Conferir preenchimento pelo ViaCEP e a possibilidade de corrigir o endereço manualmente.
3. Confirmar senha e aceitar o termo **demonstrativo lorem ipsum**. Nenhum desses dois campos é enviado à API.
4. Após cadastrar, conferir login sem autenticação automática, com e-mail preenchido e mensagem de sucesso.
5. Entrar como lar e abrir “Minhas adoções”. Conferir os três grupos e as datas do histórico.
6. Sair, abrir `/minhas-adocoes` e entrar novamente: deve retornar à tela solicitada. O login usa a sessão oficial plana em `@dadoslogin`, com role `admin` ou `lar`.
7. E-mail já cadastrado como lar ou equipe deve retornar conflito e mostrar o aviso no topo do cadastro.

## Pets no painel

1. Abrir `/admin/pets` sem sessão e entrar como equipe: o login deve retornar à listagem. Na entrada sem origem, o destino padrão do contrato redireciona à gestão de pets nesta entrega restrita.
2. Conferir totais, busca por nome/raça, filtros por tipo/situação e ausência do pet arquivado na visão inicial.
3. Cadastrar um pet com os seletores e opcionais vazios. Conferir situação Disponível.
4. Editar somente o nome e conferir preservação dos demais dados. Informar uma foto válida e depois inválida para conferir a prévia e o aviso.
5. Arquivar Amora com motivo. Conferir data/motivo no filtro Arquivado. Editar o registro arquivado e restaurá-lo.
6. Conferir botões desativados para Bento/Cacau/Dora, com explicação dos impedimentos.
7. Conferir o adotante de Dora e o endereço de seu link, exigido pelo requisito 3.1. A tela de destino não integra a entrega restrita.

## Limites da entrega

- Não existem telas de preparação ou menus fora dos requisitos 2 e 3.
- O retorno oficial `{ redirectTo: '/pets/:id', petId }` é preservado pelo login/cadastro, assim como o alias anterior com `?adotar=1`. Somente o contrato do retorno é coberto nesta entrega; a tela de destino não é implementada. Consulte `CONTRATOS.md` para os links exigidos pelo enunciado e o redirecionamento das entradas padrão.
- WhatsApp: o contato autorizado já está em `VITE_ONG_WHATSAPP`. Conferir o link de cada pedido ativo e a mensagem com número do pedido e nome do pet. A verificação não envia mensagens pelo WhatsApp.
- O termo usa lorem ipsum a pedido do usuário; substituir antes de qualquer uso real.
- Template oficial conferido e reconciliado nos contratos e estrutura dos módulos 2 e 3. A conta GitHub foi autenticada, o repositório pessoal foi criado e a implementação foi publicada com PR #1 em rascunho; a CI do código passou. Revisão/merges, criação do Trello e entrega no AVA seguem pendentes. O trabalho é individual; `origin` aponta somente para `javagirardi/projetoFinalApiPetFullstack`, e `template` preserva a referência oficial.

## Verificações realizadas

- Banco novo criado, migração aplicada e seeds executados, preservando o banco da etapa anterior.
- Suíte automatizada dos contratos oficiais e fluxos dos módulos 2 e 3; build de produção verificado.
- Execução mais recente: 36 testes aprovados. Reinício da API, login da equipe, retorno à rota protegida e layout/endereço de edição oficiais conferidos no navegador.
- Cadastro real de uma conta fictícia pelo navegador, máscaras, preenchimento ViaCEP e retorno ao login conferidos.
- Login dos dois perfis, grupos/históricos de adoção, listagem administrativa e arquivamento/restauração conferidos no navegador.
