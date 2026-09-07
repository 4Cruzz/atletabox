const KEY="achadobox_products_v1";

const demoProducts=[
  {
    id:"p1",
    title:"Fone Bluetooth sem fio",
    category:"tecnologia",
    price:49.90,
    rating:4.8,
    sales:3200,
    brand:"",
    image:"",
    affiliate:"#",
    featured:true,
    description:"Fone Bluetooth compacto e com ótimo custo-benefício."
  },
  {
    id:"p2",
    title:"Luminária LED inteligente",
    category:"casa",
    price:39.90,
    rating:4.7,
    sales:1800,
    brand:"",
    image:"",
    affiliate:"#",
    featured:true,
    description:"Item simples para deixar o ambiente mais moderno."
  },
  {
    id:"p3",
    title:"Kit de faixas elásticas para treino",
    category:"esportes",
    price:59.90,
    rating:4.8,
    sales:1200,
    brand:"",
    image:"",
    affiliate:"#",
    featured:true,
    description:"Kit versátil para treino em casa ou academia."
  },
  {
    id:"p4",
    title:"Bolsa transversal masculina",
    category:"moda",
    price:69.90,
    rating:4.7,
    sales:950,
    brand:"",
    image:"",
    affiliate:"#",
    featured:true,
    description:"Bolsa compacta para usar no dia a dia."
  },
  {
    id:"p5",
    title:"Escova facial elétrica",
    category:"beleza",
    price:44.90,
    rating:4.8,
    sales:2100,
    brand:"",
    image:"",
    affiliate:"#",
    featured:false,
    description:"Produto para cuidados e limpeza facial."
  },
  {
    id:"p6",
    title:"Mini aspirador portátil",
    category:"ofertas",
    price:79.90,
    rating:4.6,
    sales:1500,
    brand:"",
    image:"",
    affiliate:"#",
    featured:true,
    description:"Achado útil para limpeza rápida de pequenos espaços."
  }
];

const cats=[
  ["all","Todos"],
  ["ofertas","🔥 Ofertas"],
  ["tecnologia","📱 Tecnologia"],
  ["casa","🏠 Casa"],
  ["esportes","🏋️ Esportes"],
  ["moda","👕 Moda"],
  ["beleza","✨ Beleza"]
];

function getProducts(){
  try{
    const x=localStorage.getItem(KEY);
    return x ? JSON.parse(x) : demoProducts;
  }catch(e){
    return demoProducts;
  }
}

function saveProducts(p){
  localStorage.setItem(KEY,JSON.stringify(p));
}

function money(v){
  return Number(v).toLocaleString("pt-BR",{
    style:"currency",
    currency:"BRL"
  });
}

function catName(c){
  return (cats.find(x=>x[0]===c)||["","Produto"])[1].replace(/^[^ ]+ /,"");
}

function categoryEmoji(c){
  const emojis={
    tecnologia:"📱",
    casa:"🏠",
    esportes:"🏋️",
    moda:"👕",
    beleza:"✨",
    ofertas:"🔥"
  };
  return emojis[c] || "🛍️";
}

function esc(s){
  return String(s??"").replace(/[&<>"']/g,m=>({
    "&":"&amp;",
    "<":"&lt;",
    ">":"&gt;",
    '"':"&quot;",
    "'":"&#039;"
  }[m]));
}

function productCard(p){
  return `
    <article class="card">
      <a href="produto.html?id=${encodeURIComponent(p.id)}">
        <div class="card-img">
          ${
            p.image
              ? `<img src="${esc(p.image)}" alt="${esc(p.title)}">`
              : `<div class="placeholder">${categoryEmoji(p.category)}</div>`
          }
        </div>
      </a>
      <div class="card-body">
        <span class="tag">${esc(catName(p.category))}</span>
        <h3>${esc(p.title)}</h3>
        <div class="rating">
          ★ ${Number(p.rating||0).toFixed(1)} · ${Number(p.sales||0).toLocaleString("pt-BR")} vendas
        </div>
        <div class="price">${money(p.price)}</div>
        <a class="btn" href="produto.html?id=${encodeURIComponent(p.id)}">Ver produto</a>
      </div>
    </article>
  `;
}

