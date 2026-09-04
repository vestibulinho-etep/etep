/**
 * vestibulinho.js - Gerenciamento centralizado do Vestibulinho ETEP
 *
 * Fonte de dados:
 * - Dados institucionais, cursos, datas de prova, período de inscrições e visibilidade: json/vestibulinho.json
 * - Documentos e editais oficiais para download: API https://vestibulinho.etep.com.br/api/arquivos/
 */

const CURSOS_MAP = {
  ETEP_QUIMICA_INTEGRAL: { cardIndex: 1, alias: "curso1" },
  ETEP_QUIMICA_NOTURNO: { cardIndex: 2, alias: "curso2" },
  ETEP_ENFERMAGEM_MATUTINO: { cardIndex: 3, alias: "curso3" },
  CEMEP_INFORMATICA_INTEGRAL: { cardIndex: 4, alias: "curso4" },
};

function parseDataBrasileira(dataStr) {
  if (!dataStr || typeof dataStr !== "string") return null;
  const partes = dataStr.split("/").map(Number);
  if (partes.length !== 3) return null;
  const [dia, mes, ano] = partes;
  return new Date(ano, mes - 1, dia, 0, 0, 0, 0);
}

function atualizaInscricoes(inicio, fim) {
  const elemento = document.getElementById("inscricoes");
  if (!elemento || !fim) return;

  const dataInicio = parseDataBrasileira(inicio);
  const dataFim = parseDataBrasileira(fim);

  if (!dataFim) return;

  const hoje = new Date();
  hoje.setHours(0, 0, 0, 0);

  if (dataInicio && hoje < dataInicio) {
    elemento.textContent = `Inscrições de ${dataInicio.toLocaleDateString("pt-BR")} a ${dataFim.toLocaleDateString("pt-BR")}`;
  } else if (hoje <= dataFim) {
    elemento.textContent = `Inscrições até ${dataFim.toLocaleDateString("pt-BR")}`;
  } else {
    elemento.textContent = "Inscrições encerradas";
  }
}

function atualizaVestibulinho(ano, emBreve = false) {
  const elementos = document.getElementsByName("vestibulinho");
  elementos.forEach((elemento) => {
    const texto = emBreve
      ? "Vestibulinho em Breve!"
      : `Vestibulinho ${ano || ""}`.trim();
    const icon = elemento.querySelector("i");

    if (icon) {
      elemento.innerHTML = "";
      elemento.appendChild(icon);
      elemento.appendChild(document.createTextNode(" " + texto));
    } else {
      elemento.textContent = texto;
    }
  });
}

function atualizaDataHorarioProva(cardIndex, data, horario) {
  const elemento = document.getElementById(`data-prova-curso-${cardIndex}`);
  if (!elemento) return;

  elemento.textContent = horario
    ? `Prova: ${data} às ${horario}`
    : `Prova: ${data}`;
}

function atualizaCursosVestibulinho(
  cursos = {},
  datasProvas = {},
  visibilidade = {},
) {
  Object.entries(CURSOS_MAP).forEach(([chaveCurso, info]) => {
    const cardIndex = info.cardIndex;
    const cardCurso = document.getElementById(`card-curso-${cardIndex}`);
    if (!cardCurso) return;

    // Verifica visibilidade (prioriza chave semântica, depois alias cursoN)
    const isVisivel =
      visibilidade[chaveCurso] !== false &&
      visibilidade[`mostrarCurso${cardIndex}`] !== false &&
      visibilidade[info.alias] !== false;

    // Obtém dados da prova
    const dadosProva =
      datasProvas[chaveCurso] || datasProvas[info.alias] || null;
    const dataValida =
      dadosProva &&
      dadosProva.data !== null &&
      dadosProva.data !== undefined &&
      String(dadosProva.data).trim() !== "";

    const dadosCurso = cursos[chaveCurso];

    // Atualiza título do curso se elemento existir
    const tituloCurso = document.getElementById(`titulo-curso-${cardIndex}`);
    if (tituloCurso && dadosCurso && dadosCurso.nome) {
      tituloCurso.textContent = dadosCurso.nome;
    }

    // O card é exibido se estiver visível e possuir data de prova válida
    if (isVisivel && dataValida) {
      cardCurso.style.display = "";
      cardCurso.classList.remove("hidden");
      atualizaDataHorarioProva(cardIndex, dadosProva.data, dadosProva.horario);
    } else {
      cardCurso.style.display = "none";
      cardCurso.classList.add("hidden");
    }
  });
}

