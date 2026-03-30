// ============================================================================
// script.js
// ============================================================================

// Mensagem de boas-vindas
console.log('Bem-vindo ao meu portfólio, me chamo Gabriel Lima!');


// ============================================================================
// MENU: link ativo conforme scroll + clique
// ============================================================================

const links = document.querySelectorAll('.menu-navegacao .link-menu');
const secoes = document.querySelectorAll('main section');

function atualizarLinkAtivo() {
  let indexAtivo = secoes.length - 1;

  for (let i = 0; i < secoes.length; i++) {
    const secaoTopo = secoes[i].getBoundingClientRect().top;
    if (secaoTopo > 80) break;
    indexAtivo = i;
  }

  const idAtivo = secoes[indexAtivo]?.id;
  if (!idAtivo) return;

  links.forEach((l) => l.classList.remove('link-ativo'));
  const alvo = document.querySelector(`.menu-navegacao .link-menu[href="#${idAtivo}"]`);
  if (alvo) alvo.classList.add('link-ativo');
}

links.forEach((link) => {
  link.addEventListener('click', function () {
    links.forEach((l) => l.classList.remove('link-ativo'));
    this.classList.add('link-ativo');
  });
});

window.addEventListener('scroll', atualizarLinkAtivo);
window.addEventListener('DOMContentLoaded', () => {
  atualizarLinkAtivo();
  const linkHome = document.querySelector('.menu-navegacao .link-menu[href="#home"]');
  if (linkHome) {
    document.querySelectorAll('.menu-navegacao .link-menu').forEach((l) => l.classList.remove('link-ativo'));
    linkHome.classList.add('link-ativo');
  }
});

window.addEventListener('DOMContentLoaded', () => {
  if (window.location.hash === '#sobre' || window.location.hash === '#sobre-educacao') {
    history.replaceState(null, '', window.location.pathname);
    window.scrollTo({ top: 0, behavior: 'auto' });
  }
});

window.addEventListener('DOMContentLoaded', () => {
  if (window.location.hash) {
    history.replaceState(null, '', window.location.pathname);
    window.scrollTo({ top: 0, behavior: 'auto' });
  }
});

function inicializarLazyLoadingProjetos() {
  const imagensLazy = document.querySelectorAll('img[data-src]');
  if (!imagensLazy.length) return;

  const carregarImagem = (img) => {
    const src = img.getAttribute('data-src');
    if (!src || img.dataset.lazyLoaded === 'true') return;

    img.src = src;
    img.dataset.lazyLoaded = 'true';
    img.removeAttribute('data-src');
  };

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        carregarImagem(entry.target);
        obs.unobserve(entry.target);
      });
    }, {
      root: null,
      rootMargin: '220px 0px',
      threshold: 0.01,
    });

    imagensLazy.forEach((img) => observer.observe(img));
    return;
  }

  imagensLazy.forEach(carregarImagem);
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', inicializarLazyLoadingProjetos);
} else {
  inicializarLazyLoadingProjetos();
}

// ============================================================================
// SEÇÃO SOBRE – Carrossel
// ============================================================================

