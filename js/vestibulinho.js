async function getDadosVestibulinho() {
    try {
        const response = await fetch('https://wcpmac.hospedagemelastica.com.br/vestibulinho/documentos/api/etep/');
        if (!response.ok) {
            throw new Error(`Erro HTTP: ${response.status}`);
        }
        const dados = await response.json();
        return dados;
    } catch (erro) {
        console.error('Erro ao buscar dados do vestibulinho:', erro);
        return {
            vestibulinhoAtivo: false,
        };
    }
}

(async function() {
    const dadosVestibulinho = await getDadosVestibulinho();
    
    // Configurações do Vestibulinho (carregadas dinamicamente)
    window.vestibulinhoAtivo = dadosVestibulinho.vestibulinhoAtivo || false;

    // Atualiza os dados na página se o vestibulinho estiver ativo
    if (window.vestibulinhoAtivo) {
        atualizaTodosOsDados(dadosVestibulinho);
    }
})();