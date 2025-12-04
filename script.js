/* ============================== */
/* Fogos 🎆                       */
/* ============================== */
function iniciarFogos() {
    const canvas = document.getElementById("fireworksCanvas");
    const ctx = canvas.getContext("2d");

    canvas.style.display = "block";
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    let particles = [];

/* ============================== */
/* Som dos Fogos – tocar 1 vez   */
/* ============================== */

let fogoSomTocado = false;

function tocarSomFogos() {
    if (fogoSomTocado) return; // já tocou → não toca mais

    const audio = document.getElementById("fireworkSound");
    if (!audio) return;

    fogoSomTocado = true; // não toca novamente

    audio.currentTime = 0;
    audio.play().catch(() => {});

    // ⏳ PARA O SOM APÓS 5 SEGUNDOS
    setTimeout(() => {
        audio.pause();
        audio.currentTime = 0;
    }, 5000);
}

    function random(min, max) { return Math.random() * (max - min) + min; }

    function createFirework() {

        // 🔊 TOCA O SOM TODA VEZ QUE UM FOGO NOVO É CRIADO
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

/* ============================== */
/* Bloquear tudo exceto o dia atual */
/* ============================== */
function bloquearDiasExcetoHoje() {
    const dia = new Date().getDay(); // 1-seg ... 6-sab

    const col = {1:1,2:2,3:3,4:4,5:5,6:6}[dia];

    if (!col) return; // domingo → nada liberado

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

/* ============================== */
/* Progresso do dia atual         */
/* ============================== */
function calcularProgressoDiaAtual() {
    const dia = new Date().getDay();
    const col = {1:1,2:2,3:3,4:4,5:5,6:6}[dia];

    if (!col) return 0;

    const linhas = document.querySelectorAll("tbody tr");

    let total = 0;
    let marcados = 0;

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

/* ============================== */
/* Atualiza o relógio             */
/* ============================== */
function atualizarRelogio() {
    const pct = calcularProgressoDiaAtual();

    document.querySelector(".progress-text").textContent = pct + "%";

    const circ = 2 * Math.PI * 35;
    const offset = circ - (pct / 100) * circ;

    document.querySelector(".progress-ring-progress").style.strokeDashoffset = offset;

    if (pct === 100) iniciarFogos();
}

/* ============================== */
/* Principal                      */
/* ============================== */
document.addEventListener("DOMContentLoaded", () => {

    bloquearDiasExcetoHoje();

    const checkboxes = document.querySelectorAll(".checkbox");

    checkboxes.forEach((cb, i) => {
        if (!cb.id) cb.id = "chk_" + i;

        const saved = localStorage.getItem(cb.id);
        if (saved === "true") cb.checked = true;

        cb.addEventListener("change", () => {
            localStorage.setItem(cb.id, cb.checked);
            tocarSomClick();   // 🔊 SOM DO CLICK
            atualizarRelogio();
        });
    });

    /* Data no título */
    const hoje = new Date();
    const d = String(hoje.getDate()).padStart(2, "0");
    const m = String(hoje.getMonth() + 1).padStart(2, "0");
    const a = hoje.getFullYear();

    document.querySelector(".subtitle").textContent =
        `Semana de ${d}/${m}/${a}`;

    /* Dia atual destacado */
    const col = {1:1,2:2,3:3,4:4,5:5,6:6}[hoje.getDay()];
    if (col) {
        document.querySelectorAll("table tr").forEach(row => {
            if (row.children[col])
                row.children[col].classList.add("dia-atual");
        });
    }

    atualizarRelogio();
});


/* ============================== */
/* Som do Click 🎵               */
/* ============================== */
function tocarSomClick() {
    const audio = document.getElementById("clickSound");
    if (!audio) return;
    audio.currentTime = 0;
    audio.play().catch(() => {});
}