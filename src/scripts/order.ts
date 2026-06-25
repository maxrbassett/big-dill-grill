/**
 * Client-side pickup-ordering cart + checkout (POC / demo).
 *
 * This is intentionally backend-free: the cart lives in localStorage and
 * "placing" an order just renders an on-screen confirmation with a generated
 * order number. NOTHING is sent anywhere and NO payment is taken — it exists to
 * show the owners how online pickup ordering would feel. In the live product
 * this would post to a real order system (or a service like Square/Toast).
 * See site.ts `ordering` + README.
 */
import { ordering } from '../data/site';

export interface CartLine {
  id: string;
  name: string;
  price: number; // unit price, USD
  qty: number;
}

const STORAGE_KEY = 'bdg:cart';
const CHANGED_EVENT = 'bdg:cart-changed';

// --- Store ---------------------------------------------------------------------
export function getCart(): CartLine[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(
      (l): l is CartLine =>
        l && typeof l.id === 'string' && typeof l.price === 'number' && typeof l.qty === 'number',
    );
  } catch {
    return [];
  }
}

function saveCart(lines: CartLine[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(lines));
  window.dispatchEvent(new CustomEvent(CHANGED_EVENT));
}

export function addItem(item: { id: string; name: string; price: number }, qty = 1) {
  const lines = getCart();
  const existing = lines.find((l) => l.id === item.id);
  if (existing) existing.qty += qty;
  else lines.push({ ...item, qty });
  saveCart(lines);
}

export function setQty(id: string, qty: number) {
  let lines = getCart();
  if (qty <= 0) lines = lines.filter((l) => l.id !== id);
  else lines = lines.map((l) => (l.id === id ? { ...l, qty } : l));
  saveCart(lines);
}

export function removeItem(id: string) {
  saveCart(getCart().filter((l) => l.id !== id));
}

export function clearCart() {
  saveCart([]);
}

export function cartCount(): number {
  return getCart().reduce((n, l) => n + l.qty, 0);
}

export function cartSubtotal(): number {
  return getCart().reduce((n, l) => n + l.price * l.qty, 0);
}

// --- Formatting / time ---------------------------------------------------------
export function money(n: number): string {
  return `$${n.toFixed(2)}`;
}

function fmtTime(totalMinutes: number): string {
  const m = ((totalMinutes % 1440) + 1440) % 1440;
  let h = Math.floor(m / 60);
  const min = m % 60;
  const ampm = h >= 12 ? 'PM' : 'AM';
  h = h % 12 || 12;
  return `${h}:${String(min).padStart(2, '0')} ${ampm}`;
}

/** Build pickup-time <option>s: ASAP plus today's remaining 15-min slots. */
function buildPickupOptions(): { value: string; label: string; etaMinutes: number }[] {
  const now = new Date();
  const nowMin = now.getHours() * 60 + now.getMinutes();
  const opts: { value: string; label: string; etaMinutes: number }[] = [];

  const asapEta = nowMin + ordering.prepMinutes;
  const openNow = nowMin >= ordering.openMinutes && asapEta <= ordering.closeMinutes;
  opts.push({
    value: 'asap',
    label: openNow
      ? `As soon as possible (~${ordering.prepMinutes} min, around ${fmtTime(asapEta)})`
      : `As soon as we’re open (~${ordering.prepMinutes} min after opening)`,
    etaMinutes: openNow ? asapEta : ordering.openMinutes + ordering.prepMinutes,
  });

  // Today's scheduled slots, rounded up to the next 15 minutes.
  let start = Math.max(ordering.openMinutes, Math.ceil(asapEta / 15) * 15);
  for (let t = start; t <= ordering.closeMinutes; t += 15) {
    opts.push({ value: String(t), label: `Today at ${fmtTime(t)}`, etaMinutes: t });
  }
  return opts;
}

function generateOrderNumber(): string {
  const n = 1000 + Math.floor(Math.random() * 9000);
  return `BDG-${n}`;
}

// --- DOM wiring ----------------------------------------------------------------
type Panel = 'cart' | 'details' | 'review' | 'done';

const PANEL_TITLES: Record<Panel, string> = {
  cart: 'Your Order',
  details: 'Pickup Details',
  review: 'Review & Place',
  done: 'Order Confirmed',
};

