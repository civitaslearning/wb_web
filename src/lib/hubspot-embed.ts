/**
 * Browser side of the HubSpot embed. Runs on every page (imported by Base.astro).
 * It looks for `[data-hs-form]` mounts. When there is at least one, it loads the
 * HubSpot forms script once and creates a form in each mount. Markdown content
 * can place a mount with raw HTML; Astro pages use <HubSpotForm />.
 *
 * If the script does not arrive (ad blocker, strict privacy settings), the
 * mount shows its fallback text after `FAIL_OPEN_MS` so the visitor is not
 * left with "Loading form…".
 */
import { PORTAL_ID, REGION } from './hubspot';

const SCRIPT = 'https://js.hsforms.net/forms/embed/v2.js';
const FAIL_OPEN_MS = 10_000;

declare global {
  interface Window {
    hbspt?: { forms: { create: (opts: Record<string, unknown>) => void } };
  }
}

function fallback(mount: HTMLElement) {
  if (mount.querySelector('form, iframe')) return;
  mount.querySelector('.hs-note')?.remove();
  mount.querySelector<HTMLElement>('.hs-fallback')?.removeAttribute('hidden');
}

function create(mount: HTMLElement, n: number) {
  if (!mount.id) mount.id = `hs-form-${n}`;
  const opts: Record<string, unknown> = {
    region: REGION,
    portalId: PORTAL_ID,
    formId: mount.dataset.hsForm,
    target: `#${mount.id}`,
    onFormReady: () => mount.querySelector('.hs-note')?.remove(),
  };
  if (mount.dataset.hsCampaign) opts.sfdcCampaignId = mount.dataset.hsCampaign;
  window.hbspt!.forms.create(opts);
}

function init() {
  const mounts = Array.from(document.querySelectorAll<HTMLElement>('[data-hs-form]'));
  if (!mounts.length) return;
  const s = document.createElement('script');
  s.src = SCRIPT;
  s.async = true;
  s.onload = () => {
    if (!window.hbspt) return;
    mounts.forEach(create);
  };
  s.onerror = () => mounts.forEach(fallback);
  document.head.appendChild(s);
  setTimeout(() => mounts.forEach(fallback), FAIL_OPEN_MS);
}

if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
else init();
