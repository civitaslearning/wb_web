/**
 * HubSpot forms, as embedded on www.civitaslearning.com (checked 2026-09-10).
 * One portal, one region. Each form keeps the Salesforce campaign the live
 * site sends with it. The loader in `hubspot-embed.ts` renders any element
 * that carries `data-hs-form`; `HubSpotForm.astro` writes that element.
 */
export const PORTAL_ID = '47005231';
export const REGION = 'na1';

export interface HsForm {
  formId: string;
  /** Salesforce campaign attribution (sfdcCampaignId). */
  campaign?: string;
}

export const FORMS = {
  /** /contact/ — the sales form. Every "Book a demo" button lands here. */
  contact: { formId: 'a9cb8985-5804-449e-ada6-7e654cd3714c', campaign: '7010z000000mb8iAAA' },
  /** /subscribe/ — Signals newsletter. */
  subscribe: { formId: '13901ac7-1d3b-4988-851e-0b9832526171' },
  /** Impact Report download pages (2023, 2024). */
  impactReportDownload: { formId: 'f6ef0318-062a-412c-837a-17f7b95c01f7', campaign: '701Uo00000KWVGUIA5' },
  /** 2024 Impact Report webinar recording. */
  webinar2024: { formId: 'eddb235c-7130-4893-a6da-69d72c6f61e0', campaign: '701Uo0000097G2tIAE' },
  /** Impact Report self-assessment gate (2026). Five hidden fields; see src/scripts/impact-report-assessment.js. */
  assessment2026: { formId: 'd19a3e8e-7683-43c8-b144-8a8f9696556b', campaign: '701Uo00000KWVGUIA5' },
} as const satisfies Record<string, HsForm>;

export type FormName = keyof typeof FORMS;
