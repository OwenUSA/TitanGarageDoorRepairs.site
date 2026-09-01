const fs=require('fs');
const base=u=>{try{return (u||'').split('/').pop().split('?')[0].slice(0,46)}catch{return ''}};
for(const route of ['home','about','services','contact']){
 const rec={};
 for(const bp of [390,768,1440]){
  const f='.harness/assets/'+route+'-'+bp+'.json';
  if(!fs.existsSync(f))continue;
  const d=JSON.parse(fs.readFileSync(f,'utf8'));
  for(const s of d.slots){
   if(s.dataUri)continue;
   const key=s.kind+':sec'+s.section+':'+(s.kind==='img'?'#'+s.n:base(s.url));
   rec[key]=rec[key]||{key,kind:s.kind,section:s.section,url:s.currentSrc||s.url||'',alt:s.alt||'',fit:s.fit||s.size||'',radius:s.radius||'',nat:s.natural||null,dims:{},dom:{}};
   rec[key].dims[bp]=s.rect.w+'x'+s.rect.h;
   if(s.dominant)rec[key].dom[bp]=s.dominant.hex;
   if(s.natural&&s.natural.w)rec[key].nat=s.natural;
  }
 }
 console.log('\n##### '+route);
 for(const r of Object.values(rec)){
  const ar=(()=>{const d=r.dims[1440]||r.dims[768]||r.dims[390];if(!d)return '';const[a,b]=d.split('x').map(Number);return (a/b).toFixed(2)})();
  console.log([r.key.padEnd(34),'390='+(r.dims[390]||'-').padEnd(9),'768='+(r.dims[768]||'-').padEnd(9),'1440='+(r.dims[1440]||'-').padEnd(9),'ar='+ar,'nat='+(r.nat?r.nat.w+'x'+r.nat.h:'-'),'fit='+r.fit,'dom='+(r.dom[1440]||r.dom[768]||r.dom[390]||'-'),'| '+base(r.url)].join(' '));
 }
}
