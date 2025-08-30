// ===== Navegação mobile + Scrollspy + Simulador WhatsApp =====
document.addEventListener('DOMContentLoaded', () => {
  // --- Scrollspy: mantém seleção ativa na navegação
  const navAnchors = Array.from(document.querySelectorAll('.nav-links a[href^="#"]'));
  const sections = navAnchors
    .map(a => document.getElementById((a.getAttribute('href') || '').slice(1)))
    .filter(Boolean);

  let lockActiveUntil = 0; // impede que o scrollspy sobrescreva seleção durante rolagem suave

  function setActiveById(id) {
    navAnchors.forEach(a => {
      const match = (a.getAttribute('href') || '') === `#${id}`;
      a.classList.toggle('active', match);
      if (match) a.setAttribute('aria-current', 'page'); else a.removeAttribute('aria-current');
    });
  }

  function refreshActive() {
    if (Date.now() < lockActiveUntil) return;
    if (!sections.length) return;
    const offsetVar = getComputedStyle(document.documentElement).getPropertyValue('--nav-offset').trim();
    const offset = parseInt(offsetVar || '84', 10) || 84;
    const pos = window.scrollY + offset + 8;
    let currentId = sections[0].id;
    for (const sec of sections) { if (sec.offsetTop <= pos) currentId = sec.id; }
    setActiveById(currentId);
  }

  navAnchors.forEach(a => a.addEventListener('click', (e) => {
    const href = a.getAttribute('href') || '';
    if (!href.startsWith('#')) return;
    e.preventDefault();

    const id = href.slice(1);
    const targetEl = document.getElementById(id);
    if (id) setActiveById(id);
    lockActiveUntil = Date.now() + 1200;
    if (targetEl) {
      const offsetVar = getComputedStyle(document.documentElement).getPropertyValue('--nav-offset').trim();
      const navOffset = parseInt(offsetVar || '84', 10) || 84;
      const top = targetEl.getBoundingClientRect().top + window.scrollY - navOffset;
      window.scrollTo({ top: Math.max(0, top), behavior: 'smooth' });
    } else {
      location.hash = href;
    }
  }));

  window.addEventListener('scroll', refreshActive, { passive: true });
  refreshActive();

  // --- Menu mobile
  const toggle = document.querySelector('.nav-toggle');
  const links = document.querySelector('.nav-links');

  if (toggle && links) {
    toggle.addEventListener('click', () => {
      const opened = links.classList.toggle('open');
      toggle.setAttribute('aria-expanded', opened ? 'true' : 'false');
    });
    links.querySelectorAll('a').forEach(a =>
      a.addEventListener('click', () => {
        links.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
      })
    );
  }

  /* ===== WhatsApp em "Conferir produto" (sem imagem e sem slide) ===== */
  (function initPromoWhatsApp() {
    const number = '5561986644528'; // seu número
    const buttons = document.querySelectorAll('.promo-card .btn-light');
    if (!buttons.length) return;

    const labelFromId = (id) => {
      if (id === 'card-imovel') return 'Imóvel';
      if (id === 'card-veiculo') return 'Veículo';
      if (id === 'card-caminhao') return 'Caminhão';
      return 'Produto';
    };

    buttons.forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();

        const card = btn.closest('article');
        const tipo = labelFromId(card?.id || '');
        const titulo = card?.querySelector('h3')?.textContent.trim() || 'Conferir produto';

        let msg = `Olá! Quero conferir mais detalhes do ${tipo}.`;
        msg += `\nProduto: ${titulo}`;

        const url = `https://wa.me/${number}?text=${encodeURIComponent(msg)}`;
        window.open(url, '_blank');
      });
    });
  })();

  // Ao clicar em "Contato" fora do menu
  const contatoLinks = Array.from(document.querySelectorAll('a[href="#contato"]')).filter(a => !a.closest('.nav'));
  if (contatoLinks.length) {
    const onClickContato = (e) => {
      e.preventDefault();
      const section = document.getElementById('contato');
      if (!section) return;

      const offsetVar = getComputedStyle(document.documentElement).getPropertyValue('--nav-offset').trim();
      const navOffset = parseInt(offsetVar || '84', 10) || 84;
      const sectionTop = section.getBoundingClientRect().top + window.scrollY;
      const target = Math.max(0, sectionTop - navOffset);
      window.scrollTo({ top: target, behavior: 'smooth' });
    };
    contatoLinks.forEach(a => a.addEventListener('click', onClickContato));
  }

  // Slider do HERO (opcional, se tiver estrutura)
  (function initHeroSlider() {
    const elImg = document.getElementById('hero-slide');
    const dotsWrap = document.querySelector('.hero-dots');
    if (!elImg || !dotsWrap) return;
    // ... (mantém código original do slider)
  })();

  // Slider de produtos (opcional, se tiver estrutura)
  (function initProductSlider() {
    // ... (mantém código original)
  })();

  // Depoimentos
  const card = document.querySelector('.testimonial-card');
  if (card) {
    // ... (mantém código original)
  }

  // Slider por card (promo-media)
  (function initCardMediaSliders() {
    // ... (mantém código original)
  })();

  // --- Máscara de moeda (BRL) no campo valor
  const el = (id) => document.getElementById(id);
  const valorInput = el('valor');
  function formatBRLFromDigits(digitsStr) {
    const cents = parseInt(digitsStr || '0', 10) || 0;
    const value = cents / 100;
    return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  }
  function maskCurrencyInput(e) {
    const input = e.target;
    const digits = (input.value || '').replace(/\D/g, '');
    input.value = formatBRLFromDigits(digits);
  }
  if (valorInput) {
    maskCurrencyInput({ target: valorInput });
    valorInput.addEventListener('input', maskCurrencyInput);
    valorInput.addEventListener('blur', maskCurrencyInput);
    valorInput.addEventListener('paste', () => {
      setTimeout(() => maskCurrencyInput({ target: valorInput }), 0);
    });
  }

  // Dinâmica nos promo-cards ao rolar
  (function initPromoMotion() {
    // ... (mantém código original)
  })();

  // --- Simulador -> abrir WhatsApp
  const btn = el('btn-simular');
  if (btn) {
    btn.addEventListener('click', () => {
      const tipoEl = el('tipo');
      const tipoValue = (tipoEl?.value || '').trim();
      const tipoLabel = (tipoEl?.options?.[tipoEl.selectedIndex]?.text || tipoValue).trim();
      // Converte "R$ 120.000,00" -> 120000.00
      const rawValor = (el('valor')?.value || '');
      const digits = rawValor.replace(/\D/g, '');
      const valor = (parseInt(digits || '0', 10) || 0) / 100;
      const prazo = Number(el('prazo')?.value || 0);
      const nome = (el('nome')?.value || '').trim();

      if (!valor || !prazo || !tipoValue) {
        alert('Preencha Tipo, Valor e Prazo para simular.');
        return;
      }

      const brl = new Intl.NumberFormat('pt-BR', {
        style: 'currency', currency: 'BRL'
      }).format(valor);

      const linhas = [
        'Olá! Gostaria de simular.',
        `Tipo: ${tipoLabel}`,
        `Valor da carta: ${brl}`,
        `Prazo: ${prazo} meses`,
        nome ? `Nome: ${nome}` : null
      ].filter(Boolean);

      const texto = encodeURIComponent(linhas.join('\n'));
      window.open(`https://wa.me/5561986644528?text=${texto}`, '_blank');
    });
  }

  // Ícone dinâmico no select de Tipo
  const tipoSelect = el('tipo');
  const tipoIcon = document.querySelector('.select-field i');
  function updateTipoIconFixed() {
    if (!tipoSelect || !tipoIcon) return;
    const v = (tipoSelect.value || '').toLowerCase();
    if (v === 'imovel') {
      tipoIcon.classList.remove('fa-car-side');
      tipoIcon.classList.add('fa-house');
    } else {
      tipoIcon.classList.remove('fa-house');
      tipoIcon.classList.add('fa-car-side');
    }
  }
  if (tipoSelect) {
    updateTipoIconFixed();
    tipoSelect.addEventListener('change', updateTipoIconFixed);
  }

  // === Hero typing effect ===
  (function heroTyping() {
    const el = document.querySelector('.hero-typing');
    if (!el) return;
    const words = ['inteligente', 'seguro', 'acessível', 'planejado'];
    let i = 0;
    el.style.transition = 'opacity .18s ease';
    function swap() {
      i = (i + 1) % words.length;
      el.style.opacity = '0';
      setTimeout(() => {
        el.textContent = words[i];
        el.style.opacity = '1';
      }, 180);
    }
    setInterval(swap, 2000);
  })();

}); // fim do DOMContentLoaded