(function () {
  const SELECTORS = {
    carousel: '.carrossel-sobre',
    track: '.trilho-carrossel',
    slides: '.slide-sobre',
    dots:   '.aba-carrossel',
  };

  const AUTO_MS = 60_000;
  const ANIM_MS = 1400;

  const CLS = {
    active:           'is-active',
    enteringFromLeft: 'enter-from-left',
    enteringFromRight:'enter-from-right',
    leavingToLeft:    'leave-to-left',
    leavingToRight:   'leave-to-right',
  };

  let autoTimer = null;
  let isPaused  = false;

  const $  = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));

  function clearAnimClasses(el) {
    el?.classList.remove(
      CLS.enteringFromLeft, CLS.enteringFromRight,
      CLS.leavingToLeft,    CLS.leavingToRight,
      'entrar-da-direita','entrar-da-esquerda','sair-para-esquerda','sair-para-direita'
    );
  }

  function safelyShow(el) {
    if (!el) return;
    el.style.display = 'block';
    el.offsetHeight;
    el.style.opacity = '1';
  }

  function safelyHide(el) {
    if (!el) return;
    el.style.opacity = '0';
    setTimeout(() => { el.style.display = 'none'; }, ANIM_MS);
  }

  function setDotActive(dots, targetId) {
    dots.forEach((d) => {
      const on = d.getAttribute('href') === `#${targetId}`;
      d.setAttribute('aria-selected', on ? 'true' : 'false');
    });
  }

  function animateSwitch(current, next, direction) {
    if (current === next) return;

    if (current) clearAnimClasses(current);
    if (next)    clearAnimClasses(next);

    if (current) {
      current.classList.remove(CLS.active);
      current.style.display = 'block';
      current.style.opacity = '1';
      current.classList.add('sair-para-esquerda');
    }

    const entradaDelay = ANIM_MS * 0.5;

    setTimeout(() => {
      if (next) {
        next.classList.add(CLS.active);
        next.style.display = 'block';
        next.style.opacity = '1';
        next.classList.add('entrar-da-direita');
        setTimeout(() => clearAnimClasses(next), ANIM_MS);
      }
    }, entradaDelay);

    setTimeout(() => {
      if (current) {
        clearAnimClasses(current);
        current.style.display = 'none';
        current.style.opacity = '0';
      }
    }, ANIM_MS + entradaDelay);
  }

  function setupAboutCarousel() {
    const carousel = $(SELECTORS.carousel);
    if (!carousel) return;

    const track  = $(SELECTORS.track, carousel);
    let slides   = $$(SELECTORS.slides, track);
    const dots   = $$(SELECTORS.dots,  carousel);

    slides = slides.slice(0, 2);
    if (slides.length < 2) return;

    carousel.classList.add('js-ready');
    carousel.style.setProperty('--sobre-anim-ms', `${ANIM_MS}ms`);

    let currentIndex = 0;
    history.replaceState(null, '', `#${slides[0].id}`);

    slides.forEach((s, i) => {
      if (i === currentIndex) {
        s.classList.add(CLS.active);
        safelyShow(s);
      } else {
        s.classList.remove(CLS.active);
        s.style.display = 'none';
        s.style.opacity = '0';
      }
    });
    setDotActive(dots, slides[currentIndex].id);

    dots.forEach((dot, i) => {
      dot.addEventListener('click', (ev) => {
        ev.preventDefault();
        if (i === currentIndex) return;
        const direction = i > currentIndex ? 'forward' : 'backward';
        const current   = slides[currentIndex];
        const next      = slides[i];

        history.pushState(null, '', dot.getAttribute('href'));
        animateSwitch(current, next, direction);
        currentIndex = i;
        setDotActive(dots, slides[currentIndex].id);
        restartAuto();
      });
    });

    window.addEventListener('hashchange', () => {
      const id = location.hash.slice(1);
      const i  = slides.findIndex((s) => s.id === id);
      if (i < 0 || i === currentIndex) return;
      const direction = i > currentIndex ? 'forward' : 'backward';
      animateSwitch(slides[currentIndex], slides[i], direction);
      currentIndex = i;
      setDotActive(dots, slides[currentIndex].id);
      restartAuto();
    });

    function tick() {
      if (isPaused) return;
      const nextIndex = (currentIndex + 1) % slides.length;
      animateSwitch(slides[currentIndex], slides[nextIndex], 'forward');
      currentIndex = nextIndex;
      setDotActive(dots, slides[currentIndex].id);
    }

    function startAuto()  { autoTimer = setInterval(tick, AUTO_MS); }
    function stopAuto()   { clearInterval(autoTimer); autoTimer = null; }
    function restartAuto(){ stopAuto(); startAuto(); }

    document.addEventListener('visibilitychange', () => { isPaused = document.hidden; });
    carousel.addEventListener('mouseenter', () => { isPaused = true;  });
    carousel.addEventListener('mouseleave', () => { isPaused = false; });

    startAuto();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', setupAboutCarousel);
  } else {
    setupAboutCarousel();
  }
})();


// ============================================================================
// PARTICLES (home)
// ============================================================================

window.addEventListener('DOMContentLoaded', function () {
  if (window.particlesJS) {
    particlesJS('particles-js', {
      particles: {
        number: { value: 200, density: { enable: true, value_area: 800 } },
        color: { value: '#FFFFFF' },
        shape: { type: 'circle' },
        opacity: { value: 0.5, random: true },
        size: { value: 2, random: true },
        line_linked: { enable: true, distance: 150, color: '#ffffff', opacity: 0.5, width: 1 },
        move: { enable: true, speed: 0.7, direction: 'none', random: false, straight: false, out_mode: 'out', bounce: false }
      },
      interactivity: {
        detect_on: 'canvas',
        events: { onhover: { enable: true, mode: 'grab' }, onclick: { enable: true, mode: 'push' }, resize: true },
        modes: { grab: { distance: 150, line_linked: { opacity: 0.7 } }, push: { particles_nb: 1 } }
      },
      retina_detect: true
    });
  }
});


// ============================================================================
// HOME – efeito de digitação
// ============================================================================

const typingEl    = document.querySelector('.typing-effect');
const subtituloEl = document.querySelector('.subtitulo');

