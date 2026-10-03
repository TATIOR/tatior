"use client";

import { FormEvent, useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

type Product = {
  id:string; slug:string; name_fr:string; name_en:string; category:string; brand:string;
  price:number; old_price:number|null; condition_fr:string; condition_en:string; stock:number;
  short_message_fr:string; short_message_en:string; description_fr:string; description_en:string;
  specs_fr:string[]; specs_en:string[]; images:string[];
};

const empty:Omit<Product,"id">={
  slug:"",name_fr:"",name_en:"",category:"Laptops",brand:"",price:0,old_price:null,
  condition_fr:"Neuf",condition_en:"New",stock:0,short_message_fr:"",short_message_en:"",
  description_fr:"",description_en:"",specs_fr:[],specs_en:[],images:[]
};

export default function AdminPage(){
  const [session,setSession]=useState<any>(null);
  const [email,setEmail]=useState(""); const [password,setPassword]=useState("");
  const [products,setProducts]=useState<Product[]>([]);
  const [form,setForm]=useState(empty); const [editing,setEditing]=useState<string|null>(null);
  const [specFr,setSpecFr]=useState(""); const [specEn,setSpecEn]=useState("");
  const [files,setFiles]=useState<File[]>([]); const [saving,setSaving]=useState(false); const [message,setMessage]=useState("");

  useEffect(()=>{
    if(!supabase)return;
    supabase.auth.getSession().then(({data})=>setSession(data.session));
    const {data}=supabase.auth.onAuthStateChange((_event,s)=>setSession(s));
    return ()=>data.subscription.unsubscribe();
  },[]);

  const load=async()=>{
    if(!supabase)return;
    const {data,error}=await supabase.from("products").select("*").order("created_at",{ascending:false});
    if(error)setMessage(error.message); else setProducts((data||[]) as Product[]);
  };
  useEffect(()=>{if(session)load()},[session]);

  const login=async(e:FormEvent)=>{
    e.preventDefault(); setMessage("");
    if(!supabase){setMessage("Supabase n'est pas encore configuré.");return}
    const {error}=await supabase.auth.signInWithPassword({email,password});
    if(error)setMessage(error.message);
  };

  const uploadImages=async(productId:string)=>{
    if(!supabase||!files.length)return [];
    const urls:string[]=[];
    for(const file of files.slice(0,4)){
      const safe=file.name.toLowerCase().replace(/[^a-z0-9.]+/g,"-");
      const path=productId+"/"+Date.now()+"-"+safe;
      const {error}=await supabase.storage.from("products").upload(path,file,{upsert:true});
      if(error)throw error;
      const {data}=supabase.storage.from("products").getPublicUrl(path);
      urls.push(data.publicUrl);
    }
    return urls;
  };

  const save=async(e:FormEvent)=>{
    e.preventDefault(); if(!supabase)return;
    setSaving(true);setMessage("");
    try{
      const payload={...form,slug:form.slug||form.name_en.toLowerCase().replace(/[^a-z0-9]+/g,"-").replace(/(^-|-$)/g,""),specs_fr:specFr? [...form.specs_fr,specFr]:form.specs_fr,specs_en:specEn?[...form.specs_en,specEn]:form.specs_en};
      if(editing){
        const uploaded=await uploadImages(editing);
        const next={...payload,images:uploaded.length?uploaded:form.images,updated_at:new Date().toISOString()};
        const {error}=await supabase.from("products").update(next).eq("id",editing);
        if(error)throw error;
        setMessage("Produit modifié.");
      }else{
        const {data,error}=await supabase.from("products").insert({...payload,images:[]}).select().single();
        if(error)throw error;
        const uploaded=await uploadImages(data.id);
        if(uploaded.length)await supabase.from("products").update({images:uploaded}).eq("id",data.id);
        setMessage("Produit ajouté.");
      }
      reset(); await load();
    }catch(err:any){setMessage(err.message||"Erreur");}
    finally{setSaving(false)}
  };

  const reset=()=>{setForm(empty);setEditing(null);setSpecFr("");setSpecEn("");setFiles([])};
  const edit=(p:Product)=>{setForm(p);setEditing(p.id);setSpecFr("");setSpecEn("");setFiles([]);window.scrollTo({top:0,behavior:"smooth"})};
  const remove=async(id:string)=>{if(!supabase||!confirm("Supprimer ce produit ?"))return;const {error}=await supabase.from("products").delete().eq("id",id);if(error)setMessage(error.message);else{setMessage("Produit supprimé.");load()}};
  const field=(key:keyof typeof empty,label:string,type="text")=><label className="admin-field"><span>{label}</span><input type={type} value={String(form[key]??"")} onChange={e=>setForm({...form,[key]:type==="number"?Number(e.target.value):e.target.value})}/></label>;

  if(!session)return <main className="admin-page"><div className="admin-login"><a className="logo" href="/">TATIOR</a><div className="kicker">ADMINISTRATION</div><h1>Gestion du catalogue</h1><p>Connectez-vous pour ajouter, modifier ou supprimer les produits.</p><form onSubmit={login}>{fieldLogin("Email",email,setEmail,"email")}{fieldLogin("Mot de passe",password,setPassword,"password")}<button className="btn gold admin-submit">Se connecter</button></form>{message&&<div className="admin-message">{message}</div>}</div></main>;

  return <main className="admin-page"><div className="container admin-shell">
    <header className="admin-header"><div><a className="logo" href="/">TATIOR</a><div className="kicker">ADMINISTRATION</div><h1>Catalogue produits</h1></div><div className="admin-head-actions"><a href="/" className="btn">Voir le site</a><button className="btn" onClick={()=>supabase?.auth.signOut()}>Déconnexion</button></div></header>
    <form className="admin-form" onSubmit={save}>
      <div className="admin-form-head"><div><div className="kicker">{editing?"MODIFIER":"NOUVEAU PRODUIT"}</div><h2>{editing?form.name_fr||"Produit":"Ajouter un produit"}</h2></div>{editing&&<button type="button" className="btn" onClick={reset}>Annuler</button>}</div>
      <div className="admin-grid">
        {field("name_fr","Nom français")}{field("name_en","English name")}{field("brand","Marque")}
        <label className="admin-field"><span>Catégorie</span><select value={form.category} onChange={e=>setForm({...form,category:e.target.value})}><option>Laptops</option><option>Phones</option><option>Monitors</option><option>Accessories</option></select></label>
        {field("price","Prix FCFA","number")}{field("old_price","Ancien prix FCFA","number")}{field("stock","Stock","number")}
        {field("condition_fr","État français")}{field("condition_en","Condition English")}
      </div>
      <div className="admin-two">
        <label className="admin-field"><span>Petit message sous le produit — FR</span><input value={form.short_message_fr} onChange={e=>setForm({...form,short_message_fr:e.target.value})}/></label>
        <label className="admin-field"><span>Small message under product — EN</span><input value={form.short_message_en} onChange={e=>setForm({...form,short_message_en:e.target.value})}/></label>
      </div>
      <div className="admin-two">
        <label className="admin-field"><span>Description française</span><textarea value={form.description_fr} onChange={e=>setForm({...form,description_fr:e.target.value})}/></label>
        <label className="admin-field"><span>English description</span><textarea value={form.description_en} onChange={e=>setForm({...form,description_en:e.target.value})}/></label>
      </div>
      <div className="admin-two">
        <div className="admin-field"><span>Caractéristiques FR</span><div className="tag-list">{form.specs_fr.map((s,i)=><button type="button" key={i} className="tag" onClick={()=>setForm({...form,specs_fr:form.specs_fr.filter((_,n)=>n!==i)})}>{s} ×</button>)}</div><div className="admin-inline"><input value={specFr} onChange={e=>setSpecFr(e.target.value)} placeholder="Ex. 16 Go RAM"/><button type="button" className="btn" onClick={()=>{if(specFr.trim()){setForm({...form,specs_fr:[...form.specs_fr,specFr.trim()]});setSpecFr("")}}}>Ajouter</button></div></div>
        <div className="admin-field"><span>Specifications EN</span><div className="tag-list">{form.specs_en.map((s,i)=><button type="button" key={i} className="tag" onClick={()=>setForm({...form,specs_en:form.specs_en.filter((_,n)=>n!==i)})}>{s} ×</button>)}</div><div className="admin-inline"><input value={specEn} onChange={e=>setSpecEn(e.target.value)} placeholder="e.g. 16GB RAM"/><button type="button" className="btn" onClick={()=>{if(specEn.trim()){setForm({...form,specs_en:[...form.specs_en,specEn.trim()]});setSpecEn("")}}}>Add</button></div></div>
      </div>
      <label className="admin-field"><span>Photos — maximum 4</span><input type="file" accept="image/*" multiple onChange={e=>setFiles(Array.from(e.target.files||[]).slice(0,4))}/><small>{files.length} nouvelle(s) photo(s) sélectionnée(s). Si vous modifiez un produit, ces photos remplaceront les anciennes.</small></label>
      {form.images.length>0&&<div className="admin-preview">{form.images.slice(0,4).map(x=><img key={x} src={x} alt="Produit"/>)}</div>}
      <button className="btn gold admin-submit" disabled={saving}>{saving?"Enregistrement...":editing?"Enregistrer les modifications":"Ajouter le produit"}</button>
      {message&&<div className="admin-message">{message}</div>}
    </form>
    <section className="admin-list"><div className="admin-form-head"><div><div className="kicker">CATALOGUE</div><h2>Produits existants</h2></div><span>{products.length} produit(s)</span></div><div className="admin-products">{products.map(p=><article className="admin-product" key={p.id}><div className="admin-product-img">{p.images[0]?<img src={p.images[0]} alt={p.name_fr}/>:<span>PHOTO</span>}</div><div><div className="product-meta"><span>{p.brand}</span><span>{p.category}</span></div><h3>{p.name_fr}</h3><p>{p.short_message_fr}</p><strong>{p.price?new Intl.NumberFormat("fr-FR").format(p.price)+" FCFA":"Sur demande"}</strong><small> · Stock {p.stock}</small></div><div className="admin-product-actions"><button className="btn" onClick={()=>edit(p)}>Modifier</button><button className="btn danger" onClick={()=>remove(p.id)}>Supprimer</button></div></article>)}</div></section>
  </div></main>;
}

function fieldLogin(label:string,value:string,setter:(v:string)=>void,type:string){return <label className="admin-field"><span>{label}</span><input required type={type} value={value} onChange={e=>setter(e.target.value)}/></label>}
