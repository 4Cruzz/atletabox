const KEY="atletabox_products_v1";
const demoProducts=[
 {id:"p1",title:"Kit de faixas elásticas para treino",category:"academia",price:59.9,rating:4.8,sales:1200,brand:"AtletaBox",image:"",affiliate:"#",featured:true,description:"Kit versátil para mobilidade, resistência e treino em casa."},
 {id:"p2",title:"Caneleira profissional para futebol",category:"futebol",price:39.9,rating:4.9,sales:2400,brand:"",image:"",affiliate:"#",featured:true,description:"Caneleira leve para treinos e partidas."},
 {id:"p3",title:"Garrafa térmica esportiva 1L",category:"performance",price:49.9,rating:4.7,sales:950,brand:"",image:"",affiliate:"#",featured:true,description:"Boa opção para hidratação durante treino e jogos."},
 {id:"p4",title:"Luva de academia com proteção",category:"academia",price:69.9,rating:4.8,sales:780,brand:"",image:"",affiliate:"#",featured:true,description:"Mais conforto e aderência para musculação."},
 {id:"p5",title:"Bola de futebol tamanho oficial",category:"futebol",price:89.9,rating:4.8,sales:1800,brand:"",image:"",affiliate:"#",featured:false,description:"Bola para treino e lazer."},
 {id:"p6",title:"Bolsa esportiva compacta",category:"performance",price:79.9,rating:4.6,sales:620,brand:"",image:"",affiliate:"#",featured:false,description:"Bolsa para academia, futebol e rotina."}
];
const cats=[["all","Todos"],["academia","🏋️ Academia"],["futebol","⚽ Futebol"],["performance","🏃 Performance"],["ofertas","🔥 Ofertas"]];

function getProducts(){try{const x=localStorage.getItem(KEY);return x?JSON.parse(x):demoProducts}catch(e){return demoProducts}}
function saveProducts(p){localStorage.setItem(KEY,JSON.stringify(p))}
function money(v){return Number(v).toLocaleString("pt-BR",{style:"currency",currency:"BRL"})}
function catName(c){return (cats.find(x=>x[0]===c)||["","Produto"])[1].replace(/^[^ ]+ /,"")}
function productCard(p){
 return `<article class="card"><a href="produto.html?id=${encodeURIComponent(p.id)}"><div class="card-img">${p.image?`<img src="${esc(p.image)}" alt="${esc(p.title)}">`:`<div class="placeholder">${p.category==="futebol"?"⚽":p.category==="academia"?"🏋️":"🏃"}</div>`}</div></a>
 <div class="card-body"><span class="tag">${esc(catName(p.category))}</span><h3>${esc(p.title)}</h3><div class="rating">★ ${Number(p.rating||0).toFixed(1)} · ${Number(p.sales||0).toLocaleString("pt-BR")} vendas</div><div class="price">${money(p.price)}</div><a class="btn" href="produto.html?id=${encodeURIComponent(p.id)}">Ver produto</a></div></article>`;
}
function esc(s){return String(s??"").replace(/[&<>"']/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[m]))}

function initHome(){
 const nav=document.getElementById("categoryNav"), grid=document.getElementById("productGrid"), search=document.getElementById("searchInput"), sort=document.getElementById("sort");
 let active="all";
 nav.innerHTML=cats.map(c=>`<button class="cat ${c[0]==="all"?"active":""}" data-cat="${c[0]}">${c[1]}</button>`).join("");
 nav.onclick=e=>{const b=e.target.closest("[data-cat]");if(!b)return;active=b.dataset.cat;document.querySelectorAll(".cat").forEach(x=>x.classList.remove("active"));b.classList.add("active");render()};
 search.oninput=render; document.getElementById("searchBtn").onclick=()=>{document.getElementById("produtos").scrollIntoView()};
 sort.onchange=render;
 function render(){
   let q=search.value.trim().toLowerCase(), p=getProducts().filter(x=>(active==="all"||x.category===active)&&(x.title.toLowerCase().includes(q)));
   if(sort.value==="priceAsc")p.sort((a,b)=>a.price-b.price); if(sort.value==="priceDesc")p.sort((a,b)=>b.price-a.price); if(sort.value==="rating")p.sort((a,b)=>b.rating-a.rating); if(sort.value==="featured")p.sort((a,b)=>Number(b.featured)-Number(a.featured));
   grid.innerHTML=p.map(productCard).join("");document.getElementById("empty").classList.toggle("hidden",p.length>0);document.getElementById("sectionTitle").textContent=active==="all"?"Achados de hoje":catName(active);
 }
 document.getElementById("year").textContent=new Date().getFullYear();render();
}
function renderProductPage(){
 const box=document.getElementById("productDetail"), id=new URLSearchParams(location.search).get("id"), p=getProducts().find(x=>x.id===id);
 if(!p){box.innerHTML='<div class="empty">Produto não encontrado. <a href="index.html">Voltar</a></div>';return}
 box.innerHTML=`<div class="detail"><div class="detail-img">${p.image?`<img src="${esc(p.image)}" alt="${esc(p.title)}">`:`<div class="placeholder">${p.category==="futebol"?"⚽":p.category==="academia"?"🏋️":"🏃"}</div>`}</div><div><span class="tag">${esc(catName(p.category))}</span><h1>${esc(p.title)}</h1><div class="rating">★ ${Number(p.rating).toFixed(1)} · ${Number(p.sales).toLocaleString("pt-BR")} vendas</div><div class="price">${money(p.price)}</div><p class="muted">${esc(p.description||"Produto selecionado pela curadoria AtletaBox.")}</p><a class="btn" target="_blank" rel="sponsored noopener" href="${esc(p.affiliate||"#")}">VER NO MERCADO LIVRE ↗</a><p class="muted" style="font-size:12px;margin-top:18px">O AtletaBox pode receber comissão por compras realizadas através deste link.</p></div></div>`;
}
function initAdmin(){
 const form=document.getElementById("productForm"), list=document.getElementById("adminList");
 function render(){
  const p=getProducts();document.getElementById("count").textContent=p.length;document.getElementById("categoriesCount").textContent=new Set(p.map(x=>x.category)).size;document.getElementById("featuredCount").textContent=p.filter(x=>x.featured).length;
  list.innerHTML=p.map(x=>`<div class="admin-row"><div><b>${esc(x.title)}</b><br><small>${esc(catName(x.category))} · ${money(x.price)}</small></div><button class="danger" data-del="${esc(x.id)}">Excluir</button></div>`).join("");
 }
 form.onsubmit=e=>{e.preventDefault();const f=new FormData(form), p=getProducts();p.unshift({id:"p"+Date.now(),title:f.get("title"),category:f.get("category"),price:Number(f.get("price")),rating:Number(f.get("rating")),sales:Number(f.get("sales")),image:f.get("image"),affiliate:f.get("affiliate"),brand:f.get("brand"),description:f.get("description"),featured:f.get("featured")==="on"});saveProducts(p);form.reset();form.querySelector('[name="rating"]').value=4.8;form.querySelector('[name="featured"]').checked=true;render();alert("Produto adicionado!");};
 list.onclick=e=>{const id=e.target.dataset.del;if(!id)return;if(confirm("Excluir este produto?")){saveProducts(getProducts().filter(x=>x.id!==id));render()}};
 document.getElementById("resetDemo").onclick=()=>{if(confirm("Isso apaga os produtos deste navegador e restaura a demonstração.")){saveProducts(demoProducts);render()}};
 render();
}
if(document.getElementById("productGrid"))initHome();
