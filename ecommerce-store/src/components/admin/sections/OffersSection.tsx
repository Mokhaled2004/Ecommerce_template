'use client';

import { useCallback, useEffect, useState } from 'react';
import { Edit3, Plus, RefreshCw, Search, Trash2, X } from 'lucide-react';

type Offer = any;
type Collection = { id: string; name: string; [key: string]: any };
const emptyForm = { name: '', description: '', type: 'percentage', value: '', couponCode: '', couponDiscountType: 'percentage', minimumOrderAmount: '', maximumDiscountAmount: '', startAt: '', endAt: '', isActive: true, productIds: [] as string[], variantIds: [] as string[], packageIds: [] as string[], categoryIds: [] as string[], buyQuantity: '1', getQuantity: '1', getDiscountPercent: '100' };
const TYPES = [
  ['percentage', 'Percentage discount'], ['fixed_amount', 'Fixed amount discount'],
  ['buy_x_get_y', 'Buy X, get Y'], ['coupon', 'Coupon code'],
];
const GROUPS = [
  ['packageIds', 'Packages'], ['categoryIds', 'Categories'],
] as const;

export default function OffersSection() {
  const [offers, setOffers] = useState<Offer[]>([]);
  const [collections, setCollections] = useState<Record<string, Collection[]>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState(emptyForm);
  const [editing, setEditing] = useState<Offer | null>(null);
  const [formOpen, setFormOpen] = useState(false);
  const [productSearch, setProductSearch] = useState('');

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const urls = ['/api/offers', '/api/products', '/api/variants', '/api/packages', '/api/categories'];
      const responses = await Promise.all(urls.map((url) => fetch(url)));
      const data = await Promise.all(responses.map((response) => response.json()));
      if (!responses[0].ok) throw new Error(data[0].error || 'Could not load offers.');
      setOffers(data[0]);
      setCollections({ productIds: data[1], variantIds: data[2], packageIds: data[3], categoryIds: data[4] });
    } catch (e: any) { setError(e.message || 'Could not load offers.'); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { void load(); }, [load]);

  const change = (key: string, value: any) => setForm((current) => ({ ...current, [key]: value }));
  const startNew = () => { setEditing(null); setForm(emptyForm); setProductSearch(''); setError(''); setFormOpen(true); };
  const startEdit = (offer: Offer) => {
    const metadata = offer.metadata || {};
    setEditing(offer);
    setForm({ ...emptyForm, name: offer.name || '', description: offer.description || '', type: offer.type || 'percentage', value: offer.value == null ? '' : String(offer.value), couponCode: offer.couponCode || '', couponDiscountType: metadata.discountType || 'percentage', minimumOrderAmount: offer.minimumOrderAmount || '', maximumDiscountAmount: offer.maximumDiscountAmount || '', startAt: offer.startAt ? new Date(offer.startAt).toISOString().slice(0, 16) : '', endAt: offer.endAt ? new Date(offer.endAt).toISOString().slice(0, 16) : '', isActive: offer.isActive ?? true, productIds: offer.offerProducts?.map((x: any) => x.productId) || [], categoryIds: offer.offerCategories?.map((x: any) => x.categoryId) || [], variantIds: offer.offerVariants?.map((x: any) => x.variantId) || [], packageIds: offer.offerPackages?.map((x: any) => x.packageId) || [], buyQuantity: String(metadata.buyQuantity ?? 1), getQuantity: String(metadata.getQuantity ?? 1), getDiscountPercent: String(metadata.getDiscountPercent ?? 100) });
    setProductSearch(''); setError(''); setFormOpen(true);
  };
  const submit = async (event: React.FormEvent) => {
    event.preventDefault(); setSaving(true); setError('');
    try {
      const payload = { ...form, value: form.value || null, buyQuantity: Number(form.buyQuantity), getQuantity: Number(form.getQuantity), getDiscountPercent: Number(form.getDiscountPercent), startAt: form.startAt ? new Date(form.startAt).toISOString() : null, endAt: form.endAt ? new Date(form.endAt).toISOString() : null };
      const response = await fetch(editing ? `/api/offers/${editing.id}` : '/api/offers', { method: editing ? 'PUT' : 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || 'Could not save this offer.');
      setFormOpen(false); setEditing(null); setForm(emptyForm); await load();
    } catch (e: any) { setError(e.message || 'Could not save this offer.'); }
    finally { setSaving(false); }
  };
  const remove = async (offer: Offer) => {
    if (!window.confirm(`Delete “${offer.name}”?`)) return;
    const response = await fetch(`/api/offers/${offer.id}`, { method: 'DELETE' });
    const result = await response.json();
    if (!response.ok) { setError(result.error || 'Could not delete this offer.'); return; }
    await load();
  };
  const toggleTarget = (key: string, id: string) => {
    const selected = form[key as keyof typeof form] as string[];
    change(key, selected.includes(id) ? selected.filter((item) => item !== id) : [...selected, id]);
  };
  const toggleProduct = (productId: string) => {
    const selected = form.productIds.includes(productId);
    const relatedVariantIds = (collections.variantIds || []).filter((variant) => variant.productId === productId).map((variant) => variant.id);
    setForm((current) => ({
      ...current,
      productIds: selected ? current.productIds.filter((id) => id !== productId) : [...current.productIds, productId],
      variantIds: selected ? current.variantIds.filter((id) => !relatedVariantIds.includes(id)) : current.variantIds,
    }));
  };
  const matchingProducts = (collections.productIds || []).filter((product) => `${product.name || ''} ${product.sku || ''}`.toLowerCase().includes(productSearch.trim().toLowerCase()));
  const field = 'w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900';

  return <section className="space-y-6 text-gray-900">
    <div className="flex flex-wrap items-center justify-between gap-3">
      <div><h2 className="text-2xl font-bold">Offers &amp; coupons</h2><p className="text-sm text-gray-500">Create scheduled discounts for products, variants, packages, or categories.</p></div>
      <div className="flex gap-2"><button type="button" onClick={() => void load()} className="rounded-lg border border-gray-300 p-2.5" aria-label="Refresh"><RefreshCw className="h-4 w-4" /></button><button type="button" onClick={formOpen ? () => setFormOpen(false) : startNew} className="flex items-center gap-2 rounded-lg bg-rose-600 px-4 py-2.5 text-sm font-semibold text-white">{formOpen ? <X className="h-4 w-4" /> : <Plus className="h-4 w-4" />}{formOpen ? 'Close' : 'Add offer'}</button></div>
    </div>
    {error && <p role="alert" className="rounded-lg bg-red-50 p-3 text-sm text-red-700">{error}</p>}
    {formOpen && <form onSubmit={submit} className="space-y-5 rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
      <h3 className="text-lg font-bold">{editing ? 'Edit offer' : 'New offer'}</h3>
      <div className="grid gap-4 md:grid-cols-2">
        <label className="space-y-1 text-sm font-medium">Offer name<input className={field} required value={form.name} onChange={(e) => change('name', e.target.value)} /></label>
        <label className="space-y-1 text-sm font-medium">Offer type<select className={field} value={form.type} onChange={(e) => change('type', e.target.value)}>{TYPES.map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select></label>
        {form.type === 'coupon' && <label className="space-y-1 text-sm font-medium">Coupon discount type<select className={field} value={form.couponDiscountType} onChange={(e) => change('couponDiscountType', e.target.value)}><option value="percentage">Percentage</option><option value="fixed">Fixed amount</option></select></label>}
        {form.type !== 'buy_x_get_y' && <label className="space-y-1 text-sm font-medium">{form.type === 'percentage' || (form.type === 'coupon' && form.couponDiscountType === 'percentage') ? 'Discount percent' : 'Discount amount'}<input className={field} required type="number" min="0.01" step="0.01" max={form.type === 'percentage' || (form.type === 'coupon' && form.couponDiscountType === 'percentage') ? 100 : undefined} value={form.value} onChange={(e) => change('value', e.target.value)} /></label>}
        {form.type === 'coupon' && <label className="space-y-1 text-sm font-medium">Coupon code<input className={field} required value={form.couponCode} onChange={(e) => change('couponCode', e.target.value.toUpperCase())} /></label>}
        {form.type === 'buy_x_get_y' && <div className="grid grid-cols-3 gap-3 md:col-span-2"><label className="space-y-1 text-sm font-medium">Buy quantity<input className={field} type="number" min="1" required value={form.buyQuantity} onChange={(e) => change('buyQuantity', e.target.value)} /></label><label className="space-y-1 text-sm font-medium">Get quantity<input className={field} type="number" min="1" required value={form.getQuantity} onChange={(e) => change('getQuantity', e.target.value)} /></label><label className="space-y-1 text-sm font-medium">Get discount %<input className={field} type="number" min="0" max="100" required value={form.getDiscountPercent} onChange={(e) => change('getDiscountPercent', e.target.value)} /></label></div>}
        <label className="space-y-1 text-sm font-medium">Minimum order amount (optional)<input className={field} type="number" min="0" step="0.01" value={form.minimumOrderAmount} onChange={(e) => change('minimumOrderAmount', e.target.value)} /></label>
        <label className="space-y-1 text-sm font-medium">Maximum discount (optional)<input className={field} type="number" min="0" step="0.01" value={form.maximumDiscountAmount} onChange={(e) => change('maximumDiscountAmount', e.target.value)} /></label>
        <label className="space-y-1 text-sm font-medium">Starts at (optional)<input className={field} type="datetime-local" value={form.startAt} onChange={(e) => change('startAt', e.target.value)} /></label>
        <label className="space-y-1 text-sm font-medium">Deadline (optional)<input className={field} type="datetime-local" value={form.endAt} onChange={(e) => change('endAt', e.target.value)} /></label>
        <label className="space-y-1 text-sm font-medium md:col-span-2">Description<textarea className={field} rows={2} value={form.description} onChange={(e) => change('description', e.target.value)} /></label>
      </div>
      <div className="space-y-4">
        <p className="text-sm text-gray-600">An empty target list adds no items. If every target list is empty, the offer applies storewide. Choose a product to target the product itself; its variants will appear underneath, and only variants you check are targeted.</p>
        <fieldset className="rounded-lg border border-gray-200 p-3">
          <legend className="px-1 text-sm font-semibold">Target products and their variants</legend>
          <div className="relative mb-3"><Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400"/><input className={`${field} pl-9`} type="search" value={productSearch} onChange={(event) => setProductSearch(event.target.value)} placeholder="Search product name or SKU" aria-label="Search products by name or SKU"/></div>
          <div className="max-h-64 space-y-2 overflow-auto">
            {matchingProducts.map((product) => {
              const selected = form.productIds.includes(product.id);
              const variants = (collections.variantIds || []).filter((variant) => variant.productId === product.id);
              const showVariants = selected || variants.some((variant) => form.variantIds.includes(variant.id));
              return <div key={product.id} className="rounded-lg border border-gray-100 p-2.5">
                <label className="flex cursor-pointer items-center gap-2 text-sm font-medium"><input type="checkbox" checked={selected} onChange={() => toggleProduct(product.id)}/><span>{product.name}</span><span className="font-mono text-xs text-gray-500">{product.sku}</span></label>
                {showVariants && <div className="ml-6 mt-2 border-l-2 border-gray-200 pl-3"><p className="mb-1 text-xs font-semibold uppercase tracking-wide text-gray-500">Variants (optional)</p>{variants.length ? <div className="space-y-1">{variants.map((variant) => <label key={variant.id} className="flex cursor-pointer items-center gap-2 text-sm"><input type="checkbox" checked={form.variantIds.includes(variant.id)} onChange={() => toggleTarget('variantIds', variant.id)}/><span>{variant.sku}</span>{variant.metadata && Object.values(variant.metadata).length > 0 && <span className="text-xs text-gray-500">{Object.values(variant.metadata).map(String).join(' · ')}</span>}</label>)}</div> : <p className="text-xs text-gray-500">This product has no variants.</p>}</div>}
              </div>;
            })}
            {!matchingProducts.length && <p className="py-3 text-sm text-gray-500">No products match that name or SKU.</p>}
          </div>
        </fieldset>
        <div className="grid gap-4 md:grid-cols-2">{GROUPS.map(([key, label]) => <fieldset key={key} className="rounded-lg border border-gray-200 p-3"><legend className="px-1 text-sm font-semibold">Target {label.toLowerCase()} <span className="font-normal text-gray-500">(optional)</span></legend><div className="max-h-36 space-y-1 overflow-auto">{(collections[key] || []).map((item) => <label key={item.id} className="flex items-center gap-2 text-sm"><input type="checkbox" checked={(form[key] as string[]).includes(item.id)} onChange={() => toggleTarget(key, item.id)} />{item.name || item.sku}</label>)}{!(collections[key] || []).length && <p className="text-xs text-gray-500">No {label.toLowerCase()} available.</p>}</div></fieldset>)}</div>
      </div>
      <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={form.isActive} onChange={(e) => change('isActive', e.target.checked)} />Offer is active</label>
      <div className="flex justify-end gap-2"><button type="button" onClick={() => setFormOpen(false)} className="rounded-lg border border-gray-300 px-4 py-2 text-sm">Cancel</button><button disabled={saving} className="rounded-lg bg-rose-600 px-4 py-2 text-sm font-semibold text-white disabled:opacity-50">{saving ? 'Saving…' : editing ? 'Save changes' : 'Create offer'}</button></div>
    </form>}
    <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white"><table className="w-full min-w-[720px] text-left text-sm"><thead className="bg-gray-50 text-xs uppercase text-gray-500"><tr><th className="p-4">Offer</th><th className="p-4">Type</th><th className="p-4">Schedule</th><th className="p-4">Status</th><th className="p-4 text-right">Actions</th></tr></thead><tbody className="divide-y divide-gray-100">{offers.map((offer) => <tr key={offer.id}><td className="p-4"><div className="font-semibold">{offer.name}</div>{offer.couponCode && <div className="text-xs text-rose-700">Code: {offer.couponCode}</div>}</td><td className="p-4 capitalize">{String(offer.type).replaceAll('_', ' ')}{offer.value != null ? ` · ${offer.type === 'percentage' ? `${offer.value}%` : offer.value}` : ''}</td><td className="p-4 text-xs text-gray-600">{offer.startAt ? new Date(offer.startAt).toLocaleString() : 'Any start'}<br />Until {offer.endAt ? new Date(offer.endAt).toLocaleString() : 'no deadline'}</td><td className="p-4"><span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${offer.isActive ? 'bg-emerald-50 text-emerald-700' : 'bg-gray-100 text-gray-600'}`}>{offer.isActive ? 'Active' : 'Inactive'}</span></td><td className="space-x-1 p-4 text-right"><button type="button" onClick={() => startEdit(offer)} className="rounded-lg p-2 text-blue-700 hover:bg-blue-50" aria-label={`Edit ${offer.name}`}><Edit3 className="h-4 w-4" /></button><button type="button" onClick={() => void remove(offer)} className="rounded-lg p-2 text-red-700 hover:bg-red-50" aria-label={`Delete ${offer.name}`}><Trash2 className="h-4 w-4" /></button></td></tr>)}{!offers.length && <tr><td colSpan={5} className="p-8 text-center text-gray-500">{loading ? 'Loading offers…' : 'No offers yet.'}</td></tr>}</tbody></table></div>
  </section>;
}
