const tg=window.Telegram?.WebApp;if(tg){tg.ready();tg.expand();tg.setHeaderColor('#090a0c');tg.setBackgroundColor('#090a0c')}
const PRODUCTS=[
{id:1,name:'PLA матовый',type:'PLA',price:150000,weight:'1000 г',diameter:'1.75 мм',color:'Белый',stock:34,colorDots:['#fff','#d8d8d8','#999']},
{id:2,name:'PLA шёлк',type:'PLA',price:175000,weight:'1000 г',diameter:'1.75 мм',color:'Белый',stock:22,colorDots:['#fff','#ddd','#aaa']},
{id:3,name:'PETG',type:'PETG',price:165000,weight:'1000 г',diameter:'1.75 мм',color:'Чёрный',stock:30,colorDots:['#222','#555','#aaa']},
{id:4,name:'ABS',type:'ABS',price:160000,weight:'1000 г',diameter:'1.75 мм',color:'Чёрный',stock:18,colorDots:['#111','#333']},
{id:5,name:'ASA',type:'ASA',price:195000,weight:'1000 г',diameter:'1.75 мм',color:'Матовый',stock:12,colorDots:['#eee','#aaa','#777']},
{id:6,name:'TPU 95A',type:'TPU',price:210000,weight:'800 г',diameter:'1.75 мм',color:'Матовый',stock:7,colorDots:['#f4c8b9','#bbb','#777']},
{id:7,name:'Нейлон PA12',type:'Nylon',price:320000,weight:'750 г',diameter:'1.75 мм',color:'Матовый',stock:7,colorDots:['#eee']}
];
let cart=JSON.parse(localStorage.getItem('layerone_cart')||'[]'),currentFilter='all',currentProduct=null,geo=null;const money=n=>n.toLocaleString('ru-RU')+' UZS';
function save(){localStorage.setItem('layerone_cart',JSON.stringify(cart));updateBadge()}function updateBadge(){document.getElementById('cartBadge').textContent=cart.reduce((s,x)=>s+x.qty,0)}
function showScreen(id){document.querySelectorAll('.screen').forEach(x=>x.classList.remove('active'));const s=document.getElementById(id);if(s)s.classList.add('active');document.querySelectorAll('.nav').forEach(x=>x.classList.toggle('active',x.dataset.screen===id));if(id==='catalog')renderProducts();if(id==='cart')renderCart();if(id==='home')renderCats();if(id==='profile'){const u=tg?.initDataUnsafe?.user;document.getElementById('tgName').textContent=u?(u.first_name+(u.last_name?' '+u.last_name:'')):'Не подключён'}window.scrollTo(0,0)}
function spoolHTML(p){return `<div class="spool" style="filter:hue-rotate(${p.id*9}deg)"><span></span></div>`}
function renderCats(){document.getElementById('categories').innerHTML=[['PLA','⚪'],['PETG','⚫'],['ABS','⚫'],['TPU','🟣']].map(([x,e])=>`<button class="cat" onclick="setFilter('${x}')"><span class="emoji">${e}</span><b>${x}</b><span style="margin-left:auto;color:#777">→</span></button>`).join('')}
function setFilter(f){currentFilter=f;showScreen('catalog');document.querySelectorAll('.filter').forEach(b=>b.classList.toggle('active',b.dataset.filter===f))}
function qtyFor(id){const x=cart.find(x=>x.id===id);return x?x.qty:0}
function renderProducts(){const q=(document.getElementById('search')?.value||'').toLowerCase();const arr=PRODUCTS.filter(p=>(currentFilter==='all'||p.type===currentFilter)&&(`${p.name} ${p.type}`.toLowerCase().includes(q)));document.getElementById('products').innerHTML=arr.map(p=>{const qn=qtyFor(p.id);const control=qn?`<div class="card-qty" data-stop><button class="qty-btn" data-action="dec" data-id="${p.id}">−</button><b>${qn}</b><button class="qty-btn" data-action="add" data-id="${p.id}">+</button></div>`:`<button class="add" data-action="add" data-id="${p.id}" aria-label="Добавить в корзину">+</button>`;return `<article class="product" data-product-id="${p.id}"><div class="product-img">${spoolHTML(p)}</div><div class="product-info"><h3>${p.name}</h3><div class="meta">${p.type} · ${p.color} · ${p.diameter} · ${p.weight}</div><div class="price">${money(p.price)}</div><div class="color-dots">${p.colorDots.map(c=>`<i class="color-dot" style="background:${c}"></i>`).join('')}</div><div class="availability">В наличии — ${p.stock} шт.</div></div>${control}</article>`}).join('')||'<p class="meta">Ничего не найдено.</p>'}
function openProduct(id){currentProduct=PRODUCTS.find(p=>p.id===id);const p=currentProduct;document.getElementById('productDetail').innerHTML=`<div class="product-detail"><div class="big-img">${spoolHTML(p)}</div><div class="detail"><span class="eyebrow">${p.type} / 3D PRINTING</span><h1>${p.name}</h1><div class="price" style="font-size:25px">${money(p.price)}</div><div class="specs"><div class="spec"><span>Материал</span><b>${p.type}</b></div><div class="spec"><span>Поверхность</span><b>${p.color}</b></div><div class="spec"><span>Диаметр</span><b>${p.diameter}</b></div><div class="spec"><span>Вес</span><b>${p.weight}</b></div></div><p class="meta">Филамент для стабильной и точной 3D-печати. Перед заказом можно уточнить наличие нужного цвета.</p><button class="primary full" onclick="add(${p.id});showScreen('cart')">Добавить в корзину →</button></div></div>`;showScreen('product')}
function add(id){let x=cart.find(x=>x.id===id);x?x.qty++:cart.push({id,qty:1});save();tg?.HapticFeedback?.impactOccurred('light')}function dec(id){let x=cart.find(x=>x.id===id);if(!x)return;x.qty--;if(x.qty<=0)cart=cart.filter(y=>y.id!==id);save();renderCart()}function clearCart(){cart=[];save();renderCart()}
function renderCart(){const el=document.getElementById('cartItems');if(!cart.length){el.innerHTML='<div class="total-box">Корзина пока пуста.</div>';document.getElementById('cartTotal').innerHTML='';return}el.innerHTML=cart.map(x=>{const p=PRODUCTS.find(p=>p.id===x.id);return`<div class="cart-item"><div class="product-img">${spoolHTML(p)}</div><div style="flex:1"><b>${p.name}</b><div class="meta">${p.weight} · ${money(p.price)}</div><div class="qty"><button onclick="dec(${p.id})">−</button><b>${x.qty}</b><button onclick="add(${p.id});renderCart()">+</button></div></div><b>${money(p.price*x.qty)}</b></div>`}).join('');const sum=cart.reduce((s,x)=>s+PRODUCTS.find(p=>p.id===x.id).price*x.qty,0);document.getElementById('cartTotal').innerHTML=`<div class="total-row"><span>Товары</span><b>${money(sum)}</b></div><div class="total-row"><span>Доставка</span><span>При получении</span></div><div class="total-row big"><span>Итого</span><span>${money(sum)}</span></div>`}
function showCheckout(){if(!cart.length)return;const sum=cart.reduce((s,x)=>s+PRODUCTS.find(p=>p.id===x.id).price*x.qty,0);document.getElementById('checkoutTotal').innerHTML=`<div class="total-row big"><span>К оплате за товары</span><span>${money(sum)}</span></div><div class="meta">Доставка оплачивается отдельно при получении.</div>`;showScreen('checkout')}
function requestLocation(){
  if(!tg){
    alert('Откройте магазин внутри Telegram, чтобы использовать геолокацию.');
    return;
  }

  const lm = tg.LocationManager;

  if(!lm){
    alert('Ваша версия Telegram не поддерживает геолокацию Mini App. Обновите Telegram.');
    return;
  }

  lm.init(()=>{
    if(!lm.isLocationAvailable){
      alert('Геолокация недоступна. Проверьте настройки геолокации.');
      return;
    }

    if(lm.isAccessRequested && !lm.isAccessGranted){
      if(lm.openSettings){
        lm.openSettings();
      }else{
        alert('Разрешите Telegram доступ к геолокации в настройках телефона.');
      }
      return;
    }

    lm.getLocation(location=>{
      if(!location){
        alert('Не удалось получить геолокацию. Разрешите доступ к местоположению и попробуйте ещё раз.');
        return;
      }

      geo = location;
      document.getElementById('address').value =
        `Геолокация: ${location.latitude}, ${location.longitude}`;

      tg.HapticFeedback?.notificationOccurred('success');
    });
  });
}
async function submitOrder(){const name=document.getElementById('name').value.trim(),phone=document.getElementById('phone').value.trim(),address=document.getElementById('address').value.trim(),comment=document.getElementById('comment').value.trim();if(!name||!phone||!address){alert('Заполните имя, телефон и адрес доставки.');return}const items=cart.map(x=>{const p=PRODUCTS.find(p=>p.id===x.id);return{name:p.name,qty:x.qty,price:p.price}}),sum=items.reduce((s,x)=>s+x.price*x.qty,0);const order={orderId:'L1-'+Date.now().toString().slice(-6),user:tg?.initDataUnsafe?.user||null,name,phone,address,comment,items,total:sum,delivery:'Оплачивается покупателем при получении',createdAt:new Date().toISOString()};const url='https://script.google.com/macros/s/AKfycbxShKI7jndqyaClcosh_hHzQTFBdFayDmGc-Kb4EzPUCDhCLwvR4cgvzEszXJwl2W1x2Q/exec';if(url){try{await fetch(url,{method:'POST',mode:'no-cors',headers:{'Content-Type':'text/plain;charset=utf-8'},body:JSON.stringify(order)})}catch(e){console.log(e)}}else console.log('ORDER',order);cart=[];save();document.getElementById('successText').textContent=`Ваш заказ ${order.orderId} принят. Мы свяжемся с вами для подтверждения.`;showScreen('success');tg?.HapticFeedback?.notificationOccurred('success')}
document.getElementById('products').addEventListener('click',e=>{const action=e.target.closest('[data-action]')?.dataset.action;const id=Number(e.target.closest('[data-action]')?.dataset.id);if(action&&id){e.stopPropagation();action==='add'?add(id):dec(id);renderProducts();renderCart();return}const card=e.target.closest('[data-product-id]');if(card)openProduct(Number(card.dataset.productId))});
document.getElementById('search')?.addEventListener('input',renderProducts);document.querySelectorAll('.filter').forEach(b=>b.addEventListener('click',()=>{currentFilter=b.dataset.filter;document.querySelectorAll('.filter').forEach(x=>x.classList.toggle('active',x===b));renderProducts()}));document.querySelectorAll('.nav').forEach(b=>b.addEventListener('click',()=>showScreen(b.dataset.screen)));document.getElementById('cartTop').onclick=()=>showScreen('cart');renderCats();renderProducts();updateBadge();
