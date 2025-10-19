/**
 * Smart Internal Linking Script for xmethod.de Blog
 * Автоматическая перелинковка ключевых слов в статьях блога
 * Полная база данных - 100+ ключевых слов
 */

(function() {
  'use strict';

  // ========== КОНФИГУРАЦИЯ ==========

  const CONFIG = {
    maxLinksPerPage: 15,
    excludeSelectors: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'code', 'pre', 'a', 'script', 'style', '.no-autolink'],
    contentSelector: '.blog-text',
    debugMode: false
  };

  // ========== РАСШИРЕННАЯ БАЗА КЛЮЧЕВЫХ СЛОВ ==========

  const KEYWORDS_DATABASE = {

    // ===== MVP & Product Development =====
    'mvp development agencies': {
      de: '/blog/13-besten-mvp-development-agenturen',
      en: '/en/blog/13-best-mvp-development-companies'
    },
    'mvp development': {
      de: '/blog/from-idea-to-reality-how-to-build-mvp-app',
      en: '/en/blog/from-idea-to-reality-how-to-build-mvp-app'
    },
    'mvp app development': {
      de: '/blog/mvp-app-development-how-to-design-and-build-for-success-in-2023',
      en: '/en/blog/mvp-app-development-how-to-design-and-build-for-success-in-2023'
    },
    'mvp app design': {
      de: '/blog/mvp-app-design-demystified-crafting-a-winning-strategy-in-2023',
      en: '/en/blog/mvp-app-design-demystified-crafting-a-winning-strategy-in-2023'
    },
    'mvp product design': {
      de: '/blog/mastering-mvp-product-design-in-2023',
      en: '/en/blog/mastering-mvp-product-design-in-2023'
    },
    'mvp in app development': {
      de: '/blog/cracking-the-code-mvp-in-app-development-demystified',
      en: '/en/blog/cracking-the-code-mvp-in-app-development-demystified'
    },
    'product manager mvp strategies': {
      de: '/blog/deep-dive-into-product-manager-mvp-strategies',
      en: '/en/blog/deep-dive-into-product-manager-mvp-strategies'
    },
    'mvp web development': {
      de: '/blog/the-power-of-mvp-in-web-development-how-to-build-a-quality-website',
      en: '/en/blog/the-power-of-mvp-in-web-development-how-to-build-a-quality-website'
    },
    'lean ux mvp': {
      de: '/blog/the-roadmap-to-a-successful-lean-ux-mvp-design-development-and-testing',
      en: '/en/blog/the-roadmap-to-a-successful-lean-ux-mvp-design-development-and-testing'
    },
    'mvp mistakes': {
      de: '/blog/top-10-mistakes-to-avoid-in-mvp-development',
      en: '/en/blog/top-10-mistakes-to-avoid-in-mvp-development'
    },
    'building mvp with low-code': {
      de: '/blog/5-steps-to-building-a-mvp-with-low-code-tools',
      en: '/en/blog/5-steps-to-building-a-mvp-with-low-code-tools'
    },
    'mvp with no-code': {
      de: '/blog/how-to-create-an-mvp-with-no-code-and-low-code-benefits-and-use-cases',
      en: '/en/blog/how-to-create-an-mvp-with-no-code-and-low-code-benefits-and-use-cases'
    },

    // ===== Low-Code Development =====
    'low-code development': {
      de: '/blog/what-is-low-code-development-and-why-is-it-important-for-business',
      en: '/en/blog/what-is-low-code-development-and-why-is-it-important-for-business'
    },
    'low-code platforms': {
      de: '/blog/revolutionize-your-business-with-these-top-10-low-code-platforms',
      en: '/en/blog/revolutionize-your-business-with-these-top-10-low-code-platforms'
    },
    'low-code business process automation': {
      de: '/blog/low-code-geschaftsprozessautomatisierung',
      en: '/en/blog/low-code-business-process-automation'
    },
    'low-code integration': {
      de: '/blog/low-code-integration',
      en: '/en/blog/low-code-integration'
    },
    'low-code agencies': {
      de: '/blog/uberblick-uber-22-low-code-entwicklung-agenturen-zur-entwicklung-von-mvp-web--oder-mobilanwendungen',
      en: '/en/blog/uberblick-uber-22-low-code-entwicklung-agenturen-zur-entwicklung-von-mvp-web--oder-mobilanwendungen'
    },
    'reasons to use low-code': {
      de: '/blog/5-compelling-reasons-to-start-using-low-code-today',
      en: '/en/blog/5-compelling-reasons-to-start-using-low-code-today'
    },
    'low-code vs no-code': {
      de: '/blog/breaking-down-the-differences-between-low-code-and-no-code',
      en: '/en/blog/breaking-down-the-differences-between-low-code-and-no-code'
    },
    'low-code no-code future': {
      de: '/blog/how-low-code-and-no-code-software-impact-the-future-of-development',
      en: '/en/blog/how-low-code-and-no-code-software-impact-the-future-of-development'
    },

    // ===== No-Code Development =====
    'no-code solutions': {
      de: '/blog/10-no-code-solutions-to-streamline-business-processes',
      en: '/en/blog/10-no-code-solutions-to-streamline-business-processes'
    },
    'no-code development': {
      de: '/blog/ways-no-code-development-is-democratizing-software-development',
      en: '/en/blog/ways-no-code-development-is-democratizing-software-development'
    },
    'no-code platforms': {
      de: '/blog/5-key-considerations-for-choosing-the-right-no-code-development-platform',
      en: '/en/blog/5-key-considerations-for-choosing-the-right-no-code-development-platform'
    },
    'no-code challenges': {
      de: '/blog/top-5-challenges-of-no-code-development',
      en: '/en/blog/top-5-challenges-of-no-code-development'
    },
    'no-code app builder': {
      de: '/blog/no-code-app-builder-tools-to-try-in-2023-unleash-your-creativity',
      en: '/en/blog/no-code-app-builder-tools-to-try-in-2023-unleash-your-creativity'
    },
    'no-code android app builders': {
      de: '/blog/discover-the-top-no-code-android-app-builders-of-2023',
      en: '/en/blog/discover-the-top-no-code-android-app-builders-of-2023'
    },
    'secure no-code applications': {
      de: '/blog/5-considerations-for-building-secure-no-code-applications',
      en: '/en/blog/5-considerations-for-building-secure-no-code-applications'
    },
    'no-code customer experience': {
      de: '/blog/top-5-ways-no-code-development-can-improve-customer-experience',
      en: '/en/blog/top-5-ways-no-code-development-can-improve-customer-experience'
    },
    'no-code data tools': {
      de: '/blog/top-5-no-code-tools-for-data-integration-and-analysis',
      en: '/en/blog/top-5-no-code-tools-for-data-integration-and-analysis'
    },
    'future of no-code': {
      de: '/blog/the-evolution-of-technology-roles-future-of-no-code-in-2024',
      en: '/en/blog/the-evolution-of-technology-roles-future-of-no-code-in-2024'
    },
    'no-code vs low-code': {
      de: '/blog/no-code-vs-low-code-optimale-entwicklungsansatze-fur-unterschiedliche-anforderungen',
      en: '/en/blog/no-code-vs-low-code-optimale-entwicklungsansatze-fur-unterschiedliche-anforderungen'
    },

    // ===== Specific Platforms =====
    'flutterflow agencies': {
      de: '/blog/die-12-besten-agenturen-fur-die-flutterflow-app-entwicklung',
      en: '/en/blog/die-12-besten-agenturen-fur-die-flutterflow-app-entwicklung'
    },
    'flutterflow vs bubble': {
      de: '/blog/flutterflow-vs-bubble-eine-ausfuhrliche-analyse-der-vor--und-nachteile-sowie-anwendungsbeispiele',
      en: '/en/blog/flutterflow-vs-bubble-eine-ausfuhrliche-analyse-der-vor--und-nachteile-sowie-anwendungsbeispiele'
    },
    'flutter vs flutterflow': {
      de: '/blog/flutterflow-vs-flutter-vergleich-der-entwicklungsframeworks',
      en: '/en/blog/flutterflow-vs-flutter-vergleich-der-entwicklungsframeworks'
    },
    'flutter and flutterflow at xmethod': {
      de: '/blog/warum-wir-bei-xmethod-als-digitalagentur-sowohl-flutter-als-auch-flutterflow-nutzen',
      en: '/en/blog/warum-wir-bei-xmethod-als-digitalagentur-sowohl-flutter-als-auch-flutterflow-nutzen'
    },
    'bubble.io gdpr': {
      de: '/blog/is-bubble-io-gdpr-compliant',
      en: '/en/blog/is-bubble-io-gdpr-compliant'
    },
    'webflow agencies': {
      de: '/blog/die-13-besten-webflow-agenturen',
      en: '/en/blog/die-13-besten-webflow-agenturen-in-berlin'
    },
    'webflow vs wordpress': {
      de: '/blog/webflow-vs-wordpress-eine-eingehende-analyse-der-vor--und-nachteile-in-der-website-entwicklung',
      en: '/en/blog/webflow-vs-wordpress-eine-eingehende-analyse-der-vor--und-nachteile-in-der-website-entwicklung'
    },
    'framer vs webflow': {
      de: '/blog/framer-vs-webflow-welches-tool-ist-besser-fur-webdesign',
      en: '/en/blog/framer-vs-webflow-which-tool-is-better-for-web-design'
    },

    // ===== UI/UX Design =====
    'ui ux benefits': {
      de: '/blog/13-unbelievable-ui-ux-benefits-for-your-businesses',
      en: '/en/blog/13-unbelievable-ui-ux-benefits-for-your-businesses'
    },
    'ux design guide': {
      de: '/blog/get-started-in-ux-design-a-full-guide-to-success',
      en: '/en/blog/get-started-in-ux-design-a-full-guide-to-success'
    },
    'ui design 101': {
      de: '/blog/ui-design-101-everything-you-need-to-know-about-ui-design',
      en: '/en/blog/ui-design-101-everything-you-need-to-know-about-ui-design'
    },
    'ui ux design trends': {
      de: '/blog/stay-ahead-of-the-curve-top-11-ui-ux-design-trends-for-2023-and-beyond',
      en: '/en/blog/stay-ahead-of-the-curve-top-11-ui-ux-design-trends-for-2023-and-beyond'
    },
    'dark theme ux design': {
      de: '/blog/diving-into-the-dark-exploring-dark-theme-ux-design-best-practices',
      en: '/en/blog/diving-into-the-dark-exploring-dark-theme-ux-design-best-practices'
    },
    'redesigning ui ux': {
      de: '/blog/elevate-and-innovate-the-ultimate-guide-to-redesigning-ui-ux',
      en: '/en/blog/elevate-and-innovate-the-ultimate-guide-to-redesigning-ui-ux'
    },
    'layout ui ux design': {
      de: '/blog/mastering-the-art-of-layout-ui-ux-design-fundamentals-unveiled',
      en: '/en/blog/mastering-the-art-of-layout-ui-ux-design-fundamentals-unveiled'
    },
    'ui ux best practices': {
      de: '/blog/rocking-ux-design-10-best-ui-ux-practices-to-elevate-your-user-experience',
      en: '/en/blog/rocking-ux-design-10-best-ui-ux-practices-to-elevate-your-user-experience'
    },
    'basic ui ux design': {
      de: '/blog/simple-principles-for-basic-ui-ux-design',
      en: '/en/blog/simple-principles-for-basic-ui-ux-design'
    },
    'web app ui ux': {
      de: '/blog/proven-tips-for-optimizing-your-web-app-best-ui-ux-design-website',
      en: '/en/blog/proven-tips-for-optimizing-your-web-app-best-ui-ux-design-website'
    },
    'conversion ux': {
      de: '/blog/the-ultimate-conversion-ux-guide-crafting-experiences-that-convert',
      en: '/en/blog/the-ultimate-conversion-ux-guide-crafting-experiences-that-convert'
    },
    'ui ux importance': {
      de: '/blog/ui-ux-importance-decoding-the-powerhouse-of-design-in-the-digital-era',
      en: '/en/blog/ui-ux-importance-decoding-the-powerhouse-of-design-in-the-digital-era'
    },
    'ui ux usability testing': {
      de: '/blog/understanding-the-nuances-of-ui-ux-and-usability-testing-in-software-development',
      en: '/en/blog/understanding-the-nuances-of-ui-ux-and-usability-testing-in-software-development'
    },
    'ux design advantages': {
      de: '/blog/maximizing-your-potential-the-advantages-of-ux-design-for-your-business',
      en: '/en/blog/maximizing-your-potential-the-advantages-of-ux-design-for-your-business'
    },
    'ui ux designers future': {
      de: '/blog/must-know-insights-about-the-ui-ux-designers-future',
      en: '/en/blog/must-know-insights-about-the-ui-ux-designers-future'
    },
    'ux ui design cost': {
      de: '/blog/ux-ui-design-cost-guide-expenses-and-factors-to-consider',
      en: '/en/blog/ux-ui-design-cost-guide-expenses-and-factors-to-consider'
    },
    'ux ui design meaning': {
      de: '/blog/ux-ui-design-meaning-understanding-mastering-the-craft',
      en: '/en/blog/ux-ui-design-meaning-understanding-mastering-the-craft'
    },

    // ===== Mobile App Development =====
    'app development guide': {
      de: '/blog/the-ultimate-guide-everything-you-need-to-know-about-app-development',
      en: '/en/blog/the-ultimate-guide-everything-you-need-to-know-about-app-development'
    },
    'mobile app development approaches': {
      de: '/blog/secrets-of-effective-mobile-app-development-approaches',
      en: '/en/blog/secrets-of-effective-mobile-app-development-approaches'
    },
    'app development cost': {
      de: '/blog/how-much-does-it-cost-to-make-an-app-in-2024-a-comprehensive-guide',
      en: '/en/blog/how-much-does-it-cost-to-make-an-app-in-2024-a-comprehensive-guide'
    },
    'average app development price': {
      de: '/blog/average-price-to-develop-an-app-2023-trends-tips',
      en: '/en/blog/average-price-to-develop-an-app-2023-trends-tips'
    },
    'app development tips': {
      de: '/blog/essential-app-development-tips-you-must-know',
      en: '/en/blog/essential-app-development-tips-you-must-know'
    },
    'mobile app kpis': {
      de: '/blog/essential-25-mobile-app-kpis-for-excellence',
      en: '/en/blog/essential-25-mobile-app-kpis-for-excellence'
    },
    'mobile app success metrics': {
      de: '/blog/maximizing-mobile-app-success-the-metrics-you-cant-afford-to-ignore',
      en: '/en/blog/maximizing-mobile-app-success-the-metrics-you-cant-afford-to-ignore'
    },
    'mobile app engagement metrics': {
      de: '/blog/unlocking-success-the-comprehensive-guide-to-mobile-app-engagement-metrics',
      en: '/en/blog/unlocking-success-the-comprehensive-guide-to-mobile-app-engagement-metrics'
    },
    'app monetization strategies': {
      de: '/blog/monetize-your-app-effective-mobile-app-monetization-strategies-for-2023',
      en: '/en/blog/monetize-your-app-effective-mobile-app-monetization-strategies-for-2023'
    },
    'businesses use mobile apps': {
      de: '/blog/how-businesses-utilise-mobile-applications',
      en: '/en/blog/how-businesses-utilise-mobile-applications'
    },
    'mobile vs web applications': {
      de: '/blog/unterschied-zwischen-mobilen-anwendungen-und-web-applications',
      en: '/en/blog/unterschied-zwischen-mobilen-anwendungen-und-web-applications'
    },
    'app launch bugs': {
      de: '/blog/why-do-so-many-websites-and-apps-launch-with-bugs',
      en: '/en/blog/why-do-so-many-websites-and-apps-launch-with-bugs'
    },

    // ===== App Agencies =====
    'app agencies germany': {
      de: '/blog/die-besten-app-agenturen-in-deutschland',
      en: '/en/blog/top-10-app-development-companies'
    },

    // ===== Healthcare & Digital Health =====
    'digital health trends': {
      de: '/blog/top-15-digital-health-trends-shaping-the-future-of-healthcare',
      en: '/en/blog/top-15-digital-health-trends-shaping-the-future-of-healthcare'
    },
    'healthcare app development': {
      de: '/blog/guide-to-mobile-healthcare-software-development',
      en: '/en/blog/guide-to-mobile-healthcare-software-development'
    },
    'healthcare app agencies': {
      de: '/blog/die-11-beste-gesundheits-apps-entwicklung-agenturen',
      en: '/en/blog/die-11-beste-gesundheits-apps-entwicklung-agenturen'
    },
    'hipaa compliant app': {
      de: '/blog/5-considerations-for-building-hipaa-compliant-app',
      en: '/en/blog/5-considerations-for-building-hipaa-compliant-app'
    },
    'hipaa app development': {
      de: '/blog/hipaa-compliant-app-development-unlocking-a-world-of-opportunities',
      en: '/en/blog/hipaa-compliant-app-development-unlocking-a-world-of-opportunities'
    },
    'telehealth trends': {
      de: '/blog/key-trends-in-telehealth-and-remote-patient-monitoring',
      en: '/en/blog/key-trends-in-telehealth-and-remote-patient-monitoring'
    },
    'digital health challenges': {
      de: '/blog/challenges-and-opportunities-in-the-digital-health-industry',
      en: '/en/blog/challenges-and-opportunities-in-the-digital-health-industry'
    },
    'digital healthcare challenges': {
      de: '/blog/navigating-innovation-main-challenges-of-digital-healthcare',
      en: '/en/blog/navigating-innovation-main-challenges-of-digital-healthcare'
    },
    'digital health areas': {
      de: '/blog/unraveling-the-future-exploring-the-key-areas-of-digital-health-revolution',
      en: '/en/blog/unraveling-the-future-exploring-the-key-areas-of-digital-health-revolution'
    },
    'digital healthcare delivery': {
      de: '/blog/unveiling-the-latest-trends-in-digital-healthcare-delivery',
      en: '/en/blog/unveiling-the-latest-trends-in-digital-healthcare-delivery'
    },
    'ai and digital health': {
      de: '/blog/the-future-of-medicine-exploring-the-impact-of-ai-and-digital-health',
      en: '/en/blog/the-future-of-medicine-exploring-the-impact-of-ai-and-digital-health'
    },
    'healthcare digital marketing': {
      de: '/blog/digital-marketing-for-healthcare-providers-strategies-for-success',
      en: '/en/blog/digital-marketing-for-healthcare-providers-strategies-for-success'
    },
    'health products marketing': {
      de: '/blog/healthy-profits-4-digital-marketing-strategies-for-marketing-health-products',
      en: '/en/blog/healthy-profits-4-digital-marketing-strategies-for-marketing-health-products'
    },
    'digital marketing and healthcare': {
      de: '/blog/thriving-in-the-digital-age-mastering-digital-marketing-and-healthcare',
      en: '/en/blog/thriving-in-the-digital-age-mastering-digital-marketing-and-healthcare'
    },

    // ===== PWA & Web Development =====
    'progressive web apps': {
      de: '/blog/the-abcs-of-pwa-exploring-features-that-transform-web-experiences',
      en: '/en/blog/the-abcs-of-pwa-exploring-features-that-transform-web-experiences'
    },
    'pwa vs native apps': {
      de: '/blog/the-benefits-of-pwa-over-native-apps-a-comprehensive-guide',
      en: '/en/blog/the-benefits-of-pwa-over-native-apps-a-comprehensive-guide'
    },
    'pwa vs native app': {
      de: '/blog/the-face-off-pwa-vs-native-app-how-to-make-the-right-choice',
      en: '/en/blog/the-face-off-pwa-vs-native-app-how-to-make-the-right-choice'
    },
    'pwa pros and cons': {
      de: '/blog/from-speed-to-offline-access-pros-and-cons-of-pwa',
      en: '/en/blog/from-speed-to-offline-access-pros-and-cons-of-pwa'
    },
    'pwa functionality': {
      de: '/blog/why-pwa-functionality-is-the-future-of-web-development',
      en: '/en/blog/why-pwa-functionality-is-the-future-of-web-development'
    },
    'programming languages': {
      de: '/blog/die-sieben-meistgenutzten-programmiersprachen-fur-webentwicklung-in-2024',
      en: '/en/blog/die-sieben-meistgenutzten-programmiersprachen-fur-webentwicklung-in-2024'
    },

    // ===== Product Launch & Strategy =====
    'product launch strategies': {
      de: '/blog/the-ultimate-guide-to-product-launch-strategies-tips-and-best-practices',
      en: '/en/blog/the-ultimate-guide-to-product-launch-strategies-tips-and-best-practices'
    },
    'product launch in new markets': {
      de: '/blog/5-proven-strategies-for-a-successful-product-launch-in-new-markets',
      en: '/en/blog/5-proven-strategies-for-a-successful-product-launch-in-new-markets'
    },
    'new product launch steps': {
      de: '/blog/from-idea-to-impact-the-12-steps-to-an-epic-launch-of-the-new-product',
      en: '/en/blog/from-idea-to-impact-the-12-steps-to-an-epic-launch-of-the-new-product'
    },
    'digital product management': {
      de: '/blog/navigating-the-world-of-digital-product-management',
      en: '/en/blog/navigating-the-world-of-digital-product-management'
    },
    'tech product marketing': {
      de: '/blog/unlocking-the-keys-to-tech-product-marketing-success-in-2023',
      en: '/en/blog/unlocking-the-keys-to-tech-product-marketing-success-in-2023'
    },

    // ===== Software Development & Outsourcing =====
    'software outsourcing': {
      de: '/blog/software-outsourcing-in-2024-a-comprehensive-guide',
      en: '/en/blog/software-outsourcing-in-2024-a-comprehensive-guide'
    },
    'hire development team': {
      de: '/blog/the-future-of-development-why-you-should-hire-a-team-of-developers',
      en: '/en/blog/the-future-of-development-why-you-should-hire-a-team-of-developers'
    },
    'gradually disappearing code': {
      de: '/blog/gradually-disappearing-code',
      en: '/en/blog/gradually-disappearing-code'
    },

    // ===== AI & Advanced Technologies =====
    'ai agencies': {
      de: '/blog/besten-ki-agenturen',
      en: '/en/blog/best-ai-agencies'
    },
    'gpt business ideas': {
      de: '/blog/best-business-ideas-based-on-gpt-3-5-4',
      en: '/en/blog/best-business-ideas-based-on-gpt-3-5-4'
    },

    // ===== Web Design Agencies =====
    'webdesign agencies': {
      de: '/blog/top-webdesign-agenturen',
      en: '/en/blog/top-webdesign-agenturen'
    }

  };

  // ========== ОСНОВНЫЕ ФУНКЦИИ ==========

  function detectPageLanguage() {
    const path = window.location.pathname;
    if (path.includes('/en/blog/')) return 'en';
    if (path.includes('/blog/')) return 'de';
    return 'de';
  }

  function isBlogPage() {
    const path = window.location.pathname;
    return path.includes('/blog/') || path.includes('/en/blog/');
  }

  function isInExcludedElement(node) {
    let parent = node.parentElement;
    while (parent) {
      const tagName = parent.tagName.toLowerCase();
      if (CONFIG.excludeSelectors.some(selector => {
        if (selector.startsWith('.')) {
          return parent.classList.contains(selector.substring(1));
        }
        return tagName === selector;
      })) {
        return true;
      }
      parent = parent.parentElement;
    }
    return false;
  }

  function createKeywordRegex(keyword) {
    const escaped = keyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    return new RegExp(`\\b${escaped}\\b`, 'gi');
  }

  function processTextNode(textNode, keyword, url, usedKeywords) {
    if (usedKeywords.has(keyword.toLowerCase())) {
      return;
    }

    if (isInExcludedElement(textNode)) {
      return;
    }

    const text = textNode.textContent;
    const regex = createKeywordRegex(keyword);
    const match = regex.exec(text);

    if (match) {
      const matchedText = match[0];
      const beforeText = text.substring(0, match.index);
      const afterText = text.substring(match.index + matchedText.length);

      const beforeNode = document.createTextNode(beforeText);
      const link = document.createElement('a');
      link.href = url;
      link.textContent = matchedText;
      link.className = 'auto-internal-link';
      const afterNode = document.createTextNode(afterText);

      const parent = textNode.parentNode;
      parent.insertBefore(beforeNode, textNode);
      parent.insertBefore(link, textNode);
      parent.insertBefore(afterNode, textNode);
      parent.removeChild(textNode);

      usedKeywords.add(keyword.toLowerCase());

      if (CONFIG.debugMode) {
        console.log(`✓ Linked: "${matchedText}" -> ${url}`);
      }

      return true;
    }

    return false;
  }

  function getTextNodes(element) {
    const textNodes = [];
    const walker = document.createTreeWalker(
      element,
      NodeFilter.SHOW_TEXT,
      {
        acceptNode: function(node) {
          if (!node.textContent.trim()) {
            return NodeFilter.FILTER_REJECT;
          }
          if (isInExcludedElement(node)) {
            return NodeFilter.FILTER_REJECT;
          }
          return NodeFilter.FILTER_ACCEPT;
        }
      }
    );

    let node;
    while (node = walker.nextNode()) {
      textNodes.push(node);
    }

    return textNodes;
  }

  function processPage() {
    if (!isBlogPage()) {
      if (CONFIG.debugMode) {
        console.log('Not a blog page, skipping internal linking');
      }
      return;
    }

    const language = detectPageLanguage();
    const contentContainer = document.querySelector(CONFIG.contentSelector);

    if (!contentContainer) {
      if (CONFIG.debugMode) {
        console.log('Content container not found');
      }
      return;
    }

    const sortedKeywords = Object.keys(KEYWORDS_DATABASE).sort((a, b) => b.length - a.length);
    const usedKeywords = new Set();
    let linksAdded = 0;
    const textNodes = getTextNodes(contentContainer);

    for (const keyword of sortedKeywords) {
      if (linksAdded >= CONFIG.maxLinksPerPage) {
        if (CONFIG.debugMode) {
          console.log(`Max links limit reached (${CONFIG.maxLinksPerPage})`);
        }
        break;
      }

      const urls = KEYWORDS_DATABASE[keyword];
      const url = urls[language];

      if (!url) continue;
      if (window.location.pathname === url) continue;

      for (const textNode of textNodes) {
        if (linksAdded >= CONFIG.maxLinksPerPage) break;

        if (processTextNode(textNode, keyword, url, usedKeywords)) {
          linksAdded++;
          break;
        }
      }
    }

    if (CONFIG.debugMode) {
      console.log(`Internal linking complete: ${linksAdded} links added`);
      console.log('Used keywords:', Array.from(usedKeywords));
    }
  }

  // ========== ИНИЦИАЛИЗАЦИЯ ==========

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', processPage);
  } else {
    processPage();
  }

  let lastUrl = location.href;
  new MutationObserver(() => {
    const url = location.href;
    if (url !== lastUrl) {
      lastUrl = url;
      setTimeout(processPage, 500);
    }
  }).observe(document, { subtree: true, childList: true });

})();
