async function getDadosVestibulinho() {
    let dadosApi = {
        vestibulinhoAtivo: false,
        documentos: []
    };

    try {
        const response = await fetch('https://vestibulinho.etep.com.br/api/arquivos/');
        if (response.ok) {
            dadosApi = await response.json();
        } else {
            console.error(`Erro HTTP ao buscar API: ${response.status}`);
        }
    } catch (erro) {
        console.error('Erro ao buscar dados do vestibulinho da API:', erro);
    }

    try {
        const prefResponse = await fetch('json/preferencia.json');
        if (prefResponse.ok) {
            const preferencia = await prefResponse.json();
            return {
                ...preferencia,
                documentos: dadosApi.documentos || []
            };
        }
    } catch (erro) {
        // Se json/preferencia.json não existir ou falhar, segue com os dados da API
    }

    return dadosApi;
}

(async function() {
    const dadosVestibulinho = await getDadosVestibulinho();
    
    // Se vestibulinhoAtivo for true, ativa e exibe as informações do vestibulinho (não mais "em breve")
    window.vestibulinhoAtivo = Boolean(dadosVestibulinho.vestibulinhoAtivo);

    // Atualiza os dados na página se o vestibulinho estiver ativo
    if (window.vestibulinhoAtivo) {
        atualizaTodosOsDados(dadosVestibulinho);
    } else {
        // Se inativo, define como 'Vestibulinho em Breve!' e abre o modal de aviso
        atualizaVestibulinho(dadosVestibulinho.ano, true);
        configurarModalEmBreve();
    }
})();

function configurarModalEmBreve() {
    const modal = document.getElementById('modal-vestibulinho');
    const modalOverlay = document.getElementById('modal-overlay');
    const modalContent = document.getElementById('modal-content');
    const closeModalBtn = document.getElementById('close-modal');

    if (!modal) return;

    function abrirModal() {
        modal.classList.remove('hidden');
        setTimeout(() => {
            if (modalOverlay) {
                modalOverlay.classList.remove('opacity-0');
                modalOverlay.classList.add('opacity-50');
            }
            if (modalContent) {
                modalContent.classList.remove('opacity-0', 'translate-y-4');
                modalContent.classList.add('opacity-100', 'translate-y-0');
            }
        }, 10);
    }

    function fecharModal() {
        if (modalOverlay) {
            modalOverlay.classList.remove('opacity-50');
            modalOverlay.classList.add('opacity-0');
        }
        if (modalContent) {
            modalContent.classList.remove('opacity-100', 'translate-y-0');
            modalContent.classList.add('opacity-0', 'translate-y-4');
        }
        setTimeout(() => {
            modal.classList.add('hidden');
        }, 300);
    }

    if (closeModalBtn) {
        closeModalBtn.addEventListener('click', fecharModal);
    }
    if (modalOverlay) {
        modalOverlay.addEventListener('click', fecharModal);
    }

    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
            fecharModal();
        }
    });

    // Exibe o aviso de que o Vestibulinho estará em breve
    abrirModal();
}