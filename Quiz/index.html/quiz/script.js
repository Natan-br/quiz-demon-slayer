// Aguarda o DOM carregar completamente
document.addEventListener('DOMContentLoaded', function() {
    
    // Respostas corretas
    const respostasCorretas = {
        pergunta1: "Flame Breathing, Ninth Form: Rengoku (Respiração das Chamas, Nona Forma: Rengoku)",
        pergunta2: "Hakuji",
        pergunta3: "Não é mencionado – Giyu ficou sozinho desde criança sem irmãos.",
        pergunta4: "Eles sobreviveram juntos à fome extrema e prometeram proteger um ao outro a qualquer custo.",
        pergunta5: "Porque apenas alguém que compreende a música da Dança do Deus do Sol consegue usar sem se auto-destruir.",
        pergunta6: "Kibutsuji Kurusu – queria eliminar possíveis descendentes de famílias caçadoras de demônios.",
        pergunta7: "Michikatsu Tsugikuni – ele ficou obcecado com a habilidade de respiração do sol do irmão e quis viver eternamente.",
        pergunta8: "Respiração do Sol"
    };

    // Formulário do quiz
    const quizForm = document.getElementById('quiz-form');
    
    // Formulário de feedback
    const feedbackForm = document.getElementById('feedback-form');

    // Evento de submit do quiz
    quizForm.addEventListener('submit', function(e) {
        e.preventDefault();
        verificarRespostas();
    });

    // Evento de submit do feedback
    feedbackForm.addEventListener('submit', function(e) {
        e.preventDefault();
        enviarFeedback();
    });

    // Função principal para verificar respostas
    function verificarRespostas() {
        let pontuacao = 0;
        const resultados = [];

        // Verificar cada pergunta
        for (let i = 1; i <= 8; i++) {
            const pergunta = `pergunta${i}`;
            let acertou = false;
            let respostaUsuario = '';

            if (i === 2 || i === 8) {
                // Perguntas de texto
                respostaUsuario = document.querySelector(`[name="${pergunta}"]`).value.trim();
                const respostaCorreta = respostasCorretas[pergunta];
                
                acertou = validarRespostaTexto(respostaUsuario, respostaCorreta);
                
                if (acertou) {
                    pontuacao++;
                }
            } else {
                // Perguntas de múltipla escolha
                const respostaSelecionada = document.querySelector(`[name="${pergunta}"]:checked`);
                
                if (respostaSelecionada) {
                    respostaUsuario = respostaSelecionada.value;
                    acertou = respostaUsuario === respostasCorretas[pergunta];
                    
                    if (acertou) {
                        pontuacao++;
                    }
                }
            }

            resultados.push({
                pergunta: i,
                acertou: acertou,
                respostaUsuario: respostaUsuario,
                respostaCorreta: respostasCorretas[pergunta]
            });
        }

        // Mostrar resultado
        mostrarResultado(pontuacao, resultados);
    }

    // Função para validar respostas de texto (mais flexível)
    function validarRespostaTexto(respostaUsuario, respostaCorreta) {
        // Normalizar as respostas para comparação
        const usuarioNormalizado = respostaUsuario.toLowerCase()
            .normalize('NFD').replace(/[\u0300-\u036f]/g, '') // Remove acentos
            .trim();
        
        const corretoNormalizado = respostaCorreta.toLowerCase()
            .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
            .trim();

        // Verificar correspondência exata ou parcial
        if (usuarioNormalizado === corretoNormalizado) {
            return true;
        }

        // Para a pergunta 2 (nome Hakuji), aceitar variações
        if (corretoNormalizado === 'hakuji') {
            return usuarioNormalizado === 'hakuji' || 
                   usuarioNormalizado === 'hakuji souma' || 
                   usuarioNormalizado.includes('hakuji');
        }

        // Para a pergunta 8 (Respiração do Sol), aceitar variações
        if (corretoNormalizado === 'respiração do sol') {
            return usuarioNormalizado.includes('respiração') && 
                   usuarioNormalizado.includes('sol') ||
                   usuarioNormalizado === 'respiração do sol' ||
                   usuarioNormalizado === 'sun breathing' ||
                   usuarioNormalizado === 'hinokami kagura';
        }

        return false;
    }

    // Função para mostrar o resultado na tela
    function mostrarResultado(pontuacao, resultados) {
        const mensagem = getMensagemPontuacao(pontuacao);
        
        // Criar HTML do resultado
        let resultadoHTML = `
            <div class="resultado-container">
                <div class="pontuacao-header">
                    <h3>Sua Pontuação: ${pontuacao}/8</h3>
                    <div class="barra-progresso">
                        <div class="progresso" style="width: ${(pontuacao/8)*100}%"></div>
                    </div>
                    <p class="mensagem-resultado">${mensagem}</p>
                </div>
                
                <div class="detalhes-respostas">
                    <h4>Detalhes das Respostas:</h4>
                    <div class="lista-resultados">
        `;

        // Adicionar detalhes de cada pergunta
        resultados.forEach(resultado => {
            const status = resultado.acertou ? "✅" : "❌";
            const classe = resultado.acertou ? "acertou" : "errou";
            
            resultadoHTML += `
                <div class="resultado-item ${classe}">
                    <div class="pergunta-header">
                        <span class="status">${status}</span>
                        <strong>Pergunta ${resultado.pergunta}</strong>
                    </div>
            `;
            
            if (!resultado.acertou) {
                resultadoHTML += `
                    <div class="correcao">
                        <small><strong>Sua resposta:</strong> ${resultado.respostaUsuario || 'Não respondida'}</small><br>
                        <small><strong>Resposta correta:</strong> ${resultado.respostaCorreta}</small>
                    </div>
                `;
            }
            
            resultadoHTML += `</div>`;
        });

        resultadoHTML += `
                    </div>
                </div>
                
                <div class="acoes-resultado">
                    <button onclick="reiniciarQuiz()" class="btn-reiniciar">Tentar Novamente</button>
                    <button onclick="compartilharResultado(${pontuacao})" class="btn-compartilhar">Compartilhar Resultado</button>
                </div>
            </div>
        `;

        // Inserir ou atualizar a seção de resultados
        let resultadoSection = document.getElementById('resultado-section');
        if (!resultadoSection) {
            resultadoSection = document.createElement('section');
            resultadoSection.id = 'resultado-section';
            resultadoSection.innerHTML = '<h2>Seu Resultado</h2>' + resultadoHTML;
            
            // Inserir após o formulário do quiz
            const quizFormSection = quizForm.parentElement;
            quizFormSection.parentNode.insertBefore(resultadoSection, quizFormSection.nextSibling);
        } else {
            resultadoSection.innerHTML = '<h2>Seu Resultado</h2>' + resultadoHTML;
        }

        // Adicionar estilos dinâmicos
        adicionarEstilosResultado();

        // Rolagem suave para o resultado
        resultadoSection.scrollIntoView({ 
            behavior: 'smooth',
            block: 'start'
        });

        // Animar a barra de progresso
        setTimeout(() => {
            const barraProgresso = document.querySelector('.progresso');
            if (barraProgresso) {
                barraProgresso.style.transition = 'width 1s ease-in-out';
            }
        }, 100);
    }

    // Função para obter mensagem baseada na pontuação
    function getMensagemPontuacao(pontuacao) {
        const mensagens = {
            0: "Ruim demais kkk. Assistiu de olho fechado? 🚫",
            1: "Ruim demais kkk. Assistiu de olho fechado? 🚫",
            2: "Ruim demais kkk. Assistiu de olho fechado? 🚫",
            3: "Ta noob ainda. Tu assistiu Demon Slayer mesmo? 🤔",
            4: "Ta noob ainda. Tu assistiu Demon Slayer mesmo? 🤔",
            5: "Ta o bichão mesmo! Continue assim! 🎉",
            6: "Ta o bichão mesmo! Muito bem! 🎉",
            7: "Ta o bichão mesmo! Excelente! 🎉",
            8: "UMA LENDA! Precisa nem assistir de novo. APROVADO! 🌟"
        };
        
        return mensagens[pontuacao] || "Resultado interessante!";
    }

    // Função para enviar feedback
    function enviarFeedback() {
        const nome = document.getElementById('name').value.trim();
        const email = document.getElementById('email').value.trim();
        const comentarios = document.getElementById('comentarios').value.trim();

        // Validação básica
        if (!comentarios) {
            mostrarNotificacao('Por favor, digite seus comentários!', 'erro');
            return;
        }

        // Simular envio do feedback
        mostrarNotificacao('Obrigado pelo seu feedback! Sua opinião é muito importante para nós. 🙏', 'sucesso');
        
        // Limpar formulário
        feedbackForm.reset();
        
        // Aqui você pode adicionar uma requisição AJAX para enviar os dados para um servidor
        console.log('Feedback enviado:', { nome, email, comentarios });
    }

    // Função para mostrar notificações
    function mostrarNotificacao(mensagem, tipo = 'info') {
        // Remover notificação anterior se existir
        const notificacaoAnterior = document.querySelector('.notificacao');
        if (notificacaoAnterior) {
            notificacaoAnterior.remove();
        }

        // Criar nova notificação
        const notificacao = document.createElement('div');
        notificacao.className = `notificacao ${tipo}`;
        notificacao.textContent = mensagem;
        
        // Adicionar estilos
        notificacao.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 15px 20px;
            border-radius: 8px;
            color: white;
            font-weight: bold;
            z-index: 1000;
            animation: slideIn 0.3s ease-out;
            max-width: 300px;
        `;

        // Cor baseada no tipo
        const cores = {
            sucesso: '#28a745',
            erro: '#dc3545',
            info: '#17a2b8'
        };
        
        notificacao.style.background = cores[tipo] || cores.info;

        document.body.appendChild(notificacao);

        // Remover após 5 segundos
        setTimeout(() => {
            notificacao.style.animation = 'slideOut 0.3s ease-in';
            setTimeout(() => notificacao.remove(), 300);
        }, 5000);
    }

    // Adicionar estilos CSS para os resultados
    function adicionarEstilosResultado() {
        if (document.getElementById('estilos-dinamicos')) return;

        const estilos = document.createElement('style');
        estilos.id = 'estilos-dinamicos';
        estilos.textContent = `
            .resultado-container {
                background: linear-gradient(135deg, #1a1a1a, #2a0a0a);
                padding: 25px;
                border-radius: 15px;
                border-left: 5px solid #00bfff;
                margin: 20px 0;
            }

            .pontuacao-header {
                text-align: center;
                margin-bottom: 25px;
            }

            .pontuacao-header h3 {
                color: #00bfff;
                font-size: 1.8em;
                margin-bottom: 15px;
            }

            .barra-progresso {
                width: 100%;
                height: 20px;
                background: #333;
                border-radius: 10px;
                overflow: hidden;
                margin: 15px 0;
            }

            .progresso {
                height: 100%;
                background: linear-gradient(90deg, #B71C1C, #ff4444);
                border-radius: 10px;
                transition: width 0.5s ease-in-out;
            }

            .mensagem-resultado {
                font-size: 1.2em;
                font-weight: bold;
                color: #ff4444;
                margin-top: 15px;
            }

            .detalhes-respostas h4 {
                color: #00bfff;
                margin-bottom: 15px;
                border-bottom: 1px solid #444;
                padding-bottom: 8px;
            }

            .lista-resultados {
                display: flex;
                flex-direction: column;
                gap: 10px;
            }

            .resultado-item {
                padding: 15px;
                border-radius: 8px;
                border-left: 4px solid;
            }

            .resultado-item.acertou {
                background: rgba(40, 167, 69, 0.1);
                border-left-color: #28a745;
            }

            .resultado-item.errou {
                background: rgba(220, 53, 69, 0.1);
                border-left-color: #dc3545;
            }

            .pergunta-header {
                display: flex;
                align-items: center;
                gap: 10px;
                margin-bottom: 8px;
            }

            .status {
                font-size: 1.2em;
            }

            .correcao {
                background: rgba(0, 0, 0, 0.3);
                padding: 10px;
                border-radius: 5px;
                margin-top: 8px;
            }

            .acoes-resultado {
                display: flex;
                gap: 15px;
                justify-content: center;
                margin-top: 25px;
                flex-wrap: wrap;
            }

            .btn-reiniciar, .btn-compartilhar {
                padding: 12px 25px;
                border: none;
                border-radius: 8px;
                font-weight: bold;
                cursor: pointer;
                transition: all 0.3s ease;
            }

            .btn-reiniciar {
                background: #B71C1C;
                color: white;
            }

            .btn-reiniciar:hover {
                background: #8B0000;
                transform: translateY(-2px);
            }

            .btn-compartilhar {
                background: #00bfff;
                color: white;
            }

            .btn-compartilhar:hover {
                background: #0099cc;
                transform: translateY(-2px);
            }

            @keyframes slideIn {
                from { transform: translateX(100%); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
            }

            @keyframes slideOut {
                from { transform: translateX(0); opacity: 1; }
                to { transform: translateX(100%); opacity: 0; }
            }

            @media (max-width: 768px) {
                .acoes-resultado {
                    flex-direction: column;
                }
                
                .btn-reiniciar, .btn-compartilhar {
                    width: 100%;
                }
            }
        `;

        document.head.appendChild(estilos);
    }
});

// Funções globais para os botões
function reiniciarQuiz() {
    // Limpar formulário
    document.getElementById('quiz-form').reset();
    
    // Remover seção de resultados
    const resultadoSection = document.getElementById('resultado-section');
    if (resultadoSection) {
        resultadoSection.remove();
    }
    
    // Rolar para o topo do quiz
    document.getElementById('quiz-form').scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
    });
    
    // Mostrar notificação
    if (typeof mostrarNotificacao === 'function') {
        mostrarNotificacao('Quiz reiniciado! Boa sorte! 🍀', 'info');
    }
}

function compartilharResultado(pontuacao) {
    const texto = `🎯 Acabei de fazer o Quiz Demon Slayer e fiz ${pontuacao}/8 pontos! \n\nTeste seus conhecimentos também!`;
    
    // Tentar usar a Web Share API se disponível
    if (navigator.share) {
        navigator.share({
            title: 'Quiz Demon Slayer',
            text: texto,
            url: window.location.href
        }).catch(err => {
            console.log('Erro ao compartilhar:', err);
            copiarParaAreaTransferencia(texto);
        });
    } else {
        // Fallback para copiar para área de transferência
        copiarParaAreaTransferencia(texto);
    }
}

function copiarParaAreaTransferencia(texto) {
    navigator.clipboard.writeText(texto).then(() => {
        if (typeof mostrarNotificacao === 'function') {
            mostrarNotificacao('Resultado copiado para a área de transferência! 📋', 'sucesso');
        }
    }).catch(err => {
        console.log('Erro ao copiar:', err);
        // Fallback manual
        const textarea = document.createElement('textarea');
        textarea.value = texto;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
        
        if (typeof mostrarNotificacao === 'function') {
            mostrarNotificacao('Resultado copiado! 📋', 'sucesso');
        }
    });
}