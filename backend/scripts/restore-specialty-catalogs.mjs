import { readFile } from 'node:fs/promises';
const base = process.env.API_BASE_URL;
if (!base || !process.env.ADMIN_EMAIL || !process.env.ADMIN_PASSWORD) throw Error('Set API_BASE_URL, ADMIN_EMAIL and ADMIN_PASSWORD');
const defaults = JSON.parse(await readFile(new URL('./specialty-catalog-defaults.json', import.meta.url), 'utf8'));
let accessToken;
async function api(path, method='GET', body) {
  const response = await fetch(base.replace(/\/$/, '') + path, { method, signal: AbortSignal.timeout(30000), headers: { 'Content-Type': 'application/json', ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}) }, body: body === undefined ? undefined : JSON.stringify(body) });
  if (!response.ok) throw Error(`${method} ${path}: ${response.status}`);
  return response.json();
}
const session = await api('/auth/login','POST',{email:process.env.ADMIN_EMAIL,password:process.env.ADMIN_PASSWORD});
accessToken = session.accessToken;
try {
  const categories = await api('/admin/option-categories');
  for (const key of new Set(defaults.map(row => row.baseKey))) {
    let category = categories.find(c => c.baseKey === key && c.materialScope === 'BOTH');
    if (category) { console.log(`${key}: already exists; preserved`); continue; }
    // Nested creation is atomic: a failure cannot leave a partly seeded category.
    const items = defaults.filter(row => row.baseKey === key).map(({baseKey,id,...row}) => ({...row,priceMode:'FLAT',isActive:true}));
    category = await api('/admin/option-categories','POST',{baseKey:key,name:key.replaceAll('_',' ').replace(/\b\w/g,c=>c.toUpperCase()),materialScope:'BOTH',isActive:true,items:{create:items}});
    console.log(`${key}: restored ${items.length} items`);
  }
  const settings = await api('/admin/pricing-settings');
  const shared = settings.find(s=>s.key==='shape_area_rate_per_sqin')?.value ?? '1.65';
  for(const material of ['canvas','acrylic']) {
    const key=material+'_shape_area_rate_per_sqin';
    if(!settings.some(s=>s.key===key)) await api('/admin/pricing-settings/'+key,'PATCH',{value:shared});
  }
  console.log('Missing catalogs and material rates restored; existing records preserved.');
} finally { await api('/auth/logout','POST',{refreshToken:session.refreshToken}); }