if (typingEl && subtituloEl) {
  const textoTitulo   = 'Seja bem-vindo ao meu ';
  const highlight     = 'Portfólio';
  const textoSubtitulo= 'Desenvolvedor Back-end | Banco de Dados';
  let i = 0, j = 0;

  subtituloEl.style.visibility = 'hidden';

  typingEl.innerHTML = '<span class="typing-text"></span><span class="typing-cursor">|</span>';
  const typingTextEl = typingEl.querySelector('.typing-text');

  function typeTitulo() {
    if (i < textoTitulo.length) {
      typingTextEl.innerHTML += textoTitulo.charAt(i);
      i++;
      setTimeout(typeTitulo, 110);
    } else if (j < highlight.length) {
      if (j === 0) typingTextEl.innerHTML += '<span class="highlight"></span>';
      const highlightEl = typingTextEl.querySelector('.highlight');
      highlightEl.textContent += highlight.charAt(j);
      j++;
      setTimeout(typeTitulo, 110);
    } else {
      const cursor = typingEl.querySelector('.typing-cursor');
      if (cursor) cursor.remove();
      setTimeout(typeSubtitulo, 400);
    }
  }

  function typeSubtitulo() {
    let k = 0;
    subtituloEl.textContent = '';
    subtituloEl.style.visibility = 'visible';
    (function escrever() {
      if (k < textoSubtitulo.length) {
        subtituloEl.textContent += textoSubtitulo.charAt(k);
        k++;
        setTimeout(escrever, 70);
      }
    })();
  }

  typeTitulo();
}


// ============================================================================
// (LEGADO) Carrossel Sobre com setas
// ============================================================================

const slidesSobre    = document.querySelectorAll('.carrossel-sobre-slide');
const btnProximo     = document.getElementById('proximo');
const btnAnterior    = document.getElementById('anterior');
let   slideAtualSobre= 0;
let   timerSobre;

function mostrarSlideSobre(index) {
  slidesSobre.forEach((slide, i) => {
    slide.classList.toggle('ativo', i === index);
  });
  slideAtualSobre = index;
}
function proximoSlideSobre()  { mostrarSlideSobre((slideAtualSobre + 1) % slidesSobre.length); }
function anteriorSlideSobre() { mostrarSlideSobre((slideAtualSobre - 1 + slidesSobre.length) % slidesSobre.length); }
function iniciarTimerSobre()  { timerSobre = setInterval(proximoSlideSobre, 7000); }
function pararTimerSobre()    { clearInterval(timerSobre); }

if (btnProximo && btnAnterior) {
  btnProximo.addEventListener('click', proximoSlideSobre);
  btnAnterior.addEventListener('click', anteriorSlideSobre);
}

const carrosselContainer = document.querySelector('.carrossel-container');
if (carrosselContainer) {
  carrosselContainer.addEventListener('mouseenter', pararTimerSobre);
  carrosselContainer.addEventListener('mouseleave', iniciarTimerSobre);
}
if (slidesSobre.length) {
  mostrarSlideSobre(0);
  iniciarTimerSobre();
}


// ============================================================================
// SERVIÇOS – modal
// ============================================================================

const titulosServicos = [
  'Desenvolvimento Backend',
  'Gerenciamento de Bancos de Dados (SQL/NoSQL)',
  'Integração de APIs',
  'Desenvolvimento Frontend Básico'
];

