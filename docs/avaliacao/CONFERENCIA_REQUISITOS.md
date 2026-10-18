# Conferência dos módulos 2 e 3

Data: 18/10/2026. Escopo: requisitos 2.1–2.3 e 3.1–3.4 do documento avaliativo, respeitando a restrição oficial aos módulos 2 e 3. Esta conferência compara o documento, incluindo a imagem do body de cadastro do pet, com o código e a suíte existente; não representa revisão por outra pessoa.

## Evidências

| Requisito | Evidência no projeto | Resultado |
| --- | --- | --- |
| 2.1 Login | `backend/src/auth/`, `frontend/src/auth/`, `frontend/src/pages/Login.jsx`, `shared/src/index.js` | Login dos dois perfis, DTO público, sessão, erros e origem implementados. Destinos padrão adaptados ao escopo restrito. |
| 2.2 Cadastro do lar | `frontend/src/pages/Cadastro.jsx`, `backend/src/modules/lares.js`, `shared/src/validation.js` | Campos, máscaras, ViaCEP, confirmação/termo somente no frontend, bcrypt, unicidade entre perfis e retorno ao login implementados. |
| 2.3 Minhas adoções | `frontend/src/pages/MinhasAdocoes.jsx`, `backend/src/modules/lares.js`, entidades de adoção e histórico | Consulta pelo token, relações, ordenação, três grupos, etapas, histórico, datas, motivos e contato implementados. |
| 3.1 Listagem | `frontend/src/pages/PetList.jsx`, `backend/src/modules/pets.js`, `shared/src/index.js` | Perfis, cinco situações, contagens, busca, filtros, adotante e ações implementados. |
| 3.2 Cadastro de pet | `frontend/src/pages/PetForm.jsx`, `backend/src/modules/pets.js`, `shared/src/validation.js` | Catálogos públicos, campos, validações, prévia da foto, resposta 201 e retorno com sucesso implementados. |
| 3.3 Edição | Mesmo formulário e módulo de pets | GET protegido, atualização parcial, validações, 400/404, preservação de relações e edição de arquivados implementados. |
| 3.4 Arquivamento/restauração | `frontend/src/pages/PetList.jsx`, `backend/src/modules/pets.js` | Motivo, limites, impedimentos, 404/409, data, restauração e preservação do histórico implementados. |

## Verificações executadas

- `npm test`: **36 testes aprovados** — 7 frontend, 23 backend incluindo subtestes e 6 contratos.
- `npm run build`: aprovado.
- Leitura de componentes, handlers, validações, entidades e migração, comparada aos requisitos.
- Conferência visual da imagem do body do requisito 3.2.
- Comparação das árvores antes/depois da reorganização confirmou conteúdo funcional idêntico.

Os testes HTTP precisaram de execução fora do isolamento que impedia acesso às portas locais temporárias. A execução inicial nesse isolamento falhou por conexão; a execução com acesso local passou integralmente. Os testes usam PostgreSQL em memória (PGlite), sem gravar no banco local da aplicação.

## Limites e pendências

- Não foi identificada nova funcionalidade ausente no escopo autorizado. Isso não equivale a cobertura exaustiva dos cenários de interface.
- Fazer a conferência manual final nos dois perfis antes da entrega. Verificações anteriores no navegador estão em `docs/BASE_PROVISORIA.md` e `docs/VISUAL.md`.
- Os destinos de detalhes do pet e dossiê do lar não pertencem à implementação autorizada. Os links preservam o contrato, mas suas telas não foram entregues; detalhes em `docs/CONTRATOS.md`.
- Os destinos padrão do login foram adaptados às telas disponíveis. Não declarar fluxos externos completos nem ampliar o projeto para resolver essa limitação.
- Termo demonstrativo e contato foram autorizados pelo usuário; não são funcionalidades pendentes.
- A reorganização posterior dos commits não substitui branches/PRs por funcionalidade realizados durante o desenvolvimento.
- Estado do Trello, integração final em main, apresentação e AVA são tratados nos documentos de entrega e não foram presumidos concluídos.
