// ---------- Data (sample estimates: cost = INR per person per day) ----------
const PLACES = [
  // Top destinations
  {id:'jaipur',n:'Jaipur',s:'Rajasthan',g:'top',d:'The Pink City, known for forts, palaces and busy bazaars.',se:'Oct–Mar',c:3500,q:'Jaipur, Rajasthan'},
  {id:'varanasi',n:'Varanasi',s:'Uttar Pradesh',g:'top',d:'One of India\'s oldest living cities, with ghats and evening aarti on the Ganga.',se:'Oct–Mar',c:2500,q:'Varanasi, Uttar Pradesh'},
  {id:'kerala-backwaters',n:'Kerala Backwaters',s:'Kerala',g:'top',d:'Slow houseboat journeys through palm-lined canals around Alleppey.',se:'Nov–Feb',c:4500,q:'Alappuzha backwaters, Kerala'},
  {id:'goa',n:'Goa',s:'Goa',g:'top',d:'Beaches, old churches and a relaxed coastal pace.',se:'Nov–Feb',c:4000,q:'Goa, India'},
  {id:'ladakh',n:'Leh-Ladakh',s:'Ladakh',g:'top',d:'High-altitude desert, monasteries and clear mountain lakes.',se:'Jun–Sep',c:4500,q:'Leh, Ladakh'},
  {id:'udaipur',n:'Udaipur',s:'Rajasthan',g:'top',d:'The City of Lakes, with palaces reflected in calm water.',se:'Oct–Mar',c:3500,q:'Udaipur, Rajasthan'},
  {id:'rishikesh',n:'Rishikesh',s:'Uttarakhand',g:'top',d:'A yoga town on the Ganga, with river rafting nearby.',se:'Sep–Apr',c:2500,q:'Rishikesh, Uttarakhand'},
  {id:'andaman',n:'Andaman Islands',s:'Andaman & Nicobar',g:'top',d:'Clear water, coral reefs and quiet beaches.',se:'Oct–May',c:6000,q:'Havelock Island, Andaman'},
  // UNESCO World Heritage sites
  {id:'taj-mahal',n:'Taj Mahal',s:'Agra, Uttar Pradesh',g:'unesco',d:'White marble mausoleum built by Shah Jahan, a Mughal-era icon.',se:'Oct–Mar',c:3000,q:'Taj Mahal, Agra'},
  {id:'hampi',n:'Hampi',s:'Karnataka',g:'unesco',d:'Ruins of the Vijayanagara capital among boulder-covered hills.',se:'Oct–Feb',c:2200,q:'Hampi, Karnataka'},
  {id:'ajanta',n:'Ajanta Caves',s:'Maharashtra',g:'unesco',d:'Rock-cut Buddhist caves known for ancient wall paintings.',se:'Oct–Mar',c:2000,q:'Ajanta Caves, Maharashtra'},
  {id:'konark',n:'Konark Sun Temple',s:'Odisha',g:'unesco',d:'A 13th-century temple built as a giant chariot of the Sun god.',se:'Oct–Feb',c:2200,q:'Konark Sun Temple, Odisha'},
  {id:'khajuraho',n:'Khajuraho Temples',s:'Madhya Pradesh',g:'unesco',d:'Medieval temples famous for detailed stone sculpture.',se:'Oct–Mar',c:2200,q:'Khajuraho Group of Monuments'},
  {id:'red-fort',n:'Red Fort',s:'Delhi',g:'unesco',d:'Red sandstone Mughal fort in the heart of Old Delhi.',se:'Oct–Mar',c:3000,q:'Red Fort, Delhi'},
  // More places
  {id:'pandharpur',n:'Pandharpur',s:'Maharashtra',g:'more',d:'Home of the Vitthal temple on the Chandrabhaga river.',se:'Oct–Feb',c:1500,q:'Vitthal Rukmini Temple, Pandharpur'},
  {id:'mysuru',n:'Mysuru',s:'Karnataka',g:'more',d:'A palace city, lit up during Dasara.',se:'Oct–Mar',c:2500,q:'Mysore Palace, Karnataka'},
  {id:'amritsar',n:'Amritsar',s:'Punjab',g:'more',d:'The Golden Temple and its community kitchen.',se:'Oct–Mar',c:2500,q:'Golden Temple, Amritsar'},
  {id:'darjeeling',n:'Darjeeling',s:'West Bengal',g:'more',d:'Tea gardens and Himalayan views.',se:'Mar–May, Oct–Nov',c:3000,q:'Darjeeling, West Bengal'},
  {id:'spiti',n:'Spiti Valley',s:'Himachal Pradesh',g:'more',d:'Remote mountain villages and old monasteries.',se:'Jun–Sep',c:3500,q:'Spiti Valley, Himachal Pradesh'},
  {id:'kutch',n:'Rann of Kutch',s:'Gujarat',g:'more',d:'A white salt desert, best seen during winter.',se:'Nov–Feb',c:3500,q:'Rann of Kutch, Gujarat'}
];