function init() {
  // Cart-count badges (present on every page via the nav).
  const updateBadges = () => {
    const count = cartCount();
    document.querySelectorAll<HTMLElement>('[data-cart-count]').forEach((el) => {
      el.textContent = String(count);
    });
    document.querySelectorAll<HTMLElement>('[data-cart-badge]').forEach((el) => {
      el.classList.toggle('hidden', count === 0);
    });
  };

  const drawer = document.getElementById('cart-drawer');
  const backdrop = document.getElementById('cart-backdrop');
  const panel = drawer?.querySelector<HTMLElement>('[data-panel-host]') ?? null;
  let lastFocused: HTMLElement | null = null;

  // Wire "Add to order" buttons (on the /order page).
  document.querySelectorAll<HTMLElement>('[data-add-item]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const id = btn.dataset.id;
      const name = btn.dataset.name;
      const price = Number(btn.dataset.price);
      if (!id || !name || Number.isNaN(price)) return;
      addItem({ id, name, price });
      flashButton(btn);
      openDrawer();
    });
  });

  function flashButton(btn: HTMLElement) {
    const original = btn.getAttribute('data-label-default') ?? btn.textContent ?? 'Add';
    btn.textContent = 'Added ✓';
    btn.classList.add('is-added');
    window.setTimeout(() => {
      btn.textContent = original;
      btn.classList.remove('is-added');
    }, 1000);
  }

  // --- Drawer open/close ---
  function openDrawer() {
    if (!drawer) return;
    lastFocused = document.activeElement as HTMLElement;
    showPanel('cart');
    drawer.classList.remove('translate-x-full');
    drawer.setAttribute('aria-hidden', 'false');
    backdrop?.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
    drawer.querySelector<HTMLElement>('[data-cart-close]')?.focus();
  }
  function closeDrawer() {
    if (!drawer) return;
    drawer.classList.add('translate-x-full');
    drawer.setAttribute('aria-hidden', 'true');
    backdrop?.classList.add('hidden');
    document.body.style.overflow = '';
    lastFocused?.focus();
  }

  document.querySelectorAll<HTMLElement>('[data-cart-open]').forEach((el) =>
    el.addEventListener('click', (e) => {
      e.preventDefault();
      openDrawer();
    }),
  );
  document.addEventListener('click', (e) => {
    if ((e.target as HTMLElement)?.closest('[data-cart-close]')) closeDrawer();
  });
  backdrop?.addEventListener('click', closeDrawer);
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && drawer && !drawer.classList.contains('translate-x-full')) closeDrawer();
  });

  // --- Panels ---
  function showPanel(p: Panel) {
    if (!drawer) return;
    drawer.querySelectorAll<HTMLElement>('[data-panel]').forEach((el) => {
      el.classList.toggle('hidden', el.dataset.panel !== p);
    });
    const title = drawer.querySelector('[data-cart-title]');
    if (title) title.textContent = PANEL_TITLES[p];
    // The sticky subtotal/checkout footer belongs to the cart panel only.
    if (p !== 'cart') document.getElementById('cart-footer')?.classList.add('hidden');
    if (p === 'cart') renderCart();
    if (p === 'review') renderReview();
    panel?.scrollTo({ top: 0 });
  }

  // --- Render cart panel ---
  function renderCart() {
    const list = document.getElementById('cart-lines');
    const empty = document.getElementById('cart-empty');
    const footer = document.getElementById('cart-footer');
    const subtotalEl = document.getElementById('cart-subtotal');
    if (!list) return;
    const lines = getCart();
    list.innerHTML = '';

    if (lines.length === 0) {
      empty?.classList.remove('hidden');
      footer?.classList.add('hidden');
      return;
    }
    empty?.classList.add('hidden');
    footer?.classList.remove('hidden');

    for (const line of lines) {
      const row = document.createElement('div');
      row.className = 'flex items-start gap-3 py-3';
      row.innerHTML = `
        <div class="min-w-0 flex-1">
          <p class="font-semibold text-ink">${escapeHtml(line.name)}</p>
          <p class="text-sm text-ink-soft">${money(line.price)} each</p>
          <div class="mt-2 inline-flex items-center rounded-full border border-line">
            <button type="button" class="grid h-8 w-8 place-items-center rounded-full text-pickle-700 hover:bg-cream-deep" data-dec aria-label="Decrease quantity of ${escapeHtml(line.name)}">−</button>
            <span class="min-w-[2ch] text-center text-sm font-bold" data-qty>${line.qty}</span>
            <button type="button" class="grid h-8 w-8 place-items-center rounded-full text-pickle-700 hover:bg-cream-deep" data-inc aria-label="Increase quantity of ${escapeHtml(line.name)}">+</button>
          </div>
        </div>
        <div class="text-right">
          <p class="font-bold text-pickle-700">${money(line.price * line.qty)}</p>
          <button type="button" class="mt-2 text-xs font-semibold text-barn-600 underline-offset-2 hover:underline" data-remove>Remove</button>
        </div>`;
      row.querySelector('[data-inc]')?.addEventListener('click', () => setQty(line.id, line.qty + 1));
      row.querySelector('[data-dec]')?.addEventListener('click', () => setQty(line.id, line.qty - 1));
      row.querySelector('[data-remove]')?.addEventListener('click', () => removeItem(line.id));
      list.appendChild(row);
    }
    if (subtotalEl) subtotalEl.textContent = money(cartSubtotal());
  }

  // --- Pickup details: populate time options ---
  const pickupSelect = document.getElementById('pickup-time') as HTMLSelectElement | null;
  function populatePickup() {
    if (!pickupSelect) return;
    pickupSelect.innerHTML = '';
    for (const opt of buildPickupOptions()) {
      const o = document.createElement('option');
      o.value = opt.value;
      o.textContent = opt.label;
      o.dataset.eta = String(opt.etaMinutes);
      pickupSelect.appendChild(o);
    }
  }

  // --- Render review panel ---
  function renderReview() {
    const host = document.getElementById('review-items');
    const totalEl = document.getElementById('review-total');
    const pickupEl = document.getElementById('review-pickup');
    if (host) {
      host.innerHTML = '';
      for (const line of getCart()) {
        const row = document.createElement('div');
        row.className = 'flex justify-between gap-3 py-1.5 text-sm';
        row.innerHTML = `<span class="text-ink-soft">${line.qty} × ${escapeHtml(line.name)}</span><span class="font-semibold text-ink">${money(line.price * line.qty)}</span>`;
        host.appendChild(row);
      }
    }
    if (totalEl) totalEl.textContent = money(cartSubtotal());
    if (pickupEl) {
      const name = (document.getElementById('cust-name') as HTMLInputElement | null)?.value || '—';
      const phone = (document.getElementById('cust-phone') as HTMLInputElement | null)?.value || '—';
      const timeLabel = pickupSelect?.selectedOptions[0]?.textContent ?? '—';
      pickupEl.innerHTML = `
        <p><span class="font-semibold text-ink">Name:</span> ${escapeHtml(name)}</p>
        <p><span class="font-semibold text-ink">Phone:</span> ${escapeHtml(phone)}</p>
        <p><span class="font-semibold text-ink">Pickup:</span> ${escapeHtml(timeLabel)}</p>`;
    }
  }

  // --- Step navigation ---
  drawer?.querySelector('[data-go-details]')?.addEventListener('click', () => {
    if (getCart().length === 0) return;
    populatePickup();
    showPanel('details');
  });
  drawer?.querySelector('[data-back-cart]')?.addEventListener('click', () => showPanel('cart'));
  drawer?.querySelector('[data-back-details]')?.addEventListener('click', () => showPanel('details'));

  const detailsForm = document.getElementById('details-form') as HTMLFormElement | null;
  detailsForm?.addEventListener('submit', (e) => {
    e.preventDefault();
    if (!detailsForm.reportValidity()) return;
    showPanel('review');
  });

  // --- Place order (POC) ---
  drawer?.querySelector('[data-place-order]')?.addEventListener('click', () => {
    const orderNo = generateOrderNumber();
    const selected = pickupSelect?.selectedOptions[0];
    const eta = selected ? Number(selected.dataset.eta) : NaN;
    const name = (document.getElementById('cust-name') as HTMLInputElement | null)?.value || 'there';

    const noEl = document.getElementById('done-order-no');
    if (noEl) noEl.textContent = orderNo;
    const greetEl = document.getElementById('done-greeting');
    if (greetEl) greetEl.textContent = `Thanks, ${name}!`;
    const etaEl = document.getElementById('done-eta');
    if (etaEl) etaEl.textContent = Number.isNaN(eta) ? selected?.textContent ?? '' : `Ready around ${fmtTime(eta)}`;
    const totalEl = document.getElementById('done-total');
    if (totalEl) totalEl.textContent = money(cartSubtotal());

    clearCart();
    showPanel('done');
  });

  // --- New order resets back to the (now empty) cart ---
  drawer?.querySelector('[data-new-order]')?.addEventListener('click', () => {
    detailsForm?.reset();
    showPanel('cart');
  });

  // React to cart changes from anywhere (badges + live cart panel).
  window.addEventListener(CHANGED_EVENT, () => {
    updateBadges();
    if (drawer && !drawer.classList.contains('translate-x-full')) {
      const cartPanelVisible = drawer.querySelector<HTMLElement>('[data-panel="cart"]')?.classList.contains('hidden') === false;
      if (cartPanelVisible) renderCart();
    }
  });

  updateBadges();

  // Deep link: /order#cart (or any page) opens the cart drawer on load.
  if (location.hash === '#cart') openDrawer();
}

function escapeHtml(s: string): string {
  return s.replace(/[&<>"']/g, (c) =>
    ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c] as string,
  );
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
