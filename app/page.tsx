"use client";

import { useMemo, useState } from "react";

type Product = {
  id: string;
  name: string;
  category: string;
  brand: string;
  price: number;
  oldPrice?: number;
  condition: string;
  stock: number;
  images: string[];
  description: string;
  specs: string[];
};

const products: Product[] = [
  { id:"t480", name:"ThinkPad T480", category:"Laptops", brand:"Lenovo", price:180000, oldPrice:200000, condition:"Refurbished", stock:4, images:["https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=1000&q=85","https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?auto=format&fit=crop&w=1000&q=85","https://images.unsplash.com/photo-1541807084-5c52b6b3adef?auto=format&fit=crop&w=1000&q=85","https://images.unsplash.com/photo-1517336714739-489689fd1ca8?auto=format&fit=crop&w=1000&q=85"], description:"Reliable business laptop for work, study and everyday productivity.", specs:["Intel Core i5","8GB RAM","256GB SSD","14-inch Full HD","Wi-Fi / Bluetooth"] },
  { id:"elitebook", name:"EliteBook 840 G5", category:"Laptops", brand:"HP", price:195000, oldPrice:220000, condition:"Refurbished", stock:2, images:["https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?auto=format&fit=crop&w=1000&q=85","https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=1000&q=85","https://images.unsplash.com/photo-1541807084-5c52b6b3adef?auto=format&fit=crop&w=1000&q=85","https://images.unsplash.com/photo-1517336714739-489689fd1ca8?auto=format&fit=crop&w=1000&q=85"], description:"Premium business notebook with a clean professional design.", specs:["Intel Core i5","8GB RAM","256GB SSD","14-inch Full HD","Wi-Fi / Bluetooth"] },
  { id:"monitor", name:"24-inch Full HD Monitor", category:"Monitors", brand:"TATIOR", price:85000, condition:"New", stock:6, images:["https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&w=1000&q=85","https://images.unsplash.com/photo-1547394765-185e1e68f34e?auto=format&fit=crop&w=1000&q=85","https://images.unsplash.com/photo-1593642702821-c8da6771f0c6?auto=format&fit=crop&w=1000&q=85","https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=1000&q=85"], description:"Sharp Full HD display for office work, content and trading.", specs:["24 inch","Full HD 1920×1080","HDMI / VGA","16:9 display","60Hz"] },
  { id:"ssd", name:"512GB NVMe SSD", category:"Accessories", brand:"Kingston", price:45000, condition:"New", stock:8, images:["https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?auto=format&fit=crop&w=1000&q=85","https://images.unsplash.com/photo-1531492746076-161ca9b8e7c2?auto=format&fit=crop&w=1000&q=85","https://images.unsplash.com/photo-1593642532744-d377ab507dc8?auto=format&fit=crop&w=1000&q=85","https://images.unsplash.com/photo-1587202372634-32705e3bf49c?auto=format&fit=crop&w=1000&q=85"], description:"Fast storage upgrade for compatible laptops and desktops.", specs:["512GB","NVMe","High speed","PCIe interface","5-year warranty"] },
  { id:"iphone", name:"iPhone", category:"Phones", brand:"Apple", price:0, condition:"Available on request", stock:0, images:["https://images.unsplash.com/photo-1592286927505-2fd0f17f2a6f?auto=format&fit=crop&w=1000&q=85","https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=1000&q=85","https://images.unsplash.com/photo-1556656793-08538906a9f8?auto=format&fit=crop&w=1000&q=85","https://images.unsplash.com/photo-1592750475338-74b7b21085ab?auto=format&fit=crop&w=1000&q=85"], description:"Ask TATIOR for current iPhone models and prices.", specs:["Multiple models","Warranty options","Price on request"] },
  { id:"android", name:"Android Phones", category:"Phones", brand:"Various", price:0, condition:"Available on request", stock:0, images:["https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=1000&q=85","https://images.unsplash.com/photo-1598327105666-5b89351aff97?auto=format&fit=crop&w=1000&q=85","https://images.unsplash.com/photo-1556656793-08538906a9f8?auto=format&fit=crop&w=1000&q=85","https://images.unsplash.com/photo-1592750475338-74b7b21085ab?auto=format&fit=crop&w=1000&q=85"], description:"A selection of Android smartphones available through TATIOR.", specs:["Multiple brands","Multiple budgets","Price on request"] },
];