// ===== Contato -> envia via FormSubmit =====
function enviarEmail() {
  const get = (id) => document.getElementById(id);

  const nome = (get('nomeContato')?.value || get('nome')?.value || '').trim();
  const telefone = (get('telefone')?.value || '').trim();
  const emailCli = (get('emailCliente')?.value || '').trim();
  const mensagem = (get('mensagem')?.value || '').trim();

  if (!nome || !telefone || !mensagem) {
    alert('Preencha Nome, Telefone e Mensagem.');
    return;
  }

  const endpoint = 'https://formsubmit.co/ajax/' + encodeURIComponent('rsintermediacoesltdaofc@gmail.com');
  const payload = {
    _subject: 'Novo contato - R&S Intermediacoes',
    _template: 'table',
    _captcha: 'false',
    Nome: nome,
    Telefone: telefone,
    Email: emailCli,
    Mensagem: mensagem,
  };

  const form = document.getElementById('rs-form');
  const btn = form?.querySelector('button[type="submit"]');
  const originalHtml = btn ? btn.innerHTML : '';
  if (btn) { btn.disabled = true; btn.innerHTML = 'Enviando...'; }

  fetch(endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
    body: JSON.stringify(payload)
  })
    .then(res => { if (!res.ok) throw res; return res.json(); })
    .then(() => { alert('Mensagem enviada com sucesso!'); if (form) form.reset(); })
    .catch(async (err) => {
      let msg = 'Falha no envio. Tente novamente.';
      try { const j = await err.json(); if (j?.message) msg = 'Erro: ' + j.message; } catch (_) { }
      alert(msg);
    })
    .finally(() => { if (btn) { btn.disabled = false; btn.innerHTML = originalHtml; } });
}

