"use client";

import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/lib/supabase";

type Lang = "fr" | "en";
type Product = {
  id:string; name:string; category:string; brand:string; price:number; oldPrice?:number;
  condition:string; stock:number; images:string[]; description:string; specs:string[];
};

const products:Product[]=[
{id:"t480",name:"ThinkPad T480",category:"Laptops",brand:"Lenovo",price:180000,oldPrice:200000,condition:"Refurbished",stock:4,images:["https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=1000&q=85","https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?auto=format&fit=crop&w=1000&q=85","https://images.unsplash.com/photo-1541807084-5c52b6b3adef?auto=format&fit=crop&w=1000&q=85","https://images.unsplash.com/photo-1517336714739-489689fd1ca8?auto=format&fit=crop&w=1000&q=85"],description:"Reliable business laptop for work, study and everyday productivity.",specs:["Intel Core i5","8GB RAM","256GB SSD","14-inch Full HD","Wi-Fi / Bluetooth"]},
{id:"elitebook",name:"EliteBook 840 G5",category:"Laptops",brand:"HP",price:195000,oldPrice:220000,condition:"Refurbished",stock:2,images:["https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?auto=format&fit=crop&w=1000&q=85","https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=1000&q=85","https://images.unsplash.com/photo-1541807084-5c52b6b3adef?auto=format&fit=crop&w=1000&q=85","https://images.unsplash.com/photo-1517336714739-489689fd1ca8?auto=format&fit=crop&w=1000&q=85"],description:"Premium business notebook with a clean professional design.",specs:["Intel Core i5","8GB RAM","256GB SSD","14-inch Full HD","Wi-Fi / Bluetooth"]},
{id:"monitor",name:"24-inch Full HD Monitor",category:"Monitors",brand:"TATIOR",price:85000,condition:"New",stock:6,images:["https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&w=1000&q=85","https://images.unsplash.com/photo-1547394765-185e1e68f34e?auto=format&fit=crop&w=1000&q=85","https://images.unsplash.com/photo-1593642702821-c8da6771f0c6?auto=format&fit=crop&w=1000&q=85","https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=1000&q=85"],description:"Sharp Full HD display for office work, content and trading.",specs:["24 inch","Full HD 1920×1080","HDMI / VGA","16:9 display","60Hz"]},
{id:"ssd",name:"512GB NVMe SSD",category:"Accessories",brand:"Kingston",price:45000,condition:"New",stock:8,images:["https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?auto=format&fit=crop&w=1000&q=85","https://images.unsplash.com/photo-1531492746076-161ca9b8e7c2?auto=format&fit=crop&w=1000&q=85","https://images.unsplash.com/photo-1593642532744-d377ab507dc8?auto=format&fit=crop&w=1000&q=85","https://images.unsplash.com/photo-1587202372634-32705e3bf49c?auto=format&fit=crop&w=1000&q=85"],description:"Fast storage upgrade for compatible laptops and desktops.",specs:["512GB","NVMe","High speed","PCIe interface","5-year warranty"]},
{id:"iphone",name:"iPhone",category:"Phones",brand:"Apple",price:0,condition:"Available on request",stock:0,images:["https://images.unsplash.com/photo-1592286927505-2fd0f17f2a6f?auto=format&fit=crop&w=1000&q=85","https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=1000&q=85","https://images.unsplash.com/photo-1556656793-08538906a9f8?auto=format&fit=crop&w=1000&q=85","https://images.unsplash.com/photo-1592750475338-74b7b21085ab?auto=format&fit=crop&w=1000&q=85"],description:"Ask TATIOR for current iPhone models and prices.",specs:["Multiple models","Warranty options","Price on request"]},
{id:"android",name:"Android Phones",category:"Phones",brand:"Various",price:0,condition:"Available on request",stock:0,images:["https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=1000&q=85","https://images.unsplash.com/photo-1598327105666-5b89351aff97?auto=format&fit=crop&w=1000&q=85","https://images.unsplash.com/photo-1556656793-08538906a9f8?auto=format&fit=crop&w=1000&q=85","https://images.unsplash.com/photo-1592750475338-74b7b21085ab?auto=format&fit=crop&w=1000&q=85"],description:"A selection of Android smartphones available through TATIOR.",specs:["Multiple brands","Multiple budgets","Price on request"]}
];

const categories=["All","Laptops","Phones","Monitors","Accessories"];