function initHome(){
  const nav=document.getElementById("categoryNav");
  const grid=document.getElementById("productGrid");
  const search=document.getElementById("searchInput");
  const sort=document.getElementById("sort");
  let active="all";

  nav.innerHTML=cats.map(c=>`
    <button class="cat ${c[0]==="all"?"active":""}" data-cat="${c[0]}">
      ${c[1]}
    </button>
  `).join("");

  nav.onclick=e=>{
    const b=e.target.closest("[data-cat]");
    if(!b) return;
    active=b.dataset.cat;
    document.querySelectorAll(".cat").forEach(x=>x.classList.remove("active"));
    b.classList.add("active");
    render();
  };

  search.oninput=render;

  document.getElementById("searchBtn").onclick=()=>{
    document.getElementById("produtos").scrollIntoView();
  };

  sort.onchange=render;

  function render(){
    let q=search.value.trim().toLowerCase();

    let p=getProducts().filter(x=>
      (active==="all" || x.category===active) &&
      x.title.toLowerCase().includes(q)
    );

    if(sort.value==="priceAsc") p.sort((a,b)=>a.price-b.price);
    if(sort.value==="priceDesc") p.sort((a,b)=>b.price-a.price);
    if(sort.value==="rating") p.sort((a,b)=>b.rating-a.rating);
    if(sort.value==="featured") p.sort((a,b)=>Number(b.featured)-Number(a.featured));

    grid.innerHTML=p.map(productCard).join("");
    document.getElementById("empty").classList.toggle("hidden",p.length>0);
    document.getElementById("sectionTitle").textContent=
      active==="all" ? "Achados de hoje" : catName(active);
  }

  const year=document.getElementById("year");
  if(year) year.textContent=new Date().getFullYear();

  render();
}

function renderProductPage(){
  const box=document.getElementById("productDetail");
  const id=new URLSearchParams(location.search).get("id");
  const p=getProducts().find(x=>x.id===id);

  if(!p){
    box.innerHTML='<div class="empty">Produto não encontrado. <a href="index.html">Voltar</a></div>';
    return;
  }

  box.innerHTML=`
    <div class="detail">
      <div class="detail-img">
        ${
          p.image
            ? `<img src="${esc(p.image)}" alt="${esc(p.title)}">`
            : `<div class="placeholder">${categoryEmoji(p.category)}</div>`
        }
      </div>
      <div>
        <span class="tag">${esc(catName(p.category))}</span>
        <h1>${esc(p.title)}</h1>
        <div class="rating">
          ★ ${Number(p.rating||0).toFixed(1)} · ${Number(p.sales||0).toLocaleString("pt-BR")} vendas
        </div>
        <div class="price">${money(p.price)}</div>
        <p class="muted">
          ${esc(p.description||"Produto selecionado pela curadoria AchadoBox.")}
        </p>
        <a class="btn" target="_blank" rel="sponsored noopener" href="${esc(p.affiliate||"#")}">
          VER NO MERCADO LIVRE ↗
        </a>
        <p class="muted" style="font-size:12px;margin-top:18px">
          O AchadoBox pode receber comissão por compras realizadas através deste link.
        </p>
      </div>
    </div>
  `;
}

function initAdmin(){
  const form=document.getElementById("productForm");
  const list=document.getElementById("adminList");

  function render(){
    const p=getProducts();
    document.getElementById("count").textContent=p.length;
    document.getElementById("categoriesCount").textContent=new Set(p.map(x=>x.category)).size;
    document.getElementById("featuredCount").textContent=p.filter(x=>x.featured).length;

    list.innerHTML=p.map(x=>`
      <div class="admin-row">
        <div>
          <b>${esc(x.title)}</b><br>
          <small>${esc(catName(x.category))} · ${money(x.price)}</small>
        </div>
        <button class="danger" data-del="${esc(x.id)}">Excluir</button>
      </div>
    `).join("");
  }

  form.onsubmit=e=>{
    e.preventDefault();
    const f=new FormData(form);
    const p=getProducts();

    p.unshift({
      id:"p"+Date.now(),
      title:f.get("title"),
      category:f.get("category"),
      price:Number(f.get("price")),
      rating:Number(f.get("rating")),
      sales:Number(f.get("sales")),
      image:f.get("image"),
      affiliate:f.get("affiliate"),
      brand:f.get("brand"),
      description:f.get("description"),
      featured:f.get("featured")==="on"
    });

    saveProducts(p);
    form.reset();
    form.querySelector('[name="rating"]').value=4.8;
    form.querySelector('[name="featured"]').checked=true;
    render();
    alert("Produto adicionado!");
  };

  list.onclick=e=>{
    const id=e.target.dataset.del;
    if(!id) return;

    if(confirm("Excluir este produto?")){
      saveProducts(getProducts().filter(x=>x.id!==id));
      render();
    }
  };

  document.getElementById("resetDemo").onclick=()=>{
    if(confirm("Isso apaga os produtos deste navegador e restaura a demonstração.")){
      saveProducts(demoProducts);
      render();
    }
  };

  render();
}

if(document.getElementById("productGrid")){
  initHome();
}