const textosServicos = [
  ` Atuo no desenvolvimento de aplicações backend e serviços de processamento de dados, projetando sistemas responsáveis pela lógica de negócio, manipulação de informações e integração entre diferentes camadas de software.

 Minha experiência envolve principalmente o uso de Node.js, Python e C#, tecnologias que utilizo para desenvolver aplicações, automações, serviços de dados e ferramentas voltadas à manipulação e processamento de informações.

 No ecossistema Node.js, desenvolvo serviços backend e APIs responsáveis pela comunicação entre aplicações, gerenciamento de requisições e integração com bancos de dados.

 Com Python, desenvolvo aplicações, scripts de automação e pipelines de dados, utilizando bibliotecas voltadas para manipulação, tratamento e análise de grandes volumes de informação.

 Já com C#, aplico conceitos de programação orientada a objetos para desenvolvimento de aplicações estruturadas e organizadas.

 Durante o desenvolvimento, aplico boas práticas de engenharia de software como:

 - organização modular de código
 - separação de responsabilidades
 - tratamento de erros e validação de dados
 - padronização de estruturas de projeto
 - otimização de processamento e manipulação de dados

 Esse conjunto de práticas permite construir sistemas escaláveis, reutilizáveis e de fácil manutenção, preparados para lidar com diferentes tipos de aplicações e fluxos de dados. `,

  ` Possuo experiência na modelagem, manipulação e análise de dados em bancos relacionais, com foco na organização eficiente da informação e na construção de estruturas de dados confiáveis.

 Trabalho principalmente com PostgreSQL, utilizando SQL avançado para criação e manutenção de estruturas de banco de dados, incluindo:

 - modelagem relacional
 - criação de tabelas, índices e constraints
 - definição de relacionamentos entre entidades
 - otimização de consultas e desempenho
 - manipulação e transformação de grandes conjuntos de dados

 Também realizo processos de tratamento, consolidação e padronização de dados, frequentemente utilizando Python como ferramenta complementar para ETL, limpeza de dados e automação de manipulações em larga escala.

 Além disso, possuo familiaridade com arquiteturas NoSQL, compreendendo suas aplicações em cenários onde flexibilidade estrutural, escalabilidade horizontal e alto volume de dados são necessários.

 Para gerenciamento e integração de banco de dados em aplicações modernas, também utilizo plataformas como Supabase, que fornece uma infraestrutura baseada em PostgreSQL com recursos de autenticação, APIs automáticas e gerenciamento simplificado. `,

  ` Desenvolvo e integro sistemas através de APIs RESTful, permitindo a comunicação entre aplicações, serviços externos e plataformas de dados.

 Tenho experiência tanto na criação quanto no consumo de APIs, projetando endpoints estruturados, manipulando requisições HTTP e organizando respostas em formatos padronizados como JSON.

 Para isso utilizo tecnologias e bibliotecas como:

 - Node.js para construção de serviços e endpoints
 - Python para consumo de APIs, automações e pipelines de dados
 - bibliotecas de requisição HTTP como Axios, Fetch API e Requests

 Essas integrações são frequentemente utilizadas para:

 - consumo de dados externos
 - automação de fluxos de informação
 - sincronização entre sistemas
 - construção de pipelines de dados
 - integração entre aplicações backend e interfaces frontend

 Também aplico práticas como tratamento de erros, validação de dados recebidos e padronização de respostas, garantindo confiabilidade e estabilidade na comunicação entre sistemas. `,

  ` Também desenvolvo interfaces web voltadas à construção de aplicações modernas, priorizando usabilidade, organização estrutural e integração eficiente com serviços backend.

 Minha experiência envolve o desenvolvimento de interfaces utilizando as tecnologias fundamentais da web — HTML, CSS e JavaScript — aplicadas na construção de páginas dinâmicas, responsivas e estruturadas de acordo com boas práticas de desenvolvimento.

 No processo de desenvolvimento frontend, trabalho com conceitos como:

 - manipulação dinâmica do DOM
 - consumo e integração com APIs REST
 - renderização dinâmica de dados
 - estruturação semântica de interfaces
 - responsividade e adaptação para diferentes dispositivos

 Também aplico técnicas modernas de estilização utilizando CSS avançado, incluindo:

 - Flexbox e CSS Grid
 - organização modular de estilos
 - criação de layouts responsivos
 - animações e transições para melhorar a experiência do usuário

 Utilizando JavaScript, desenvolvo funcionalidades interativas e sistemas capazes de consumir dados de serviços externos, manipular informações em tempo real e atualizar elementos da interface de forma dinâmica.

 Essa abordagem permite construir interfaces que atuam como camada de apresentação para aplicações mais complexas, integrando dados provenientes de APIs, bancos de dados e serviços backend.

 Além da implementação técnica, também busco aplicar princípios de design moderno e organização visual, criando interfaces limpas, funcionais e alinhadas às práticas atuais do desenvolvimento web. `
];

document.querySelectorAll('.botao-oque-faco').forEach((btn, idx) => {
  btn.addEventListener('click', () => {
    const modal    = document.querySelector('.tela-cada-servico');
    const conteudo = document.getElementById('tela-conteudo-servico');
    modal.style.display = 'flex';
    conteudo.classList.remove('saindo', 'ativo');
    document.getElementById('modal-titulo').textContent = titulosServicos[idx];
    document.getElementById('modal-texto').textContent  = textosServicos[idx];
    void conteudo.offsetWidth;
    conteudo.classList.add('ativo');
  });
});

function fecharModal() {
  const modal    = document.querySelector('.tela-cada-servico');
  const conteudo = document.getElementById('tela-conteudo-servico');
  conteudo.classList.remove('ativo');
  conteudo.classList.add('saindo');
  setTimeout(() => {
    modal.style.display = 'none';
    conteudo.classList.remove('saindo');
  }, 500);
}

const fecharServBtn = document.getElementById('tela-fechar-servico');
if (fecharServBtn) {
  fecharServBtn.onclick = fecharModal;
}
const modalServ = document.querySelector('.tela-cada-servico');
if (modalServ) {
  modalServ.onclick = function (e) {
    if (e.target === this || e.target.classList.contains('modal-backdrop')) fecharModal();
  };
}


// ============================================================================
// CONHECIMENTOS – hover com blur de fundo + janelas
// ============================================================================

