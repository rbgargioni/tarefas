// ==============================
// PERGUNTAS COM OPCOES (FÁCIL DE EDITAR)
// ==============================
const perguntas = [
    {
        pergunta: "Quantos dedos tem uma mão? 🤚",
        correta: "5",
        opcoes: ["3", "5", "10"]
    },
    {
        pergunta: "Qual é a cor do céu? ☁️",
        correta: "azul",
        opcoes: ["verde", "azul", "amarelo"]
    },
    {
        pergunta: "Quantas pernas tem uma mesa? 🪑",
        correta: "4",
        opcoes: ["2", "3", "4"]
    },
    {
        pergunta: "Qual é o primeiro dia da semana?",
        correta: "segunda",
        opcoes: ["sexta", "segunda", "domingo"]
    },
    {
        pergunta: "Quantas rodas tem uma bicicleta? 🚲",
        correta: "2",
        opcoes: ["2", "4", "6"]
    },
    {
        pergunta: "O que é vermelho e tem sementes? 🍓",
        correta: "morango",
        opcoes: ["banana", "morango", "uva"]
    },
    {
        pergunta: "Quantos meses tem um ano? 📅",
        correta: "12",
        opcoes: ["10", "12", "15"]
    },
    {
        pergunta: "Qual animal faz au au? 🐶",
        correta: "cachorro",
        opcoes: ["gato", "cachorro", "coelho"]
    },
    {
        pergunta: "Quantas cores tem o arco-íris? 🌈",
        correta: "7",
        opcoes: ["5", "7", "10"]
    },
    {
        pergunta: "O que você faz com os dentes? 🦷",
        correta: "escovar",
        opcoes: ["comer", "escovar", "pintar"]
    },
    {
        pergunta: "Onde dormimos? 🛏️",
        correta: "cama",
        opcoes: ["mesa", "cama", "carro"]
    },
    {
        pergunta: "Quantas mãos você tem? ✋",
        correta: "2",
        opcoes: ["1", "2", "4"]
    },
    {
        pergunta: "Qual é o oposto de grande? 📏",
        correta: "pequeno",
        opcoes: ["grande", "pequeno", "médio"]
    },
    {
        pergunta: "O que bebemos da torneira? 🥤",
        correta: "água",
        opcoes: ["leite", "água", "suco"]
    },
    {
        pergunta: "Quantos dias tem uma semana? 📆",
        correta: "7",
        opcoes: ["5", "6", "7"]
    }
];

let indicePerguntaAtual = 0;

// ==============================
// SOM DE ERRO (NOVO)
// ==============================
function tocarSomErro() {
    const audio = document.getElementById("errorSound");
    if (!audio) return;
    audio.currentTime = 0;
    audio.play().catch(() => {});
}
// ==============================
// SOM DE ERRO (NOVO)
// ==============================
function tocarPensando() {
    const audio = document.getElementById("pensando");
    if (!audio) return;

    const inicio = 103; // 1:43
    const fim = 125;    // 2:05

    function startAudio() {
        audio.currentTime = inicio;
        audio.play().catch(() => {});

        const interval = setInterval(() => {
            if (audio.currentTime >= fim) {
                audio.pause();      // para o áudio
                clearInterval(interval); // remove o intervalo
            }
        }, 200);
    }

    if (audio.readyState >= 1) {
        startAudio();
    } else {
        audio.addEventListener("loadedmetadata", startAudio, { once: true });
    }
}
function pararPensando() {
    const audio = document.getElementById("pensando");
    if (!audio) return;
    audio.pause();
    audio.currentTime = 0; // voltar ao início caso queira
}

// ==============================
// Fogos 🎆 (igual)
// ==============================
function iniciarFogos() {
    mostrarParabens();
    const canvas = document.getElementById("fireworksCanvas");
    const ctx = canvas.getContext("2d");
    canvas.style.display = "block";
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    let particles = [];

    let fogoSomTocado = false;
    function tocarSomFogos() {
        const audio = document.getElementById("fireworkSound");
        if (!audio || fogoSomTocado) return;
        fogoSomTocado = true;
        audio.currentTime = 0;
        audio.play().catch(() => {});
        setTimeout(() => { audio.pause(); audio.currentTime = 0; }, 5000);
    }

    function random(min, max) {
        return Math.random() * (max - min) + min;
    }

    function createFirework() {
        tocarSomFogos();
        const x = random(100, window.innerWidth - 100);
        const y = random(50, window.innerHeight / 2);
        for (let i = 0; i < 60; i++) {
            particles.push({
                x, y,
                angle: random(0, Math.PI * 2),
                speed: random(2, 6),
                radius: 2,
                life: 60,
                color: `hsl(${random(0, 360)}, 100%, 60%)`
            });
        }
    }

    function loop() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        particles.forEach((p, i) => {
            p.x += Math.cos(p.angle) * p.speed;
            p.y += Math.sin(p.angle) * p.speed;
            p.life--;
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
            ctx.fillStyle = p.color;
            ctx.fill();
            if (p.life <= 0) particles.splice(i, 1);
        });
        if (Math.random() < 0.05) createFirework();
        if (particles.length > 0) requestAnimationFrame(loop);
        else canvas.style.display = "none";
    }

    createFirework();
    loop();
}

