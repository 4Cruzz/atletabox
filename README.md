# AtletaBox — V1

Site estático de curadoria de produtos esportivos.

## O que já existe
- Home responsiva
- Busca
- Categorias: Academia, Futebol, Performance e Ofertas
- Cards de produtos
- Ordenação por destaque/preço/avaliação
- Página individual de produto
- Botão de saída para link de afiliado
- Aviso de transparência sobre afiliados
- Painel inicial para cadastrar/excluir produtos
- Dados salvos no `localStorage` do navegador

## Como colocar no ar grátis
1. Crie uma conta no Cloudflare.
2. Crie um projeto em Pages.
3. Faça upload desta pasta/repositório.
4. O arquivo inicial é `index.html`.

Também funciona em qualquer hospedagem de site estático.

## Como cadastrar um produto
Abra `/admin.html`.
Preencha:
- nome
- categoria
- preço
- avaliação
- vendas
- imagem
- link de afiliado do Mercado Livre
- descrição

### Importante sobre a V1
O painel é apenas local: os produtos ficam salvos no navegador em que foram cadastrados. Portanto, ainda não é um painel de produção.

Na próxima etapa, conecte:
- Supabase para banco de dados
- autenticação para proteger o admin
- API do Mercado Livre para busca/atualização
- um backend/Cloudflare Worker para não expor segredos

## Personalização
Edite `styles.css` para aparência e `app.js` para dados/lógica.

Não use a identidade visual do Mercado Livre de forma que pareça que o AtletaBox é o próprio Mercado Livre.
