// script.js
// Mensagem de boas-vindas no console\
console.log("Bem-vindo ao meu portfólio, me chamo Gabriel Lima!");

// Seleciona todos os links do menu e todas as seções do conteúdo
const links = document.querySelectorAll('.menu-navegacao .link-menu');
const secoes = document.querySelectorAll('main section');

// Função para atualizar o link ativo conforme o scroll
function atualizarLinkAtivo() {
  let indexAtivo = secoes.length - 1;
  for (let i = 0; i < secoes.length; i++) {
    const secaoTopo = secoes[i].getBoundingClientRect().top;
    if (secaoTopo > 80) break; // 80px de tolerância do topo
    indexAtivo = i;
  }

links.forEach(link => {
  link.addEventListener('click', function() {
    links.forEach(l => l.classList.remove('link-ativo'));
    this.classList.add('link-ativo');
  });
});
}

// secao sobre troca de slides
/* ============================================================================
   SEÇÃO SOBRE — Carrossel (somente abas)
   - Apresentação SEMPRE primeiro
   - 1 slide por vez
   - Animação lateral 0.9s: atual sai para ESQ, novo entra pela DIR (mesmo tempo)
   - Auto-troca a cada 60s; pausa em hover/aba oculta
   ============================================================================ */

(function () {
  const AUTO_MS = 60_000; // 60s
  const ANIM_MS = 900;    // 0.9s (mantém sincronizado com CSS via --sobre-anim-ms)

  const SEL = {
    carrossel: '.carrossel-sobre',
    trilho: '.trilho-carrossel',
    slides: '.slide-sobre',
    abas:   '.abas-carrossel .aba-carrossel'
  };

  const $  = (s, ctx = document) => ctx.querySelector(s);
  const $$ = (s, ctx = document) => Array.from(ctx.querySelectorAll(s));

  function limparAnim(el){
    if(!el) return;
    el.classList.remove('entrar-da-direita','entrar-da-esquerda','sair-para-esquerda','sair-para-direita');
  }
  function mostrar(el){
    if(!el) return;
    el.style.display = 'block';
    // força reflow p/ garantir início da animação
    // eslint-disable-next-line no-unused-expressions
    el.offsetHeight;
    el.style.opacity = '1';
  }
  function ocultar(el){
    if(!el) return;
    el.style.opacity = '0';
    setTimeout(()=>{ el.style.display = 'none'; }, ANIM_MS);
  }
  function marcarAba(abas, idAlvo){
    abas.forEach(a => a.setAttribute('aria-selected', a.getAttribute('href') === `#${idAlvo}` ? 'true' : 'false'));
  }

  function trocar(atual, proximo, carrossel){
    if(!proximo || atual === proximo) return;

    limparAnim(atual); limparAnim(proximo);

    // sincroniza duração com o CSS
    carrossel.style.setProperty('--sobre-anim-ms', `${ANIM_MS}ms`);

    // mostra o novo antes de animar
    mostrar(proximo);

    // regra fixa: o que está visível sai para a ESQUERDA; o novo entra pela DIREITA
    if(atual) atual.classList.add('sair-para-esquerda');
    proximo.classList.add('entrar-da-direita');

    if(atual) setTimeout(()=>{ limparAnim(atual); ocultar(atual); }, ANIM_MS);
    setTimeout(()=>{ limparAnim(proximo); }, ANIM_MS);
  }

  function iniciar(){
    const carrossel = $(SEL.carrossel);
    if(!carrossel) return;

    const trilho  = $(SEL.trilho, carrossel);
    const slides  = $$(SEL.slides, trilho);
    const abas    = $$(SEL.abas, carrossel);
    if(!trilho || slides.length < 1 || abas.length < 2) return;

    // Desliga qualquer fallback CSS baseado em :target (se você tiver)
    carrossel.classList.add('js-pronto');

    // SEMPRE começa no primeiro (Apresentação), ignorando hash inicial
    let iAtual = 0;
    history.replaceState(null, '', `#${slides[0].id}`);

    slides.forEach((s,i)=>{
      if(i === iAtual){ mostrar(s); }
      else { s.style.display='none'; s.style.opacity='0'; }
    });
    marcarAba(abas, slides[iAtual].id);

    // Abas / botões
    abas.forEach((aba, i)=>{
      aba.addEventListener('click', (e)=>{
        e.preventDefault();
        if(i === iAtual) return;
        trocar(slides[iAtual], slides[i], carrossel);
        iAtual = i;
        history.pushState(null, '', aba.getAttribute('href'));
        marcarAba(abas, slides[iAtual].id);
        reiniciarAuto();
      });
    });

    // Mudança de hash externa (após o load)
    window.addEventListener('hashchange', ()=>{
      const id = location.hash.slice(1);
      const idx = slides.findIndex(s => s.id === id);
      if(idx < 0 || idx === iAtual) return;
      trocar(slides[iAtual], slides[idx], carrossel);
      iAtual = idx;
      marcarAba(abas, slides[iAtual].id);
      reiniciarAuto();
    });

    // Auto‑troca
    let pausado = false;
    let timer = null;

    function passo(){
      if(pausado) return;
      const prox = (iAtual + 1) % slides.length;
      trocar(slides[iAtual], slides[prox], carrossel);
      iAtual = prox;
      history.replaceState(null, '', `#${slides[iAtual].id}`);
      marcarAba(abas, slides[iAtual].id);
    }
    function start(){ timer = setInterval(passo, AUTO_MS); }
    function stop(){ clearInterval(timer); timer = null; }
    function reiniciarAuto(){ stop(); start(); }

    // Pausas
    document.addEventListener('visibilitychange', ()=>{ pausado = document.hidden; });
    carrossel.addEventListener('mouseenter', ()=>{ pausado = true; });
    carrossel.addEventListener('mouseleave', ()=>{ pausado = false; });

    start();
  }

  if(document.readyState === 'loading') document.addEventListener('DOMContentLoaded', iniciar);
  else iniciar();
})();

