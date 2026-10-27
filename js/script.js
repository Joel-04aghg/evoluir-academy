/* ===== MENU MOBILE ===== */
const menu = document.getElementById('menu');
const menuBtn = document.getElementById('menuBtn');

menuBtn.addEventListener('click', () => {
  const aberto = menu.classList.toggle('aberto');
  menuBtn.setAttribute('aria-expanded', aberto);
});
menu.querySelectorAll('a').forEach(link =>
  link.addEventListener('click', () => {
    menu.classList.remove('aberto');
    menuBtn.setAttribute('aria-expanded', 'false');
  })
);

/* ===== DESTAQUE DO LINK ATIVO AO ROLAR ===== */
const secoes = document.querySelectorAll('main section[id]');
const links = document.querySelectorAll('.menu a:not(.btn-menu)');

const observador = new IntersectionObserver(entradas => {
  entradas.forEach(e => {
    if (e.isIntersecting) {
      links.forEach(l => l.classList.toggle('ativo', l.getAttribute('href') === '#' + e.target.id));
    }
  });
}, { rootMargin: '-45% 0px -50% 0px' });
secoes.forEach(s => observador.observe(s));

/* ===== BOTÃO VOLTAR AO TOPO ===== */
const voltar = document.getElementById('voltarTopo');
window.addEventListener('scroll', () => {
  voltar.classList.toggle('visivel', window.scrollY > 500);
});
voltar.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

/* ===== CONTADORES ANIMADOS ===== */
const contadores = document.querySelectorAll('[data-alvo]');
const obsContador = new IntersectionObserver((entradas, obs) => {
  entradas.forEach(e => {
    if (!e.isIntersecting) return;
    const el = e.target;
    const alvo = Number(el.dataset.alvo);
    const duracao = 1500;
    const inicio = performance.now();
    function passo(agora) {
      const prog = Math.min((agora - inicio) / duracao, 1);
      el.textContent = Math.floor(alvo * prog).toLocaleString('pt-BR');
      if (prog < 1) requestAnimationFrame(passo);
    }
    requestAnimationFrame(passo);
    obs.unobserve(el);
  });
}, { threshold: 0.6 });
contadores.forEach(c => obsContador.observe(c));

/* ===== FILTRO DE CURSOS ===== */
const filtros = document.querySelectorAll('.filtro');
const cursos = document.querySelectorAll('.curso');

filtros.forEach(botao => {
  botao.addEventListener('click', () => {
    filtros.forEach(b => b.classList.remove('ativo'));
    botao.classList.add('ativo');
    const cat = botao.dataset.cat;
    cursos.forEach(c => {
      c.classList.toggle('oculto', cat !== 'todos' && c.dataset.cat !== cat);
    });
  });
});

/* ===== SIMULADOR DE MENSALIDADE ===== */
const formSim = document.getElementById('formSimulador');
const resultado = document.getElementById('resultado');
const moeda = v => v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

formSim.addEventListener('submit', e => {
  e.preventDefault();
  const base = Number(document.getElementById('selCurso').value);
  const desconto = Number(document.getElementById('selPlano').value);
  const final = base * (1 - desconto);
  const nome = document.getElementById('selCurso').selectedOptions[0].text;

  resultado.classList.remove('erro');
  resultado.innerHTML =
    `${nome}<br>Mensalidade: <strong>${moeda(final)}</strong>` +
    (desconto > 0 ? ` <small>(economia de ${moeda(base - final)} por mês)</small>` : '');
});

/* ===== CARROSSEL DE DEPOIMENTOS ===== */
const depoimentos = [
  { texto: 'Entrei sem saber nada de programação e, seis meses depois de formado, já estava empregado em uma software house.', autor: 'Lucas Andrade', curso: 'Desenvolvimento de Sistemas' },
  { texto: 'O estágio supervisionado fez toda a diferença. Saí do curso com confiança para atuar no hospital.', autor: 'Mariana Souza', curso: 'Técnico em Enfermagem' },
  { texto: 'Os professores vêm do mercado e ensinam o que realmente é usado nas empresas. Valeu cada mês.', autor: 'Rafael Lima', curso: 'Eletrotécnica' },
  { texto: 'Com o apoio do banco de vagas consegui minha primeira oportunidade na área de logística.', autor: 'Camila Ferreira', curso: 'Logística' }
];
let atual = 0;
const caixa = document.getElementById('depoimento');

function mostrar(i) {
  atual = (i + depoimentos.length) % depoimentos.length;
  const d = depoimentos[atual];
  caixa.style.opacity = 0;
  setTimeout(() => {
    caixa.innerHTML = `<p>“${d.texto}”</p><footer>${d.autor}<span>${d.curso}</span></footer>`;
    caixa.style.opacity = 1;
  }, 200);
}
document.getElementById('anterior').addEventListener('click', () => { mostrar(atual - 1); reiniciar(); });
document.getElementById('proximo').addEventListener('click', () => { mostrar(atual + 1); reiniciar(); });

let timer = setInterval(() => mostrar(atual + 1), 6000);
function reiniciar() { clearInterval(timer); timer = setInterval(() => mostrar(atual + 1), 6000); }
mostrar(0);

/* ===== FORMULÁRIO DE CONTATO (validação) ===== */
const formContato = document.getElementById('formContato');
const msg = document.getElementById('msgContato');

formContato.addEventListener('submit', e => {
  e.preventDefault();
  const nome = document.getElementById('nome');
  const email = document.getElementById('email');
  const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value.trim());
  const nomeOk = nome.value.trim().length >= 3;

  nome.classList.toggle('erro', !nomeOk);
  email.classList.toggle('erro', !emailOk);

  if (!nomeOk || !emailOk) {
    msg.className = 'resultado erro';
    msg.textContent = !nomeOk ? 'Informe seu nome completo.' : 'Informe um e-mail válido.';
    return;
  }
  const curso = document.getElementById('interesse').value;
  msg.className = 'resultado';
  msg.textContent = `Obrigado, ${nome.value.trim().split(' ')[0]}! Recebemos seu interesse em ${curso}.`;
  formContato.reset();
});
