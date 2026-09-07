const cats=[
  ["all","Todos"],
  ["ofertas","🔥 Ofertas"],
  ["tecnologia","📱 Tecnologia"],
  ["casa","🏠 Casa"],
  ["esportes","🏋️ Esportes"],
  ["moda","👕 Moda"],
  ["beleza","✨ Beleza"]
];

const demoProducts=[
  {title:"Fone Bluetooth sem fio",category:"tecnologia",price:49.90,rating:4.8,sales:3200,brand:"",image:"",affiliate:"",featured:true,description:"Fone Bluetooth compacto e com ótimo custo-benefício."},
  {title:"Luminária LED inteligente",category:"casa",price:39.90,rating:4.7,sales:1800,brand:"",image:"",affiliate:"",featured:true,description:"Item simples para deixar o ambiente mais moderno."},
  {title:"Kit de faixas elásticas para treino",category:"esportes",price:59.90,rating:4.8,sales:1200,brand:"",image:"",affiliate:"",featured:true,description:"Kit versátil para treino em casa ou academia."},
  {title:"Bolsa transversal masculina",category:"moda",price:69.90,rating:4.7,sales:950,brand:"",image:"",affiliate:"",featured:true,description:"Bolsa compacta para usar no dia a dia."},
  {title:"Escova facial elétrica",category:"beleza",price:44.90,rating:4.8,sales:2100,brand:"",image:"",affiliate:"",featured:false,description:"Produto para cuidados e limpeza facial."},
  {title:"Mini aspirador portátil",category:"ofertas",price:79.90,rating:4.6,sales:1500,brand:"",image:"",affiliate:"",featured:true,description:"Achado útil para limpeza rápida de pequenos espaços."}
];

function esc(s){
  return String(s??"").replace(/[&<>"']/g,m=>({
    "&":"&amp;",
    "<":"&lt;",
    ">":"&gt;",
    '"':"&quot;",
    "'":"&#039;"
  }[m]));
}

