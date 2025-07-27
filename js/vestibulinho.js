// Configurações do Vestibulinho (carregadas dinamicamente)
let vestibulinhoAtivo = false;
let ano = "";

// Configurações dos Cursos
let curso1 = "";
let curso2 = "";
let curso3 = "";

// Visibilidade dos Cursos
let mostrarCurso1 = true;
let mostrarCurso2 = true;
let mostrarCurso3 = true;

// Datas e Horários - Curso 1
let dataProvaCurso1 = "";
let horarioProvaCurso1 = "";

// Datas e Horários - Curso 2
let dataProvaCurso2 = "";
let horarioProvaCurso2 = "";

// Datas e Horários - Curso 3
let dataProvaCurso3 = "";
let horarioProvaCurso3 = "";

// Periodo de inscrições - Todos os cursos
let inicioInscricoes = "";
let fimInscricoes = "";

// Função para encontrar o arquivo JSON com o maior ano
async function encontrarMaiorAno() {
    try {
        // Calcula dinamicamente os anos para testar baseado no ano atual
        const anoAtual = new Date().getFullYear();
        const anosParaTestar = [anoAtual - 1, anoAtual, anoAtual + 1];
        let maiorAno = 0;
        
        for (const ano of anosParaTestar) {
            try {
                const response = await fetch(`json/${ano}.json`);
                if (response.ok) {
                    maiorAno = ano;
                }
            } catch (error) {
                // Arquivo não existe, continua para o próximo
                continue;
            }
        }
        
        return maiorAno > 0 ? maiorAno : null;
    } catch (error) {
        console.error('Erro ao encontrar arquivo JSON:', error);
        return null;
    }
}

// Função para mostrar a tela de loading
function mostrarLoading() {
    const loadingScreen = document.getElementById('loading-screen');
    const mainContent = document.getElementById('main-content');
    
    if (loadingScreen) {
        loadingScreen.classList.remove('hidden');
    }
    if (mainContent) {
        mainContent.classList.add('content-hidden');
        mainContent.classList.remove('content-show');
    }
}

// Função para esconder a tela de loading
function esconderLoading() {
    const loadingScreen = document.getElementById('loading-screen');
    const mainContent = document.getElementById('main-content');
    
    setTimeout(() => {
        if (loadingScreen) {
            loadingScreen.classList.add('hidden');
        }
        if (mainContent) {
            mainContent.classList.remove('content-hidden');
            mainContent.classList.add('content-show');
        }
    }, 500); // Pequeno delay para garantir que tudo foi processado
}

// Função para carregar as configurações do vestibulinho
async function carregarConfiguracoes() {
    try {
        const maiorAno = await encontrarMaiorAno();
        
        if (!maiorAno) {
            console.error('Nenhum arquivo JSON encontrado');
            return false;
        }
        
        const response = await fetch(`json/${maiorAno}.json`);
        
        if (!response.ok) {
            throw new Error(`Erro ao carregar ${maiorAno}.json: ${response.status}`);
        }
        
        const dados = await response.json();
        
        // Extrai os valores para as variáveis
        vestibulinhoAtivo = dados.vestibulinhoAtivo;
        ano = dados.ano;
        
        curso1 = dados.cursos.curso1;
        curso2 = dados.cursos.curso2;
        curso3 = dados.cursos.curso3;
        
        mostrarCurso1 = dados.visibilidade.mostrarCurso1;
        mostrarCurso2 = dados.visibilidade.mostrarCurso2;
        mostrarCurso3 = dados.visibilidade.mostrarCurso3;
        
        dataProvaCurso1 = dados.datasProvas.curso1.data;
        horarioProvaCurso1 = dados.datasProvas.curso1.horario;
        
        dataProvaCurso2 = dados.datasProvas.curso2.data;
        horarioProvaCurso2 = dados.datasProvas.curso2.horario;
        
        dataProvaCurso3 = dados.datasProvas.curso3.data;
        horarioProvaCurso3 = dados.datasProvas.curso3.horario;
        
        inicioInscricoes = dados.inscricoes.inicio;
        fimInscricoes = dados.inscricoes.fim;
        
        // Atualiza as datas convertidas
        inicioInscricoesDate = converterDataBrParaDate(inicioInscricoes);
        fimInscricoesDate = converterDataBrParaDate(fimInscricoes);
        
        console.log(`Configurações carregadas do arquivo ${maiorAno}.json`);
        return true;
        
    } catch (error) {
        console.error('Erro ao carregar configurações do vestibulinho:', error);
        return false;
    }
}

// converte a data de inscrições no formato brasileiro para o formato Date
function converterDataBrParaDate(dataBr) {
    if (!dataBr || dataBr === "") return new Date();
    const [dia, mes, ano] = dataBr.split("/");
    return new Date(ano, mes - 1, dia); // mês começa do zero em JS
}

// Variáveis para datas (inicializadas após carregamento)
let inicioInscricoesDate = new Date();
let fimInscricoesDate = new Date();

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
document.addEventListener('DOMContentLoaded', async function() {
    // Mostra a tela de loading
    mostrarLoading();
    
    try {
        // Primeiro carrega as configurações do JSON
        const configCarregada = await carregarConfiguracoes();
        
        if (configCarregada) {
            // Só executa as outras funções se as configurações foram carregadas com sucesso
            handleVestibulinhoLinks();
            atualizarTodasDatas();
            atualizarAnoVestibulinho();
            
            // Aguarda um tempo mínimo para que o usuário veja o loading
            await new Promise(resolve => setTimeout(resolve, 800));
            
            // Esconde a tela de loading e mostra o conteúdo
            esconderLoading();
        } else {
            console.error('Falha ao carregar configurações do vestibulinho');
            // Mesmo com erro, esconde o loading após um tempo
            setTimeout(esconderLoading, 1000);
        }
    } catch (error) {
        console.error('Erro durante a inicialização:', error);
        // Em caso de erro, esconde o loading após um tempo
        setTimeout(esconderLoading, 1000);
    }
});