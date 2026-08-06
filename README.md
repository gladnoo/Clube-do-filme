# Clube do Filme 🎬

O clube do livro, só que de filme. Web app completo: login/cadastro, filme da
semana, fila de próximos candidatos, ficha de avaliação (nota 0–5, pontos
altos/baixos, personagem e ator preferido, cena favorita, frase marcante,
comentário), histórico com busca/filtro, ranking dos melhores filmes e
membros mais ativos, perfil e página pública de cada membro.

Feito com Next.js 14 (App Router) + Prisma + NextAuth + Tailwind. Funciona
como site responsivo — abre igual no celular e no computador, não precisa
instalar nada.

## Novidades desta versão

- **Fila** (`/queue`): candidatos a filme da semana. Ao adicionar um filme,
  escolha o destino: fila, filme da semana, ou já assistido (vai direto pro
  histórico). Qualquer membro pode "escolher pra semana" um filme da fila.
- **Busca e filtro no Histórico**: busca por título/ano, ordena por mais
  recente / melhor nota / ordem alfabética, filtro "só com fichas".
- **Ranking** (`/ranking`): top 10 filmes mais bem avaliados e top 10
  membros que mais avaliaram.
- **Editar e apagar filme**: na página de qualquer filme, botões "Editar" e
  "Apagar filme" (apagar remove as fichas dele também, com confirmação).
- **Exportar ficha como imagem**: depois de preencher sua ficha, um botão
  gera uma imagem (estilo card pra postar no story) com pôster, nota e um
  trecho do comentário.
- **Pôster desfocado como fundo**: a página de cada filme usa o próprio
  pôster, desfocado e escurecido, como plano de fundo ambiente.
- **Perfil público de membros** (`/member/[username]`) e lista de todos os
  membros (`/members`), acessível a partir do seu Perfil ou clicando no
  nome de qualquer pessoa numa ficha.

> Se você já tinha rodado uma versão anterior deste projeto, o schema do
> banco mudou (campo novo `inQueue`). Rode `npx prisma db push` de novo
> depois de atualizar os arquivos — é rápido e não apaga fichas nem filmes
> já cadastrados.

- **Preview bonito ao compartilhar o link** (Open Graph): quando alguém manda
  o link no WhatsApp/Telegram, aparece uma imagem com o nome do clube.
  Isso usa a variável `NEXTAUTH_URL` do `.env` pra montar a URL da imagem —
  então, em produção, garanta que `NEXTAUTH_URL` está com o domínio real
  (ex: `https://clube-do-filme.vercel.app`), senão o preview aponta pro
  `localhost`.
- **Favicon e ícone de "adicionar à tela inicial"**: o site agora tem
  ícone próprio e um manifesto PWA básico — dá pra instalar como atalho no
  celular com carinha de app.

## 1. Rodando local

Pré-requisitos: [Node.js](https://nodejs.org) 18 ou mais novo.

```bash
npm install
cp .env.example .env
```

Abra o `.env` e preencha:

- `NEXTAUTH_SECRET`: gere um valor aleatório com `openssl rand -base64 32`
  (ou qualquer texto longo e aleatório).
- `TMDB_API_KEY`: crie de graça em
  https://www.themoviedb.org/settings/api (é rápido, só precisa de uma conta).
  Sem isso, a busca automática de filme não funciona — mas o cadastro manual
  continua funcionando normalmente.

`DATABASE_URL` já vem pronto usando SQLite (um arquivo local, zero
configuração). Não precisa mexer pra rodar local.

Crie o banco de dados e rode:

```bash
npx prisma db push
npm run dev
```

Abra http://localhost:3000 — clique em "Cadastre-se" pra criar a primeira
conta do clube. Todo mundo do clube pode criar a própria conta com usuário e
senha.

## 2. Como usar

- **Adicionar filme**: busca no TMDB (importa pôster, sinopse, elenco e
  diretor automaticamente) ou cadastro manual. Dá pra marcar o filme já
  como "filme da semana" na hora.
- **Filme da semana**: mostra o filme atual do clube, sua ficha de
  avaliação (folha estilo ficha de cinema) e as fichas dos outros membros.
- **Histórico**: grade com todos os filmes já cadastrados e nota média de
  cada um. Clique num filme pra ver/editar sua ficha dele, mesmo que não
  seja mais o "filme da semana" (dá pra avaliar qualquer filme, não só o
  atual). Tem um botão pra trocar o filme da semana por qualquer filme do
  histórico.
- **Perfil**: suas fichas e estatísticas (quantos filmes avaliou, nota
  média que costuma dar, quantos filmes adicionou).

## 3. Publicando o site de verdade (pra usar do celular também)

O jeito mais simples e gratuito é [Vercel](https://vercel.com) (mesma
empresa do Next.js) + um banco Postgres gratuito, porque o SQLite local não
funciona em produção na Vercel.

**Banco de dados** — crie um banco Postgres grátis em uma dessas opções:
[Neon](https://neon.tech), [Supabase](https://supabase.com) ou
[Railway](https://railway.app). Copie a "connection string" (algo como
`postgresql://usuario:senha@host/banco`).

Depois, troque o provider no `prisma/schema.prisma`:

```prisma
datasource db {
  provider = "postgresql"   // era "sqlite"
  url      = env("DATABASE_URL")
}
```

**Deploy**:

1. Suba este projeto pro GitHub (crie um repositório e faça `git push`).
2. Em https://vercel.com, clique em "Add New Project" e importe o
   repositório.
3. Em "Environment Variables", adicione:
   - `DATABASE_URL` → a connection string do Postgres
   - `NEXTAUTH_SECRET` → o mesmo valor aleatório de antes (ou gere outro)
   - `NEXTAUTH_URL` → a URL que a Vercel vai te dar, tipo
     `https://clube-do-filme.vercel.app`
   - `TMDB_API_KEY` → sua chave do TMDB
4. Clique em Deploy.
5. Depois do primeiro deploy, rode `npx prisma db push` apontando pro
   `DATABASE_URL` de produção (localmente: `DATABASE_URL="sua-connection-string" npx prisma db push`)
   pra criar as tabelas no banco novo.

Pronto — o link da Vercel funciona igual em qualquer celular ou computador,
sem precisar instalar app nenhum. Se quiser, dá pra "instalar" como atalho
na tela inicial do celular pelo navegador (Adicionar à tela de início), que
já fica com carinha de app.

## 4. Estrutura do projeto

```
prisma/schema.prisma       modelos do banco (User, Movie, CastMember, Review)
src/lib/                   prisma client, auth (NextAuth), integração TMDB
src/app/api/                rotas da API (filmes, fichas, busca TMDB, auth)
src/app/(app)/               páginas logadas: semana, adicionar, histórico, perfil
src/app/login, /signup      páginas de autenticação
src/components/             StarRating, FichaForm, MovieCard, ReviewCard, Nav...
```

## 5. Sobre segurança

Login é feito com senha com hash (bcrypt) e sessão via NextAuth — é
razoável pra um grupo de amigos, mas não foi pensado pra ser um app
público na internet com muitos usuários desconhecidos (não tem, por
exemplo, recuperação de senha por e-mail, verificação de conta, nem
limite de tentativas de login). Pra um clube fechado entre amigos, tá de
bom tamanho.
