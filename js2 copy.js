// ==============================
// PERGUNTAS COMPLEXAS (PARA CRIANÇAS MAIORES)
// ==============================
const perguntas = [
    {
        pergunta: "Quanto é 8 × 7 ?",
        correta: "56",
        opcoes: ["42", "48", "56"]
    },
    {
        pergunta: "Qual é o maior planeta do Sistema Solar? 🪐",
        correta: "Júpiter",
        opcoes: ["Terra", "Marte", "Júpiter"]
    },
    {
        pergunta: "Qual é a capital do Brasil? 🇧🇷",
        correta: "Brasília",
        opcoes: ["Rio de Janeiro", "Brasília", "São Paulo"]
    },
    {
        pergunta: "Quantos segundos tem um minuto?",
        correta: "60",
        opcoes: ["30", "45", "60"]
    },
    {
        pergunta: "Qual é o resultado de 45 - 18?",
        correta: "27",
        opcoes: ["20", "27", "33"]
    },
    {
        pergunta: "Quem escreveu ‘Dom Casmurro’? 📚",
        correta: "Machado de Assis",
        opcoes: ["Monteiro Lobato", "Machado de Assis", "José de Alencar"]
    },
    {
        pergunta: "Qual é o processo das plantas produzirem seu alimento? 🌱",
        correta: "Fotossíntese",
        opcoes: ["Respiração", "Digestão", "Fotossíntese"]
    },
    {
        pergunta: "Quantos lados tem um hexágono? 🔷",
        correta: "6",
        opcoes: ["5", "6", "8"]
    },
    {
        pergunta: "Qual desses é mamífero?",
        correta: "Golfinho",
        opcoes: ["Tubarão", "Golfinho", "Carpa"]
    },
    {
        pergunta: "Qual é o oposto de 'aumentar'?",
        correta: "diminuir",
        opcoes: ["crescer", "diminuir", "somar"]
    },
    {
        pergunta: "Quanto é 25% de 100?",
        correta: "25",
        opcoes: ["50", "25", "75"]
    },
    {
        pergunta: "Qual gás os seres humanos precisam para respirar?",
        correta: "Oxigênio",
        opcoes: ["Hidrogênio", "Oxigênio", "Nitrogênio"]
    },
    {
        pergunta: "Qual é o continente do Egito? 🏺",
        correta: "África",
        opcoes: ["Ásia", "África", "Europa"]
    },
    {
        pergunta: "Qual é o maior órgão do corpo humano?",
        correta: "A pele",
        opcoes: ["Coração", "Fígado", "A pele"]
    },
    {
        pergunta: "Quantos dias tem o mês de fevereiro em ano bissexto?",
        correta: "29",
        opcoes: ["28", "29", "30"]
    }
];

let indicePerguntaAtual = 0;

// ==============================
// SOM DE ERRO 😉
// ==============================
function tocarSomErro() {
    const audio = document.getElementById("errorSound");
    if (!audio) return;
    audio.currentTime = 0;
    audio.play().catch(() => {});
}

// ==============================
// Fogos 🎆 (Igual ao original)
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
// MODAL DE PERGUNTAS (igual, só usa perguntas difíceis)
// ==============================
function mostrarModalPergunta(callbackCheckbox) {
    const modal = document.getElementById("modalPergunta");
    const textoPergunta = document.getElementById("modalPerguntaTexto");
    const containerOpcoes = document.getElementById("modalOpcoes");

    indicePerguntaAtual = Math.floor(Math.random() * perguntas.length);
    const pergunta = perguntas[indicePerguntaAtual];
    textoPergunta.textContent = pergunta.pergunta;

    const opcoesEmbaralhadas = [...pergunta.opcoes].sort(() => Math.random() - 0.5);
    containerOpcoes.innerHTML = opcoesEmbaralhadas
        .map(opcao => `<button class="opcao-btn" data-resposta="${opcao}">${opcao}</button>`)
        .join('');

    modal.style.display = "flex";

    document.querySelectorAll(".opcao-btn").forEach(btn => {
        btn.onclick = () => {
            const escolhida = btn.dataset.resposta;
            const correta = pergunta.correta;

            if (escolhida === correta) {
                callbackCheckbox.checked = true;
                localStorage.setItem(callbackCheckbox.id, "true");
                modal.style.display = "none";
                atualizarRelogio();
            } else {
                tocarSomErro();
                callbackCheckbox.checked = false;
                modal.style.display = "none";
            }
        };
    });

    document.getElementById("modalBtnCancelar").onclick = () => {
        modal.style.display = "none";
        callbackCheckbox.checked = false;
    };
}

// ==============================
// Função para apagar idade
// ==============================
function resetarIdade() {
    localStorage.removeItem("idadeCrianca");
    alert("Idade apagada! Vou perguntar de novo na próxima vez.");
    window.location.href = "idade.html";
}

// ==============================
// Resto igual ao original (checkbox, progresso, etc.)
// ==============================
document.addEventListener("DOMContentLoaded", () => {
    const checkboxes = document.querySelectorAll("input[type='checkbox']");

    checkboxes.forEach((cb, i) => {
        if (!cb.id) cb.id = "chk2_" + i;

        const saved = localStorage.getItem(cb.id);
        if (saved === "true") cb.checked = true;

        cb.addEventListener("click", (e) => {
            e.preventDefault();
            mostrarModalPergunta(cb);
        });
    });
});