function atualizaDocumentos(documentos = []) {
  const listaDocumentos = document.getElementById("lista-documentos");
  if (!listaDocumentos) return;

  // Filtra documentos da ETEP
  const docsEtep = documentos
    .filter((doc) => doc.is_etep !== false)
    .sort((a, b) => {
      const dataA =
        parseDataBrasileira(a.data_publicacao) ||
        new Date(a.data_publicacao || 0);
      const dataB =
        parseDataBrasileira(b.data_publicacao) ||
        new Date(b.data_publicacao || 0);
      return dataB - dataA;
    });

  if (docsEtep.length === 0) {
    listaDocumentos.innerHTML =
      '<p class="text-center text-gray-500 py-4">Nenhum documento disponível no momento.</p>';
    return;
  }

  listaDocumentos.innerHTML = docsEtep
    .map(
      (doc) => `
        <div class="py-2.5 px-3 hover:bg-gray-50 rounded-lg transition-colors border-b border-gray-100 last:border-0 flex items-center">
            <span class="text-gray-500 text-sm font-medium mr-4 whitespace-nowrap" style="min-width: 95px;">
                ${doc.data_publicacao || ""}
            </span>
            <a
                href="${doc.arquivo_url}"
                target="_blank"
                rel="noopener noreferrer"
                class="font-medium text-gray-800 hover:text-red-700 transition-colors"
                style="display: inline-flex !important; align-items: center; text-decoration: none;"
            >
                <span
                    class="material-symbols-outlined"
                    style="
                        color: var(--etep-red-dark, #AE1F24);
                        font-size: 20px;
                        margin-right: 8px;
                        vertical-align: middle;
                    "
                >
                    description
                </span>
                <span>${doc.titulo}</span>
                <span
                    class="material-symbols-outlined text-gray-400"
                    style="font-size: 18px; margin-left: 6px; vertical-align: middle;"
                    title="Baixar arquivo"
                >
                    download
                </span>
            </a>
        </div>
      `,
    )
    .join("");
}

function atualizaTodosOsDados(dados) {
  if (!dados) return;

  if (dados.ano !== undefined) {
    atualizaVestibulinho(dados.ano, !dados.vestibulinhoAtivo);
  }

  if (dados.datasProvas || dados.visibilidade || dados.cursos) {
    atualizaCursosVestibulinho(
      dados.cursos,
      dados.datasProvas,
      dados.visibilidade,
    );
  }

  if (dados.documentos) {
    atualizaDocumentos(dados.documentos);
  }

  if (dados.inscricoes) {
    atualizaInscricoes(dados.inscricoes.inicio, dados.inscricoes.fim);
  }
}

async function carregarJsonVestibulinho() {
  const noCacheParam = `_t=${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
  const rotas = [
    `json/vestibulinho.json?${noCacheParam}`,
    `/json/vestibulinho.json?${noCacheParam}`,
    `./json/vestibulinho.json?${noCacheParam}`,
  ];

  for (const rota of rotas) {
    try {
      const resp = await fetch(rota, {
        method: "GET",
        cache: "no-store",
        headers: {
          "Cache-Control": "no-cache, no-store, must-revalidate",
          Pragma: "no-cache",
          Expires: "0",
        },
      });
      if (resp.ok) {
        return await resp.json();
      }
    } catch (e) {
      // Tenta próxima rota
    }
  }

  console.error("Não foi possível carregar o arquivo vestibulinho.json.");
  return null;
}

async function carregarDocumentosDaApi(ano) {
  if (!ano) return [];

  const url = `https://vestibulinho.etep.com.br/api/arquivos/?ano=${encodeURIComponent(ano)}&escola_sigla=ETEP`;

  try {
    const resp = await fetch(url, {
      cache: "no-store",
    });
    if (resp.ok) {
      const data = await resp.json();
      if (Array.isArray(data.documentos)) {
        return data.documentos;
      }
    } else {
      console.warn(`API de arquivos retornou status HTTP ${resp.status}`);
    }
  } catch (erro) {
    console.warn(
      "Documentos oficiais da API remota não puderam ser carregados:",
      erro,
    );
  }
  return [];
}