document.querySelectorAll('.card-conhecimento').forEach((card) => {
  const janela = card.querySelector('div[class^="janela-conhecimento"]');
  const fundo  = document.getElementById('fundo-desfocado-conhecimento');
  let janelaTimeout = null;

  function mostrarJanela() {
    if (fundo) fundo.classList.add('ativo');
    card.classList.add('ativo');
    if (janelaTimeout) clearTimeout(janelaTimeout);
    janelaTimeout = setTimeout(() => {
      if (janela) {
        janela.classList.add('ativo');
        janela.classList.remove('saindo');
      }
    }, 300);
  }

  function esconderJanela(e) {
    if (!card.contains(e.relatedTarget) && (!janela || !janela.contains(e.relatedTarget))) {
      if (fundo) fundo.classList.remove('ativo');
      card.classList.remove('ativo');
      if (janelaTimeout) clearTimeout(janelaTimeout);
      if (janela) {
        janela.classList.remove('ativo');
        janela.classList.add('saindo');
        janelaTimeout = setTimeout(() => {
          janela.classList.remove('saindo');
        }, 600);
      }
    }
  }

  card.addEventListener('mouseenter', mostrarJanela);
  card.addEventListener('mouseleave', esconderJanela);
  if (janela) janela.addEventListener('mouseleave', esconderJanela);
});


// ============================================================================
// MODAL DE PROJETOS – abrir/fechar + carrossel (imagens/vídeo)
// ============================================================================

const openModalProjetos = () => {
  const modal = document.getElementById('segundatela-projetos');
  if (modal) modal.style.display = 'flex';
};
const closeModalProjetos = () => {
  const modal = document.getElementById('segundatela-projetos');
  if (modal) modal.style.display = 'none';
};

