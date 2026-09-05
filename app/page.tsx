"use client";

import { useEffect, useMemo, useState } from "react";
import { Flame, MapPin, MessageSquareText, Phone, Search, Star, X } from "lucide-react";
import type { MenuItem } from "@/lib/menu-data";
import { defaultMenu, menuCategories } from "@/lib/menu-data";

type Offer = { id: string; title: string; description: string; oldPrice: number | null; newPrice: number; image: string };

const money = new Intl.NumberFormat("ar-IQ");

export default function Home() {
  const [items, setItems] = useState<MenuItem[]>(defaultMenu);
  const [offers, setOffers] = useState<Offer[]>([]);
  const [category, setCategory] = useState(menuCategories[0]);
  const [query, setQuery] = useState("");
  const [complaintOpen, setComplaintOpen] = useState(false);
  useEffect(() => { fetch("/api/menu").then((r) => r.ok ? r.json() : null).then((data) => { if (data?.items) setItems(data.items); if (data?.offers) setOffers(data.offers); }); }, []);
  const shown = useMemo(() => items.filter((item) => item.available && item.category === category && item.name.includes(query.trim())), [items, category, query]);

  return <main dir="rtl" className="menu-shell">
    <header className="topbar">
      <a href="#home" className="brand-mini"><Flame size={18} fill="currentColor"/> خان الجمر</a>
      <nav><a href="#menu">المنيو</a><a href="#location">موقعنا</a><button onClick={() => setComplaintOpen(true)}>الشكاوى والملاحظات</button></nav>
    </header>
    <section id="home" className="hero">
      <div className="hero-copy"><span className="eyebrow"><Flame size={18}/> من الجمر مباشرة</span><h1>نكهة تركية<br/><em>بروح خان الجمر</em></h1><p>اختار وجبتك وتعرّف على أسعارنا بسهولة. كل أطباقنا تُحضّر بعناية وتُشوى على الجمر.</p><a className="primary-button" href="#menu">استكشف المنيو</a></div>
      <div className="hero-image"><img src="/menu/logo.webp" alt="شعار خان الجمر"/><div className="seal">مشويات<br/>على الجمر</div></div>
    </section>
    {offers.length > 0 && <section className="offers-section"><div className="offers-heading"><span>لفترة محدودة</span><h2>عروض خان الجمر</h2></div><div className="offers-grid">{offers.map((offer) => <article key={offer.id}><img src={offer.image} alt={offer.title}/><div><span>عرض خاص</span><h3>{offer.title}</h3>{offer.description && <p>{offer.description}</p>}<div className="public-offer-price">{offer.oldPrice && <del>{money.format(offer.oldPrice)} د.ع</del>}<strong>{money.format(offer.newPrice)} <small>د.ع</small></strong></div></div></article>)}</div></section>}
    <section id="menu" className="menu-section">
      <div className="section-heading"><div><span>قائمتنا</span><h2>اختار على ذوقك</h2></div><label className="search"><Search size={18}/><input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="ابحث عن وجبة"/></label></div>
      <div className="category-tabs">{menuCategories.map((name) => <button key={name} onClick={() => setCategory(name)} className={category === name ? "active" : ""}>{name}</button>)}</div>
      <div className="food-grid">{shown.map((item) => <article className="food-card" key={item.id}><div className="food-photo"><img src={item.image} alt={item.name}/></div><div className="food-info"><div><h3>{item.name}</h3>{item.description && <p>{item.description}</p>}</div><strong>{money.format(item.price)} <small>د.ع</small></strong></div></article>)}</div>
      {!shown.length && <div className="empty">لا توجد أصناف مطابقة حالياً</div>}
    </section>
    <section className="feedback-strip"><div><MessageSquareText/><span>رأيك يهمنا</span><h2>ساعدنا نخدمك بصورة أفضل</h2></div><button onClick={() => setComplaintOpen(true)}>أرسل شكوى أو ملاحظة</button></section>
    <footer id="location"><img src="/menu/logo.webp" alt="خان الجمر"/><div><h3><MapPin/> موقعنا</h3><p>كركوك – شارع القدس، مقابل قرية الهدايا</p></div><div><h3><Phone/> للطلب والتوصيل</h3><a href="tel:07705050381">0770 505 0381</a><a href="tel:07705050382">0770 505 0382</a></div></footer>
    {complaintOpen && <ComplaintModal close={() => setComplaintOpen(false)}/>} 
  </main>;
}

function ComplaintModal({ close }: { close: () => void }) {
  const [rating, setRating] = useState(5); const [sending, setSending] = useState(false); const [reference, setReference] = useState(""); const [error, setError] = useState("");
  async function submit(e: React.FormEvent<HTMLFormElement>) { e.preventDefault(); setSending(true); setError(""); const form = new FormData(e.currentTarget); const response = await fetch("/api/complaints", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(Object.fromEntries([...form, ["rating", String(rating)]])) }); const data = await response.json(); setSending(false); if (response.ok) setReference(data.reference); else setError(data.error || "تعذر الإرسال"); }
  return <div className="modal-backdrop" onMouseDown={(e) => e.target === e.currentTarget && close()}><section className="complaint-modal"><button className="close" onClick={close} aria-label="إغلاق"><X/></button>
    {reference ? <div className="success"><span>✓</span><h2>وصلتنا رسالتك</h2><p>تم الإرسال بصورة مجهولة، ورقم المتابعة هو:</p><strong>{reference}</strong><button onClick={close}>تم</button></div> : <><span className="modal-kicker">بكل خصوصية</span><h2>شكوى أو ملاحظة</h2><p>لا نطلب اسمك أو رقم هاتفك. اكتب لنا بصراحة حتى نحسن تجربتك.</p><form onSubmit={submit}>
      <div className="two-fields"><label>نوع الرسالة<select name="type"><option>شكوى</option><option>ملاحظة</option><option>اقتراح</option><option>إشادة</option></select></label><label>تخص أي جانب؟<select name="area"><option>الطعام</option><option>الخدمة</option><option>النظافة</option><option>الأسعار</option><option>أخرى</option></select></label></div>
      <label>رقم الطاولة <small>(اختياري)</small><input name="tableNumber" inputMode="numeric" placeholder="مثلاً 12"/></label><label>تفاصيل الرسالة<textarea name="message" required minLength={5} maxLength={1500} placeholder="اكتب تفاصيل تجربتك هنا..."/></label>
      <div className="rating"><span>تقييم التجربة</span><div>{[1,2,3,4,5].map((n) => <button type="button" key={n} onClick={() => setRating(n)} aria-label={`${n} نجوم`}><Star fill={n <= rating ? "currentColor" : "none"}/></button>)}</div></div>
      {error && <p className="form-error">{error}</p>}<button className="submit" disabled={sending}>{sending ? "جارٍ الإرسال..." : "إرسال بصورة مجهولة"}</button>
    </form></>}
  </section></div>;
}