// ==============================
// Funções auxiliares (iguais)
// ==============================
function bloquearDiasExcetoHoje() {
    const dia = new Date().getDay();
    const col = {1:1,2:2,3:3,4:4,5:5,6:6}[dia];
    if (!col) return;
    document.querySelectorAll("table tr").forEach(row => {
        Array.from(row.children).forEach((cel, index) => {
            const chk = cel.querySelector("input[type='checkbox']");
            if (chk && index !== col) {
                chk.disabled = true;
                chk.classList.add("bloqueado");
            }
        });
    });
}

function calcularProgressoDiaAtual() {
    const dia = new Date().getDay();
    const col = {1:1,2:2,3:3,4:4,5:5,6:6}[dia];
    if (!col) return 0;
    const linhas = document.querySelectorAll("tbody tr");
    let total = 0, marcados = 0;
    linhas.forEach(row => {
        const cel = row.children[col];
        const chk = cel.querySelector("input[type='checkbox']");
        if (chk) {
            total++;
            if (chk.checked) marcados++;
        }
    });
    return Math.round((marcados / total) * 100);
}

function atualizarRelogio() {
    const pct = calcularProgressoDiaAtual();
    document.querySelector(".progress-text").textContent = pct + "%";
    const circ = 2 * Math.PI * 35;
    const offset = circ - (pct / 100) * circ;
    document.querySelector(".progress-ring-progress").style.strokeDashoffset = offset;
    if (pct === 100) iniciarFogos();
}

function mostrarModalErro() {
    const modalErro = document.createElement("div");
    modalErro.id = "modalErro";
    modalErro.className = "modal-erro";
    modalErro.innerHTML = `
        <div class="modal-erro-conteudo">
            <div class="modal-erro-emoji">💔</div>
            <div class="modal-erro-texto">Quase! 😅</div>
            <div class="modal-erro-subtexto">Tente de novo ou peça ajuda ao papai/mamãe!</div>
            <button class="btn-erro-ok">✅ Tentar Novamente</button>
        </div>
    `;
    document.body.appendChild(modalErro);
    
    setTimeout(() => {
        if (modalErro.parentNode) modalErro.remove();
    }, 3000);
    
    modalErro.querySelector(".btn-erro-ok").onclick = () => {
        modalErro.remove();
    };
}

// ==============================
// MODAL COM OPCOES MULTIPLA ESCOLHA (MODIFICADO: + som de erro)
// ==============================
function mostrarModalPergunta(callbackCheckbox) {
    tocarPensando(); // ← NOVO!
    const modal = document.getElementById("modalPergunta");
    const textoPergunta = document.getElementById("modalPerguntaTexto");
    const containerOpcoes = document.getElementById("modalOpcoes");
    
    indicePerguntaAtual = Math.floor(Math.random() * perguntas.length);
const pergunta = perguntas[indicePerguntaAtual];
textoPergunta.textContent = pergunta.pergunta;
    
    // Embaralha opções (correta sempre em posição aleatória)
    const opcoesEmbaralhadas = [...pergunta.opcoes].sort(() => Math.random() - 0.5);
    
    containerOpcoes.innerHTML = opcoesEmbaralhadas.map(opcao => 
        `<button class="opcao-btn" data-resposta="${opcao}">${opcao}</button>`
    ).join('');
    
    modal.style.display = "flex";
    
    // Adiciona eventos aos botões de opção
    document.querySelectorAll(".opcao-btn").forEach(btn => {
        btn.onclick = () => {
            pararPensando(); // ← NOVO!
            const escolhida = btn.dataset.resposta;
            const correta = pergunta.correta;
            
            // Remove eventos de todos os botões
            document.querySelectorAll(".opcao-btn").forEach(b => {
                b.onclick = null;
                if (b.dataset.resposta === correta) {
                    b.classList.add("correta");
                } else {
                    b.classList.add("errada");
                }
            });
            
            modal.style.display = "none";
            
            setTimeout(() => {
                // Limpa classes visuais
                document.querySelectorAll(".opcao-btn").forEach(b => {
                    b.classList.remove("correta", "errada");
                });
            }, 1500);
            
            if (escolhida === correta) {
                // ✅ CORRETO!
                callbackCheckbox.checked = true;
                localStorage.setItem(callbackCheckbox.id, "true");
                tocarSomClick();
                atualizarRelogio();
            } else {
                // ❌ ERRADO + SOM DE ERRO!
                tocarSomErro();  // ← NOVO!
                mostrarModalErro();
                callbackCheckbox.checked = false;
            }
        };
    });
    
    document.getElementById("modalBtnCancelar").onclick = () => {
        modal.style.display = "none";
        callbackCheckbox.checked = false;
    };
}