const projetos = [
  {
    titulo: "Store Power BI",
    descricao: `Projeto de Business Intelligence desenvolvido no Power BI a partir de dados transacionais de uma loja.

O trabalho envolveu tratamento, limpeza e modelagem dos dados, aplicação de métricas e indicadores com DAX e construção de um modelo analítico voltado à análise de desempenho comercial.

Foram criadas duas telas interativas com foco em KPIs estratégicos — faturamento, volume de vendas, desempenho por produto e análise temporal — permitindo a identificação de padrões, tendências e oportunidades de melhoria no negócio.

O projeto demonstra domínio de análise de dados, visualização, storytelling com dados e suporte à tomada de decisão baseada em evidências.`,
    imagens: [
      "Imagens/webp/Dashboard Store/DashPowerBi1.webp",
      "Imagens/webp/Dashboard Store/DashPowerBi2.webp",
      "Imagens/webp/Dashboard Store/VideoDash.mp4"
    ],
    data: "Feito em 02/2026",
    linguagens: "Power BI, DAX, SQL",
    github: "https://github.com/GabrielLima-BD/store.powerbi-prt",
  },
{
  titulo: 'Sis. Biblioteca',
  descricao: `Sistema completo de gerenciamento de biblioteca desenvolvido com arquitetura separada entre frontend e backend, integrações com Supabase e foco em operação prática, rastreabilidade e experiência de uso clara.

    O projeto cobre os principais fluxos de uma biblioteca real: cadastro e gestão de clientes e livros, criação e acompanhamento de reservas, controle de multas e painel analítico com métricas agregadas. Cada módulo foi pensado para operar de forma independente, com estados de busca organizados, navegação por domínio de negócio e leitura rápida para uso cotidiano.

    No backend, a API REST em Node.js com Express centraliza todas as regras de negócio — controle de estoque, fluxo de reservas com finalização e cancelamento, baixa de multas e agregações para o dashboard. O frontend consome a API por um cliente HTTP único, sem lógica de domínio espalhada pela interface.

    A persistência é feita via Supabase, com variáveis de ambiente controladas, CORS configurado por origem permitida e logs centralizados com Morgan. O projeto inclui script de seed incremental, atalho de inicialização para Windows e separação clara entre camadas para facilitar manutenção e evolução futura.

    Competências demonstradas no projeto:
      · Arquitetura REST com separação real entre frontend e backend
      · CRUD completo com buscas por múltiplos filtros em todos os domínios
      · Regras de negócio aplicadas no backend — estoque, reservas e multas
      · Dashboard executivo com KPIs, gráficos e rankings agregados
      · Integração com Supabase e configuração segura de ambiente
      · Estrutura organizada para portfólio, avaliação técnica e evolução incremental`,
    imagens: [
      'Imagens/webp/Sis Biblioteca/SisBiblioteca.webp',
      'Imagens/webp/Sis Biblioteca/SisBiblioteca2.webp',
      'Imagens/webp/Sis Biblioteca/SisBiblioteca3.webp',
      'Imagens/webp/Sis Biblioteca/SisBiblioteca4.webp',
      'Imagens/webp/Sis Biblioteca/SisBiblioteca5.webp',
      'Imagens/webp/Sis Biblioteca/SisBiblioteca6.webp',
      'Imagens/webp/Sis Biblioteca/SisBiblioteca7.webp',
      'Imagens/webp/Sis Biblioteca/SisBiblioteca8.webp',
      'Imagens/webp/Sis Biblioteca/SisBiblioteca9.webp',
      'Imagens/webp/Sis Biblioteca/SisBiblioteca10.webp'
    ],
    data: '10/2025',
    linguagens: "JAVASCRIPT, NODE/EXPRESS, HTML, CSS, JSON, POSTGRESQL"
  },
  {
    titulo: 'Project Fraud',
    descricao: '',
    imagens: ['Imagens/webp/Foto Projetos Em Desenvolvimento/EmDesenvolvimento.webp'],
    data: '...',
    linguagens: '...'
  },
  {
    titulo: "Cafe Borcelle",
    descricao: `Borcelle La Café é um site premium para cafeteria desenvolvido com foco em UX/UI, performance e design responsivo.

O projeto evoluiu de um site estático para uma aplicação web moderna, incorporando sistema de e-commerce funcional, animações suaves e arquitetura frontend bem estruturada. Conta com carrinho de compras persistente via localStorage, cálculo automático de valores, modal de checkout, formulários com validação em tempo real e feedback visual, além de suporte completo a acessibilidade e navegação por teclado.

O layout utiliza CSS Grid e Flexbox, sistema de temas com variáveis CSS (dark/light) e tipografia premium. A aplicação foi otimizada para alta performance, alcançando pontuação acima de 95 no Lighthouse, com carregamento rápido, lazy loading de imagens e boas práticas de SEO.

Totalmente responsivo e com abordagem mobile-first, o projeto oferece uma experiência consistente em diferentes dispositivos. Desenvolvido com HTML5, CSS3 e JavaScript moderno, demonstra domínio de JavaScript vanilla, arquitetura CSS profissional e atenção minuciosa à experiência do usuário.`,
    imagens: [
      "Imagens/webp/Cafe Borcelles/Borcelles1.webp",
      "Imagens/webp/Cafe Borcelles/Borcelles2.webp",
      "Imagens/webp/Cafe Borcelles/Borcelles3.webp",
      "Imagens/webp/Cafe Borcelles/Borcelles4.webp",
      "Imagens/webp/Cafe Borcelles/Borcelles5.webp",
      "Imagens/webp/Cafe Borcelles/Borcelles6.webp",
      "Imagens/webp/Cafe Borcelles/Borcelles7.webp"
    ],
    data: "Feito em 08/2025",
    linguagens: "HTML, CSS, JS",
    github: "https://github.com/GabrielLima-BD/cafeteria.borcelles-prt",
    site: "https://gabriellima-bd.github.io/cafeteria.borcelles-prt/"
  },
  {
    titulo: "API Correios",
    descricao: `Correios Helper é uma aplicação web completa para consulta de CEP e simulação de frete premium, combinando frontend moderno com backend em Node.js/Express.

O sistema integra a API ViaCEP e o SOAP dos Correios (CalcPrecoPrazo), oferecendo uma experiência visual refinada, responsiva e orientada a microinterações. A aplicação permite consultar endereços por CEP, simular fretes SEDEX e PAC entre dois CEPs, calcular valores e prazos automaticamente e destacar a melhor opção de envio. Conta ainda com histórico detalhado de consultas, exportação de resultados em CSV, modo escuro/claro, loaders animados e interface de alto padrão com foco em UX/UI.

O backend atua como API e proxy, com fallback mock para simulação de frete quando o serviço dos Correios está indisponível, além de suporte a variáveis de ambiente, logs verbosos e boas práticas de segurança.

O projeto conta com infraestrutura pronta para Azure, deploy automatizado via GitHub Actions e arquivos Bicep para provisionamento em produção. Demonstra domínio em integrações externas, arquitetura backend, automação de deploy e preparação para ambientes reais de produção.`,
    imagens: [
      "Imagens/webp/ApiCorreios/ApiCorreios1.webp",
      "Imagens/webp/ApiCorreios/ApiCorreios2.webp",
      "Imagens/webp/ApiCorreios/ApiCorreios3.webp",
      "Imagens/webp/ApiCorreios/ApiCorreios4.webp"
    ],
    data: "Feito em 12/2025",
    linguagens: "HTML, CSS, JS, BICEP, NODE.JS, EXPRESS",
    github: "https://github.com/GabrielLima-BD/api.correios-prt"
  },
  {
    titulo: 'App de Upscaling para Vídeos',
    descricao: `Upscalling Videos é uma aplicação local desenvolvida em Python para automatizar o fluxo de preparação, processamento e envio de vídeos em lote.

O projeto foi criado para resolver uma operação repetitiva de forma mais rápida, organizada e confiável, oferecendo uma interface web moderna, execução local sem dependências externas de servidor e uma experiência de uso próxima a um aplicativo desktop. A solução permite cadastrar múltiplos vídeos de uma vez, acompanhar o status de cada item em tempo real e reaproveitar apenas os registros com falha.

O backend recebe os links informados, baixa os vídeos, aplica um processamento padronizado com FFmpeg, extrai dados complementares por scraping e realiza o envio final para canais do Telegram configurados. Todo o fluxo é persistido em SQLite, com histórico visual, ordenação por atualização e suporte a reprocessamento individual.

Do ponto de vista técnico, o projeto utiliza FastAPI para expor a API local, SQLAlchemy para persistência, Pydantic para validação, yt-dlp para download de mídia, FFmpeg para reencodificação e normalização dos arquivos, além de httpx e BeautifulSoup para extração de informações da página de origem.

A interface foi construída com HTML, CSS e JavaScript puro, com foco em usabilidade, feedback visual e automação de ações — criação dinâmica de linhas, atualização automática do histórico e encerramento completo da aplicação pela própria interface.

Competências demonstradas no projeto:
  · Arquitetura backend/frontend desacoplada
  · Automação de processamento de mídia
  · Integração com APIs externas e scraping
  · Persistência local com banco relacional
  · Tratamento de erros e reprocessamento
  · Interface responsiva, animada e sem exposição de terminal ao usuário final`,
    imagens: [
      'Imagens/webp/Upscalling Videos/UpscallingVideos1.webp',
      'Imagens/webp/Upscalling Videos/UpscallingVideos2.webp',
      'Imagens/webp/Upscalling Videos/UpscallingVideos3.webp',
      'Imagens/webp/Upscalling Videos/UpscallingVideos4.webp',
      'Imagens/webp/Upscalling Videos/UpscallingVideos5.webp',
      'Imagens/webp/Upscalling Videos/UpscallingVideos6.webp',
      'Imagens/webp/Upscalling Videos/UpscallingVideos7.webp'
    ],
    data: '24/03/2026',
    linguagens: "HTML, CSS, JS, PYTHON, SQL, VBScript, Batch",
    github: 'https://github.com/GabrielLima-BD/upscalling.videos-prt/tree/main',
  },
  {
    titulo: "Linktree",
    descricao: `Página web moderna criada para centralizar e destacar os principais links de portfólio, redes sociais e contato profissional.

Com design responsivo, animações fluidas e alternância de tema claro/escuro, o projeto oferece uma experiência visual elegante e adaptável a qualquer dispositivo. Permite fácil personalização dos links, integração de ícones e foto de perfil.

O código é modular, desenvolvido com HTML5, CSS3 e JavaScript puro, e está pronto para expansão — ideal para profissionais que buscam consolidar sua presença digital de forma prática e sofisticada.`,
    imagens: [
      "Imagens/webp/Linktree/Linktree1.webp",
      "Imagens/webp/Linktree/Linktree2.webp",
      "Imagens/webp/Linktree/Linktree3.webp",
      "Imagens/webp/Linktree/Linktree4.webp",
    ],
    data: "09/2025",
    linguagens: "HTML, CSS, JS",
    github: "https://github.com/GabrielLima-BD/linktree-prt?tab=readme-ov-file",
    site: "https://gabriellima-bd.github.io/linktree-prt/"
  },
  {
    titulo: 'APP Para Costureira',
    descricao: '',
    imagens: ['Imagens/webp/Foto Projetos Em Desenvolvimento/EmDesenvolvimento.webp'],
    data: '...',
    linguagens: '...',
    github: '...',
    site: '...'
  }
];

