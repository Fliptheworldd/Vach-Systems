#!/usr/bin/env node
/**
 * Add missing article styles to blog posts
 */

const fs = require('fs').promises;
const path = require('path');

const ARTICLE_STYLES = `
    <style>
        * { hyphens: none !important; -webkit-hyphens: none !important; word-break: normal !important; }
        .article { max-width: 800px; margin: 0 auto; padding: 6rem 2rem 4rem; }
        .article-header { margin-bottom: 3rem; }
        .article-meta { color: var(--gray-600); font-size: 0.875rem; margin-bottom: 1.5rem; }
        .article-title { font-size: 3.5rem; font-weight: 900; line-height: 1.1; margin-bottom: 1.5rem; }
        .article-excerpt { font-size: 1.25rem; color: var(--gray-700); line-height: 1.6; margin-bottom: 2rem; }
        .article-lead { font-size: 1.25rem; color: var(--gray-700); line-height: 1.6; margin-bottom: 2rem; }
        .article-image { width: 100%; height: 400px; object-fit: cover; border-radius: 12px; margin-bottom: 3rem; }
        .article-content { font-size: 1.125rem; line-height: 1.8; color: var(--gray-900); }
        .article-content h2 { font-size: 2rem; font-weight: 800; margin: 3rem 0 1.5rem; line-height: 1.3; }
        .article-content h3 { font-size: 1.5rem; font-weight: 700; margin: 2.5rem 0 1rem; }
        .article-content p { margin-bottom: 1.5rem; }
        .article-content ul, .article-content ol { margin: 1.5rem 0; padding-left: 1.5rem; }
        .article-content li { margin-bottom: 0.75rem; }
        .article-content strong { font-weight: 700; color: var(--gray-900); }
        .highlight-box { background: #f8f9fa; border-left: 4px solid var(--accent); padding: 1.5rem; margin: 2rem 0; border-radius: 8px; }
        .highlight-box p:last-child { margin-bottom: 0; }
        .blog-cta{margin:4rem 0;padding:3rem;background:linear-gradient(135deg,#000 0%,#1F2937 100%);border-radius:16px;text-align:center;color:#fff}.blog-cta h3{font-size:2rem;font-weight:800;margin-bottom:1rem;color:#fff}.blog-cta>p{font-size:1.125rem;margin-bottom:2rem;color:#fff!important;opacity:.95}.blog-cta a{display:inline-block;padding:1rem 2.5rem;background:#fff;color:var(--black);text-decoration:none;border-radius:8px;font-weight:700;margin-bottom:1rem}.blog-cta .email-alt{font-size:.9rem;color:rgba(255,255,255,.9)!important;margin:0;opacity:1!important}.blog-cta .email-alt a{display:inline;padding:0;background:0 0;color:#fff!important;text-decoration:underline;font-size:.9rem;margin:0}
        .stats-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 2rem; margin: 2rem 0; }
        .stat-box { text-align: center; padding: 2rem; background: #fff; border-radius: 12px; box-shadow: 0 2px 8px rgba(0,0,0,0.08); }
        .stat-number { font-size: 3rem; font-weight: 900; color: var(--accent); margin-bottom: 0.5rem; }
        .stat-label { font-size: 0.875rem; color: var(--gray-600); text-transform: uppercase; letter-spacing: 0.05em; }
        .back-link { display: inline-block; margin-bottom: 2rem; color: var(--accent); font-weight: 600; text-decoration: none; }
        .back-link:hover { text-decoration: underline; }
        .blog-article { max-width: 800px; margin: 0 auto; padding: 6rem 2rem 4rem; }
        .blog-article .article-header { margin-bottom: 3rem; }
        .blog-article .article-meta { color: var(--gray-600); font-size: 0.875rem; margin-bottom: 1.5rem; display: flex; gap: 1rem; }
        .blog-article h1 { font-size: 3.5rem; font-weight: 900; line-height: 1.1; margin-bottom: 1.5rem; }
        .blog-article .article-content { font-size: 1.125rem; line-height: 1.8; color: var(--gray-900); }
        .blog-article .article-content h2 { font-size: 2rem; font-weight: 800; margin: 3rem 0 1.5rem; line-height: 1.3; }
        .blog-article .article-content h3 { font-size: 1.5rem; font-weight: 700; margin: 2.5rem 0 1rem; }
        .blog-article .article-content ul, .blog-article .article-content ol { margin: 1.5rem 0; padding-left: 1.5rem; }
        .blog-article .article-content li { margin-bottom: 0.75rem; }
        @media (max-width: 768px) {
            .article { padding: 4rem 1.5rem 3rem; }
            .article-title { font-size: 2.25rem; }
            h1 { font-size: 2.25rem; }
            .article-image { height: 250px; }
            .article-content { font-size: 1rem; }
            .article-content h2 { font-size: 1.75rem; }
            .stats-grid { grid-template-columns: 1fr; gap: 1rem; }
        }
    </style>`;

const articlesWithoutStyles = [
    '30-prozent-netzwerk-automatisierung-ai-mittelstand.html',
    '500-llm-modelle-richtiges-fuer-unternehmen-waehlen.html',
    'agentic-ai-mittelstand-von-theorie-zur-praxis.html',
    'agentic-automation-guardrails-mittelstand-sicher.html',
    'ai-agents-4000-steps-komplexitaet-problem.html',
    'ai-first-vs-ai-ready-unternehmen-2026.html',
    'ai-pragmatismus-2026-hype-zu-produktivitaet.html',
    'ai-vendor-lock-in-vermeiden-open-source-vs-proprietary.html',
    'claude-opus-5-launch-enterprise-kunden.html',
    'claude-opus-5-vs-gpt-5-5-enterprise-vergleich.html',
    'deepseek-v4-moonshot-kimi-chinesische-ki-modelle.html',
    'enterprise-ai-stack-2026-richtige-architektur.html',
    'gemini-3-1-pro-reasoning-wichtiger-als-geschwindigkeit.html',
    'gpt-5-5-native-computer-use-unternehmen.html',
    'hybrid-ai-systems-lokal-cloud-zukunft.html',
    'llm-kosten-2026-kleinere-modelle-besser.html',
    'multi-agent-systems-ki-teams-komplexe-aufgaben.html',
    'roi-rechnung-ai-agents-investition-lohnt-sich.html',
    'small-language-models-slm-fine-tuning-unternehmen.html',
    'von-copilot-zu-agent-paradigmenwechsel-automatisierung.html'
];

async function fixArticle(filename) {
    const filepath = path.join(__dirname, 'blog', filename);
    let html = await fs.readFile(filepath, 'utf-8');
    
    // Insert styles after the stylesheet link
    html = html.replace(
        /<link rel="stylesheet" href="\.\.\/css\/style\.min\.css">/,
        `<link rel="stylesheet" href="../css/style.min.css">${ARTICLE_STYLES}`
    );
    
    await fs.writeFile(filepath, html, 'utf-8');
    console.log(`✓ ${filename}`);
}

async function main() {
    console.log('🔧 Adding missing styles to 20 blog articles...\n');
    
    for (const filename of articlesWithoutStyles) {
        await fixArticle(filename);
    }
    
    console.log(`\n✅ Done! All ${articlesWithoutStyles.length} articles fixed.\n`);
}

main().catch(console.error);
