/* ============================== */
/* Fogos de Artifício 🎆          */
/* ============================== */
function iniciarFogos() {
    const canvas = document.getElementById("fireworksCanvas");
    const ctx = canvas.getContext("2d");

    canvas.style.display = "block";
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    let particles = [];

    function random(min, max) {
        return Math.random() * (max - min) + min;
    }

    function createFirework() {
        const x = random(100, window.innerWidth - 100);
        const y = random(50, window.innerHeight / 2);

        for (let i = 0; i < 60; i++) {
            particles.push({
                x,
                y,
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

        if (particles.length > 0) {
            requestAnimationFrame(loop);
        } else {
            canvas.style.display = "none";
        }
    }

    createFirework();
    loop();
}

/* ============================== */
/* Principal                      */
/* ============================== */
document.addEventListener("DOMContentLoaded", () => {

    const checkboxes = document.querySelectorAll(".checkbox");

    checkboxes.forEach((cb, i) => {
        if (!cb.id) cb.id = "chk_" + i;

        const saved = localStorage.getItem(cb.id);
        if (saved === "true") cb.checked = true;

        cb.addEventListener("change", () => {
            localStorage.setItem(cb.id, cb.checked);
            atualizarRelogio();
        });
    });

    /* Data atual */
    const hoje = new Date();
    const d = String(hoje.getDate()).padStart(2, "0");
    const m = String(hoje.getMonth() + 1).padStart(2, "0");
    const a = hoje.getFullYear();

    document.querySelector(".subtitle").textContent =
        `Semana de ${d}/${m}/${a}`;

    /* Destacar dia da semana */
    const dia = hoje.getDay();
    const map = {1:1,2:2,3:3,4:4,5:5,6:6};

    if (dia !== 0) {
        const col = map[dia];
        document.querySelectorAll("table tr").forEach(row => {
            if (row.children[col])
                row.children[col].classList.add("dia-atual");
        });
    }

    /* Relógio gráfico */
    function atualizarRelogio() {
        const total = checkboxes.length;
        const marcados = Array.from(checkboxes).filter(c => c.checked).length;

        const pct = Math.round((marcados / total) * 100);

        document.querySelector(".progress-text").textContent = pct + "%";

        const circ = 2 * Math.PI * 35;
        const offset = circ - (pct / 100) * circ;

        document.querySelector(".progress-ring-progress").style.strokeDashoffset = offset;

        if (pct === 100) iniciarFogos();
    }

    atualizarRelogio();
});