// Carrossel do modal de projetos
let carrosselIndex   = 0;
let carrosselProjeto = null;
let carrosselInterval= null;

const modalImg   = document.getElementById('modal-img');
const modalVideo = document.getElementById('modal-video');

function isVideoSlide(slide) {
  return typeof slide === 'string' && /\.(mp4|webm|ogg)$/i.test(slide);
}

function mostrarSlideCarrossel(idx) {
  if (!carrosselProjeto || !carrosselProjeto.imagens) return;
  const slide = carrosselProjeto.imagens[idx];

  if (isVideoSlide(slide)) {
    if (modalImg)   modalImg.style.display   = 'none';
    if (modalVideo) {
      modalVideo.style.display = 'block';
      modalVideo.src = slide;
      modalVideo.currentTime = 0;
      modalVideo.load();
    }
  } else {
    if (modalVideo) {
      modalVideo.pause();
      modalVideo.style.display = 'none';
    }
    if (modalImg) {
      modalImg.style.display = 'block';
      modalImg.src = slide;
    }
  }
}

function trocarImagemCarrossel(sentido = 1) {
  if (!carrosselProjeto || !carrosselProjeto.imagens) return;

  if (modalImg)   modalImg.classList.add('carrossel-saindo');
  if (modalVideo) modalVideo.classList.add('carrossel-saindo');

  setTimeout(() => {
    carrosselIndex = (carrosselIndex + sentido + carrosselProjeto.imagens.length) % carrosselProjeto.imagens.length;
    mostrarSlideCarrossel(carrosselIndex);

    if (modalImg) {
      modalImg.classList.remove('carrossel-saindo');
      modalImg.classList.add('carrossel-entrando');
      setTimeout(() => modalImg.classList.remove('carrossel-entrando'), 400);
    }
    if (modalVideo) {
      modalVideo.classList.remove('carrossel-saindo');
      modalVideo.classList.add('carrossel-entrando');
      setTimeout(() => modalVideo.classList.remove('carrossel-entrando'), 400);
    }
  }, 400);
}

