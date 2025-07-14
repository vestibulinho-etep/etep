// Garantir que o jsPDF está disponível globalmente
window.jsPDF = window.jspdf.jsPDF;

// Aguardar o DOM estar pronto
document.addEventListener('DOMContentLoaded', function() {
    // Definir a função no escopo global
    window.gerarPDFInscricao = function() {
        // Criar novo documento PDF
        const doc = new jsPDF();
        
        // Configurações de fonte e margens
        const margemEsquerda = 20;
        let posicaoY = 20;
        
        // Função auxiliar para adicionar texto
        function adicionarTexto(texto, negrito = false) {
            doc.setFont('helvetica', negrito ? 'bold' : 'normal');
            doc.text(texto, margemEsquerda, posicaoY);
            posicaoY += 7;
        }

        // Função auxiliar para adicionar campo
        function adicionarCampo(label, valor) {
            if (valor && valor !== 'undefined' && valor !== 'null') {
                doc.setFont('helvetica', 'bold');
                doc.text(label + ': ', margemEsquerda, posicaoY);
                doc.setFont('helvetica', 'normal');
                doc.text(valor, margemEsquerda + doc.getTextWidth(label + ': '), posicaoY);
                posicaoY += 7;
            }
        }

        try {
            // Obter dados do elemento hidden
            const dados = document.getElementById('dadosInscricao').dataset;
            
            // Título
            doc.setFontSize(16);
            adicionarTexto('Comprovante de Inscrição - Vestibulinho ETEP', true);
            doc.setFontSize(12);
            posicaoY += 5;

            // Dados do Candidato
            adicionarTexto('Dados do Candidato', true);
            adicionarCampo('Nome', dados.nome);
            adicionarCampo('CPF', dados.cpf);
            adicionarCampo('Data de Nascimento', dados.dataNascimento);
            adicionarCampo('Telefone', dados.telefone);
            adicionarCampo('E-mail', dados.email);
            adicionarCampo('Morador de Paulínia', dados.moradorPaulinia);
            adicionarCampo('Escola Particular', dados.escolaParticular);
            posicaoY += 5;

            // Dados do Responsável (se houver)
            if (dados.nomeResponsavel) {
                adicionarTexto('Dados do Responsável', true);
                adicionarCampo('Nome', dados.nomeResponsavel);
                adicionarCampo('CPF', dados.cpfResponsavel);
                posicaoY += 5;
            }

            // Informações de PCD e Acessibilidade
            if (dados.pcd === 'Sim') {
                adicionarTexto('Informações de PCD', true);
                adicionarCampo('PCD', dados.pcd);
                if (dados.descricaoDeficiencia) {
                    adicionarCampo('Descrição', dados.descricaoDeficiencia);
                }
                posicaoY += 5;
            }

            if (dados.acessibilidade === 'Sim') {
                adicionarTexto('Acessibilidade', true);
                adicionarCampo('Acessibilidade Solicitada', dados.acessibilidade);
                if (dados.descricaoAcessibilidade) {
                    adicionarCampo('Descrição', dados.descricaoAcessibilidade);
                }
                posicaoY += 5;
            }

            // Cursos
            adicionarTexto('Cursos Inscritos', true);
            const cursos = dados.cursos.split('|');
            cursos.forEach(curso => {
                adicionarCampo('Curso', curso);
            });
            posicaoY += 5;

            // Local da Prova
            adicionarTexto('Local da Prova', true);
            doc.setFontSize(10);
            const localProva = dados.localProva;
            const linhasLocal = doc.splitTextToSize(localProva, 170);
            linhasLocal.forEach(linha => {
                doc.text(linha, margemEsquerda, posicaoY);
                posicaoY += 5;
            });
            doc.setFontSize(12);
            posicaoY += 10;

            // Espaço para Assinatura
            posicaoY = Math.min(posicaoY, 240); // Garantir que a assinatura não fique muito embaixo
            doc.line(margemEsquerda, posicaoY, 190, posicaoY); // Linha para assinatura
            posicaoY += 5;
            doc.text('Assinatura do Candidato', margemEsquerda, posicaoY);
            
            if (dados.nomeResponsavel) {
                posicaoY += 20;
                doc.line(margemEsquerda, posicaoY, 190, posicaoY); // Linha para assinatura do responsável
                posicaoY += 5;
                doc.text('Assinatura do Responsável', margemEsquerda, posicaoY);
            }

            // Data e Local
            posicaoY += 20;
            const dataAtual = new Date().toLocaleDateString('pt-BR');
            doc.text(`Paulínia, ${dataAtual}`, margemEsquerda, posicaoY);

            // Gerar e abrir o PDF
            doc.save('comprovante_inscricao.pdf');
        } catch (error) {
            console.error('Erro ao gerar PDF:', error);
            alert('Erro ao gerar o PDF. Por favor, tente novamente.');
        }
    };
});
