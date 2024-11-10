const canvas = document.getElementById('particleCanvas');
const ctx = canvas.getContext('2d');

let particles = [];
const particleCount = 100;
const maxDistance = 100;  // Maximum distance at which particles will connect

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let mouseX = 0;
let mouseY = 0;

// Track mouse position
canvas.addEventListener('mousemove', (event) => {
    mouseX = event.x;
    mouseY = event.y;
});

class Particle {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.size = 5; // Increased particle size
        this.speedX = Math.random() * 2 - 1; // random horizontal speed
        this.speedY = Math.random() * 2 - 1; // random vertical speed
        this.hue = Math.random() * 360; // Random initial hue
        this.hueSpeed = 0.5 + Math.random() * 0.5; // Speed at which the hue changes (for smooth color cycling)
    }

    // Update the position of the particle
    update() {
        const dx = mouseX - this.x;
        const dy = mouseY - this.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        // If the particle is close to the mouse, push it away
        if (distance < 150) {
            const angle = Math.atan2(dy, dx);
            this.x -= Math.cos(angle) * 2; // Repel in the opposite direction
            this.y -= Math.sin(angle) * 2;
        }

        // Move the particle normally
        this.x += this.speedX;
        this.y += this.speedY;

        // Create bouncing effect when particles hit canvas edges
        if (this.x <= 0 || this.x >= canvas.width) this.speedX *= -1;
        if (this.y <= 0 || this.y >= canvas.height) this.speedY *= -1;

        // Update the hue to cycle through colors
        this.hue += this.hueSpeed;
        if (this.hue > 360) this.hue = 0; // Loop the hue back to 0 after it reaches 360
    }

    // Draw the particle with a smooth color transition
    draw() {
        const color = `hsl(${this.hue}, 100%, 70%)`; // Using HSL for smooth color transitions
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = color;
        ctx.fill();
    }
}

// Create initial particles
for (let i = 0; i < particleCount; i++) {
    particles.push(new Particle(Math.random() * canvas.width, Math.random() * canvas.height));
}

function connectParticles() {
    for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
            const dx = particles[i].x - particles[j].x;
            const dy = particles[i].y - particles[j].y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < maxDistance) {
                ctx.beginPath();
                ctx.moveTo(particles[i].x, particles[i].y);
                ctx.lineTo(particles[j].x, particles[j].y);
                ctx.strokeStyle = `rgba(255, 255, 255, ${1 - distance / maxDistance})`;
                ctx.lineWidth = 1;
                ctx.stroke();
            }
        }
    }
}

function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear the canvas on each frame

    // Update and draw all particles
    for (let i = 0; i < particles.length; i++) {
        particles[i].update();
        particles[i].draw();
    }

    connectParticles(); // Connect particles with lines

    requestAnimationFrame(animate); // Call the animate function again for the next frame
}

animate(); // Start the animation