// Atualiza ao rolar a página
window.addEventListener('scroll', atualizarLinkAtivo);

// Atualiza ao carregar a página
window.addEventListener('DOMContentLoaded', () => {
  atualizarLinkAtivo();
  // Garante que o link Home seja marcado como ativo ao carregar
  const linkHome = document.querySelector('.menu-navegacao .link-menu[href="#home"]');
  if (linkHome) {
    document.querySelectorAll('.menu-navegacao .link-menu').forEach(l => l.classList.remove('link-ativo'));
    linkHome.classList.add('link-ativo');
  }
});

// Atualiza ao clicar em um link (opcional, para feedback imediato)
links.forEach(link => {
  link.addEventListener('click', function() {
    links.forEach(l => l.classList.remove('link-ativo'));
    this.classList.add('link-ativo');
  });
});

// // Particles.js para fundo e home
window.addEventListener('DOMContentLoaded', function() {
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



// animacao escrita da Home

// Efeito de digitação no título e subtítulo da home
const typingEl = document.querySelector('.typing-effect');
const subtituloEl = document.querySelector('.subtitulo');

if (typingEl && subtituloEl) {
  const textoTitulo = 'Seja bem-vindo ao meu ';
  const highlight = 'Portfólio';
  const textoSubtitulo = 'Desenvolvedor Back-end | Banco de Dados';
  let i = 0, j = 0;

  // Esconde o subtítulo até o título terminar
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
      // Quando terminar o título, remove o cursor e inicia o subtítulo
      const cursor = typingEl.querySelector('.typing-cursor');
      if (cursor) cursor.remove();
      setTimeout(typeSubtitulo, 400);
    }
  }

  function typeSubtitulo() {
    let k = 0;
    subtituloEl.textContent = '';
    subtituloEl.style.visibility = 'visible';
    function escrever() {
      if (k < textoSubtitulo.length) {
        subtituloEl.textContent += textoSubtitulo.charAt(k);
        k++;
        setTimeout(escrever, 70);
      }
    }
    escrever();
  }

  typeTitulo();
}

// carrosel slide pagina sobre
// Carrossel da seção Sobre
const slidesSobre = document.querySelectorAll('.carrossel-sobre-slide');
const btnProximo = document.getElementById('proximo');
const btnAnterior = document.getElementById('anterior');
let slideAtualSobre = 0;
let timerSobre;

