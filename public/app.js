const menu = document.querySelector('.menu-toggle');
const navigation = document.querySelector('#navigation');
menu.addEventListener('click', () => { const open = menu.getAttribute('aria-expanded') !== 'true'; menu.setAttribute('aria-expanded', String(open)); navigation.classList.toggle('open', open); });
navigation.querySelectorAll('a').forEach(link => link.addEventListener('click', () => { menu.setAttribute('aria-expanded', 'false'); navigation.classList.remove('open'); }));
const search = document.querySelector('#search');
const filters = [...document.querySelectorAll('[data-filter]')];
const resources = [...document.querySelectorAll('.resource')];
let category = 'all';
function filterResources() { const query = search.value.trim().toLowerCase(); let count = 0; resources.forEach(resource => { const match = (category === 'all' || resource.dataset.category === category) && (resource.textContent + ' ' + resource.dataset.keywords).toLowerCase().includes(query); resource.hidden = !match; if (match) count++; }); document.querySelector('#result-count').textContent = `${count} resource${count === 1 ? '' : 's'}`; document.querySelector('#empty').hidden = count !== 0; }
function selectCategory(value) { category = value; filters.forEach(button => { const active = button.dataset.filter === value; button.classList.toggle('active', active); button.setAttribute('aria-pressed', String(active)); }); }
filters.forEach(button => button.addEventListener('click', () => { selectCategory(button.dataset.filter); filterResources(); }));
search.addEventListener('input', filterResources);
document.querySelectorAll('[data-resource-filter]').forEach(link => link.addEventListener('click', () => { selectCategory('all'); search.value = link.dataset.resourceFilter; filterResources(); }));
const dialog = document.querySelector('#lightbox');
document.querySelectorAll('[data-image]').forEach(button => button.addEventListener('click', () => { dialog.querySelector('img').src = button.dataset.image; dialog.querySelector('img').alt = button.querySelector('img').alt; dialog.querySelector('p').textContent = button.dataset.caption; dialog.showModal(); }));
dialog.querySelector('.close').addEventListener('click', () => dialog.close());
dialog.addEventListener('click', event => { if (event.target === dialog) { const rect = dialog.getBoundingClientRect(); if(event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) dialog.close(); } });