function iniciarCarrosselAuto() {
  if (carrosselInterval) clearInterval(carrosselInterval);
  if (carrosselProjeto && isVideoSlide(carrosselProjeto.imagens[carrosselIndex])) return;

  carrosselInterval = setInterval(() => {
    trocarImagemCarrossel(1);
    if (carrosselProjeto && isVideoSlide(carrosselProjeto.imagens[(carrosselIndex + 1) % carrosselProjeto.imagens.length])) {
      clearInterval(carrosselInterval);
    }
  }, 10000);
}

function reiniciarCarrosselAuto() {
  iniciarCarrosselAuto();
}

// ── Função auxiliar: converte \n em <br> para renderizar no HTML ──
function descricaoParaHTML(texto) {
  if (!texto) return '';
  // Escapa caracteres HTML para segurança, depois converte \n em <br>
  return texto
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/\n/g, '<br>');
}

// Abertura do modal via cards
document.querySelectorAll('.link-projeto').forEach((card) => {
  card.addEventListener('click', function (e) {
    e.preventDefault();

    const projetoDiv = this.querySelector('[data-projeto]');
    if (!projetoDiv) return;

    const idx  = projetoDiv.getAttribute('data-projeto');
    const proj = projetos[idx];
    if (!proj) return;

    carrosselIndex   = 0;
    carrosselProjeto = proj;

    mostrarSlideCarrossel(carrosselIndex);

    document.getElementById('segundatela-titulo').textContent   = proj.titulo;
    document.getElementById('segundatela-infodata').textContent = proj.data;
    document.getElementById('segundatela-linguagens').textContent = proj.linguagens;

    // ── CORREÇÃO: usa innerHTML + descricaoParaHTML para respeitar as quebras de linha ──
    document.getElementById('segundatela-descricoes').innerHTML = descricaoParaHTML(proj.descricao);

    const githubBtn = document.getElementById('modal-github');
    const siteBtn   = document.getElementById('modal-site');

    if (githubBtn) {
      if (proj.github) { githubBtn.style.display = '';     githubBtn.href = proj.github; }
      else             { githubBtn.style.display = 'none'; }
    }
    if (siteBtn) {
      if (proj.site)   { siteBtn.style.display = '';     siteBtn.href = proj.site; }
      else             { siteBtn.style.display = 'none'; }
    }

    const modal = document.getElementById('segundatela-projetos');
    if (modal) modal.style.display = 'flex';

    iniciarCarrosselAuto();
  });
});

// Navegação por clique na mídia
if (modalImg) {
  modalImg.onclick = function () {
    trocarImagemCarrossel(1);
    reiniciarCarrosselAuto();
  };
}
if (modalVideo) {
  modalVideo.onclick = function () {
    trocarImagemCarrossel(1);
    reiniciarCarrosselAuto();
  };
  modalVideo.onended = function () {
    trocarImagemCarrossel(1);
    reiniciarCarrosselAuto();
  };
  modalVideo.onplay = function () {
    if (carrosselInterval) clearInterval(carrosselInterval);
  };
}

// Fechar modal
const fecharBtn = document.getElementById('segundatela-fechar');
if (fecharBtn) {
  fecharBtn.addEventListener('click', () => {
    if (carrosselInterval) clearInterval(carrosselInterval);
    closeModalProjetos();
  });
}

const modalGlobal = document.getElementById('segundatela-projetos');
if (modalGlobal) {
  modalGlobal.addEventListener('click', function (e) {
    if (e.target.classList.contains('segundatela-projetos') || e.target.classList.contains('segundatela-backdrop')) {
      if (carrosselInterval) clearInterval(carrosselInterval);
      closeModalProjetos();
    }
  });
}