// Função para mostrar o slide correto
function mostrarSlideSobre(index) {
  slidesSobre.forEach((slide, i) => {
    slide.classList.toggle('ativo', i === index);
  });
  slideAtualSobre = index;
}

// Próximo slide
function proximoSlideSobre() {
  mostrarSlideSobre((slideAtualSobre + 1) % slidesSobre.length);
}

// Slide anterior
function anteriorSlideSobre() {
  mostrarSlideSobre((slideAtualSobre - 1 + slidesSobre.length) % slidesSobre.length);
}

// Timer automático (troca a cada 7 segundos)
function iniciarTimerSobre() {
  timerSobre = setInterval(proximoSlideSobre, 7000);
}
function pararTimerSobre() {
  clearInterval(timerSobre);
}

// Eventos dos botões
if (btnProximo && btnAnterior) {
  btnProximo.addEventListener('click', proximoSlideSobre);
  btnAnterior.addEventListener('click', anteriorSlideSobre);
}

// Pausa o timer ao passar o mouse, volta ao sair
const carrosselContainer = document.querySelector('.carrossel-container');
if (carrosselContainer) {
  carrosselContainer.addEventListener('mouseenter', pararTimerSobre);
  carrosselContainer.addEventListener('mouseleave', iniciarTimerSobre);
}

// Inicializa
mostrarSlideSobre(0);
iniciarTimerSobre();

//tela secundaria dos servicos

const titulosServicos = [
  "Desenvolvimento Backend",
  "Gerenciamento de Bancos de Dados (SQL/NoSQL)",
  "Integração de APIs",
  "Desenvolvimento Frontend Básico"
];

const textosServicos = [
  "No desenvolvimento backend, eu crio a lógica do servidor que alimenta aplicações web e mobile. Utilizo linguagens como Node.js, Python ou Java para construir sistemas robustos. Por exemplo, desenvolvo APIs RESTful ou GraphQL que integram com bancos de dados. Meu processo envolve entender as necessidades do cliente, projetar a arquitetura, implementar o código e testar para garantir performance. Alinhamos ideias através de reuniões iniciais, wireframes e iterações ágeis.",
  "Especializado em bancos como SQL Server, MySQL e MongoDB, eu gerencio armazenamento de dados para sistemas integrados. Isso inclui modelagem de dados, otimização de queries e backups. Para lojas online, por exemplo, crio schemas que lidam com transações seguras. Alinho com o cliente definindo requisitos de dados, criando ERDs e implementando soluções escaláveis. ",
  "Conecto sistemas através de APIs, permitindo comunicação entre serviços. Por exemplo, integro pagamentos ou autenticação externa. O processo inclui análise de endpoints, implementação de autenticação (OAuth/JWT) e testes de integração. Colaboramos para mapear fluxos de dados e garantir segurança.",
  "Embora focado em backend, desenvolvo interfaces simples com HTML, CSS e JS. Crio sites responsivos para lojas ou dashboards. Alinho designs com o cliente via protótipos, implemento interações e integro com o backend."
];

document.querySelectorAll('.botao-oque-faco').forEach((btn, idx) => {
  btn.addEventListener('click', () => {
    const modal = document.querySelector('.tela-cada-servico');
    const conteudo = document.getElementById('tela-conteudo-servico');
    modal.style.display = 'flex';
    conteudo.classList.remove('saindo', 'ativo');
    document.getElementById('modal-titulo').textContent = titulosServicos[idx];
    document.getElementById('modal-texto').textContent = textosServicos[idx];
    void conteudo.offsetWidth;
    conteudo.classList.add('ativo');
  });
});

document.getElementById('tela-fechar-servico').onclick = fecharModal;
document.querySelector('.tela-cada-servico').onclick = function(e) {
  if (e.target === this || e.target.classList.contains('modal-backdrop')) fecharModal();
};