const categories = ["All","Laptops","Phones","Monitors","Accessories"];
const copy={fr:{all:'Accueil',laptops:'Ordinateurs',phones:'Téléphones',monitors:'Moniteurs',accessories:'Accessoires',products:'Produits',whatsapp:'WhatsApp',search:'Rechercher un produit...',catalogue:'CATALOGUE',title:'Trouvez votre prochain appareil.',count:'produits',buy:'Acheter ↗',view:'Voir la fiche ↗',inStock:'En stock',order:'Sur commande',trust1:'Testés avant la vente',trust1p:'Nous privilégions des produits vérifiés avant de vous les proposer.',trust2:'Communication claire',trust2p:'Confirmez directement avec TATIOR la disponibilité, l’état et le prix.',trust3:'Assistance humaine',trust3p:'Besoin de conseils ? Dites-nous ce que vous cherchez et nous vous aidons.',need:'BESOIN DE QUELQUE CHOSE ?',contactTitle:'Dites-nous ce que vous recherchez.',contactText:'Envoyez-nous votre budget, l’appareil souhaité ou la référence exacte. Nous vérifions la disponibilité.',contact:'Contacter TATIOR sur WhatsApp ↗',condition:'État',specs:'CARACTÉRISTIQUES',buyWhats:'Acheter sur WhatsApp ↗'},en:{all:'Home',laptops:'Laptops',phones:'Phones',monitors:'Monitors',accessories:'Accessories',products:'Products',whatsapp:'WhatsApp',search:'Search for a product...',catalogue:'CATALOGUE',title:'Find your next device.',count:'products',buy:'Buy ↗',view:'View product ↗',inStock:'In stock',order:'On order',trust1:'Tested before sale',trust1p:'We focus on products that are checked before they reach you.',trust2:'Clear communication',trust2p:'Confirm availability, condition and price directly with TATIOR.',trust3:'Human support',trust3p:'Need advice? Tell us what you need and we help you choose.',need:'NEED SOMETHING?',contactTitle:'Tell us what you are looking for.',contactText:'Send us your budget, preferred device or exact model. We’ll check availability.',contact:'Contact TATIOR on WhatsApp ↗',condition:'Condition',specs:'SPECIFICATIONS',buyWhats:'Buy on WhatsApp ↗'}} as const;

const money = (n:number) => n ? new Intl.NumberFormat("fr-FR").format(n)+" FCFA" : "Sur demande";
const stockLabel = (stock:number) => stock > 5 ? "En stock" : stock > 0 ? `Plus que ${stock} en stock` : "Sur commande";
const wa = (p:Product) => "https://wa.me/237000000000?text="+encodeURIComponent(`Bonjour TATIOR, je suis intéressé par: ${p.name}. Pouvez-vous confirmer la disponibilité et le prix ?`);

