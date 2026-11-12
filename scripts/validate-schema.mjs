/**
 * Automated structured-data (JSON-LD) validation for all indexable routes.
 *
 * Usage:
 *   node scripts/validate-schema.mjs
 *   node scripts/validate-schema.mjs --json
 *   node scripts/validate-schema.mjs --strict   # warnings also fail the run
 *
 * Exit codes:
 *   0  all checks passed
 *   1  one or more errors (or warnings in --strict mode)
 *   2  validator itself failed to load SEO data
 *
 * Checks cover Schema.org shape + Google Software-App field expectations
 * (without requiring fabricated aggregateRating). FAQ/HowTo are validated
 * as valid markup even though Google no longer shows those rich results.
 */

import { getToolSeo, getHomeJsonLd, getRouteSeo, getIndexableRoutes } from '../src/data/seo.js';
import { TOOLS } from '../src/data/tools.js';

const args = new Set(process.argv.slice(2));
const asJson = args.has('--json');
const strict = args.has('--strict');

/** @typedef {{ path: string, sev: 'error'|'warn', msg: string, type?: string }} Issue */

/** @type {Issue[]} */
const issues = [];

function issue(path, sev, msg, type) {
  issues.push({ path, sev, msg, ...(type ? { type } : {}) });
}

function typesOf(node) {
  if (!node || node['@type'] == null) return [];
  return Array.isArray(node['@type']) ? node['@type'] : [node['@type']];
}

function hasType(node, type) {
  return typesOf(node).includes(type);
}

/**
 * Validate a single JSON-LD graph (or single node).
 * @param {string} path
 * @param {object|null|undefined} jsonLd
 */
function validateJsonLd(path, jsonLd) {
  if (!jsonLd) {
    issue(path, 'error', 'Missing jsonLd');
    return;
  }
  if (jsonLd['@context'] !== 'https://schema.org') {
    issue(path, 'warn', `Unexpected @context: ${jsonLd['@context']}`);
  }

  const graph = Array.isArray(jsonLd['@graph'])
    ? jsonLd['@graph']
    : [jsonLd];

  if (!graph.length) {
    issue(path, 'error', 'Empty @graph');
    return;
  }

  // Must be serializable
  try {
    JSON.stringify(jsonLd);
  } catch (e) {
    issue(path, 'error', `JSON-LD not serializable: ${e.message}`);
    return;
  }

  let sawWebPage = false;
  let sawApp = false;
  let sawBreadcrumb = false;

  for (const node of graph) {
    const types = typesOf(node);
    if (!types.length) {
      issue(path, 'error', 'Node missing @type');
      continue;
    }

    // ---- BreadcrumbList ----
    if (hasType(node, 'BreadcrumbList')) {
      sawBreadcrumb = true;
      const items = node.itemListElement;
      if (!Array.isArray(items) || items.length < 1) {
        issue(path, 'error', 'BreadcrumbList has no itemListElement', 'BreadcrumbList');
      } else {
        items.forEach((it, i) => {
          if (it['@type'] && it['@type'] !== 'ListItem') {
            issue(path, 'warn', `Breadcrumb item ${i} @type is ${it['@type']}`, 'BreadcrumbList');
          }
          if (!it.name) issue(path, 'error', `Breadcrumb item ${i} missing name`, 'BreadcrumbList');
          if (!it.item) issue(path, 'error', `Breadcrumb item ${i} missing item URL`, 'BreadcrumbList');
          if (it.position != null && it.position !== i + 1) {
            issue(path, 'warn', `Breadcrumb item ${i} position=${it.position}, expected ${i + 1}`, 'BreadcrumbList');
          }
        });
      }
    }

    // ---- WebPage ----
    if (hasType(node, 'WebPage')) {
      sawWebPage = true;
      for (const k of ['url', 'name']) {
        if (!node[k]) issue(path, 'error', `WebPage missing ${k}`, 'WebPage');
      }
      if (!node.description) issue(path, 'warn', 'WebPage missing description', 'WebPage');
    }

    // ---- WebApplication / SoftwareApplication ----
    if (hasType(node, 'WebApplication') || hasType(node, 'SoftwareApplication')) {
      sawApp = true;
      for (const k of ['name', 'url']) {
        if (!node[k]) issue(path, 'error', `WebApplication missing ${k}`, 'WebApplication');
      }
      if (!node.applicationCategory) {
        issue(path, 'warn', 'WebApplication missing applicationCategory', 'WebApplication');
      } else if (node.applicationCategory === 'DeveloperApplication') {
        // expected
      } else {
        issue(path, 'warn', `applicationCategory is "${node.applicationCategory}" (expected DeveloperApplication for tools)`, 'WebApplication');
      }
      if (!node.operatingSystem) {
        issue(path, 'warn', 'WebApplication missing operatingSystem', 'WebApplication');
      }
      if (!node.offers) {
        issue(path, 'error', 'WebApplication missing offers (required for Software App eligibility)', 'WebApplication');
      } else {
        if (node.offers['@type'] && node.offers['@type'] !== 'Offer') {
          issue(path, 'warn', `offers @type is ${node.offers['@type']}`, 'WebApplication');
        }
        if (node.offers.price === undefined || node.offers.price === null || node.offers.price === '') {
          issue(path, 'error', 'offers.price missing', 'WebApplication');
        } else if (String(node.offers.price) !== '0' && Number(node.offers.price) !== 0) {
          issue(path, 'warn', `offers.price is ${node.offers.price} (free tools should use 0)`, 'WebApplication');
        }
        if (!node.offers.priceCurrency) {
          issue(path, 'warn', 'offers.priceCurrency missing', 'WebApplication');
        }
      }
      // Do not require aggregateRating — fabricating ratings violates Google policy
      if (node.aggregateRating) {
        const ar = node.aggregateRating;
        if (!ar.ratingValue || !ar.ratingCount && !ar.reviewCount) {
          issue(path, 'error', 'aggregateRating present but incomplete', 'WebApplication');
        }
      }
      if (node.featureList != null) {
        const ok =
          typeof node.featureList === 'string' ||
          (Array.isArray(node.featureList) && node.featureList.every((x) => typeof x === 'string'));
        if (!ok) issue(path, 'error', 'featureList must be string or string[]', 'WebApplication');
      }
    }

    // ---- FAQPage ----
    if (hasType(node, 'FAQPage')) {
      const main = node.mainEntity;
      if (!Array.isArray(main) || !main.length) {
        issue(path, 'error', 'FAQPage mainEntity empty', 'FAQPage');
      } else {
        const seen = new Set();
        main.forEach((q, i) => {
          if (q['@type'] !== 'Question') {
            issue(path, 'error', `FAQ[${i}] @type is not Question`, 'FAQPage');
          }
          if (!q.name || !String(q.name).trim()) {
            issue(path, 'error', `FAQ[${i}] missing name`, 'FAQPage');
          } else {
            const key = String(q.name).toLowerCase().trim();
            if (seen.has(key)) {
              issue(path, 'error', `Duplicate FAQ question: "${q.name}"`, 'FAQPage');
            }
            seen.add(key);
          }
          const ans = q.acceptedAnswer;
          if (!ans || !ans.text || !String(ans.text).trim()) {
            issue(path, 'error', `FAQ[${i}] missing acceptedAnswer.text`, 'FAQPage');
          } else if (ans['@type'] && ans['@type'] !== 'Answer') {
            issue(path, 'warn', `FAQ[${i}] answer @type is ${ans['@type']}`, 'FAQPage');
          }
        });
      }
    }

    // ---- HowTo ----
    if (hasType(node, 'HowTo')) {
      if (!node.name) issue(path, 'warn', 'HowTo missing name', 'HowTo');
      const steps = node.step;
      if (!Array.isArray(steps) || steps.length < 2) {
        issue(path, 'warn', `HowTo has ${steps?.length ?? 0} steps (prefer 2+)`, 'HowTo');
      } else {
        steps.forEach((s, i) => {
          if (!s.text && !s.name) {
            issue(path, 'error', `HowTo step ${i} missing text/name`, 'HowTo');
          }
          if (s['@type'] && s['@type'] !== 'HowToStep') {
            issue(path, 'warn', `HowTo step ${i} @type is ${s['@type']}`, 'HowTo');
          }
        });
      }
    }
  }

  // Route-level expectations for tool pages
  if (path.startsWith('/') && path !== '/' && TOOLS.some((t) => t.path === path)) {
    if (!sawApp) issue(path, 'error', 'Tool page missing WebApplication node');
    if (!sawWebPage) issue(path, 'warn', 'Tool page missing WebPage node');
    if (!sawBreadcrumb) issue(path, 'warn', 'Tool page missing BreadcrumbList');
  }
}

