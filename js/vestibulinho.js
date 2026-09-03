async function getDadosVestibulinho() {
    try {
        const response = await fetch('https://vestibulinho.etep.com.br/api/arquivos/');
        if (!response.ok) {
            throw new Error(`Erro HTTP: ${response.status}`);
        }
        const dados = await response.json();
        return dados;
    } catch (erro) {
        console.error('Erro ao buscar dados do vestibulinho:', erro);
        return {
            vestibulinhoAtivo: false,
            documentos: []
        };
    }
}

(async function() {
    const dadosVestibulinho = await getDadosVestibulinho();
    
    // Verifica se há pelo menos um documento/arquivo publicado para a ETEP
    const temDocumentos = Array.isArray(dadosVestibulinho.documentos) && 
                          dadosVestibulinho.documentos.some(doc => doc.is_etep);

    // Configurações do Vestibulinho: ativo somente se a flag for true E houver arquivos publicados
    window.vestibulinhoAtivo = Boolean(dadosVestibulinho.vestibulinhoAtivo && temDocumentos);

    // Atualiza os dados na página se o vestibulinho estiver ativo
    if (window.vestibulinhoAtivo) {
        atualizaTodosOsDados(dadosVestibulinho);
    } else {
        // Enquanto não houver arquivo, define como 'Vestibulinho em Breve!'
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