const ui={
fr:{all:"Accueil",Laptops:"Ordinateurs",Phones:"Téléphones",Monitors:"Moniteurs",Accessories:"Accessoires",products:"Produits",search:"Rechercher un produit...",catalogue:"CATALOGUE",title:"Trouvez votre prochain appareil.",count:"produits",view:"Voir la fiche ↗",buy:"Acheter ↗",inStock:"En stock",order:"Sur commande",condition:"État",specs:"CARACTÉRISTIQUES",buyWhats:"Acheter sur WhatsApp ↗",trust1:"Testés avant la vente",trust1p:"Nous privilégions des produits vérifiés avant de vous les proposer.",trust2:"Communication claire",trust2p:"Confirmez directement avec TATIOR la disponibilité, l'état et le prix.",trust3:"Assistance humaine",trust3p:"Besoin de conseils ? Dites-nous ce que vous cherchez et nous vous aidons.",need:"BESOIN DE QUELQUE CHOSE ?",contactTitle:"Dites-nous ce que vous recherchez.",contactText:"Envoyez-nous votre budget, l'appareil souhaité ou la référence exacte. Nous vérifions la disponibilité.",contact:"Contacter TATIOR sur WhatsApp ↗"},
en:{all:"Home",Laptops:"Laptops",Phones:"Phones",Monitors:"Monitors",Accessories:"Accessories",products:"Products",search:"Search for a product...",catalogue:"CATALOGUE",title:"Find your next device.",count:"products",view:"View product ↗",buy:"Buy ↗",inStock:"In stock",order:"On order",condition:"Condition",specs:"SPECIFICATIONS",buyWhats:"Buy on WhatsApp ↗",trust1:"Tested before sale",trust1p:"We focus on products that are checked before they reach you.",trust2:"Clear communication",trust2p:"Confirm availability, condition and price directly with TATIOR.",trust3:"Human support",trust3p:"Need advice? Tell us what you need and we help you choose.",need:"NEED SOMETHING?",contactTitle:"Tell us what you are looking for.",contactText:"Send us your budget, preferred device or exact model. We'll check availability.",contact:"Contact TATIOR on WhatsApp ↗"}
} as const;

const translations:any={
t480:{fr:{d:"Ordinateur professionnel fiable pour le travail, les études et la productivité quotidienne.",c:"Reconditionné",s:["Intel Core i5","8 Go RAM","256 Go SSD","14 pouces Full HD","Wi-Fi / Bluetooth"]},en:{d:"Reliable business laptop for work, study and everyday productivity.",c:"Refurbished",s:["Intel Core i5","8GB RAM","256GB SSD","14-inch Full HD","Wi-Fi / Bluetooth"]}},
elitebook:{fr:{d:"Ordinateur professionnel premium au design sobre et élégant.",c:"Reconditionné",s:["Intel Core i5","8 Go RAM","256 Go SSD","14 pouces Full HD","Wi-Fi / Bluetooth"]},en:{d:"Premium business notebook with a clean professional design.",c:"Refurbished",s:["Intel Core i5","8GB RAM","256GB SSD","14-inch Full HD","Wi-Fi / Bluetooth"]}},
monitor:{fr:{d:"Écran Full HD net pour le bureau, le contenu et le trading.",c:"Neuf",s:["24 pouces","Full HD 1920×1080","HDMI / VGA","Format 16:9","60 Hz"]},en:{d:"Sharp Full HD display for office work, content and trading.",c:"New",s:["24 inch","Full HD 1920×1080","HDMI / VGA","16:9 display","60Hz"]}},
ssd:{fr:{d:"Mise à niveau de stockage rapide pour ordinateurs compatibles.",c:"Neuf",s:["512 Go","NVMe","Haute vitesse","Interface PCIe","Garantie 5 ans"]},en:{d:"Fast storage upgrade for compatible laptops and desktops.",c:"New",s:["512GB","NVMe","High speed","PCIe interface","5-year warranty"]}},
iphone:{fr:{d:"Demandez à TATIOR les modèles iPhone et les prix disponibles.",c:"Disponible sur demande",s:["Plusieurs modèles","Options de garantie","Prix sur demande"]},en:{d:"Ask TATIOR for current iPhone models and prices.",c:"Available on request",s:["Multiple models","Warranty options","Price on request"]}},
android:{fr:{d:"Une sélection de smartphones Android disponible chez TATIOR.",c:"Disponible sur demande",s:["Plusieurs marques","Plusieurs budgets","Prix sur demande"]},en:{d:"A selection of Android smartphones available through TATIOR.",c:"Available on request",s:["Multiple brands","Multiple budgets","Price on request"]}}
};

