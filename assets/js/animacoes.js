/* =========================================================================
   CENTRAL DE PRESENTES DA LANA — animações ligadas a scroll e interação
   Depende de window.LANA, exposto por main.js.
   ========================================================================= */

(function () {
  'use strict';

  function iniciar() {
    var LANA = window.LANA || {};
    var aoRolar = LANA.aoRolar || function () {};
    var parado = LANA.semMovimento;

    atrasosManuais();
    contadorDeSecao(aoRolar);

    /* Quem pediu movimento reduzido no sistema para por aqui: nenhum efeito
       ligado ao scroll chega a ser registrado. */
    if (parado) return;

    parallaxDaCapa(aoRolar);
    estrada(aoRolar);
    confeteFinal();
  }

  /* ---------------------------------------------------------------------
     1. Atrasos escritos no HTML — o tempo da piada
     data-atraso="700" vira --atraso: 700ms no elemento.
     --------------------------------------------------------------------- */
  function atrasosManuais() {
    document.querySelectorAll('[data-atraso]').forEach(function (el) {
      el.style.setProperty('--atraso', parseInt(el.dataset.atraso, 10) + 'ms');
    });
  }

  /* ---------------------------------------------------------------------
     2. Parallax da capa
     Fundo, miolo e varal andam em velocidades diferentes enquanto a capa
     sai de cena. Tudo escrito como custom property, o CSS aplica.
     --------------------------------------------------------------------- */
  function parallaxDaCapa(aoRolar) {
    var capa = document.querySelector('.capa');
    if (!capa) return;

    aoRolar(function (e) {
      var altura = capa.offsetHeight;
      if (e.y > altura) return;                 /* fora de cena: não mexe */

      var t = Math.min(1, e.y / altura);
      capa.style.setProperty('--parallax-fundo', (e.y * 0.28).toFixed(1) + 'px');
      capa.style.setProperty('--parallax-miolo', (e.y * -0.16).toFixed(1) + 'px');
      capa.style.setProperty('--faixa-desliza', (e.y * -0.1).toFixed(1) + 'px');
      capa.style.setProperty('--capa-opacidade', Math.max(0, 1 - t * 1.5).toFixed(3));
    });
  }

  /* ---------------------------------------------------------------------
     3. Estrada: o carro anda, inclina, deixa rastro e marca a quilometragem
     --------------------------------------------------------------------- */
  function estrada(aoRolar) {
    var pista = document.querySelector('.estrada');
    if (!pista) return;

    var carro = pista.querySelector('.estrada__carro');
    var placa = pista.querySelector('[data-km]');
    var riscos = pista.querySelectorAll('.estrada__risco');
    var anterior = 0;
    var kmMostrado = -1;

    aoRolar(function (e) {
      var caixa = pista.getBoundingClientRect();
      if (caixa.bottom < -200 || caixa.top > e.altura + 200) return;

      var avanco = (e.altura - caixa.top) / (e.altura + caixa.height);
      avanco = Math.min(1, Math.max(0, avanco));

      pista.style.setProperty('--avanco', avanco.toFixed(4));

      /* Velocidade = quanto o avanço mudou entre dois quadros.
         Serve para inclinar o carro e acender as linhas de rastro. */
      var velocidade = Math.min(1, Math.abs(avanco - anterior) * 26);
      anterior = avanco;

      if (carro) carro.style.setProperty('--inclina', (-velocidade * 7).toFixed(2) + 'deg');
      riscos.forEach(function (risco) {
        risco.style.setProperty('--forca-risco', velocidade.toFixed(2));
      });

      if (placa) {
        var km = Math.round(avanco * 47);
        if (km !== kmMostrado) {
          kmMostrado = km;
          placa.textContent = km;
        }
      }
    });
  }

  /* ---------------------------------------------------------------------
     4. Contador de seção no botão flutuante
     --------------------------------------------------------------------- */
  function contadorDeSecao(aoRolar) {
    var alvo = document.querySelector('[data-contador]');
    if (!alvo) return;

    var secoes = document.querySelectorAll('main > section, main > header');
    var total = secoes.length;
    var ultimo = -1;

    aoRolar(function (e) {
      var atual = 0;
      for (var i = 0; i < total; i++) {
        if (secoes[i].getBoundingClientRect().top <= e.altura * 0.45) atual = i;
      }
      if (atual === ultimo) return;
      ultimo = atual;
      alvo.textContent = pad(atual + 1) + '/' + pad(total);
    });
  }

  function pad(n) { return String(n).padStart(2, '0'); }

  /* ---------------------------------------------------------------------
     5. Confete de festa na seção final
     Estrelas, discos e fitinhas caindo. Cai uma vez, e os elementos são
     removidos do DOM ao terminar.
     --------------------------------------------------------------------- */
  function confeteFinal() {
    var palco = document.querySelector('.confete');
    if (!palco || !('IntersectionObserver' in window)) return;

    /* Sem marfim: a seção final é marfim e o confete sumiria no fundo */
    var cores = ['#F3D07A', '#2F6B65', '#DDB24C', '#23504E', '#22201D'];
    var formatos = ['e', 'd', 'r'];   /* estrela, disco, fitinha */

    var obs = new IntersectionObserver(function (entradas) {
      entradas.forEach(function (entrada) {
        if (!entrada.isIntersecting) return;
        obs.disconnect();
        soltar();
      });
    }, { threshold: 0.25 });

    obs.observe(palco.parentNode);

    function soltar() {
      var quantidade = window.innerWidth < 700 ? 24 : 42;
      var fragmento = document.createDocumentFragment();
      var maisLongo = 0;

      for (var i = 0; i < quantidade; i++) {
        var papel = document.createElement('i');
        var tempo = 3.8 + Math.random() * 3;
        var espera = Math.random() * 2.4;
        maisLongo = Math.max(maisLongo, tempo + espera);

        papel.className = formatos[i % formatos.length];
        papel.style.left = (Math.random() * 100).toFixed(2) + '%';
        papel.style.background = cores[i % cores.length];
        papel.style.setProperty('--tempo', tempo.toFixed(2) + 's');
        papel.style.setProperty('--espera', espera.toFixed(2) + 's');
        papel.style.setProperty('--rodopio', Math.round(360 + Math.random() * 720) + 'deg');
        papel.style.transform = 'scale(' + (0.7 + Math.random() * 0.7).toFixed(2) + ')';
        fragmento.appendChild(papel);
      }

      palco.appendChild(fragmento);
      /* Limpa o DOM quando a última peça some */
      setTimeout(function () { palco.innerHTML = ''; }, (maisLongo + 0.6) * 1000);
    }
  }

  /* ---------------------------------------------------------------------
     6. Números que sobem em vez de aparecer prontos
     Exposto como window.LANA.contarAte — main.js chama ao abrir o modal.
     --------------------------------------------------------------------- */
  function contarAte(el, alvo, textoFinal) {
    if (!el) return;
    if (window.LANA && window.LANA.semMovimento) {
      el.textContent = textoFinal;
      return;
    }

    var inicio = performance.now();
    var duracao = 620;

    function quadro(agora) {
      var t = Math.min(1, (agora - inicio) / duracao);
      var suave = 1 - Math.pow(1 - t, 3);          /* easeOutCubic */
      if (t < 1) {
        el.textContent = formatarReal(Math.round(alvo * suave));
        requestAnimationFrame(quadro);
      } else {
        el.textContent = textoFinal;
      }
    }
    requestAnimationFrame(quadro);
  }

  function formatarReal(v) {
    return Number(v).toLocaleString('pt-BR', {
      style: 'currency', currency: 'BRL', minimumFractionDigits: 0,
    });
  }

  if (window.LANA) window.LANA.contarAte = contarAte;

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', iniciar);
  } else {
    iniciar();
  }
})();
