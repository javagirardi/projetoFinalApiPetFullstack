# Identidade visual dos módulos 2 e 3

Revisão solicitada pelo usuário em 18/10/2026.

## Direção visual

O site https://harmonious-palmier-7d4bf1.netlify.app/ foi navegado para observar composição, hierarquia, cantos arredondados e respiro entre os elementos. A identidade desta entrega usa uma paleta própria de lilás e azul pastel, com menta e areia nos indicadores e texto escuro para legibilidade.

Login, cadastro do lar, Minhas adoções, listagem administrativa e formulário de pets compartilham a navegação, os campos, os cartões e os botões. Somente dados já disponíveis nos módulos 2 e 3 alimentam os resumos exibidos. Não foram criadas telas ou funcionalidades adicionais.

## Fotografias

As imagens do projeto anterior estavam referenciadas em `servidor_api_pets/data/pets.json`. Os novos registros de demonstração não possuíam foto_url, o que fazia os cartões mostrar o estado sem foto.

- As fotos anteriores foram recuperadas e salvas em `frontend/public/images/pets`.
- A origem de cada arquivo está em `frontend/public/images/README.md`.
- `resolverFotoPet` associa somente as URLs conhecidas às cópias locais; URLs novas continuam sendo respeitadas.
- O seed preenche a foto apenas dos registros com o marcador de demonstração e com foto ausente. Fotos existentes, pedidos e históricos são preservados.
- Um pet realmente sem foto continua apresentando o estado de foto indisponível, sem receber a imagem de outro animal.

## Verificação

- Build de produção e 36 testes aprovados, incluindo a presença dos arquivos WebP e a preservação de URLs de fotos novas.
- Login dos dois perfis, busca da listagem, fotos dos cartões, formulário de edição e sua prévia, grupos de adoções, etapas e abertura do histórico conferidos no navegador.
- Composição conferida em janela ampla e na janela compacta de aproximadamente 600 px; estilos possuem adaptação adicional para telas de até 520 px.
- Nenhuma mensagem foi enviada pelo WhatsApp durante a verificação.

Os limites dos destinos de navegação e o escopo oficial continuam descritos em `CONTRATOS.md`.

## Correção da largura em Full HD

Em 18/10/2026 foi identificado que o limite de 1240 px ocupava aproximadamente 65% da largura de uma tela de 1920 px. O conteúdo das páginas e o cabeçalho passaram a compartilhar margens laterais proporcionais, sem esse limite fixo. A listagem mede aproximadamente 1790 px em 1920×1080, cerca de 94% da área disponível descontando a barra de rolagem.

- Quatro cartões por linha a partir de 1440 px, mantendo a adaptação para telas menores.
- Formulários usam a largura da página e três colunas em telas amplas. O cartão de login e as fotografias mantêm limites próprios de leitura e proporção.
- Listagem conferida em 1920×1080, 1366×768, 1080×1080 e 390×844, sem rolagem horizontal e com fotos carregadas.
- Cadastro/edição de pet, cadastro do lar, login e Minhas adoções conferidos em desktop e celular, sem gravar alterações nos dados de demonstração.
- Build de produção aprovado. Nenhum requisito funcional foi acrescentado.