const money=(n:number)=>n?new Intl.NumberFormat("fr-FR").format(n)+" FCFA":"Sur demande";

export default function Home(){
const [category,setCategory]=useState("All");\nconst [catalog,setCatalog]=useState<Product[]>(products);
const [language,setLanguage]=useState<Lang>("fr");
const [query,setQuery]=useState("");
const [selected,setSelected]=useState<Product|null>(null);
const [selectedImage,setSelectedImage]=useState(0);
const t=ui[language];
const getText=(p:Product)=>{
  if(p.descFr||p.descEn) return {d:language==="fr"?(p.descFr||p.description):(p.descEn||p.description),c:language==="fr"?(p.conditionFr||p.condition):(p.conditionEn||p.condition),s:language==="fr"?(p.specsFr||p.specs):(p.specsEn||p.specs)};
  return translations[p.id]?.[language]||{d:p.description,c:p.condition,s:p.specs};
};
const getShort=(p:Product)=>language==="fr"?(p.shortFr||getText(p).d):(p.shortEn||getText(p).d);
useEffect(()=>{
  if(!supabase)return;
  supabase.from("products").select("*").order("created_at",{ascending:false}).then(({data,error})=>{
    if(!error && data?.length)setCatalog(data.map((p:any)=>({
      id:p.id,name:p.name_en,category:p.category,brand:p.brand,price:p.price,oldPrice:p.old_price,
      condition:p.condition_en,stock:p.stock,images:Array.isArray(p.images)?p.images:[],description:p.description_en,
      specs:Array.isArray(p.specs_en)?p.specs_en:[],shortFr:p.short_message_fr,shortEn:p.short_message_en,
      descFr:p.description_fr,descEn:p.description_en,conditionFr:p.condition_fr,conditionEn:p.condition_en,
      specsFr:Array.isArray(p.specs_fr)?p.specs_fr:[],specsEn:Array.isArray(p.specs_en)?p.specs_en:[]
    })));
  });
},[]);
const label=(c:string)=>c==="All"?t.all:(t as any)[c]||c;
const stock=(n:number)=>n>5?t.inStock:n>0?(language==="fr"?"Plus que "+n+" en stock":"Only "+n+" left"):t.order;
const wa=(p:Product)=>"https://wa.me/237000000000?text="+encodeURIComponent(language==="fr"?"Bonjour TATIOR, je suis intéressé par: "+p.name+". Pouvez-vous confirmer la disponibilité et le prix ?":"Hello TATIOR, I am interested in: "+p.name+". Can you confirm availability and price?");
const filtered=useMemo(()=>catalog.filter(p=>(category==="All"||p.category===category)&&(p.name+" "+p.brand+" "+p.category).toLowerCase().includes(query.toLowerCase())),[category,query]);

return <main>
<header className="site-header">
<div className="container header-inner">
<a href="/" className="logo">TATIOR</a>
<div className="search"><span>⌕</span><input value={query} onChange={e=>setQuery(e.target.value)} placeholder={t.search}/></div>
<div className="header-actions"><a href="#products" className="header-link">{t.products}</a><a href="#contact" className="whatsapp-top">WhatsApp</a><button className="language-switch" onClick={()=>setLanguage(language==="fr"?"en":"fr")}><span className={language==="fr"?"active":""}>FR</span><i>/</i><span className={language==="en"?"active":""}>EN</span></button></div>
</div>
<div className="category-bar"><div className="container categories">{categories.map(c=><button key={c} className={category===c?"active":""} onClick={()=>setCategory(c)}>{label(c)}</button>)}</div></div>
</header>

{category==="All"&&<section className="hero-shop"><div className="container hero-grid"><div className="hero-copy-shop"><div className="kicker">{language==="fr"?"TATIOR · TECHNOLOGIE":"TATIOR · TECHNOLOGY"}</div><h1>{language==="fr"?"La technologie":"Technology"}<br/><em>{language==="fr"?"qui fonctionne.":"that works."}</em></h1><p>{language==="fr"?"Ordinateurs, téléphones, accessoires et technologies sélectionnés pour le travail, les études et la vie quotidienne.":"Laptops, phones, accessories and technology selected for work, study and everyday life."}</p><div className="hero-buttons"><a className="btn gold" href="#products">{language==="fr"?"Voir les produits":"View products"}</a><a className="btn outline" href="#contact">{language==="fr"?"Parler à TATIOR":"Talk to TATIOR"}</a></div><div className="mini-proof"><span><b>✓</b> {language==="fr"?"Produits testés":"Tested products"}</span><span><b>✓</b> {language==="fr"?"Assistance humaine":"Human support"}</span><span><b>✓</b> {language==="fr"?"Achat local":"Local purchase"}</span></div></div><div className="hero-visual"><div className="hero-card"><span>TATIOR</span><strong>YOUR<br/>TECH.<br/><i>SIMPLIFIED.</i></strong><small>SELECTED TECHNOLOGY</small></div></div></div></section>}

<section id="products" className="products-section"><div className="container"><div className="section-head"><div><div className="kicker">{t.catalogue}</div><h2>{category==="All"?t.title:label(category)}</h2></div><span>{filtered.length} {t.count}</span></div><div className="product-grid">{filtered.map(p=>{const x=getText(p);return <article className="product-card" key={p.id}><button className="product-image product-image-button" onClick={()=>{setSelected(p);setSelectedImage(0)}} aria-label={p.name}><img src={p.images[0]} alt={p.name}/><span className="condition-badge">{x.c}</span><span className={p.stock>0?"stock-badge":"stock-badge stock-out"}>{stock(p.stock)}</span><span className="view-badge">{t.view}</span></button><div className="product-body"><div className="product-meta"><span>{p.brand}</span><span>{label(p.category)}</span></div><button className="product-title-button" onClick={()=>{setSelected(p);setSelectedImage(0)}}><h3>{p.name}</h3></button><p>{getShort(p)}</p><div className="specs">{x.s.slice(0,3).map((v:string)=><span key={v}>{v}</span>)}</div><div className="product-bottom"><div><strong>{money(p.price)}</strong>{p.oldPrice&&<del>{money(p.oldPrice)}</del>}</div><a href={wa(p)} target="_blank" rel="noreferrer" className="buy">{t.buy}</a></div></div></article>})}</div></div></section>

{category==="All"&&<><section className="trust-section"><div className="container trust-grid"><div><b>01</b><h3>{t.trust1}</h3><p>{t.trust1p}</p></div><div><b>02</b><h3>{t.trust2}</h3><p>{t.trust2p}</p></div><div><b>03</b><h3>{t.trust3}</h3><p>{t.trust3p}</p></div></div></section><section id="contact" className="contact-section"><div className="container contact-box"><div><div className="kicker">{t.need}</div><h2>{t.contactTitle}</h2></div><div><p>{t.contactText}</p><a className="btn gold" href={wa({id:"contact",name:"un produit",category:"",brand:"",price:0,condition:"",stock:0,images:[],description:"",specs:[]})} target="_blank" rel="noreferrer">{t.contact}</a></div></div></section></>}

<footer><div className="container footer-inner"><a className="logo" href="/">TATIOR</a><span>{language==="fr"?"Technologie · Électronique · Plus":"Technology · Electronics · More"}</span><span>© {new Date().getFullYear()} TATIOR</span></div></footer>

{selected&&<div className="product-modal-backdrop" onClick={()=>setSelected(null)}><div className="product-modal" role="dialog" aria-modal="true" onClick={e=>e.stopPropagation()}><button className="modal-close" onClick={()=>setSelected(null)}>×</button><div className="modal-image"><img src={selected.images[selectedImage]} alt={selected.name}/><span className={selected.stock>0?"stock-badge":"stock-badge stock-out"}>{stock(selected.stock)}</span></div><div className="modal-gallery">{selected.images.slice(0,4).map((img,i)=><button key={img} className={selectedImage===i?"gallery-thumb active":"gallery-thumb"} onClick={()=>setSelectedImage(i)}><img src={img} alt={selected.name+" view "+(i+1)}/></button>)}</div><div className="modal-content"><div className="product-meta"><span>{selected.brand}</span><span>{label(selected.category)}</span></div><h2>{selected.name}</h2><div className="modal-price"><strong>{money(selected.price)}</strong>{selected.oldPrice&&<del>{money(selected.oldPrice)}</del>}</div><p className="modal-description">{getText(selected).d}</p><div className="modal-condition">{t.condition} : <strong>{getText(selected).c}</strong></div><div className="modal-spec-block"><div className="kicker">{t.specs}</div><div className="modal-specs">{getText(selected).s.map((v:string)=><div key={v}>✓ <span>{v}</span></div>)}</div></div><a className="btn gold modal-buy" href={wa(selected)} target="_blank" rel="noreferrer">{t.buyWhats}</a></div></div></div>}
</main>;
}