function fecharModal() {
  const modal = document.querySelector('.tela-cada-servico');
  const conteudo = document.getElementById('tela-conteudo-servico');
  conteudo.classList.remove('ativo');
  conteudo.classList.add('saindo');
  setTimeout(() => {
    modal.style.display = 'none';
    conteudo.classList.remove('saindo');
  }, 500); 
}

// parte da regra de mouse em cima dos cards de conhecimento
document.querySelectorAll('.card-conhecimento').forEach(card => {
  const janela = card.querySelector('div[class^="janela-conhecimento"]');
  const fundo = document.getElementById('fundo-desfocado-conhecimento');
  let janelaTimeout = null;

  function mostrarJanela() {
    if (fundo) fundo.classList.add('ativo');
    card.classList.add('ativo');
    // Cancela timeout anterior
    if (janelaTimeout) clearTimeout(janelaTimeout);
    janelaTimeout = setTimeout(() => {
      if (janela) {
        janela.classList.add('ativo');
        janela.classList.remove('saindo');
      }
    }, 300);
  }

  function esconderJanela(e) {
    if (
      !card.contains(e.relatedTarget) &&
      (!janela || !janela.contains(e.relatedTarget))
    ) {
      if (fundo) fundo.classList.remove('ativo');
      card.classList.remove('ativo');
      // Cancela timeout anterior
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

  if (janela) {
    janela.addEventListener('mouseleave', esconderJanela);
  }
});

// MODAL GLOBAL DE PROJETOS
const openModalProjetos = () => {
  const modal = document.getElementById('segundatela-projetos');
  if (modal) modal.style.display = 'flex';
};

const closeModalProjetos = () => {
  const modal = document.getElementById('segundatela-projetos');
  if (modal) modal.style.display = 'none';
};

// Corrige o seletor para pegar o data-projeto do filho correto
document.querySelectorAll('.link-projeto').forEach(card => {
  card.addEventListener('click', function(e) {
    e.preventDefault();
    // Busca o elemento filho com data-projeto
    const projetoDiv = this.querySelector('[data-projeto]');
    if (!projetoDiv) return;
    const idx = projetoDiv.getAttribute('data-projeto');
    const projeto = projetos[idx];
    if (!projeto) return;
    carrosselIndex = 0;
    carrosselProjeto = projeto;
    document.getElementById('modal-img').src = projeto.imagens[carrosselIndex];
    document.getElementById('segundatela-titulo').textContent = projeto.titulo;
    document.getElementById('segundatela-descricoes').textContent = projeto.descricao;
    document.getElementById('segundatela-infodata').textContent = projeto.data;
    document.getElementById('segundatela-linguagens').textContent = projeto.linguagens;
    const githubBtn = document.getElementById('modal-github');
    const siteBtn = document.getElementById('modal-site');
    // Github sempre aparece se existir
    if (projeto.github) {
      githubBtn.style.display = '';
      githubBtn.href = projeto.github;
    } else {
      githubBtn.style.display = 'none';
    }
    // Site só aparece se existir
    if (projeto.site) {
      siteBtn.style.display = '';
      siteBtn.href = projeto.site;
    } else {
      siteBtn.style.display = 'none';
    }
    document.getElementById('segundatela-projetos').style.display = 'flex';
    iniciarCarrosselAuto();
  });
});

// Fechar modal ao clicar no X
const fecharBtn = document.getElementById('segundatela-fechar');
if (fecharBtn) {
  fecharBtn.addEventListener('click', () => {
    if (carrosselInterval) clearInterval(carrosselInterval);
    closeModalProjetos();
  });
}

// Fechar modal ao clicar no backdrop
const modalGlobal = document.getElementById('segundatela-projetos');
if (modalGlobal) {
  modalGlobal.addEventListener('click', function(e) {
    if (e.target.classList.contains('segundatela-projetos') || e.target.classList.contains('segundatela-backdrop')) {
      if (carrosselInterval) clearInterval(carrosselInterval);
      closeModalProjetos();
    }
  });
}

// arrays com os dados da segunda tela de cada projeto
const projetos = [
  {
    titulo: "Store Power BI",
    descricao: "Projeto de Business Intelligence desenvolvido no Power BI a partir de dados transacionais de uma loja. O trabalho envolveu tratamento, limpeza e modelagem dos dados, aplicação de métricas e indicadores com DAX e construção de um modelo analítico voltado à análise de desempenho comercial. Foram criadas duas telas interativas com foco em KPIs estratégicos, como faturamento, volume de vendas, desempenho por produto e análise temporal, permitindo a identificação de padrões, tendências e oportunidades de melhoria no negócio. O projeto demonstra domínio de análise de dados, visualização, storytelling com dados e suporte à tomada de decisão baseada em dados.",
    imagens: [
      "Imagens/Dasboard Store/Dash PowerBi 1.png",
      "Imagens/Dasboard Store/Dash PowerBi 2.png",
      "Imagens/Dasboard Store/Video Dash.mp4"
    ],
    data: "Feito em 02/2026",
    linguagens: "Power BI, DAX, SQL",
    github: "https://github.com/GabrielLima-BD/store.powerbi-prt",
  },
  {
    titulo: "Sis. Biblioteca",
    descricao: "...",
    imagens: [
      "Imagens/Foto Projetos Em Desenvolvimento/EmDesenvolvimento.png"
    ],
    data: "...",
    linguagens: "..."
  },
  {
    titulo: "Project Fraud",
    descricao: "",
    imagens: [
      "Imagens/Foto Projetos Em Desenvolvimento/EmDesenvolvimento.png"
    ],
    data: "...",
    linguagens: "..."
  },
  {
    titulo: "Cafe Borcelle",
    descricao: "Borcelle La Café é um site premium para cafeteria desenvolvido com foco em UX/UI, performance e design responsivo. O projeto evolui um site estático para uma aplicação web moderna, incorporando sistema de e-commerce funcional, animações suaves e arquitetura frontend organizada.Conta com carrinho de compras persistente via localStorage, cálculo automático de valores, modal de checkout, formulários com validação em tempo real e feedback visual, além de suporte completo a acessibilidade e navegação por teclado. O layout utiliza CSS Grid e Flexbox, sistema de temas com variáveis CSS (dark/light) e tipografia premium.O projeto foi otimizado para alta performance, alcançando pontuação acima de 95 no Lighthouse, com carregamento rápido, lazy loading de imagens e boas práticas de SEO. Totalmente responsivo, segue abordagem mobile-first e oferece uma experiência consistente em diferentes dispositivos.Desenvolvido com HTML5, CSS3 e JavaScript moderno, o projeto demonstra domínio de JavaScript vanilla, arquitetura CSS profissional, atenção a detalhes visuais e foco em experiência do usuário, sendo uma peça completa e pronta para portfólio profissional.",
    imagens: [
      "Imagens/Cafe Borcelles/Borcelles1.png",
      "Imagens/Cafe Borcelles/Borcelles2.png",
      "Imagens/Cafe Borcelles/Borcelles3.png",
      "Imagens/Cafe Borcelles/Borcelles4.png",
      "Imagens/Cafe Borcelles/Borcelles5.png",
      "Imagens/Cafe Borcelles/Borcelles6.png",
      "Imagens/Cafe Borcelles/Borcelles7.png"
    ],
    data: "Feitor em 08/2025",
    linguagens: "HTML, CSS, JS",
    github: "https://github.com/GabrielLima-BD/cafeteria.borcelles-prt",
    site: "https://gabriellima-bd.github.io/cafeteria.borcelles-prt/"
  },
  {
    titulo: "API Correios",
    descricao:  "Correios Helper é uma aplicação web completa para consulta de CEP e simulação de frete premium, combinando frontend moderno com backend em Node.js/Express. O sistema integra a API ViaCEP e o SOAP dos Correios (CalcPrecoPrazo), oferecendo uma experiência visual refinada, responsiva e orientada a microinterações.A aplicação permite consultar endereços por CEP, simular fretes SEDEX e PAC entre dois CEPs, calcular valores e prazos automaticamente e destacar a melhor opção de envio. Possui histórico detalhado de consultas e simulações, exportação de resultados em CSV, modo escuro/claro, loaders animados e interface de alto padrão com foco em UX/UI.O backend atua como API e proxy, com fallback mock para simulação de frete quando o serviço dos Correios está indisponível, além de suporte a variáveis de ambiente, logs verbosos e boas práticas de segurança. O projeto conta ainda com infraestrutura pronta para Azure, deploy automatizado via GitHub Actions, e arquivos Bicep para provisionamento em produção.Desenvolvido como projeto de portfólio avançado, demonstra domínio em integrações externas, arquitetura backend, experiência do usuário, automação de deploy e preparação para ambientes reais de produção.",
    imagens: [
      "Imagens/ApiCorreios/ApiCorreios1.png",
      "Imagens/ApiCorreios/ApiCorreios2.png",
      "Imagens/ApiCorreios/ApiCorreios3.png",
      "Imagens/ApiCorreios/ApiCorreios4.png"
    ],
    data: "Feitor em 12/2025",
    linguagens: "HTML, CSS, JS, BICEP, NODE.JS, EXPRESS",
    github: "https://github.com/GabrielLima-BD/api.correios-prt"
  },
    {
    titulo: "Sistema de Upscanling de Videos",
    descricao:  "...",
    imagens: [
      "Imagens/Foto Projetos Em Desenvolvimento/EmDesenvolvimento.png"
    ],
    data: "...",
    linguagens: "..."
  },
    {
    titulo: "Linktree",
    descricao:  "O Linktree é uma página web moderna criada para centralizar e destacar os principais links de portfólio, redes sociais e contato profissional. Com design responsivo, animações e alternância de tema claro/escuro, o projeto oferece uma experiência visual elegante e adaptável a qualquer dispositivo, permitindo fácil personalização dos links e integração de ícones e foto de perfil. O código é modular, utiliza HTML5, CSS3 e JavaScript, e está pronto para expansão, sendo ideal para profissionais que buscam consolidar sua presença digital de forma prática e sofisticada.",
    imagens: [
      "Imagens/Linktree/Linktree1.png",
      "Imagens/Linktree/Linktree2.png",
      "Imagens/Linktree/Linktree3.png",
      "Imagens/Linktree/Linktree4.png",      
    ],
    data: "09/2025",
    linguagens: "HTML, CSS, JS",
    github: "https://github.com/GabrielLima-BD/linktree-prt?tab=readme-ov-file",
    site: "https://gabriellima-bd.github.io/linktree-prt/"
  },
    {
    titulo: "APP Para Costureira",
    descricao:  "",
    imagens: [
      "Imagens/Foto Projetos Em Desenvolvimento/EmDesenvolvimento.png"    
    ],
    data: "...",
    linguagens: "...",
    github: "...",
    site: "..."
  }
];


// Carrossel de imagens e vídeo no modal (manual + automático + animação)
let carrosselIndex = 0;
let carrosselProjeto = null;
let carrosselInterval = null;
const modalImg = document.getElementById('modal-img');
const modalVideo = document.getElementById('modal-video'); // Adicione um elemento <video id="modal-video"> no HTML do modal

function isVideoSlide(slide) {
  // Considera string terminando com .mp4, .webm, etc como vídeo
  return typeof slide === 'string' && /\.(mp4|webm|ogg)$/i.test(slide);
}

function mostrarSlideCarrossel(idx) {
  if (!carrosselProjeto || !carrosselProjeto.imagens) return;
  const slide = carrosselProjeto.imagens[idx];
  if (isVideoSlide(slide)) {
    if (modalImg) modalImg.style.display = 'none';
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
  if (modalImg) modalImg.classList.add('carrossel-saindo');
  if (modalVideo) modalVideo.classList.add('carrossel-saindo');
  setTimeout(() => {
    carrosselIndex = (carrosselIndex + sentido + carrosselProjeto.imagens.length) % carrosselProjeto.imagens.length;
    mostrarSlideCarrossel(carrosselIndex);
    if (modalImg) {
      modalImg.classList.remove('carrossel-saindo');
      modalImg.classList.add('carrossel-entrando');
      setTimeout(() => {
        modalImg.classList.remove('carrossel-entrando');
      }, 400);
    }
    if (modalVideo) {
      modalVideo.classList.remove('carrossel-saindo');
      modalVideo.classList.add('carrossel-entrando');
      setTimeout(() => {
        modalVideo.classList.remove('carrossel-entrando');
      }, 400);
    }
  }, 400);
}

function iniciarCarrosselAuto() {
  if (carrosselInterval) clearInterval(carrosselInterval);
  // Se o slide atual for vídeo, não inicia auto
  if (carrosselProjeto && isVideoSlide(carrosselProjeto.imagens[carrosselIndex])) {
    return;
  }
  carrosselInterval = setInterval(() => {
    trocarImagemCarrossel(1);
    // Se o próximo slide for vídeo, para o auto
    if (carrosselProjeto && isVideoSlide(carrosselProjeto.imagens[(carrosselIndex + 1) % carrosselProjeto.imagens.length])) {
      clearInterval(carrosselInterval);
    }
  }, 10000); // 10 segundos
}

function reiniciarCarrosselAuto() {
  iniciarCarrosselAuto();
}

// Substitui apenas o evento do modal de projetos, sem duplicar lógica global
const cardsProjeto = document.querySelectorAll('.link-projeto');
cardsProjeto.forEach(card => {
  card.addEventListener('click', function(e) {
    e.preventDefault();
    const projetoDiv = this.querySelector('[data-projeto]');
    if (!projetoDiv) return;
    const idx = projetoDiv.getAttribute('data-projeto');
    const projeto = projetos[idx];
    if (!projeto) return;
    carrosselIndex = 0;
    carrosselProjeto = projeto;
    mostrarSlideCarrossel(carrosselIndex);
    document.getElementById('segundatela-titulo').textContent = projeto.titulo;
    document.getElementById('segundatela-descricoes').textContent = projeto.descricao;
    document.getElementById('segundatela-infodata').textContent = projeto.data;
    document.getElementById('segundatela-linguagens').textContent = projeto.linguagens;
    document.getElementById('modal-github').href = projeto.github;
    document.getElementById('modal-site').href = projeto.site;
    document.getElementById('segundatela-projetos').style.display = 'flex';
    iniciarCarrosselAuto();
  });
});


if (modalImg) {
  modalImg.onclick = function() {
    trocarImagemCarrossel(1);
    reiniciarCarrosselAuto();
  };
}
if (modalVideo) {
  modalVideo.onclick = function() {
    trocarImagemCarrossel(1);
    reiniciarCarrosselAuto();
  };
  // Quando o vídeo terminar, avança para o próximo slide
  modalVideo.onended = function() {
    trocarImagemCarrossel(1);
    reiniciarCarrosselAuto();
  };
  // Pausa o carrossel automático enquanto o vídeo está tocando
  modalVideo.onplay = function() {
    if (carrosselInterval) clearInterval(carrosselInterval);
  };
}

// Usar apenas UMA declaração para fecharBtn e modalGlobal no arquivo inteiro
// Adiciona listeners extras sem redeclarar
if (typeof fecharBtnCarrossel === 'undefined') {
  var fecharBtnCarrossel = document.getElementById('segundatela-fechar');
  if (fecharBtnCarrossel) {
    fecharBtnCarrossel.addEventListener('click', () => {
      if (carrosselInterval) clearInterval(carrosselInterval);
      closeModalProjetos();
    });
  }
}
if (typeof modalGlobalCarrossel === 'undefined') {
  var modalGlobalCarrossel = document.getElementById('segundatela-projetos');
  if (modalGlobalCarrossel) {
    modalGlobalCarrossel.addEventListener('click', function(e) {
      if (e.target.classList.contains('segundatela-projetos') || e.target.classList.contains('segundatela-backdrop')) {
        if (carrosselInterval) clearInterval(carrosselInterval);
        closeModalProjetos();
      }
    });
  }
}
// --- FIM CARROSSEL MODAL ---

// Se o usuário já estiver fora da Home quando inicializar, pausa imediatamente.
// if (homeSection) {
//   const rect = homeSection.getBoundingClientRect();
//   const inView = rect.bottom > 0 && rect.top < window.innerHeight;
//   setParticlesPaused(!inView);
// }