function tocarSomClick() {
    const audio = document.getElementById("clickSound");
    if (!audio) return;
    audio.currentTime = 0;
    audio.play().catch(() => {});
}

// ==============================
// PRINCIPAL (mantido exatamente como você quer)
// ==============================
document.addEventListener("DOMContentLoaded", () => {
    bloquearDiasExcetoHoje();
    
    const checkboxes = document.querySelectorAll(".checkbox");
    checkboxes.forEach((cb, i) => {
        if (!cb.id) cb.id = "chk_" + i;
        const saved = localStorage.getItem(cb.id);
        if (saved === "true") cb.checked = true;
        
        cb.addEventListener("click", (e) => {
            e.preventDefault();
            mostrarModalPergunta(cb);
        });
    });

    const hoje = new Date();
    const d = String(hoje.getDate()).padStart(2, "0");
    const m = String(hoje.getMonth() + 1).padStart(2, "0");
    const a = hoje.getFullYear();
    document.querySelector(".subtitle").textContent = `Semana de ${d}/${m}/${a}`;

    const col = {1:1,2:2,3:3,4:4,5:5,6:6}[hoje.getDay()];
    if (col) {
        document.querySelectorAll("table tr").forEach(row => {
            if (row.children[col]) row.children[col].classList.add("dia-atual");
        });
    }
    
    atualizarRelogio();
});

function mostrarParabens() {
    const texto = document.getElementById("parabensTexto");
    texto.style.display = "block";
    setTimeout(() => { texto.style.display = "none"; }, 5000);
}

// ==============================
// LIMPAR DIA ATUAL (COM MODAL INFANTIL)
// ==============================
function limparDiaAtual() {
    // Cria modal de confirmação
    const modalConfirm = document.createElement("div");
    modalConfirm.id = "modalConfirmar";
    modalConfirm.className = "modal-confirmar";
    modalConfirm.innerHTML = `
        <div class="modal-confirm-conteudo">
            <div class="modal-confirm-emoji">🗑️</div>
            <div class="modal-confirm-texto">Limpar o Dia?</div>
            <div class="modal-confirm-subtexto">Todas as tarefas de HOJE serão apagadas!</div>
            <div class="modal-confirm-botoes">
                <button class="btn-confirm-sim">✅ Sim, Limpar!</button>
                <button class="btn-confirm-nao">❌ Cancelar</button>
            </div>
        </div>
    `;
    document.body.appendChild(modalConfirm);
    
    // Sim - limpa o dia
    modalConfirm.querySelector(".btn-confirm-sim").onclick = () => {
        const dia = new Date().getDay();
        const col = {1:1,2:2,3:3,4:4,5:5,6:6}[dia];
        if (!col) return;
        
        document.querySelectorAll("tbody tr").forEach(row => {
            const cel = row.children[col];
            const chk = cel.querySelector("input[type='checkbox']");
            if (chk) {
                chk.checked = false;
                localStorage.setItem(chk.id, "false");
            }
        });
        
        atualizarRelogio();
        modalConfirm.remove();
        
        // Mostra modal de sucesso
        setTimeout(() => mostrarModalSucesso(), 200);
    };
    
    // Não - fecha modal
    modalConfirm.querySelector(".btn-confirm-nao").onclick = () => {
        modalConfirm.remove();
    };
    
    // Fecha com ESC
    document.onkeydown = (e) => {
        if (e.key === "Escape") modalConfirm.remove();
    };
}

function mostrarModalSucesso() {
    const modalSucesso = document.createElement("div");
    modalSucesso.id = "modalSucesso";
    modalSucesso.className = "modal-sucesso";
    modalSucesso.innerHTML = `
        <div class="modal-sucesso-conteudo">
            <div class="modal-sucesso-emoji">✅</div>
            <div class="modal-sucesso-texto">Dia Limpinho!</div>
            <div class="modal-sucesso-subtexto">Pronto para começar de novo! ✨</div>
        </div>
    `;
    document.body.appendChild(modalSucesso);
    
    setTimeout(() => {
        if (modalSucesso.parentNode) modalSucesso.remove();
    }, 2500);
}


function resetarIdade() {
    localStorage.removeItem("idadeCrianca");
    localStorage.clear();
   // location.reload();
    const modalErro = document.createElement("div");
    modalErro.id = "modalErro";
    modalErro.className = "modal-erro";
    modalErro.innerHTML = `
        <div class="modal-erro-conteudo">
            <div class="modal-erro-emoji">💔</div>
            <div class="modal-erro-texto">Quase! 😅</div>
            <div class="modal-erro-subtexto">Clique para digitar sua idade!</div>
            <button class="btn-erro-ok">✅ Tentar Novamente</button>
        </div>
    `;
    document.body.appendChild(modalErro);
    setTimeout(() => {
        if (modalErro.parentNode) modalErro.remove();
        window.location.href = "index.html";
    }, 3000);
    
    modalErro.querySelector(".btn-erro-ok").onclick = () => {
        modalErro.remove();
    };
}