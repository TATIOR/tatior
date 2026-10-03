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
const money = (n:number) => n ? new Intl.NumberFormat("fr-FR").format(n)+" FCFA" : "Sur demande";
const stockLabel = (stock:number) => stock > 5 ? "En stock" : stock > 0 ? `Plus que ${stock} en stock` : "Sur commande";
const wa = (p:Product) => "https://wa.me/237000000000?text="+encodeURIComponent(`Bonjour TATIOR, je suis intéressé par: ${p.name}. Pouvez-vous confirmer la disponibilité et le prix ?`);

export default function Home() {
  const [category,setCategory] = useState("All");
  const [query,setQuery] = useState("");
  const [selected,setSelected] = useState<Product|null>(null);
  const [selectedImage,setSelectedImage] = useState(0);

  const filtered = useMemo(() => products.filter(p =>
    (category==="All" || p.category===category) &&
    `${p.name} ${p.brand} ${p.category}`.toLowerCase().includes(query.toLowerCase())
  ), [category,query]);

  return (
    <main>
      <header className="site-header">
        <div className="container header-inner">
          <a href="/" className="logo">TATIOR</a>
          <div className="search"><span>⌕</span><input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Rechercher un produit..." /></div>
          <div className="header-actions"><a href="#products" className="header-link">Produits</a><a href="#contact" className="whatsapp-top">WhatsApp</a></div>
        </div>
        <div className="category-bar"><div className="container categories">{categories.map(c=><button key={c} className={category===c?"active":""} onClick={()=>setCategory(c)}>{c}</button>)}</div></div>
      </header>

      <section className="hero-shop">
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
      </section>

      <section id="products" className="products-section">
        <div className="container">
          <div className="section-head"><div><div className="kicker">CATALOGUE</div><h2>Find your next device.</h2></div><span>{filtered.length} produits</span></div>
          <div className="product-grid">
            {filtered.map(p=>(
              <article className="product-card" key={p.id}>
                <button className="product-image product-image-button" onClick={()=>{setSelected(p);setSelectedImage(0)}} aria-label={`Voir ${p.name}`}>
                  <img src={p.images[0]} alt={p.name}/><span className="condition-badge">{p.condition}</span>
                  <span className={p.stock>0?"stock-badge":"stock-badge stock-out"}>{stockLabel(p.stock)}</span>
                  <span className="view-badge">Voir la fiche ↗</span>
                </button>
                <div className="product-body">
                  <div className="product-meta"><span>{p.brand}</span><span>{p.category}</span></div>
                  <button className="product-title-button" onClick={()=>{setSelected(p);setSelectedImage(0)}}><h3>{p.name}</h3></button>
                  <p>{p.description}</p>
                  <div className="specs">{p.specs.slice(0,3).map(s=><span key={s}>{s}</span>)}</div>
                  <div className="product-bottom"><div><strong>{money(p.price)}</strong>{p.oldPrice&&<del>{money(p.oldPrice)}</del>}</div><a href={wa(p)} target="_blank" rel="noreferrer" className="buy">Acheter ↗</a></div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="trust-section"><div className="container trust-grid">
        <div><b>01</b><h3>Tested before sale</h3><p>We focus on products that are checked before they reach you.</p></div>
        <div><b>02</b><h3>Clear communication</h3><p>Confirm availability, condition and price directly with TATIOR.</p></div>
        <div><b>03</b><h3>Human support</h3><p>Need advice? Tell us what you need and we help you choose.</p></div>
      </div></section>

      <section id="contact" className="contact-section"><div className="container contact-box">
        <div><div className="kicker">NEED SOMETHING?</div><h2>Tell us what<br/>you&apos;re looking for.</h2></div>
        <div><p>Send us your budget, preferred device or exact model. We&apos;ll check availability and get back to you.</p><a className="btn gold" href={wa({id:"contact",name:"un produit",category:"",brand:"",price:0,condition:"",stock:0,images:[],description:"",specs:[]})} target="_blank" rel="noreferrer">Contact TATIOR on WhatsApp ↗</a></div>
      </div></section>

      <footer><div className="container footer-inner"><a className="logo" href="/">TATIOR</a><span>Technology · Electronics · More</span><span>© {new Date().getFullYear()} TATIOR</span></div></footer>

      {selected && (
        <div className="product-modal-backdrop" onClick={()=>setSelected(null)}>
          <div className="product-modal" role="dialog" aria-modal="true" aria-label={selected.name} onClick={e=>e.stopPropagation()}>
            <button className="modal-close" onClick={()=>setSelected(null)} aria-label="Fermer">×</button>
            <div className="modal-image"><img src={selected.images[selectedImage] ?? selected.images[0]} alt={selected.name}/><span className={selected.stock>0?"stock-badge":"stock-badge stock-out"}>{stockLabel(selected.stock)}</span></div>
            <div className="modal-gallery">{selected.images.slice(0,4).map((img,i)=><button key={`${selected.id}-${i}`} className={selectedImage===i?"gallery-thumb active":"gallery-thumb"} onClick={()=>setSelectedImage(i)} aria-label={`Voir photo ${i+1}`}><img src={img} alt={`${selected.name} vue ${i+1}`}/></button>)}</div>
            <div className="modal-content">
              <div className="product-meta"><span>{selected.brand}</span><span>{selected.category}</span></div>
              <h2>{selected.name}</h2>
              <div className="modal-price"><strong>{money(selected.price)}</strong>{selected.oldPrice&&<del>{money(selected.oldPrice)}</del>}</div>
              <p className="modal-description">{selected.description}</p>
              <div className="modal-condition">État : <strong>{selected.condition}</strong></div>
              <div className="modal-spec-block"><div className="kicker">CARACTÉRISTIQUES</div><div className="modal-specs">{selected.specs.map(s=><div key={s}>✓ <span>{s}</span></div>)}</div></div>
              <a className="btn gold modal-buy" href={wa(selected)} target="_blank" rel="noreferrer">Acheter sur WhatsApp ↗</a>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
