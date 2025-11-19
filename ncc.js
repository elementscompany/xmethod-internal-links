/**
 * Internal Linking Script for nocodecircle.com
 * Version: 1.0 - Database-driven with Priority Support (Russian only)
 *
 * Changelog v1.0:
 * - Adapted from xmethod.js for Russian-only site
 * - Single language support (ru)
 * - Priority-based sorting from database
 * - Weighted link distribution by priority
 * - Performance optimizations (regex caching, batch DOM updates)
 * - Analytics tracking for link placement
 * - Improved error handling and logging
 */

(function() {
  'use strict';

  const CONFIG = {
    apiEndpoint: 'https://n8n.maclear.ch/webhook/ncc',
    maxLinksPerPage: 15,
    excludeSelectors: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'code', 'pre', 'a', 'script', 'style', '.no-autolink'],
    contentSelector: '.blog-text',
    debugMode: false,
    cacheKey: 'ncc_keywords_cache',
    cacheDuration: 3600000, // 1 час в миллисекундах
    maxRetries: 3,
    retryDelay: 1000,
    // Весовые коэффициенты для приоритетов (процент от maxLinksPerPage)
    priorityWeights: {
      10: 0.4,  // Высокий приоритет: до 40% ссылок (6 из 15)
      7: 0.3,   // Средне-высокий: до 30% (4-5 из 15)
      5: 0.2,   // Средний: до 20% (3 из 15)
      3: 0.1    // Низкий: до 10% (1-2 из 15)
    },
    enableAnalytics: true,
    analyticsKey: 'ncc_links_analytics'
  };

  let KEYWORDS = {};
  const regexCache = new Map(); // Кэш для regex паттернов
  const analytics = {
    placed: [],
    skipped: [],
    errors: []
  };

  // ============================================
  // Загрузка ключевых слов из API
  // ============================================
  async function loadKeywords(retryCount = 0) {
    try {
      // Проверяем кэш
      const cached = getFromCache();
      if (cached) {
        if (CONFIG.debugMode) {
          console.log('NCC Internal Links: Loaded from cache');
        }
        return cached;
      }

      if (CONFIG.debugMode) {
        console.log('NCC Internal Links: Fetching from API...');
      }

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000);

      const response = await fetch(CONFIG.apiEndpoint, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      // Валидация структуры данных
      if (!validateKeywordsData(data)) {
        throw new Error('Invalid data structure from API');
      }

      // Сохраняем в кэш
      saveToCache(data);

      if (CONFIG.debugMode) {
        console.log('NCC Internal Links: Loaded ' + Object.keys(data).length + ' keywords from API');
      }

      return data;

    } catch (error) {
      console.error('NCC Internal Links: Error loading keywords:', error);
      analytics.errors.push({
        type: 'api_load',
        message: error.message,
        timestamp: Date.now()
      });

      // Retry logic
      if (retryCount < CONFIG.maxRetries) {
        if (CONFIG.debugMode) {
          console.log(`NCC Internal Links: Retrying... (${retryCount + 1}/${CONFIG.maxRetries})`);
        }
        await sleep(CONFIG.retryDelay * (retryCount + 1));
        return loadKeywords(retryCount + 1);
      }

      console.error('NCC Internal Links: Failed to load keywords after ' + CONFIG.maxRetries + ' retries');
      return {};
    }
  }

  // ============================================
  // Валидация данных из API
  // ============================================
  function validateKeywordsData(data) {
    if (!data || typeof data !== 'object') return false;

    for (const keyword in data) {
      const entry = data[keyword];
      if (!entry.ru) {
        console.warn('NCC Internal Links: Missing URL for keyword:', keyword);
        return false;
      }
      // priority необязателен, будет использоваться дефолтное значение
    }
    return true;
  }

  // ============================================
  // Кэширование
  // ============================================
  function getFromCache() {
    try {
      const cached = localStorage.getItem(CONFIG.cacheKey);
      if (!cached) return null;

      const { data, timestamp } = JSON.parse(cached);
      const now = Date.now();

      if (now - timestamp < CONFIG.cacheDuration) {
        return data;
      }

      // Кэш устарел
      localStorage.removeItem(CONFIG.cacheKey);
      return null;
    } catch (error) {
      console.error('NCC Internal Links: Cache error:', error);
      return null;
    }
  }

  function saveToCache(data) {
    try {
      const cacheData = {
        data: data,
        timestamp: Date.now()
      };
      localStorage.setItem(CONFIG.cacheKey, JSON.stringify(cacheData));
    } catch (error) {
      console.error('NCC Internal Links: Failed to save cache:', error);
    }
  }

  function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  // ============================================
  // Проверка страницы блога
  // ============================================
  function isBlogPage() {
    const path = window.location.pathname;
    return path.includes('/blog/');
  }

  // ============================================
  // Проверка исключений
  // ============================================
  function isExcluded(node) {
    let parent = node.parentElement;
    while (parent) {
      const tag = parent.tagName.toLowerCase();
      if (CONFIG.excludeSelectors.some(function(sel) {
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

  // ============================================
  // Создание и кэширование регулярных выражений
  // ============================================
  function getRegex(keyword) {
    if (!regexCache.has(keyword)) {
      const escaped = keyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      regexCache.set(keyword, new RegExp('\\b' + escaped + '\\b', 'i'));
    }
    return regexCache.get(keyword);
  }

  // ============================================
  // Обработка текстового узла (оптимизированная)
  // ============================================
  function processNode(node, keyword, url, used, priority) {
    if (used.has(keyword.toLowerCase()) || isExcluded(node)) {
      return null;
    }

    const text = node.textContent;
    const regex = getRegex(keyword);
    const match = regex.exec(text);

    if (match) {
      used.add(keyword.toLowerCase());

      return {
        node: node,
        match: match,
        url: url,
        keyword: keyword,
        priority: priority
      };
    }
    return null;
  }

  // ============================================
  // Batch DOM updates для производительности
  // ============================================
  function applyLinkReplacement(replacement) {
    const { node, match, url, keyword } = replacement;
    const text = node.textContent;

    const before = text.substring(0, match.index);
    const after = text.substring(match.index + match[0].length);

    const beforeNode = document.createTextNode(before);
    const link = document.createElement('a');
    link.href = url;
    link.textContent = match[0];
    link.className = 'auto-internal-link';
    link.setAttribute('data-keyword', keyword);
    link.setAttribute('data-priority', replacement.priority);
    const afterNode = document.createTextNode(after);

    const parent = node.parentNode;
    parent.insertBefore(beforeNode, node);
    parent.insertBefore(link, node);
    parent.insertBefore(afterNode, node);
    parent.removeChild(node);

    return link;
  }

  // ============================================
  // Получение текстовых узлов
  // ============================================
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

  // ============================================
  // Сортировка с учетом приоритета
  // ============================================
  function sortKeywordsByPriority(keywords) {
    const keywordsArray = Object.keys(keywords).map(function(keyword) {
      const entry = keywords[keyword];
      return {
        keyword: keyword,
        url: entry.ru,
        priority: entry.priority || 5, // Дефолтный приоритет
        length: keyword.length
      };
    });

    // Сортировка: приоритет DESC -> длина DESC
    return keywordsArray.sort(function(a, b) {
      if (b.priority !== a.priority) {
        return b.priority - a.priority;
      }
      return b.length - a.length;
    });
  }

  // ============================================
  // Расчет лимитов по приоритетам
  // ============================================
  function calculatePriorityLimits(sortedKeywords) {
    const limits = {};
    const priorityGroups = {};

    // Группируем по приоритетам
    sortedKeywords.forEach(function(item) {
      if (!priorityGroups[item.priority]) {
        priorityGroups[item.priority] = 0;
      }
      priorityGroups[item.priority]++;
    });

    // Рассчитываем лимиты
    Object.keys(priorityGroups).forEach(function(priority) {
      const weight = CONFIG.priorityWeights[priority] || 0.1;
      limits[priority] = Math.ceil(CONFIG.maxLinksPerPage * weight);
    });

    if (CONFIG.debugMode) {
      console.log('NCC Internal Links: Priority limits:', limits);
      console.log('NCC Internal Links: Priority groups:', priorityGroups);
    }

    return limits;
  }

  // ============================================
  // Основная функция обработки (переработана)
  // ============================================
  async function process() {
    const startTime = performance.now();

    if (!isBlogPage()) {
      if (CONFIG.debugMode) {
        console.log('NCC Internal Links: Not a blog page');
      }
      return;
    }

    const container = document.querySelector(CONFIG.contentSelector);

    if (!container) {
      if (CONFIG.debugMode) {
        console.log('NCC Internal Links: Container .blog-text not found');
      }
      return;
    }

    // Загружаем ключевые слова из API
    KEYWORDS = await loadKeywords();

    if (!KEYWORDS || Object.keys(KEYWORDS).length === 0) {
      console.error('NCC Internal Links: No keywords loaded');
      return;
    }

    // Сортируем с учетом приоритета
    const sortedKeywords = sortKeywordsByPriority(KEYWORDS);
    const priorityLimits = calculatePriorityLimits(sortedKeywords);
    const priorityCounters = {};

    const used = new Set();
    const replacements = [];
    const nodes = getTextNodes(container);

    if (CONFIG.debugMode) {
      console.log('NCC Internal Links: Found ' + nodes.length + ' text nodes');
      console.log('NCC Internal Links: Processing ' + sortedKeywords.length + ' keywords');
    }

    // Обработка ключевых слов с учетом приоритетов
    for (let i = 0; i < sortedKeywords.length; i++) {
      if (replacements.length >= CONFIG.maxLinksPerPage) {
        if (CONFIG.debugMode) {
          console.log('NCC Internal Links: Max limit reached');
        }
        break;
      }

      const item = sortedKeywords[i];
      const keyword = item.keyword;
      const priority = item.priority;
      const url = item.url;

      if (!url || window.location.pathname === url) {
        analytics.skipped.push({
          keyword: keyword,
          reason: !url ? 'no_url' : 'same_page',
          priority: priority
        });
        continue;
      }

      // Проверяем лимит по приоритету
      if (!priorityCounters[priority]) {
        priorityCounters[priority] = 0;
      }

      if (priorityCounters[priority] >= priorityLimits[priority]) {
        analytics.skipped.push({
          keyword: keyword,
          reason: 'priority_limit',
          priority: priority
        });
        continue;
      }

      // Ищем совпадение в узлах
      for (let j = 0; j < nodes.length; j++) {
        if (replacements.length >= CONFIG.maxLinksPerPage) {
          break;
        }

        const replacement = processNode(nodes[j], keyword, url, used, priority);
        if (replacement) {
          replacements.push(replacement);
          priorityCounters[priority]++;

          analytics.placed.push({
            keyword: keyword,
            url: url,
            priority: priority,
            position: j
          });

          if (CONFIG.debugMode) {
            console.log('Queued: ' + keyword + ' (priority: ' + priority + ') -> ' + url);
          }
          break;
        }
      }
    }

    // Применяем все замены batch-ом
    if (CONFIG.debugMode) {
      console.log('NCC Internal Links: Applying ' + replacements.length + ' replacements');
    }

    replacements.forEach(function(replacement) {
      try {
        applyLinkReplacement(replacement);
      } catch (error) {
        console.error('NCC Internal Links: Error applying replacement:', error);
        analytics.errors.push({
          type: 'dom_update',
          keyword: replacement.keyword,
          message: error.message
        });
      }
    });

    const endTime = performance.now();
    const duration = (endTime - startTime).toFixed(2);

    if (CONFIG.debugMode) {
      console.log('NCC Internal Links: Complete - ' + replacements.length + ' links added in ' + duration + 'ms');
      console.log('NCC Internal Links: Priority distribution:', priorityCounters);
    }

    // Сохраняем аналитику
    if (CONFIG.enableAnalytics) {
      saveAnalytics(duration, replacements.length);
    }
  }

  // ============================================
  // Сохранение аналитики
  // ============================================
  function saveAnalytics(duration, linksAdded) {
    try {
      const analyticsData = {
        url: window.location.href,
        timestamp: Date.now(),
        duration: duration,
        linksAdded: linksAdded,
        placed: analytics.placed,
        skipped: analytics.skipped,
        errors: analytics.errors
      };

      const existing = JSON.parse(localStorage.getItem(CONFIG.analyticsKey) || '[]');
      existing.push(analyticsData);

      // Храним только последние 50 записей
      if (existing.length > 50) {
        existing.shift();
      }

      localStorage.setItem(CONFIG.analyticsKey, JSON.stringify(existing));

      if (CONFIG.debugMode) {
        console.log('NCC Internal Links: Analytics saved', analyticsData);
      }
    } catch (error) {
      console.error('NCC Internal Links: Failed to save analytics:', error);
    }
  }

  // ============================================
  // Публичный API для отладки
  // ============================================
  window.nccInternalLinks = {
    getAnalytics: function() {
      try {
        return JSON.parse(localStorage.getItem(CONFIG.analyticsKey) || '[]');
      } catch (error) {
        return [];
      }
    },
    clearAnalytics: function() {
      localStorage.removeItem(CONFIG.analyticsKey);
      console.log('NCC Internal Links: Analytics cleared');
    },
    clearCache: function() {
      localStorage.removeItem(CONFIG.cacheKey);
      console.log('NCC Internal Links: Cache cleared');
    },
    reprocess: function() {
      console.log('NCC Internal Links: Reprocessing...');
      process();
    },
    getConfig: function() {
      return CONFIG;
    },
    enableDebug: function() {
      CONFIG.debugMode = true;
      console.log('NCC Internal Links: Debug mode enabled');
    },
    disableDebug: function() {
      CONFIG.debugMode = false;
      console.log('NCC Internal Links: Debug mode disabled');
    }
  };

  // ============================================
  // Инициализация
  // ============================================
  function init() {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', process);
    } else {
      process();
    }

    // Наблюдатель за изменениями URL (для SPA)
    let lastUrl = location.href;
    new MutationObserver(function() {
      const url = location.href;
      if (url !== lastUrl) {
        lastUrl = url;
        // Очищаем кэш regex при смене страницы
        regexCache.clear();
        setTimeout(process, 500);
      }
    }).observe(document, {subtree: true, childList: true});
  }

  // Запускаем
  init();

  if (CONFIG.debugMode) {
    console.log('NCC Internal Links: Script initialized v1.0');
  }

})();
