/* =========================================================================
   CENTRAL DE PRESENTES DA LANA — comportamento
   ========================================================================= */

(function () {
  'use strict';

  var cfg = window.LANA_CONFIG || {};
  var semMovimento = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------------------------------------------------------------------
     1. Revelação no scroll
     Cada elemento com [data-reveal] entra quando cruza 12% da viewport.
     Grupos com [data-stagger] distribuem o atraso entre os filhos.
     --------------------------------------------------------------------- */
  /* Envolve cada palavra dos nós de texto em .palavra > span, recursivamente */
  function fatiarEmPalavras(no, conta, passo) {
    Array.prototype.slice.call(no.childNodes).forEach(function (filho) {
      if (filho.nodeType === 1) {
        fatiarEmPalavras(filho, conta, passo);
        return;
      }
      if (filho.nodeType !== 3 || !filho.nodeValue.trim()) return;

      var fragmento = document.createDocumentFragment();
      var partes = filho.nodeValue.split(/(\s+)/);

      partes.forEach(function (parte) {
        if (!parte) return;
        if (!parte.trim()) {
          fragmento.appendChild(document.createTextNode(parte));
          return;
        }
        var caixa = document.createElement('span');
        caixa.className = 'palavra';
        var interno = document.createElement('span');
        interno.textContent = parte;
        interno.style.setProperty('--atraso', conta.i * passo + 'ms');
        conta.i++;
        caixa.appendChild(interno);
        fragmento.appendChild(caixa);
      });

      no.replaceChild(fragmento, filho);
    });
  }

  function prepararStagger() {
    document.querySelectorAll('[data-stagger]').forEach(function (grupo) {
      var passo = parseInt(grupo.dataset.stagger, 10) || 70;
      Array.prototype.forEach.call(grupo.children, function (filho, i) {
        filho.style.setProperty('--atraso', i * passo + 'ms');
      });
    });

    /* Títulos que sobem palavra por palavra.
       Percorre os nós de texto em vez de achatar o textContent, para não
       destruir marcações internas (<span class="nome-lana">, <strong>...). */
    document.querySelectorAll('[data-palavras]').forEach(function (titulo) {
      var conta = { i: 0 };
      var passo = parseInt(titulo.dataset.palavras, 10) || 62;
      fatiarEmPalavras(titulo, conta, passo);
    });

    /* Elementos que animam em cascata dentro da própria seção.
       Cada grupo tem contador próprio, senão o atraso de um vaza no outro. */
    ['.checklist', '.predio'].forEach(function (seletor) {
      document.querySelectorAll(seletor).forEach(function (grupo) {
        var itens = grupo.querySelectorAll('li, .predio__andar');
        Array.prototype.forEach.call(itens, function (el, i) {
          el.style.setProperty('--atraso', i * 130 + 'ms');
        });
      });
    });
  }

  function observarRevelacoes() {
    var alvos = document.querySelectorAll('[data-reveal], .secao, .capa, .checklist, .predio');
    if (semMovimento || !('IntersectionObserver' in window)) {
      alvos.forEach(function (el) { el.classList.add('is-visivel'); });
      return;
    }
    var obs = new IntersectionObserver(function (entradas) {
      entradas.forEach(function (entrada) {
        if (!entrada.isIntersecting) return;
        entrada.target.classList.add('is-visivel');
        obs.unobserve(entrada.target);
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });

    alvos.forEach(function (el) { obs.observe(el); });
  }

  /* ---------------------------------------------------------------------
     2. Barra de progresso + botão "voltar ao menu"
     --------------------------------------------------------------------- */
  /* Barramento de scroll: TODO efeito ligado ao scroll se inscreve aqui,
     para a página inteira rodar num único requestAnimationFrame. */
  var inscritos = [];
  var pendente = false;

  function despachar() {
    pendente = false;
    var total = document.documentElement.scrollHeight - window.innerHeight;
    var estado = {
      y: window.scrollY,
      altura: window.innerHeight,
      progresso: total > 0 ? Math.min(1, Math.max(0, window.scrollY / total)) : 0,
    };
    for (var i = 0; i < inscritos.length; i++) inscritos[i](estado);
  }

  function agendar() {
    if (pendente) return;
    pendente = true;
    requestAnimationFrame(despachar);
  }

  function aoRolar(fn) {
    inscritos.push(fn);
    return fn;
  }

  function progressoDeLeitura() {
    var barra = document.querySelector('.progresso__barra');
    var voltar = document.querySelector('.voltar-menu');
    var capa = document.querySelector('.capa');

    aoRolar(function (e) {
      if (barra) barra.style.width = (e.progresso * 100).toFixed(2) + '%';
      if (voltar && capa) {
        voltar.classList.toggle('visivel', e.y > capa.offsetHeight * 0.85);
      }
    });

    window.addEventListener('scroll', agendar, { passive: true });
    window.addEventListener('resize', agendar, { passive: true });
    despachar();
  }

  /* ---------------------------------------------------------------------
     3. Rolagem suave para as âncoras (sem scrollIntoView)
     --------------------------------------------------------------------- */
  function ancorasSuaves() {
    document.addEventListener('click', function (ev) {
      var link = ev.target.closest('a[href^="#"]');
      if (!link) return;
      var id = link.getAttribute('href');
      if (id === '#' || id.length < 2) return;
      var destino = document.querySelector(id);
      if (!destino) return;
      ev.preventDefault();
      var topo = destino.getBoundingClientRect().top + window.scrollY - 6;
      window.scrollTo({ top: topo, behavior: semMovimento ? 'auto' : 'smooth' });
      history.replaceState(null, '', id);
    });
  }

  /* ---------------------------------------------------------------------
     4. Seleção de valores em cada bloco de contribuição
     --------------------------------------------------------------------- */
  function selecionarValores() {
    document.querySelectorAll('.valores').forEach(function (bloco) {
      var tiers = bloco.querySelectorAll('.tier');
      var botao = bloco.querySelector('[data-abrir-pix]');

      tiers.forEach(function (tier) {
        tier.addEventListener('click', function () {
          tiers.forEach(function (t) { t.setAttribute('aria-pressed', 'false'); });
          tier.setAttribute('aria-pressed', 'true');
          if (botao) botao.dataset.valor = tier.dataset.valor;
        });
      });

      /* O primeiro nível já vem marcado, para o botão nunca ficar sem valor */
      if (tiers.length) {
        tiers[0].setAttribute('aria-pressed', 'true');
        if (botao) botao.dataset.valor = tiers[0].dataset.valor;
      }
    });
  }

  /* ---------------------------------------------------------------------
     5. Seção Pix livre — chips de valor + campo aberto
     --------------------------------------------------------------------- */
  function pixLivre() {
    var chips = document.querySelectorAll('.chip[data-valor]');
    var campo = document.getElementById('pix-outro-valor');
    var botao = document.querySelector('[data-abrir-pix][data-origem="pix-livre"]');
    if (!botao) return;

    function marcar(valor) {
      botao.dataset.valor = valor || '';
      chips.forEach(function (c) {
        c.setAttribute('aria-pressed', String(Number(c.dataset.valor) === Number(valor)));
      });
      atualizarQrDaSecao(valor);
    }

    chips.forEach(function (chip) {
      chip.addEventListener('click', function () {
        if (campo) campo.value = '';
        marcar(chip.dataset.valor);
      });
    });

    if (campo) {
      campo.addEventListener('input', function () {
        var limpo = campo.value.replace(/[^\d,.]/g, '').replace(',', '.');
        var num = parseFloat(limpo);
        marcar(isNaN(num) || num <= 0 ? '' : num);
      });
    }

    marcar(50);
  }

  /* QR fixo da seção Pix, que acompanha o valor escolhido */
  function atualizarQrDaSecao(valor) {
    var moldura = document.getElementById('qr-pix-secao');
    var codigo = document.getElementById('pix-codigo-secao');
    if (!moldura) return;

    var payload = montarPayload(valor);
    if (codigo) {
      codigo.textContent = payload || 'Chave Pix ainda não configurada em assets/js/config.js';
    }
    desenharQr(moldura, payload);
  }

  /* ---------------------------------------------------------------------
     6. Pix: payload + QR Code
     --------------------------------------------------------------------- */
  function montarPayload(valor) {
    if (!cfg.pixChave || typeof window.gerarPix !== 'function') return '';
    if (!Number(valor) && cfg.pixCodigoOriginal) return cfg.pixCodigoOriginal;
    return window.gerarPix({
      chave: cfg.pixChave,
      nome: cfg.pixNome,
      cidade: cfg.pixCidade,
      valor: valor ? Number(valor) : 0,
      txid: 'NIVER' + (cfg.nome || '').toUpperCase().replace(/[^A-Z]/g, ''),
    });
  }

  function desenharQr(moldura, payload) {
    moldura.innerHTML = '';

    /* O QR do banco é sem valor. Só usamos sua imagem quando o copia e cola
       é exatamente o original; valores escolhidos geram um QR correspondente. */
    if (cfg.qrCodeImagem && payload && payload === cfg.pixCodigoOriginal) {
      var pronta = new Image();
      pronta.src = cfg.qrCodeImagem;
      pronta.alt = 'QR Code do Pix da ' + (cfg.nome || 'aniversariante');
      moldura.appendChild(pronta);
      return;
    }

    if (!payload || typeof window.qrcode !== 'function') {
      moldura.appendChild(recadoDeQr(payload
        ? 'QR Code indisponível — use o código copia e cola abaixo.'
        : 'QR Code pendente. Cadastre a chave Pix em assets/js/config.js.'));
      return;
    }

    try {
      /* tipo 0 = escolhe sozinho o tamanho da matriz; 'M' = correção média,
         que é o nível recomendado para BR Code impresso ou em tela. */
      var qr = window.qrcode(0, 'M');
      qr.addData(payload);
      qr.make();

      var img = new Image();
      img.src = qr.createDataURL(8, 0);
      img.alt = 'QR Code do Pix da ' + (cfg.nome || 'aniversariante');
      moldura.appendChild(img);
    } catch (erro) {
      moldura.appendChild(recadoDeQr('Não foi possível gerar o QR. Use o copia e cola.'));
    }
  }

  function recadoDeQr(texto) {
    var p = document.createElement('p');
    p.className = 'qr-vazio';
    p.textContent = texto;
    return p;
  }

  /* ---------------------------------------------------------------------
     7. Modal de pagamento
     --------------------------------------------------------------------- */
  function modalPix() {
    var modal = document.getElementById('modal-pix');
    if (!modal) return;

    var elValor = modal.querySelector('[data-modal-valor]');
    var elCausa = modal.querySelector('[data-modal-causa]');
    var elQr = modal.querySelector('[data-modal-qr]');
    var elCodigo = modal.querySelector('[data-modal-codigo]');
    var elChave = modal.querySelector('[data-modal-chave]');
    var btnCopiar = modal.querySelector('[data-copiar]');
    var linkZap = modal.querySelector('[data-whatsapp]');
    var aviso = modal.querySelector('[data-modal-aviso]');
    var ultimoFoco = null;
    var payloadAtual = '';

    function formatar(v) {
      return Number(v).toLocaleString('pt-BR', {
        style: 'currency', currency: 'BRL', minimumFractionDigits: 0,
      });
    }

    function abrir(gatilho) {
      ultimoFoco = gatilho;
      var valor = Number(gatilho.dataset.valor || 0);
      var causa = gatilho.dataset.causa || 'presente de aniversário';

      if (elValor) {
        var textoValor = valor > 0 ? formatar(valor) : 'valor livre';
        if (valor > 0 && window.LANA && window.LANA.contarAte) {
          window.LANA.contarAte(elValor, valor, textoValor);
        } else {
          elValor.textContent = textoValor;
        }
      }
      if (elCausa) elCausa.textContent = causa;

      payloadAtual = montarPayload(valor);
      if (elChave) elChave.textContent = cfg.pixChave || '—';
      if (elCodigo) {
        elCodigo.textContent = payloadAtual || 'Chave Pix ainda não configurada.';
      }
      if (aviso) aviso.hidden = Boolean(cfg.pixChave);
      if (btnCopiar) {
        btnCopiar.disabled = !payloadAtual;
        btnCopiar.textContent = 'Copiar código Pix';
      }
      if (elQr) desenharQr(elQr, payloadAtual);

      if (linkZap) {
        if (cfg.whatsapp) {
          var msg =
            'Oi ' + (cfg.nome || '') + '! Acabei de mandar ' +
            (valor > 0 ? formatar(valor) : 'um Pix') +
            ' pra causa: ' + causa + '. Feliz aniversário!';
          linkZap.href = 'https://wa.me/' + cfg.whatsapp + '?text=' + encodeURIComponent(msg);
          linkZap.hidden = false;
        } else {
          linkZap.hidden = true;
        }
      }

      modal.classList.add('aberto');
      modal.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
      var fechar = modal.querySelector('.modal__fechar');
      if (fechar) fechar.focus();
    }

    function fechar() {
      modal.classList.remove('aberto');
      modal.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
      if (ultimoFoco) ultimoFoco.focus();
    }

    document.querySelectorAll('[data-abrir-pix]').forEach(function (botao) {
      botao.addEventListener('click', function () { abrir(botao); });
    });

    modal.addEventListener('click', function (ev) {
      if (ev.target === modal || ev.target.closest('[data-fechar]')) fechar();
    });

    document.addEventListener('keydown', function (ev) {
      if (ev.key === 'Escape' && modal.classList.contains('aberto')) fechar();
    });

    if (btnCopiar) {
      btnCopiar.addEventListener('click', function () {
        if (!payloadAtual) return;
        copiar(payloadAtual).then(function (ok) {
          btnCopiar.textContent = ok ? 'Copiado! Cole no app do banco ✓' : 'Copie manualmente abaixo';
          setTimeout(function () { btnCopiar.textContent = 'Copiar código Pix'; }, 2600);
        });
      });
    }
  }

  function copiar(texto) {
    if (navigator.clipboard && window.isSecureContext) {
      return navigator.clipboard.writeText(texto).then(function () { return true; }, function () { return false; });
    }
    /* Fallback para file:// e navegadores antigos */
    var area = document.createElement('textarea');
    area.value = texto;
    area.setAttribute('readonly', '');
    area.style.position = 'fixed';
    area.style.opacity = '0';
    document.body.appendChild(area);
    area.select();
    var ok = false;
    try { ok = document.execCommand('copy'); } catch (e) { ok = false; }
    document.body.removeChild(area);
    return Promise.resolve(ok);
  }

  /* ---------------------------------------------------------------------
     8. Colagem e ticker gerados por script (para não poluir o HTML)
     --------------------------------------------------------------------- */

  /* Espalha estrelas recortadas dentro de um contêiner marcado com
     data-estrelas="6". Posições fixas, não aleatórias: composição de
     colagem é decisão de desenho, não sorteio. */
  var POSES = [
    /* Agrupadas perto dos objetos pendurados, não espalhadas pela página:
       estrela solta no meio do nada vira sujeira, não colagem. */
    { t: '9%',  l: '17%', tam: 38, giro: -13 },
    { t: '19%', l: '26%', tam: 21, giro: 15 },
    { t: '15%', l: '9%',  tam: 17, giro: 4 },
    { t: '56%', l: '92%', tam: 34, giro: -8 },
    { t: '69%', l: '85%', tam: 20, giro: 17 },
    { t: '31%', l: '96%', tam: 25, giro: -5 }
  ];

  function montarColagem() {
    document.querySelectorAll('[data-estrelas]').forEach(function (area) {
      var quantas = Math.min(parseInt(area.dataset.estrelas, 10) || 4, POSES.length);
      var cor = area.dataset.corEstrela || '';
      var fragmento = document.createDocumentFragment();

      for (var i = 0; i < quantas; i++) {
        var pose = POSES[i];
        var estrela = document.createElement('span');
        estrela.className = 'estrela';
        estrela.setAttribute('aria-hidden', 'true');
        estrela.style.top = pose.t;
        estrela.style.left = pose.l;
        estrela.style.setProperty('--tam', pose.tam + 'px');
        estrela.style.setProperty('--giro-estrela', pose.giro + 'deg');
        estrela.style.animationDelay = (i * 320) + 'ms';
        if (cor) estrela.style.setProperty('--cor', cor);
        fragmento.appendChild(estrela);
      }
      area.appendChild(fragmento);
    });
  }

  function montarTicker() {
    document.querySelectorAll('.ticker').forEach(function (ticker) {
      var trilha = ticker.querySelector('.ticker__trilha');
      if (!trilha) return;

      /* A trilha precisa ser mais larga que a tela, senão a volta do loop
         deixa um buraco. Duplicamos o conteúdo até cobrir a largura. */
      var base = trilha.innerHTML;
      var guarda = 0;
      while (trilha.scrollWidth < window.innerWidth && guarda < 6) {
        trilha.innerHTML += base;
        guarda++;
      }

      var copia = trilha.cloneNode(true);
      copia.setAttribute('aria-hidden', 'true');
      ticker.appendChild(copia);
    });
  }

  /* ---------------------------------------------------------------------
     9. Personaliza o nome da aniversariante a partir do config
     --------------------------------------------------------------------- */
  function aplicarNome() {
    if (!cfg.nome) return;
    document.querySelectorAll('[data-nome]').forEach(function (el) {
      el.textContent = cfg.nome;
    });
    document.title = 'Central de Presentes da ' + cfg.nome;
  }

  /* ---------------------------------------------------------------------
     Boot
     --------------------------------------------------------------------- */
  function iniciar() {
    aplicarNome();
    montarColagem();
    montarTicker();
    prepararStagger();
    observarRevelacoes();
    progressoDeLeitura();
    ancorasSuaves();
    selecionarValores();
    pixLivre();
    modalPix();
  }

  /* API usada por assets/js/animacoes.js */
  window.LANA = {
    aoRolar: aoRolar,
    agendar: agendar,
    semMovimento: semMovimento,
    fatiarEmPalavras: fatiarEmPalavras,
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', iniciar);
  } else {
    iniciar();
  }
})();