export default function Home() {
  const [category,setCategory] = useState("All");
  const [language,setLanguage] = useState<"fr"|"en">("fr");
  const t=copy[language];
  const [query,setQuery] = useState("");
  const [selected,setSelected] = useState<Product|null>(null);
  const [selectedImage,setSelectedImage] = useState(0);

  const filtered = useMemo(() => products.filter(p => (category==="All" || p.category===category) && (p.name+" "+p.brand+" "+p.category).toLowerCase().includes(query.toLowerCase())), [category,query]);
  const categoryLabel=(c:string)=>({All:t.all,Laptops:t.laptops,Phones:t.phones,Monitors:t.monitors,Accessories:t.accessories}[c] ?? c);
  const textFor=(p:Product)=>({description:p.description,condition:p.condition,specs:p.specs});
  const stockLabel=(stock:number)=>stock>5?t.inStock:stock>0?(language==="fr"?"Plus que "+stock+" en stock":"Only "+stock+" left"):t.order;
  const wa=(p:Product)=>"https://wa.me/237000000000?text="+encodeURIComponent((language==="fr"?"Bonjour TATIOR, je suis intéressé par: ":"Hello TATIOR, I am interested in: ")+p.name);

  return (
    <main>
      <header className="site-header">
        <div className="container header-inner">
          <a href="/" className="logo">TATIOR</a>
          <div className="search"><span>⌕</span><input value={query} onChange={e=>setQuery(e.target.value)} placeholder={t.search} /></div>
          <div className="header-actions"><a href="#products" className="header-link">{t.products}</a><a href="#contact" className="whatsapp-top">{t.whatsapp}</a><button className="language-switch" onClick={()=>setLanguage(language==="fr"?"en":"fr")}><span className={language==="fr"?"active":""}>FR</span><i>/</i><span className={language==="en"?"active":""}>EN</span></button></div>
        </div>
        <div className="category-bar"><div className="container categories">{categories.map(c=><button key={c} className={category===c?"active":""} onClick={()=>setCategory(c)}>{categoryLabel(c)}</button>)}</div></div>
      </header>

      {category==="All" && <section className="hero-shop">
        <div className="container hero-grid">
          <div className="hero-copy-shop">
            <div className="kicker">TATIOR · TECHNOLOGY</div>
            <h1>Technology<br/><em>that works.</em></h1>
            <p>Laptops, phones, accessories and technology selected for work, study and everyday life.</p>
            <div className="hero-buttons"><a className="btn gold" href="#products">Voir les produits</a><a className="btn outline" href="#contact">Parler à TATIOR</a></div>
            <div className="mini-proof"><span><b>✓</b> Produits testés</span><span><b>✓</b> Assistance humaine</span><span><b>✓</b> Achat local</span></div>
          </div>
          <div className="hero-visual"><div className="hero-card"><span>TATIOR</span><strong>YOUR<br/>TECH.<br/><i>SIMPLIFIED.</i></strong><small>SELECTED TECHNOLOGY</small></div></div>
        </div>
      </section>}

      <section id="products" className="products-section">
        <div className="container">
          <div className="section-head"><div><div className="kicker">{t.catalogue}</div><h2>{category==="All"?t.title:categoryLabel(category)}</h2></div><span>{filtered.length} {t.count}</span></div>
          <div className="product-grid">
            {filtered.map(p=>(
              <article className="product-card" key={p.id}>
                <button className="product-image product-image-button" onClick={()=>{setSelected(p);setSelectedImage(0)}} aria-label={`Voir ${p.name}`}>
                  <img src={p.images[0]} alt={p.name}/><span className="condition-badge">{textFor(p).condition}</span>
                  <span className={p.stock>0?"stock-badge":"stock-badge stock-out"}>{stockLabel(p.stock)}</span>
                  <span className="view-badge">{t.view}</span>
                </button>
                <div className="product-body">
                  <div className="product-meta"><span>{p.brand}</span><span>{p.category}</span></div>
                  <button className="product-title-button" onClick={()=>{setSelected(p);setSelectedImage(0)}}><h3>{p.name}</h3></button>
                  <p>{textFor(p).description}</p>
                  <div className="specs">{textFor(p).specs.slice(0,3).map(s=><span key={s}>{s}</span>)}</div>
                  <div className="product-bottom"><div><strong>{money(p.price)}</strong>{p.oldPrice&&<del>{money(p.oldPrice)}</del>}</div><a href={wa(p)} target="_blank" rel="noreferrer" className="buy">{t.buy}</a></div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {category==="All" && <section className="trust-section"><div className="container trust-grid">
        <div><b>01</b><h3>{t.trust1}</h3><p>{t.trust1p}</p></div>
        <div><b>02</b><h3>{t.trust2}</h3><p>{t.trust2p}</p></div>
        <div><b>03</b><h3>{t.trust3}</h3><p>{t.trust3p}</p></div>
      </div></section>

      <section id="contact" className="contact-section"><div className="container contact-box">
        <div><div className="kicker">{t.need}</div><h2>{t.contactTitle}</h2></div>
        <div><p>{t.contactText}</p><a className="btn gold" href={wa({id:"contact",name:"un produit",category:"",brand:"",price:0,condition:"",stock:0,images:[],description:"",specs:[]})} target="_blank" rel="noreferrer">{t.contact}</a></div>
      </div></section>}

      <footer><div className="container footer-inner"><a className="logo" href="/">TATIOR</a><span>Technology · Electronics · More</span><span>© {new Date().getFullYear()} TATIOR</span></div></footer>

      {selected && (
        <div className="product-modal-backdrop" onClick={()=>setSelected(null)}>
          <div className="product-modal" role="dialog" aria-modal="true" aria-label={selected.name} onClick={e=>e.stopPropagation()}>
            <button className="modal-close" onClick={()=>setSelected(null)} aria-label="Fermer">×</button>
            <div className="modal-image"><img src={selected.images[selectedImage] ?? selected.images[0]} alt={selected.name}/><span className={selected.stock>0?"stock-badge":"stock-badge stock-out"}>{stockLabel(selected.stock)}</span></div>
            <div className="modal-gallery">{selected.images.slice(0,4).map((img,i)=><button key={`${selected.id}-${i}`} className={selectedImage===i?"gallery-thumb active":"gallery-thumb"} onClick={()=>setSelectedImage(i)} aria-label={`Voir photo ${i+1}`}><img src={img} alt={`${selected.name} vue ${i+1}`}/></button>)}</div>
            <div className="modal-content">
              <div className="product-meta"><span>{selected.brand}</span><span>{categoryLabel(selected.category)}</span></div>
              <h2>{selected.name}</h2>
              <div className="modal-price"><strong>{money(selected.price)}</strong>{selected.oldPrice&&<del>{money(selected.oldPrice)}</del>}</div>
              <p className="modal-description">{selected.description}</p>
              <div className="modal-condition">{t.condition} : <strong>{textFor(selected).condition}</strong></div>
              <div className="modal-spec-block"><div className="kicker">{t.specs}</div><div className="modal-specs">{textFor(selected).specs.map(s=><div key={s}>✓ <span>{s}</span></div>)}</div></div>
              <a className="btn gold modal-buy" href={wa(selected)} target="_blank" rel="noreferrer">{t.buyWhats}</a>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
