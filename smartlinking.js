/**
 * Internal Linking Script for xmethod.de
 * Version: 1.0
 */

(function() {
  'use strict';

  const CONFIG = {
    maxLinksPerPage: 15,
    excludeSelectors: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'code', 'pre', 'a', 'script', 'style', '.no-autolink'],
    contentSelector: '.blog-text',
    debugMode: false
  };

  const KEYWORDS = {
    'mvp development agencies': {de: '/blog/13-besten-mvp-development-agenturen', en: '/en/blog/13-best-mvp-development-companies'},
    'mvp development': {de: '/blog/from-idea-to-reality-how-to-build-mvp-app', en: '/en/blog/from-idea-to-reality-how-to-build-mvp-app'},
    'mvp app development': {de: '/blog/mvp-app-development-how-to-design-and-build-for-success-in-2023', en: '/en/blog/mvp-app-development-how-to-design-and-build-for-success-in-2023'},
    'mvp app design': {de: '/blog/mvp-app-design-demystified-crafting-a-winning-strategy-in-2023', en: '/en/blog/mvp-app-design-demystified-crafting-a-winning-strategy-in-2023'},
    'low-code development': {de: '/blog/what-is-low-code-development-and-why-is-it-important-for-business', en: '/en/blog/what-is-low-code-development-and-why-is-it-important-for-business'},
    'low-code platforms': {de: '/blog/revolutionize-your-business-with-these-top-10-low-code-platforms', en: '/en/blog/revolutionize-your-business-with-these-top-10-low-code-platforms'},
    'no-code solutions': {de: '/blog/10-no-code-solutions-to-streamline-business-processes', en: '/en/blog/10-no-code-solutions-to-streamline-business-processes'},
    'no-code development': {de: '/blog/ways-no-code-development-is-democratizing-software-development', en: '/en/blog/ways-no-code-development-is-democratizing-software-development'},
    'flutterflow agencies': {de: '/blog/die-12-besten-agenturen-fur-die-flutterflow-app-entwicklung', en: '/en/blog/die-12-besten-agenturen-fur-die-flutterflow-app-entwicklung'},
    'ui ux design': {de: '/blog/13-unbelievable-ui-ux-benefits-for-your-businesses', en: '/en/blog/13-unbelievable-ui-ux-benefits-for-your-businesses'},
    'mobile app development': {de: '/blog/secrets-of-effective-mobile-app-development-approaches', en: '/en/blog/secrets-of-effective-mobile-app-development-approaches'},
    'app development cost': {de: '/blog/how-much-does-it-cost-to-make-an-app-in-2024-a-comprehensive-guide', en: '/en/blog/how-much-does-it-cost-to-make-an-app-in-2024-a-comprehensive-guide'},
    'digital health trends': {de: '/blog/top-15-digital-health-trends-shaping-the-future-of-healthcare', en: '/en/blog/top-15-digital-health-trends-shaping-the-future-of-healthcare'},
    'healthcare app development': {de: '/blog/guide-to-mobile-healthcare-software-development', en: '/en/blog/guide-to-mobile-healthcare-software-development'},
    'hipaa compliant app': {de: '/blog/5-considerations-for-building-hipaa-compliant-app', en: '/en/blog/5-considerations-for-building-hipaa-compliant-app'},
    'progressive web apps': {de: '/blog/the-abcs-of-pwa-exploring-features-that-transform-web-experiences', en: '/en/blog/the-abcs-of-pwa-exploring-features-that-transform-web-experiences'},
    'software outsourcing': {de: '/blog/software-outsourcing-in-2024-a-comprehensive-guide', en: '/en/blog/software-outsourcing-in-2024-a-comprehensive-guide'},
    'webflow agencies': {de: '/blog/die-13-besten-webflow-agenturen', en: '/en/blog/die-13-besten-webflow-agenturen-in-berlin'},
    'ai agencies': {de: '/blog/besten-ki-agenturen', en: '/en/blog/best-ai-agencies'}
  };

  function detectLanguage() {
    return window.location.pathname.includes('/en/blog/') ? 'en' : 'de';
  }

  function isBlogPage() {
    const path = window.location.pathname;
    return path.includes('/blog/') || path.includes('/en/blog/');
  }

  function isExcluded(node) {
    let parent = node.parentElement;
    while (parent) {
      const tag = parent.tagName.toLowerCase();
      if (CONFIG.excludeSelectors.some(sel => {
        if (sel.startsWith('.')) {
          return parent.classList.contains(sel.substring(1));
        }
        return tag === sel;
      })) {
        return true;
      }
      parent = parent.parentElement;
    }
    return false;
  }

  function createRegex(keyword) {
    const escaped = keyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    return new RegExp('\\b' + escaped + '\\b', 'gi');
  }

  function processNode(node, keyword, url, used) {
    if (used.has(keyword.toLowerCase()) || isExcluded(node)) {
      return false;
    }

    const text = node.textContent;
    const regex = createRegex(keyword);
    const match = regex.exec(text);

    if (match) {
      const before = text.substring(0, match.index);
      const after = text.substring(match.index + match[0].length);

      const beforeNode = document.createTextNode(before);
      const link = document.createElement('a');
      link.href = url;
      link.textContent = match[0];
      link.className = 'auto-internal-link';
      const afterNode = document.createTextNode(after);

      const parent = node.parentNode;
      parent.insertBefore(beforeNode, node);
      parent.insertBefore(link, node);
      parent.insertBefore(afterNode, node);
      parent.removeChild(node);

      used.add(keyword.toLowerCase());
      
      if (CONFIG.debugMode) {
        console.log('Linked: ' + match[0] + ' -> ' + url);
      }
      
      return true;
    }
    return false;
  }

  function getTextNodes(element) {
    const nodes = [];
    const walker = document.createTreeWalker(
      element,
      NodeFilter.SHOW_TEXT,
      {
        acceptNode: function(node) {
          if (!node.textContent.trim() || isExcluded(node)) {
            return NodeFilter.FILTER_REJECT;
          }
          return NodeFilter.FILTER_ACCEPT;
        }
      }
    );

    let node;
    while (node = walker.nextNode()) {
      nodes.push(node);
    }
    return nodes;
  }

  function process() {
    if (!isBlogPage()) {
      if (CONFIG.debugMode) {
        console.log('Not a blog page');
      }
      return;
    }

    const lang = detectLanguage();
    const container = document.querySelector(CONFIG.contentSelector);

    if (!container) {
      if (CONFIG.debugMode) {
        console.log('Container not found');
      }
      return;
    }

    const sorted = Object.keys(KEYWORDS).sort(function(a, b) {
      return b.length - a.length;
    });
    
    const used = new Set();
    let added = 0;
    const nodes = getTextNodes(container);

    for (let i = 0; i < sorted.length; i++) {
      if (added >= CONFIG.maxLinksPerPage) {
        break;
      }

      const keyword = sorted[i];
      const urls = KEYWORDS[keyword];
      const url = urls[lang];

      if (!url || window.location.pathname === url) {
        continue;
      }

      for (let j = 0; j < nodes.length; j++) {
        if (added >= CONFIG.maxLinksPerPage) {
          break;
        }
        
        if (processNode(nodes[j], keyword, url, used)) {
          added++;
          break;
        }
      }
    }

    if (CONFIG.debugMode) {
      console.log('Links added: ' + added);
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', process);
  } else {
    process();
  }

  let lastUrl = location.href;
  new MutationObserver(function() {
    const url = location.href;
    if (url !== lastUrl) {
      lastUrl = url;
      setTimeout(process, 500);
    }
  }).observe(document, {subtree: true, childList: true});

})();