// ===== Centralizar card ao clicar nos balões =====
(function initBalloonCentering() {
  const balloons = Array.from(document.querySelectorAll('.balloon-nav .balloon[href^="#"]'));
  if (!balloons.length) return;

  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const getNavOffset = () => {
    const v = getComputedStyle(document.documentElement).getPropertyValue('--nav-offset');
    const n = parseInt(v, 10);
    return Number.isFinite(n) ? n : 0;
  };
  const clamp = (v, min, max) => Math.max(min, Math.min(max, v));

  function centerScrollTo(el, { smooth = true } = {}) {
    if (!el) return;

    const navOffset = getNavOffset();
    const rect = el.getBoundingClientRect();
    const docTop = window.scrollY || window.pageYOffset;
    const targetTop = rect.top + docTop;
    const viewportH = window.innerHeight;
    const elH = rect.height;

    let top;
    if (elH >= viewportH) {
      // Se o card é maior que a viewport, alinha o topo, respeitando a nav
      top = targetTop - (navOffset + 12);
    } else {
      // Centraliza o card na viewport
      top = targetTop - (viewportH - elH) / 2;
    }

    const maxTop = document.documentElement.scrollHeight - viewportH;
    top = clamp(top, 0, Math.max(0, maxTop));

    window.scrollTo({
      top,
      behavior: (smooth && !prefersReduced) ? 'smooth' : 'auto'
    });

    // Acessibilidade: foco no card sem “pular” a tela
    el.setAttribute('tabindex', '-1');
    const delay = (smooth && !prefersReduced) ? 350 : 0;
    setTimeout(() => { try { el.focus({ preventScroll: true }); } catch (_) { } }, delay);
  }

  balloons.forEach(a => {
    a.addEventListener('click', (e) => {
      e.preventDefault();
      const id = (a.getAttribute('href') || '').slice(1);
      const target = document.getElementById(id);
      if (!target) return;

      // (opcional) já marca como ativo para feedback imediato
      balloons.forEach(b => b.removeAttribute('aria-current'));
      a.setAttribute('aria-current', 'page');

      centerScrollTo(target, { smooth: true });
    });
  });

  // (opcional) centraliza se abrir a página já com hash na URL:
  // window.addEventListener('load', () => {
  //   const id = location.hash.slice(1);
  //   const target = id && document.getElementById(id);
  //   if (target) centerScrollTo(target, { smooth: false });
  // });
})();

