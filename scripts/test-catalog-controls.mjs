import assert from 'node:assert/strict';
import { createServer } from 'vite';
const server=await createServer({server:{middlewareMode:true},appType:'custom',optimizeDeps:{noDiscovery:true}});
const originalFetch=globalThis.fetch;
try {
 const {mapCatalogOptions}=await server.ssrLoadModule('/src/api/catalogOptions.ts');
 const {fetchPricingRates}=await server.ssrLoadModule('/src/api/pricingSettingsApi.ts');
 const {fetchOptionCategoryItems}=await server.ssrLoadModule('/src/api/optionCategoriesApi.ts');
 const defaults=[{id:'sample',name:'Old label',price:120,description:'Old description'}];
 const row={id:'db-id',label:'Edited in admin',description:'New description',imageUrl:null,sortOrder:0,priceMode:'FLAT',flatPrice:'175',areaRatePerSqIn:null,extras:{id:'sample'}};
 assert.deepEqual(mapCatalogOptions([row],defaults,'price'),[{id:'sample',name:'Edited in admin',price:175,description:'New description'}]);
 assert.deepEqual(mapCatalogOptions([],defaults,'price'),[],'disabled items must not be restored from defaults');
 assert.deepEqual(mapCatalogOptions(undefined,defaults,'price'),defaults,'network failure retains fallback');
 globalThis.fetch=async()=>Response.json([{key:'shape_area_rate_per_sqin',value:'1.65'},{key:'canvas_shape_area_rate_per_sqin',value:'2.35'},{key:'acrylic_shape_area_rate_per_sqin',value:'4.75'},{key:'acrylic_thickness_rate_5mm',value:'7.25'}]);
 const rates=await fetchPricingRates();assert.deepEqual(rates.shapeAreaRates,{canvas:2.35,acrylic:4.75});assert.equal(rates.acrylicThicknessRates['5mm'],7.25);
 globalThis.fetch=async()=>Response.json([{materialScope:'BOTH',items:[{...row,label:'Shared'}]},{materialScope:'ACRYLIC',items:[{...row,label:'Acrylic'}]}]);
 assert.equal((await fetchOptionCategoryItems('finish','ACRYLIC'))[0].label,'Acrylic');
 globalThis.fetch=async()=>new Response('',{status:500});await assert.rejects(fetchOptionCategoryItems('finish','ACRYLIC',true));
 console.log('PASS: admin label/description/price mapping, disabled catalogs, failure fallback, separate material rates, thickness rates and material precedence.');
} finally {globalThis.fetch=originalFetch;await server.close();}
