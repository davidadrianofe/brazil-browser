# brzil

Versão inicial do navegador brzil — scaffold com Electron + React + Vite.

Autor: David Adriano Ferrari dos Santos

Recursos iniciais
- Abas
- Barra de endereço
- Favoritos (salvos em localStorage)
- Histórico básico (localStorage)
- Suporte a PT-BR (padrão) e EN

Como rodar (desenvolvimento)
1. Instalar dependências:
   npm install

2. Rodar em modo desenvolvimento:
   npm run dev
   (isso abre o Vite + Electron)

Como buildar (produção)
1. Construir UI:
   npm run build:ui
2. Gerar instaladores:
   npm run build
   (usa electron-builder — ver package.json para configuração)

Como aplicar este scaffold no seu repositório
1. Crie uma branch:
   git checkout -b redesign/pt-br

2. Copie os arquivos deste patch/estrutura para a raiz do repositório.

3. Adicione, commit e envie:
   git add .
   git commit -m "feat: redesign brzil — Electron + React, PT-BR"
   git push --set-upstream origin redesign/pt-br

4. Abra um Pull Request para revisão.

Observações e próximos passos recomendados
- Trocar ícones (pasta assets/) e logos por arquivos oficiais.
- Integrar persistência segura via electron-store ou DB para favoritos/histórico.
- Melhorar UI/UX (arrastar abas, gerenciar sessões, modo anônimo).
- Avaliar permissões e segurança do uso de webview; para produção, usar preload + contextIsolation e aplicar CSP.