// Photos: a local file in assets/ wins. If it is missing, load the lead photo of a Wikipedia article.
const WIKI = {'jaipur':'Hawa_Mahal','varanasi':'Dashashwamedh_Ghat','kerala-backwaters':'Kerala_backwaters','goa':'Fort_Aguada','ladakh':'Pangong_Tso','udaipur':'City_Palace,_Udaipur','rishikesh':'Lakshman_Jhula','andaman':'Radhanagar_Beach','taj-mahal':'Taj_Mahal','hampi':'Hampi','ajanta':'Ajanta_Caves','konark':'Konark_Sun_Temple','khajuraho':'Khajuraho_Group_of_Monuments','red-fort':'Red_Fort'};
function imgFail(img) {
  const frame = img.parentNode, title = WIKI[frame.parentNode.dataset.id];
  if (img.dataset.tried || !title) { img.remove(); frame.classList.add('noimg'); return; }
  img.dataset.tried = 1;
  fetch('https://en.wikipedia.org/api/rest_v1/page/summary/' + encodeURIComponent(title))
    .then(r => r.json())
    .then(j => { const u = j.thumbnail && j.thumbnail.source; if (!u) throw 0; img.src = u.replace(/\/\d+px-/, '/500px-'); })
    .catch(() => { img.remove(); frame.classList.add('noimg'); });
}

const $ = s => document.querySelector(s);
const inr = n => '₹' + n.toLocaleString('en-IN');
const mapUrl = q => 'https://www.google.com/maps/search/?api=1&query=' + encodeURIComponent(q);
const fine = matchMedia('(pointer:fine)').matches;
const calm = matchMedia('(prefers-reduced-motion:reduce)').matches;

// ---------- Saved places (localStorage, safe if blocked) ----------
let saved = [];
try { saved = JSON.parse(localStorage.getItem('humsafar-trip')) || []; } catch (e) { saved = []; }
const persist = () => { try { localStorage.setItem('humsafar-trip', JSON.stringify(saved)); } catch (e) {} };

// ---------- Render ----------
const HEART = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>';
const heart = id => `<button class="heart${saved.includes(id) ? ' on' : ''}" data-save="${id}" aria-label="Save to My Trip" aria-pressed="${saved.includes(id)}">${HEART}</button>`;

const card = (p, i) => `
<article class="card rv" style="transition-delay:${(i % 4) * 80}ms" data-id="${p.id}">
  <div class="frame" data-name="${p.n}">
    <img src="assets/${p.id}.jpg" alt="${p.n}, ${p.s}" loading="lazy" onerror="imgFail(this)">
    <span class="stamp">SAVED</span>
  </div>
  ${heart(p.id)}
  <div class="body">
    <p class="meta">${p.s}</p>
    <h3>${p.n}</h3>
    <p class="season">Best time: ${p.se}</p>
    <p>${p.d}</p>
    <div class="row"><span class="cost">About ${inr(p.c)}/day</span>
    <a class="maps" target="_blank" rel="noopener" href="${mapUrl(p.q)}">View on Maps</a></div>
  </div>
</article>`;