function money(v){
  return Number(v||0).toLocaleString("pt-BR",{style:"currency",currency:"BRL"});
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

async function fetchProducts(){
  const {data,error}=await db
    .from("products")
    .select("*")
    .order("featured",{ascending:false})
    .order("created_at",{ascending:false});

  if(error) throw error;
  return data || [];
}

function productCard(p){
  return `
    <article class="card">
      <a href="produto.html?id=${encodeURIComponent(p.id)}">
        <div class="card-img">
          ${p.image
            ? `<img src="${esc(p.image)}" alt="${esc(p.title)}">`
            : `<div class="placeholder">${categoryEmoji(p.category)}</div>`}
        </div>
      </a>

      <div class="card-body">
        <span class="tag">${esc(catName(p.category))}</span>
        <h3>${esc(p.title)}</h3>
        <div class="rating">★ ${Number(p.rating||0).toFixed(1)} · ${Number(p.sales||0).toLocaleString("pt-BR")} vendas</div>
        <div class="price">${money(p.price)}</div>
        <a class="btn" href="produto.html?id=${encodeURIComponent(p.id)}">Ver produto</a>
      </div>
    </article>
  `;
}

async function initHome(){
  const nav=document.getElementById("categoryNav");
  const grid=document.getElementById("productGrid");
  const search=document.getElementById("searchInput");
  const sort=document.getElementById("sort");
  const loading=document.getElementById("loading");
  const empty=document.getElementById("empty");

  let active="all";
  let allProducts=[];

  nav.innerHTML=cats.map(c=>`
    <button class="cat ${c[0]==="all"?"active":""}" data-cat="${c[0]}">${c[1]}</button>
  `).join("");

  nav.onclick=e=>{
    const b=e.target.closest("[data-cat]");
    if(!b)return;
    active=b.dataset.cat;
    document.querySelectorAll(".cat").forEach(x=>x.classList.remove("active"));
    b.classList.add("active");
    render();
  };

  search.oninput=render;
  sort.onchange=render;

  document.getElementById("searchBtn").onclick=()=>{
    document.getElementById("produtos").scrollIntoView();
  };

  function render(){
    const q=search.value.trim().toLowerCase();

    let p=allProducts.filter(x=>
      (active==="all" || x.category===active) &&
      ((x.title||"").toLowerCase().includes(q) || (x.brand||"").toLowerCase().includes(q))
    );

    if(sort.value==="priceAsc") p.sort((a,b)=>Number(a.price)-Number(b.price));
    if(sort.value==="priceDesc") p.sort((a,b)=>Number(b.price)-Number(a.price));
    if(sort.value==="rating") p.sort((a,b)=>Number(b.rating||0)-Number(a.rating||0));
    if(sort.value==="featured") p.sort((a,b)=>Number(Boolean(b.featured))-Number(Boolean(a.featured)));

    grid.innerHTML=p.map(productCard).join("");
    empty.classList.toggle("hidden",p.length>0);
    document.getElementById("sectionTitle").textContent=
      active==="all" ? "Achados de hoje" : catName(active);
  }

  try{
    allProducts=await fetchProducts();
    loading.classList.add("hidden");
    render();
  }catch(err){
    loading.textContent="Não foi possível carregar os produtos.";
    console.error(err);
  }

  const year=document.getElementById("year");
  if(year)year.textContent=new Date().getFullYear();
}

async function renderProductPage(){
  const box=document.getElementById("productDetail");
  const id=new URLSearchParams(location.search).get("id");

  if(!id){
    box.innerHTML='<div class="empty">Produto não encontrado. <a href="index.html">Voltar</a></div>';
    return;
  }

  const {data:p,error}=await db
    .from("products")
    .select("*")
    .eq("id",id)
    .maybeSingle();

  if(error || !p){
    console.error(error);
    box.innerHTML='<div class="empty">Produto não encontrado. <a href="index.html">Voltar</a></div>';
    return;
  }

  const hasLink=Boolean(p.affiliate && p.affiliate.trim());

  box.innerHTML=`
    <div class="detail">
      <div class="detail-img">
        ${p.image
          ? `<img src="${esc(p.image)}" alt="${esc(p.title)}">`
          : `<div class="placeholder">${categoryEmoji(p.category)}</div>`}
      </div>

      <div>
        <span class="tag">${esc(catName(p.category))}</span>
        <h1>${esc(p.title)}</h1>
        <div class="rating">★ ${Number(p.rating||0).toFixed(1)} · ${Number(p.sales||0).toLocaleString("pt-BR")} vendas</div>
        <div class="price">${money(p.price)}</div>
        <p class="muted">${esc(p.description||"Produto selecionado pela curadoria AchadoBox.")}</p>

        ${hasLink
          ? `<a class="btn" target="_blank" rel="sponsored noopener" href="${esc(p.affiliate)}">VER NO MERCADO LIVRE ↗</a>`
          : `<button class="btn disabled-btn" disabled>LINK A CONFIGURAR</button>`}

        <p class="muted" style="font-size:12px;margin-top:18px">
          O AchadoBox pode receber comissão por compras realizadas através deste link.
        </p>
      </div>
    </div>
  `;
}

function setHidden(el,hidden){
  if(el) el.classList.toggle("hidden",hidden);
}

async function initAdmin(){
  const loginBox=document.getElementById("loginBox");
  const adminApp=document.getElementById("adminApp");
  const loginForm=document.getElementById("loginForm");
  const loginError=document.getElementById("loginError");
  const logoutBtn=document.getElementById("logoutBtn");

  const productForm=document.getElementById("productForm");
  const adminList=document.getElementById("adminList");
  const formTitle=document.getElementById("formTitle");
  const submitBtn=document.getElementById("submitBtn");
  const cancelEdit=document.getElementById("cancelEdit");
  const formMessage=document.getElementById("formMessage");

  let products=[];

  async function refreshSession(){
    const {data:{session}}=await db.auth.getSession();
    const logged=Boolean(session);
    setHidden(loginBox,logged);
    setHidden(adminApp,!logged);
    if(logged) await loadAdminProducts();
  }

  loginForm.onsubmit=async e=>{
    e.preventDefault();
    setHidden(loginError,true);

    const f=new FormData(loginForm);
    const {error}=await db.auth.signInWithPassword({
      email:f.get("email"),
      password:f.get("password")
    });

    if(error){
      loginError.textContent="E-mail ou senha inválidos.";
      setHidden(loginError,false);
      return;
    }

    loginForm.reset();
    await refreshSession();
  };

  logoutBtn.onclick=async()=>{
    await db.auth.signOut();
    await refreshSession();
  };

  function resetForm(){
    productForm.reset();
    productForm.querySelector('[name="id"]').value="";
    productForm.querySelector('[name="rating"]').value=4.8;
    productForm.querySelector('[name="sales"]').value=100;
    productForm.querySelector('[name="featured"]').checked=true;
    formTitle.textContent="Adicionar produto";
    submitBtn.textContent="Adicionar produto";
    setHidden(cancelEdit,true);
    setHidden(formMessage,true);
  }

  cancelEdit.onclick=resetForm;

  async function loadAdminProducts(){
    try{
      products=await fetchProducts();
      renderAdmin();
    }catch(err){
      console.error(err);
      adminList.innerHTML='<p class="empty">Erro ao carregar produtos.</p>';
    }
  }

  function renderAdmin(){
    document.getElementById("count").textContent=products.length;
    document.getElementById("categoriesCount").textContent=new Set(products.map(x=>x.category)).size;
    document.getElementById("featuredCount").textContent=products.filter(x=>x.featured).length;

    if(!products.length){
      adminList.innerHTML='<p class="empty">Nenhum produto cadastrado ainda.</p>';
      return;
    }

    adminList.innerHTML=products.map(x=>`
      <div class="admin-row">
        <div>
          <b>${esc(x.title)}</b><br>
          <small>${esc(catName(x.category))} · ${money(x.price)}</small>
        </div>
        <div class="admin-actions">
          <button class="secondary-btn" data-edit="${x.id}">Editar</button>
          <button class="danger" data-del="${x.id}">Excluir</button>
        </div>
      </div>
    `).join("");
  }

  adminList.onclick=async e=>{
    const editId=e.target.dataset.edit;
    const delId=e.target.dataset.del;

    if(editId){
      const p=products.find(x=>String(x.id)===String(editId));
      if(!p)return;

      productForm.querySelector('[name="id"]').value=p.id;
      productForm.querySelector('[name="title"]').value=p.title||"";
      productForm.querySelector('[name="category"]').value=p.category||"ofertas";
      productForm.querySelector('[name="price"]').value=p.price??"";
      productForm.querySelector('[name="rating"]').value=p.rating??"";
      productForm.querySelector('[name="sales"]').value=p.sales??"";
      productForm.querySelector('[name="image"]').value=p.image||"";
      productForm.querySelector('[name="affiliate"]').value=p.affiliate||"";
      productForm.querySelector('[name="brand"]').value=p.brand||"";
      productForm.querySelector('[name="description"]').value=p.description||"";
      productForm.querySelector('[name="featured"]').checked=Boolean(p.featured);

      formTitle.textContent="Editar produto";
      submitBtn.textContent="Salvar alterações";
      setHidden(cancelEdit,false);
      productForm.scrollIntoView({behavior:"smooth"});
      return;
    }

    if(delId){
      if(!confirm("Excluir este produto?"))return;

      const {error}=await db.from("products").delete().eq("id",delId);
      if(error){
        alert("Não foi possível excluir: "+error.message);
        return;
      }
      await loadAdminProducts();
    }
  };

  productForm.onsubmit=async e=>{
    e.preventDefault();

    const f=new FormData(productForm);
    const editingId=f.get("id");

    const payload={
      title:f.get("title"),
      category:f.get("category"),
      price:Number(f.get("price")),
      rating:f.get("rating") ? Number(f.get("rating")) : null,
      sales:f.get("sales") ? Number(f.get("sales")) : null,
      image:f.get("image")||null,
      affiliate:f.get("affiliate"),
      brand:f.get("brand")||null,
      description:f.get("description")||null,
      featured:f.get("featured")==="on"
    };

    const result=editingId
      ? await db.from("products").update(payload).eq("id",editingId)
      : await db.from("products").insert([payload]);

    if(result.error){
      formMessage.textContent="Erro: "+result.error.message;
      formMessage.className="form-error";
      return;
    }

    formMessage.textContent=editingId ? "Produto atualizado." : "Produto adicionado.";
    formMessage.className="form-success";

    resetForm();
    await loadAdminProducts();
  };

  document.getElementById("seedDemo").onclick=async()=>{
    if(products.length && !confirm("Já existem produtos. Adicionar também os produtos de demonstração?"))return;

    const {error}=await db.from("products").insert(demoProducts);
    if(error){
      alert("Não foi possível adicionar demonstração: "+error.message);
      return;
    }
    await loadAdminProducts();
  };

  db.auth.onAuthStateChange(()=>refreshSession());
  await refreshSession();
}

if(document.getElementById("productGrid")){
  initHome();
}