async function getDadosVestibulinho() {
  // 1. Dados exclusivamente de vestibulinho.json
  const dadosLocais = (await carregarJsonVestibulinho()) || {
    vestibulinhoAtivo: false,
    ano: new Date().getFullYear(),
    inscricoes: null,
    visibilidade: {},
    datasProvas: {},
    cursos: {},
  };

  // 2. Apenas os arquivos/documentos da API externa com ano de vestibulinho.json e escola_sigla=ETEP
  const documentosApi = await carregarDocumentosDaApi(dadosLocais.ano);

  return {
    ...dadosLocais,
    documentos: documentosApi,
  };
}

function configurarModal() {
  const modal = document.getElementById("modal-vestibulinho");
  const modalOverlay = document.getElementById("modal-overlay");
  const modalContent = document.getElementById("modal-content");
  const closeModalBtn = document.getElementById("close-modal");

  if (!modal) return { abrirModal: () => {}, fecharModal: () => {} };

  function abrirModal() {
    modal.classList.remove("hidden");
    setTimeout(() => {
      if (modalOverlay) {
        modalOverlay.classList.remove("opacity-0");
        modalOverlay.classList.add("opacity-50");
      }
      if (modalContent) {
        modalContent.classList.remove("opacity-0", "translate-y-4");
        modalContent.classList.add("opacity-100", "translate-y-0");
      }
    }, 10);
  }

  function fecharModal() {
    if (modalOverlay) {
      modalOverlay.classList.remove("opacity-50");
      modalOverlay.classList.add("opacity-0");
    }
    if (modalContent) {
      modalContent.classList.remove("opacity-100", "translate-y-0");
      modalContent.classList.add("opacity-0", "translate-y-4");
    }
    setTimeout(() => {
      modal.classList.add("hidden");
    }, 300);
  }

  if (closeModalBtn) {
    closeModalBtn.addEventListener("click", fecharModal);
  }
  if (modalOverlay) {
    modalOverlay.addEventListener("click", fecharModal);
  }

  modal.addEventListener("click", function (e) {
    if (
      e.target === modal ||
      (modalContent && !modalContent.contains(e.target))
    ) {
      fecharModal();
    }
  });

  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && !modal.classList.contains("hidden")) {
      fecharModal();
    }
  });

  return { abrirModal, fecharModal };
}

async function inicializarVestibulinho() {
  const dadosVestibulinho = await getDadosVestibulinho();
  window.vestibulinhoAtivo = Boolean(dadosVestibulinho.vestibulinhoAtivo);
  window.dadosVestibulinho = dadosVestibulinho;

  const modalCtrl = configurarModal();

  const isPaginaVestibulinho =
    window.location.pathname.includes("vestibulinho.html") ||
    Boolean(document.getElementById("card-curso-1"));

  if (isPaginaVestibulinho) {
    if (window.vestibulinhoAtivo) {
      atualizaTodosOsDados(dadosVestibulinho);
    } else {
      atualizaVestibulinho(dadosVestibulinho.ano, true);
      modalCtrl.abrirModal();
    }
  } else {
    // Página inicial (index.html ou outras)
    atualizaVestibulinho(dadosVestibulinho.ano, !window.vestibulinhoAtivo);

    // Controla clique nos links de vestibulinho
    const vestibulinhoLinks = document.querySelectorAll(
      '[name="vestibulinho"]',
    );
    vestibulinhoLinks.forEach((link) => {
      link.addEventListener("click", function (e) {
        if (!window.vestibulinhoAtivo) {
          e.preventDefault();
          modalCtrl.abrirModal();
        }
      });
    });
  }
}

// Expõe globalmente para compatibilidade
window.getDadosVestibulinho = getDadosVestibulinho;
window.atualizaTodosOsDados = atualizaTodosOsDados;
window.atualizaVestibulinho = atualizaVestibulinho;
window.atualizaCursosVestibulinho = atualizaCursosVestibulinho;
window.atualizaInscricoes = atualizaInscricoes;
window.atualizaDocumentos = atualizaDocumentos;

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", inicializarVestibulinho);
} else {
  inicializarVestibulinho();
}
