# Organização dos commits por requisito

Em 18/10/2026, por solicitação do usuário, a implementação consolidada foi separada em commits da base e dos requisitos. O conteúdo final das árvores da feature e da integração foi comparado antes e depois e permaneceu idêntico.

Os commits novos registram a data dessa reorganização. Correções posteriores foram reaplicadas preservando sua autoria e data de autoria, com a data de integração atualizada. Os commits parciais devem ser lidos em sequência; a validação funcional se refere à versão integrada.

| Etapa | Commit |
| --- | --- |
| Workspaces e contratos compartilhados | `a4acfdd08b7935af07829a6324c13ae4a9c5d953` |
| 2.1 Login e sessão por perfil | `c020076badc942079a1acedc768cea02f6ff35d1` |
| 2.2 Cadastro de lar, validação e bcrypt | `f0b942fb176ccd69f403a01e28febac49763cd52` |
| 2.3 Consulta e acompanhamento de adoções | `b16a84472be389ef5962bf0b087c19eb7672907f` |
| 3.1 Listagem, filtros e situação dos pets | `c3a732a27b110f9ab6c50b4c1c3883f4d5c6ef1b` |
| 3.2 Cadastro com catálogos e formulário | `aec1e2549ab04cde957099ca3b595cb7b58c03ea` |
| 3.3 Carregamento e atualização parcial | `2ccbde55a4e5049d963304e519e4f490c73088ae` |
| 3.4 Arquivamento e restauração | `99ae58aa5c150d6d1b2d65167f54c1ce363635b9` |
| Documentação da implementação | `2773633842bcaea513cb7d1b72362f5a282069b5` |

Consulte os [commits no repositório pessoal](https://github.com/javagirardi/projetoFinalApiPetFullstack/commits/develop/).

O [PR #1](https://github.com/javagirardi/projetoFinalApiPetFullstack/pull/1) é a integração consolidada efetivamente realizada. A reorganização não cria PRs anteriores por requisito nem comprova um fluxo de branches que não ocorreu. Os cartões devem apontar para o PR real e podem usar os commits acima como evidências adicionais.

A base local continua em `10b579bc223c6fa08592f018bda10d64ea4189fe`; sua origem está em [ORIGEM.md](../template/ORIGEM.md). As referências atuais estão em [DESTINOS_GITHUB.md](DESTINOS_GITHUB.md).
