# Conferência do template oficial

Repositório: https://github.com/Desenvolvimento-WEB-FullStack/template_projeto_pets_m3

Branch usada: `develop`, commit `67e6190dc3114ad08c8472a365b1ae2ee9ebd586`, consultado e baixado em 17/10/2026. A referência está em `template/develop` no Git local; `origin` continua reservado ao repositório do usuário. A cópia de consulta fica em `.template-oficial/`, ignorada na entrega.

A `main`, em `8bf6ff59f5a5ee7512b81b5458c5fac7d0a59b81`, também foi conferida: sua única diferença para essa develop é a persistência da resposta de login em `@dadoslogin`. Essa persistência foi contemplada na adaptação.

O trabalho começou provisoriamente no código local, por escolha do usuário. Nesta conferência foram adequados os contratos e a estrutura necessários aos requisitos 2.1–2.3 e 3.1–3.4. Não se afirma que todo o histórico de desenvolvimento partiu do template nem que seu histórico substitui o do repositório existente.

| Contrato oficial | Adequação realizada |
| --- | --- |
| Perfis `admin` e `lar` | Pacote compartilhado e autorização alinhados; `ROLE.EQUIPE` passa a representar `admin` |
| Login `{ id, nome, email, role, token }` | Resposta plana da API e persistência compatíveis |
| Sessão `@dadoslogin` | Mesmo formato usado pelo cliente oficial; senha/hash excluídos |
| Retorno `redirectTo` / `petId` | Preservado entre login, cadastro e retorno; URLs externas e perfis incompatíveis rejeitados |
| Edição `/admin/pets/:id` | Rota e links canônicos; o endereço anterior com `/editar` segue como alias local |
| Erros `error` / `campos` | Expostos pela API e consumidos pelo cliente; aliases `erro` / `erros` preservados para compatibilidade |
| `PORT`, `DB_USERNAME`, `DB_LOGGING`, `JWT_SECRET`, `JWT_EXPIRES_IN`, `VITE_URL_API` | Reconhecidos junto aos nomes anteriores, sem senha padrão |
| Header e AdminLayout | Estrutura oficial adaptada à sessão, ao perfil e às funcionalidades da entrega |
| Campos do pet | IDs de tipo/raça/cor disponíveis com seus relacionamentos |

A orientação oficial de implementar somente os módulos 2 e 3 prevalece sobre a manutenção de todas as páginas vazias do template. Apenas os pontos de entrada desses requisitos são incluídos na aplicação.

## Diferenças deliberadas

- `fetch` centralizado em vez de axios: mesmo contrato HTTP, tratamento de 204/401 e erros de campo. Sessão e respostas seguem o contrato oficial.
- `senha_hash` interno, com `select: false`, em vez do nome de coluna `senha` do template. Não há mudança de campos públicos nem exposição de credenciais. A migração local permanece a fonte do banco desta entrega; o SQL do template não deve ser executado sobre ele.
- JWT mantém verificação de emissor, audiência e identidade composta. Rotas futuras devem reutilizar a segurança configurada, com o mesmo segredo. O middleware oficial simples consegue verificar os tokens emitidos aqui quando recebe `JWT_SECRET` correspondente.
- TypeORM possui relações explícitas e migrações versionadas; não é usado reset de banco, `synchronize` ou seed destrutivo.
- O enunciado exige acompanhamento em “Minhas adoções”; um trecho desatualizado do README oficial diz o contrário. Foi seguido o requisito 2.3 do documento avaliativo.

## Limites de escopo

A aplicação entrega somente os módulos 2 e 3. Não mantém páginas vazias, menus ou tarefas para funcionalidades adicionais. As referências de navegação exigidas nesses requisitos e a adaptação das entradas padrão para uso isolado estão descritas em `docs/CONTRATOS.md`.