// --------------- Run ---------------

try {
  // Home
  validateJsonLd('/', getHomeJsonLd());

  // Every tool
  for (const tool of TOOLS) {
    const seo = getToolSeo(tool.path);
    validateJsonLd(tool.path, seo.jsonLd);
  }

  // Other indexable routes that expose jsonLd via getRouteSeo
  for (const route of getIndexableRoutes()) {
    if (route === '/' || TOOLS.some((t) => t.path === route)) continue;
    try {
      const seo = getRouteSeo(route);
      if (seo?.jsonLd) validateJsonLd(route, seo.jsonLd);
    } catch (e) {
      issue(route, 'warn', `getRouteSeo failed: ${e.message}`);
    }
  }
} catch (e) {
  console.error('validate-schema: failed to load SEO data\n', e);
  process.exit(2);
}

const errors = issues.filter((i) => i.sev === 'error');
const warns = issues.filter((i) => i.sev === 'warn');
const failed = errors.length > 0 || (strict && warns.length > 0);

const summary = {
  ok: !failed,
  tools: TOOLS.length,
  errors: errors.length,
  warnings: warns.length,
  strict,
};

if (asJson) {
  console.log(JSON.stringify({ summary, issues }, null, 2));
} else {
  console.log(`Schema validation: ${TOOLS.length} tools + home/routes`);
  console.log(`  errors:   ${errors.length}`);
  console.log(`  warnings: ${warns.length}`);
  if (errors.length) {
    console.log('\nErrors:');
    for (const i of errors) {
      console.log(`  [error] ${i.path}${i.type ? ` (${i.type})` : ''}: ${i.msg}`);
    }
  }
  if (warns.length) {
    console.log('\nWarnings:');
    for (const i of warns) {
      console.log(`  [warn]  ${i.path}${i.type ? ` (${i.type})` : ''}: ${i.msg}`);
    }
  }
  if (!failed) {
    console.log(strict ? '\nAll checks passed (strict).' : '\nAll checks passed.');
  } else {
    console.log('\nValidation failed.');
  }
}

process.exit(failed ? 1 : 0);
