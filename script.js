// script.js
// Mensagem de boas-vindas no console\
console.log("Bem-vindo ao portfólio de Gabriel Lima!");

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

// // Particles.js para fundo e home (adiado)
window.addEventListener('DOMContentLoaded', function() {
  if (window.particlesJS) {
    particlesJS('particles-js', {
      particles: {
        number: { value: 95, density: { enable: true, value_area: 800 } },
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
const slides = document.querySelectorAll('.carrossel-sobre-slide');
let slideAtual = 0;

function mostrarSlide(index) {
  slides.forEach((slide, i) => {
    slide.classList.toggle('ativo', i === index);
  });
}

document.getElementById('anterior').onclick = () => {
  slideAtual = (slideAtual - 1 + slides.length) % slides.length;
  mostrarSlide(slideAtual);
};
document.getElementById('proximo').onclick = () => {
  slideAtual = (slideAtual + 1) % slides.length;
  mostrarSlide(slideAtual);
};

mostrarSlide(slideAtual);

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
  // Pega a div da janela dentro do card (independente do nome da classe)
  const janela = card.querySelector('div[class^="janela-conhecimento"]');
  const fundo = document.getElementById('fundo-desfocado-conhecimento');

  function mostrarJanela() {
    if (fundo) fundo.classList.add('ativo');
    if (janela) janela.classList.add('ativo');
    card.classList.add('ativo');
  }

  function esconderJanela(e) {
    if (
      !card.contains(e.relatedTarget) &&
      (!janela || !janela.contains(e.relatedTarget))
    ) {
      if (fundo) fundo.classList.remove('ativo');
      if (janela) janela.classList.remove('ativo');
      card.classList.remove('ativo');
    }
  }

  card.addEventListener('mouseenter', mostrarJanela);
  card.addEventListener('mouseleave', esconderJanela);

  if (janela) {
    janela.addEventListener('mouseleave', esconderJanela);
  }
});
// Se o usuário já estiver fora da Home quando inicializar, pausa imediatamente.
// if (homeSection) {
//   const rect = homeSection.getBoundingClientRect();
//   const inView = rect.bottom > 0 && rect.top < window.innerHeight;
//   setParticlesPaused(!inView);
// }

// scheduleHeavyWork(initParticlesOnce);