const item = p => `
<li class="rv" data-id="${p.id}">
  <div class="info"><strong>${p.n}</strong><span>${p.s} · Best time: ${p.se} · About ${inr(p.c)}/day</span></div>
  <a class="maps" target="_blank" rel="noopener" href="${mapUrl(p.q)}">View on Maps</a>${heart(p.id)}
</li>`;

const by = g => PLACES.filter(p => p.g === g);
$('#gTop').innerHTML = by('top').map(card).join('');
$('#gUnesco').innerHTML = by('unesco').map(card).join('');
$('#gMore').innerHTML = by('more').map(item).join('');

function renderTrip() {
  const list = PLACES.filter(p => saved.includes(p.id));
  $('#tripList').innerHTML = list.length
    ? list.map(p => `<li><strong>${p.n}<small>${p.s} · Best time: ${p.se}</small></strong><span>${inr(p.c)}/day</span>${heart(p.id)}</li>`).join('')
    : '<li class="empty">Nothing saved yet. Tap a heart to add a place.</li>';
  const sum = list.reduce((t, p) => t + p.c, 0);
  $('#total').textContent = list.length ? `${list.length} place${list.length > 1 ? 's' : ''} saved · about ${inr(sum)} for one day at each` : '';
  const b = $('#badge'); b.textContent = saved.length; b.classList.add('pop'); setTimeout(() => b.classList.remove('pop'), 300);
  document.querySelectorAll('[data-save]').forEach(h => {
    const on = saved.includes(h.dataset.save);
    h.classList.toggle('on', on); h.setAttribute('aria-pressed', on);
  });
}

// ---------- Save / unsave with passport-stamp ----------
document.addEventListener('click', e => {
  const h = e.target.closest('[data-save]');
  if (!h) return;
  const id = h.dataset.save;
  const adding = !saved.includes(id);
  saved = adding ? [...saved, id] : saved.filter(x => x !== id);
  persist(); renderTrip();
  const cardEl = h.closest('.card'), frame = cardEl && cardEl.querySelector('.frame');
  if (adding && frame) { frame.classList.remove('stamping'); void frame.offsetWidth; frame.classList.add('stamping'); }
});

$('#req').addEventListener('click', () => {
  $('#msg').textContent = saved.length
    ? `Request noted for ${saved.length} place${saved.length > 1 ? 's' : ''}. This is a demo, so nothing is sent.`
    : 'Save at least one place first, then request your trip.';
});

// ---------- Scroll reveal ----------
const io = new IntersectionObserver(es => es.forEach(x => { if (x.isIntersecting) { x.target.classList.add('in'); io.unobserve(x.target); } }), {threshold:.12});
document.querySelectorAll('.rv').forEach(el => io.observe(el));

// ---------- Cursor, hero parallax, image tilt (mouse devices only) ----------
if (fine && !calm) {
  document.documentElement.classList.add('has-cursor');
  const dot = $('.cursor-dot'), ring = $('.cursor-ring');
  let mx = innerWidth / 2, my = innerHeight / 2, rx = mx, ry = my;
  document.addEventListener('mousemove', e => {
    mx = e.clientX; my = e.clientY;
    dot.style.transform = `translate(${mx}px,${my}px)`;
    document.querySelectorAll('.shape').forEach(s => {
      const d = +s.dataset.depth;
      s.style.transform = `translate(${(mx / innerWidth - .5) * d}px,${(my / innerHeight - .5) * d}px)`;
    });
  });
  (function loop() {
    rx += (mx - rx) * .16; ry += (my - ry) * .16;
    ring.style.transform = `translate(${rx}px,${ry}px)`;
    requestAnimationFrame(loop);
  })();
  document.addEventListener('mouseover', e => ring.classList.toggle('big', !!e.target.closest('a,button,.card,.list li')));
  document.querySelectorAll('.card .frame').forEach(f => {
    f.addEventListener('mousemove', e => {
      const r = f.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - .5, y = (e.clientY - r.top) / r.height - .5;
      f.style.transform = `perspective(700px) rotateY(${x * 10}deg) rotateX(${-y * 10}deg)`;
    });
    f.addEventListener('mouseleave', () => f.style.transform = '');
  });
}

renderTrip();
