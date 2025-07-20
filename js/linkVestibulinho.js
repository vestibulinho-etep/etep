// Configurações do Vestibulinho
const vestibulinhoAtivo = false;
const ano = "2026";

// Configurações dos Cursos
const curso1 = "Técnico em Química";
const curso2 = "Técnico em Química";
const curso3 = "Técnico em Enfermagem";

// Visibilidade dos Cursos
const mostrarCurso1 = true;
const mostrarCurso2 = true;
const mostrarCurso3 = true;

// Datas e Horários - Curso 1
const dataProvaCurso1 = "10/11/2025";
const horarioProvaCurso1 = "08:00";

// Datas e Horários - Curso 2
const dataProvaCurso2 = "10/11/2025";
const horarioProvaCurso2 = "14:00";

// Datas e Horários - Curso 3
const dataProvaCurso3 = "10/11/2025";
const horarioProvaCurso3 = "14:00";

// Periodo de inscrições - Todos os cursos
const inicioInscricoes = "01/08/2025";
const fimInscricoes = "12/10/2025";

// converte a data de inscrições no formato brasileiro para o formato Date
function converterDataBrParaDate(dataBr) {
    const [dia, mes, ano] = dataBr.split("/");
    return new Date(ano, mes - 1, dia); // mês começa do zero em JS
  }

const inicioInscricoesDate = converterDataBrParaDate(inicioInscricoes);
const fimInscricoesDate = converterDataBrParaDate(fimInscricoes);

// Hoje
const hoje = new Date();

// Função para mostrar o modal com animação
function showModal() {
    const modal = document.getElementById('modal-vestibulinho');
    const overlay = document.getElementById('modal-overlay');
    const content = document.getElementById('modal-content');
    
    modal.classList.remove('hidden');
    
    requestAnimationFrame(() => {
        overlay.classList.add('bg-opacity-50');
        overlay.classList.add('opacity-100');
        
        content.classList.add('modal-animate-in');
        content.classList.remove('translate-y-4');
        content.classList.add('opacity-100');
    });
    
    document.body.style.overflow = 'hidden';
}

// Função para esconder o modal com animação
function hideModal() {
    const modal = document.getElementById('modal-vestibulinho');
    const overlay = document.getElementById('modal-overlay');
    const content = document.getElementById('modal-content');
    
    overlay.classList.remove('bg-opacity-50', 'opacity-100');
    content.classList.remove('modal-animate-in', 'opacity-100');
    content.classList.add('modal-animate-out', 'translate-y-4');
    
    setTimeout(() => {
        modal.classList.add('hidden');
        content.classList.remove('modal-animate-out');
        document.body.style.overflow = '';
    }, 300);
}

// Função para controlar o comportamento dos links do vestibulinho
function handleVestibulinhoLinks() {
    const vestibulinhoLinks = document.querySelectorAll('a[href="vestibulinho.html"]');
    const modal = document.getElementById('modal-vestibulinho');
    const closeButton = document.getElementById('close-modal');

    // Só continua se o modal existir
    if (!modal) return;

    vestibulinhoLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            if (!vestibulinhoAtivo) {
                e.preventDefault();
                showModal();
            }
        });
    });

    if (closeButton) {
        closeButton.addEventListener('click', hideModal);
    }

    modal.addEventListener('click', (e) => {
        if (!e.target.closest('#modal-content') && !e.target.closest('.modal-close-button')) {
            hideModal();
        }
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
            hideModal();
        }
    });
}

// Função para atualizar a data e hora da prova de um curso específico
function atualizarDataHoraProvaCurso(numero, dataProva, horarioProva) {
    const dataElement = document.getElementById(`data-prova-curso-${numero}`);
    if (dataElement) {
        dataElement.textContent = `Prova: ${dataProva} às ${horarioProva}`;
    }
}

// Função para atualizar informações gerais do vestibulinho
function atualizarInformacoesGerais() {
    const btnInscricao = document.querySelector('a[href="#informacoes-importantes"]');
    if (btnInscricao) {
        if (hoje > fimInscricoesDate) {
            btnInscricao.innerHTML = `
                <i class="far fa-calendar-alt mr-2"></i>
                Inscrições encerradas
            `;
        } else if (hoje < inicioInscricoesDate) {
            btnInscricao.innerHTML = `
                <i class="far fa-calendar-alt mr-2"></i>
                Inscrições de ${inicioInscricoes} até ${fimInscricoes}
            `;
        } else {
            btnInscricao.innerHTML = `
                <i class="far fa-calendar-alt mr-2"></i>
                Inscrições até ${fimInscricoes}
            `;
        }
    }
}

// Função para atualizar informações de um curso específico
function atualizarInformacoesCurso(numero, nomeCurso, dataProva, horarioProva, mostrar) {
    const card = document.getElementById(`card-curso-${numero}`);
    const titulo = document.getElementById(`titulo-curso-${numero}`);

    if (card && titulo) {
        // Atualiza visibilidade
        card.style.display = mostrar ? 'block' : 'none';
        
        // Atualiza título
        titulo.textContent = nomeCurso;
        
        // Atualiza data e hora da prova
        atualizarDataHoraProvaCurso(numero, dataProva, horarioProva);
    }
}

// Função para atualizar todas as datas do vestibulinho
function atualizarTodasDatas() {
    if (vestibulinhoAtivo) {
        // Atualiza informações gerais (período de inscrição)
        atualizarInformacoesGerais();
        
        // Atualiza informações de cada curso
        atualizarInformacoesCurso(1, curso1, dataProvaCurso1, horarioProvaCurso1, mostrarCurso1);
        atualizarInformacoesCurso(2, curso2, dataProvaCurso2, horarioProvaCurso2, mostrarCurso2);
        atualizarInformacoesCurso(3, curso3, dataProvaCurso3, horarioProvaCurso3, mostrarCurso3);
    }
}

// Função para atualizar o ano do vestibulinho nos textos
function atualizarAnoVestibulinho() {
    if (!vestibulinhoAtivo) return;

    // Atualiza todos os links e textos com "Vestibulinho"
    const textoComAno = `Vestibulinho ${ano}`;
    
    // Atualiza elementos com href="vestibulinho.html"
    const linksVestibulinho = document.querySelectorAll('a[href="vestibulinho.html"]');
    linksVestibulinho.forEach(link => {
        // Verifica se o texto contém apenas "Vestibulinho" sem o ano
        if (link.textContent.trim() === "Vestibulinho") {
            link.textContent = textoComAno;
        }
        // Se tiver ícone, preserva o ícone
        if (link.innerHTML.includes('class="fas fa-edit')) {
            link.innerHTML = `<i class="fas fa-edit mr-2"></i>${textoComAno}`;
        }
    });

    // Atualiza o título da página se estiver na página do vestibulinho
    const titulo = document.querySelector('title');
    if (titulo && titulo.textContent === "Vestibulinho") {
        titulo.textContent = textoComAno;
    }

    // Atualiza o cabeçalho h1 na página do vestibulinho
    const cabecalho = document.querySelector('h1.text-4xl.md\\:text-5xl.font-bold.mb-4.animate-fade-in');
    if (cabecalho && cabecalho.textContent === "Vestibulinho") {
        cabecalho.textContent = textoComAno;
    }
}

// Inicialização quando o DOM estiver carregado
document.addEventListener('DOMContentLoaded', function() {
    handleVestibulinhoLinks();
    atualizarTodasDatas();
    atualizarAnoVestibulinho(); // Adiciona a chamada da nova função
});