# Checklist para conferência independente

Roteiro de revisão dos requisitos, das evidências e das pendências da entrega.

Faça uma auditoria independente desta entrega avaliativa, sem implementar correções.

Projeto: D:/Computação/workspace GitHub/projeto_senai
Documento de requisitos: C:/Users/javan/Downloads/Desenvolvimento Web [FullStack] v1 - Módulo 4 - Projeto Avaliativo.md

Consulte `docs/ESCOPO.md` e o documento original, incluindo as imagens incorporadas quando relevantes. Não trate relatórios anteriores nem resultados de testes como prova suficiente de conformidade.

Orientações oficiais recebidas fora do documento:
- Implementar SOMENTE os módulos 2 e 3: requisitos 2.1–2.3 e 3.1–3.4.
- O trabalho é individual.
- Não manter telas vazias, menus, funcionalidades ou tarefas dos demais módulos. Não recomendar sua implementação como pendência desta entrega.
- As orientações gerais de tecnologia, estrutura, Git, Trello, entrega e apresentação continuam aplicáveis.
- O termo lorem ipsum demonstrativo foi autorizado pelo usuário.
- O WhatsApp autorizado é +55 (34) 99315-1770; o destino esperado é https://wa.me/5534993151770, com a mensagem contextual do pedido.
- O nome do quadro Trello é Lab365PetAmigo.

Compare cada subitem dos requisitos com o código e o comportamento verificável. Confira:
1. Login, sessão, perfis, autorização no backend, erros e preservação da origem entre login e cadastro.
2. Cadastro do lar, máscaras, ViaCEP, validações, bcrypt, unicidade entre os dois perfis, ausência de credenciais nas respostas e retorno ao login sem autenticação automática.
3. Minhas adoções: isolamento pelo token, relações TypeORM, ordenação, três grupos, etapas, respostas, histórico, datas, motivos, contato WhatsApp e estados de carregamento/erro/vazio.
4. Gestão de pets: proteção de equipe, campos, cinco situações e sua precedência, pedidos ativos, adotante, contagens, busca, filtros e ações.
5. Cadastro/edição: catálogos, validações, prévia da foto, formulário compartilhado, edição parcial, relações omitidas, atualização vazia, 404 e edição de arquivados.
6. Arquivamento/restauração: motivo, limites, conflitos, data, preservação dos históricos e transações.
7. Estrutura frontend/backend, configuração PostgreSQL, tratamento de .env, template oficial, Git Flow, PRs e Trello. Diferencie arquivos preparados de ações efetivamente executadas nos serviços.

O template de referência está em .template-oficial/, ignorado no Git; sua origem e referências estão em docs/template/ORIGEM.md. Consulte-o somente para os requisitos aplicáveis.

Examine especialmente a navegação descrita em docs/CONTRATOS.md: as entradas padrão redirecionam às telas disponíveis nesta entrega restrita, e os links exigidos pelo documento podem apontar para destinos não implementados. Registre com clareza o que é adaptação ao escopo oficial, o que foi apenas preservado como contrato e o que realmente funciona. Não declare fluxo completo quando o destino retorna 404. Não amplie o escopo para solucionar isso.

Pode executar os testes existentes e o build. Não altere código, configurações, branches ou histórico; não crie PRs/cartões nem envie mensagens. Não execute migrações, seeds ou operações de escrita no PostgreSQL local. Os testes em banco isolado/em memória são permitidos. Não exponha .env, senhas reais, hashes ou tokens. Se algum acesso não estiver disponível, marque o item como não verificado.

Produza somente o relatório docs/avaliacao/CONFERENCIA_REQUISITOS.md. Para cada requisito/subitem, inclua: exigência e localização no documento, evidência no código com arquivo e linha, verificação executada, situação (atende/parcial/não atende/não verificado) e impacto. Separe falhas confirmadas, limitações de escopo, decisões técnicas e pendências externas. Priorize os achados que possam afetar a nota e apresente próximos passos concretos, sem implementar nada.

Informe ao final os comandos executados, resultados e limitações da auditoria. Não use percentual de conclusão sem uma contagem verificável de critérios.
