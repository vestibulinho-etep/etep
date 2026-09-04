function parseDataBrasileira(dataStr) {
    const [dia, mes, ano] = dataStr.split('/').map(Number);
    return new Date(ano, mes - 1, dia, 0, 0, 0, 0);
}


function atualizaInscricoes(inicio, fim) {
    const elemento = document.getElementById('inscricoes');

    if (!elemento || !fim) return;

    const dataInicio = parseDataBrasileira(inicio);
    const dataFim = parseDataBrasileira(fim);

    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0);

    if (hoje >= dataInicio && hoje <= dataFim) {
        elemento.textContent =
            `Inscrições até ${dataFim.toLocaleDateString('pt-BR')}`;

    } else if (hoje < dataInicio) {
        elemento.textContent =
            `Inscrições de ${dataInicio.toLocaleDateString('pt-BR')} a ${dataFim.toLocaleDateString('pt-BR')}`;

    } else {
        elemento.textContent = 'Inscrições encerradas';
    }
}


function atualizaVestibulinho(ano, emBreve = false) {
    const elementos = document.getElementsByName('vestibulinho');

    elementos.forEach(elemento => {
        const texto = emBreve
            ? 'Vestibulinho em Breve!'
            : `Vestibulinho ${ano}`;

        const icon = elemento.querySelector('i');

        if (icon) {
            elemento.innerHTML = '';
            elemento.appendChild(icon);
            elemento.appendChild(document.createTextNode(' ' + texto));
        } else {
            elemento.textContent = texto;
        }
    });
}


function atualizaDataHorarioProva(curso, data, horario) {
    const elemento = document.getElementById(
        'data-prova-curso-' + curso
    );

    if (!elemento) return;

    elemento.textContent = horario
        ? `Prova: ${data} às ${horario}`
        : `Prova: ${data}`;
}


function atualizaCursosVestibulinho(datasProvas, visibilidade) {

    // Cursos 1 a 3 da ETEP.
    // O curso 4 do CEMEP é ignorado.
    for (let i = 1; i <= 3; i++) {

        const cardCurso = document.getElementById(`card-curso-${i}`);

        if (!cardCurso) continue;

        const cursoKey = `curso${i}`;
        const visibilidadeKey = `mostrarCurso${i}`;

        const isVisivel =
            !visibilidade ||
            visibilidade[visibilidadeKey] !== false;

        const dadosProva =
            datasProvas
                ? datasProvas[cursoKey]
                : null;

        const dataValida =
            dadosProva &&
            dadosProva.data !== null &&
            dadosProva.data !== undefined &&
            String(dadosProva.data).trim() !== '';

        /*
         * O curso só aparece quando:
         * 1. Está configurado como visível
         * 2. Possui uma data de prova válida
         */
        if (isVisivel && dataValida) {

            cardCurso.style.display = '';
            cardCurso.classList.remove('hidden');

            atualizaDataHorarioProva(
                i.toString(),
                dadosProva.data,
                dadosProva.horario
            );

        } else {

            cardCurso.style.display = 'none';
            cardCurso.classList.add('hidden');
        }
    }
}


function atualizaDocumentos(documentos) {

    const listaDocumentos =
        document.getElementById('lista-documentos');

    if (!listaDocumentos) return;

    // Filtra apenas documentos da ETEP
    // e ordena por data de publicação decrescente.
    const docsEtep = documentos
        .filter(doc => doc.is_etep)
        .sort(
            (a, b) =>
                new Date(b.data_publicacao) -
                new Date(a.data_publicacao)
        );

    if (docsEtep.length === 0) {

        listaDocumentos.innerHTML =
            '<p class="text-center text-gray-500">' +
            'Nenhum documento disponível no momento.' +
            '</p>';

        return;
    }

    const docsHTML = docsEtep
        .map(doc => `
            <div class="py-2 px-3 hover:bg-gray-50 rounded-lg transition-colors">
                <a
                    href="${doc.arquivo_url}"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="document-link font-medium"
                >
                    <span class="text-gray-500 text-sm">
                        ${doc.data_publicacao}
                    </span>

                    <span
                        class="material-symbols-outlined"
                        style="
                            color: var(--etep-red-dark);
                            font-size: 18px;
                            vertical-align: text-bottom;
                            margin: 0 8px;
                        "
                    >
                        download
                    </span>

                    ${doc.titulo}
                </a>
            </div>
        `)
        .join('');

    listaDocumentos.innerHTML = docsHTML;
}


function atualizaTodosOsDados(dados) {

    if (!dados) {
        console.error('Dados não foram fornecidos.');
        return;
    }

    // Atualiza o ano do vestibulinho
    if (dados.ano !== undefined) {
        atualizaVestibulinho(dados.ano);
    }

    // Atualiza datas, horários e visibilidade dos cursos
    if (dados.datasProvas || dados.visibilidade) {
        atualizaCursosVestibulinho(
            dados.datasProvas,
            dados.visibilidade
        );
    }

    // Atualiza lista de documentos
    if (dados.documentos) {
        atualizaDocumentos(dados.documentos);
    }

    // Atualiza período de inscrições
    if (dados.inscricoes) {

        atualizaInscricoes(
            dados.inscricoes.inicio || '01/09/2025',
            dados.inscricoes.fim
        );
    }
}


/*
 * ============================================================
 * CARREGAMENTO DOS DADOS
 * ============================================================
 *
 * IMPORTANTE:
 * Troque "dados.json" pelo caminho/nome real do seu arquivo.
 *
 * O parâmetro ?v=Date.now() impede que caches intermediários
 * reutilizem uma versão antiga do JSON.
 *
 * cache: 'no-store' instrui o navegador a não utilizar cache
 * para essa requisição.
 */
async function carregarDados() {

    try {

        const url =
            `dados.json?v=${Date.now()}`;

        const response = await fetch(url, {
            cache: 'no-store'
        });

        if (!response.ok) {
            throw new Error(
                `Erro HTTP ${response.status}: ${response.statusText}`
            );
        }

        const dados = await response.json();

        console.log('Dados carregados:', dados);

        atualizaTodosOsDados(dados);

    } catch (erro) {

        console.error(
            'Erro ao carregar o arquivo JSON:',
            erro
        );
    }
}


/*
 * ============================================================
 * INICIALIZAÇÃO
 * ============================================================
 *
 * Aguarda o HTML estar carregado antes de tentar alterar
 * os elementos da página.
 */
if (document.readyState === 'loading') {

    document.addEventListener(
        'DOMContentLoaded',
        carregarDados
    );

} else {

    carregarDados();
}
