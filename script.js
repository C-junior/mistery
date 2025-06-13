// Configuração dos feitiços corretos
const SPELLS = {
    unlock: 'alohomora',
    light: 'reparo',
    reveal: 'malfeito feito'
};

// Estado atual do jogo
let currentPage = 'intro-page';

// Elementos DOM
const pages = document.querySelectorAll('.page');
const spellInput = document.getElementById('spell-input');
const castSpellBtn = document.getElementById('cast-spell-btn');
const spellFeedback = document.getElementById('spell-feedback');

// Inicialização quando a página carrega
document.addEventListener('DOMContentLoaded', function() {
    initializeGame();
    setupEventListeners();
    createMagicalEffects();

    // Tentar tocar o áudio de fundo após qualquer interação do usuário
    const themeAudio = document.getElementById('theme-audio');
    function tryPlayThemeAudio() {
        if (themeAudio && themeAudio.paused) {
            themeAudio.volume = 1;
            themeAudio.play().catch(() => {});
        }
        document.removeEventListener('click', tryPlayThemeAudio);
        document.removeEventListener('keydown', tryPlayThemeAudio);
    }
    document.addEventListener('click', tryPlayThemeAudio);
    document.addEventListener('keydown', tryPlayThemeAudio);
});

// Inicializar o jogo
function initializeGame() {
    showPage('intro-page');
}

// Configurar event listeners
function setupEventListeners() {
    // Primeiro feitiço (Alohomora)
    castSpellBtn.addEventListener('click', () => castSpell(spellInput, 'unlock'));
    spellInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') castSpell(spellInput, 'unlock');
    });

    // Investigar livro
    const investigateBookBtn = document.getElementById('investigate-book-btn');
    if (investigateBookBtn) {
        investigateBookBtn.addEventListener('click', () => {
            showPage('book-page');
            playMagicalSound();
        });
    }

    // Segundo feitiço (Lumos)
    const lightSpellInput = document.getElementById('light-spell-input');
    const castLightSpellBtn = document.getElementById('cast-light-spell-btn');
    if (castLightSpellBtn) {
        castLightSpellBtn.addEventListener('click', () => castSpell(lightSpellInput, 'light'));
        lightSpellInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') castSpell(lightSpellInput, 'light');
        });
    }

    // Procurar varinha
    const findWandBtn = document.getElementById('find-wand-btn');
    if (findWandBtn) {
        findWandBtn.addEventListener('click', () => {
            showPage('wand-page');
            playMagicalSound();
        });
    }

    // Terceiro feitiço (Revelio)
    const revealSpellInput = document.getElementById('reveal-spell-input');
    const castRevealSpellBtn = document.getElementById('cast-reveal-spell-btn');
    if (castRevealSpellBtn) {
        castRevealSpellBtn.addEventListener('click', () => castSpell(revealSpellInput, 'reveal'));
        revealSpellInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') castSpell(revealSpellInput, 'reveal');
        });
    }

    // Ir ao quarto final
    const finalRoomBtn = document.getElementById('final-room-btn');
    if (finalRoomBtn) {
        finalRoomBtn.addEventListener('click', () => {
            showPage('final-page');
            playMagicalSound();
        });
    }

    // Fechar os olhos
    const closeEyesBtn = document.getElementById('close-eyes-btn');
    if (closeEyesBtn) {
        closeEyesBtn.addEventListener('click', () => {
            closeEyesEffect();
        });
    }

    // Reiniciar jogo
    const restartBtn = document.getElementById('restart-btn');
    if (restartBtn) {
        restartBtn.addEventListener('click', () => {
            restartGame();
        });
    }

    // Revelio na página do Profeta Diário
    const revelioSpellInput = document.getElementById('revelio-spell-input');
    const castRevelioSpellBtn = document.getElementById('cast-revelio-spell-btn');
    if (castRevelioSpellBtn) {
        castRevelioSpellBtn.addEventListener('click', () => handleNewsRevelio(revelioSpellInput));
        revelioSpellInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') handleNewsRevelio(revelioSpellInput);
        });
    }
    const toHedwigBtn = document.getElementById('to-hedwig-btn');
    if (toHedwigBtn) {
        toHedwigBtn.addEventListener('click', () => {
            showPage('hedwig-page');
            playMagicalSound();
        });
    }
}

// Mostrar página específica
function showPage(pageId) {
    pages.forEach(page => {
        page.classList.remove('active');
    });
    
    const targetPage = document.getElementById(pageId);
    if (targetPage) {
        targetPage.classList.add('active');
        currentPage = pageId;
        
        // Adicionar efeito de entrada
        targetPage.style.opacity = '0';
        targetPage.style.transform = 'translateY(20px)';
        
        setTimeout(() => {
            targetPage.style.transition = 'all 1s ease-in-out';
            targetPage.style.opacity = '1';
            targetPage.style.transform = 'translateY(0)';
        }, 100);
    }
}

// Conjurar feitiço
function castSpell(inputElement, spellType) {
    const userSpell = inputElement.value.toLowerCase().trim();
    const correctSpell = SPELLS[spellType];
    
    if (userSpell === correctSpell) {
        handleCorrectSpell(spellType, inputElement);
    } else {
        handleIncorrectSpell(inputElement);
    }
}

// Lidar com feitiço correto
function handleCorrectSpell(spellType, inputElement) {
    const feedbackElement = getFeedbackElement(spellType);
    
    // Mostrar feedback de sucesso
    showFeedback(feedbackElement, 'Feitiço conjurado com sucesso! ✨', 'success');
    
    // Efeitos visuais
    createSpellEffect(inputElement);
    playSuccessSound();
    
    // Navegar para próxima página após delay
    setTimeout(() => {
        switch(spellType) {
            case 'unlock':
                showPage('news-page');
                break;
            case 'light':
                showPage('light-page');
                break;
            case 'reveal':
                showPage('revelation-page');
                break;
        }
    }, 2000);
}

// Lidar com feitiço incorreto
function handleIncorrectSpell(inputElement) {
    const spellType = getSpellTypeFromInput(inputElement);
    const feedbackElement = getFeedbackElement(spellType);
    
    // Mostrar feedback de erro
    showFeedback(feedbackElement, 'Feitiço incorreto. Tente novamente! 🪄', 'error');
    
    // Efeito visual de erro
    inputElement.style.animation = 'shake 0.5s ease-in-out';
    setTimeout(() => {
        inputElement.style.animation = '';
    }, 500);
    
    playErrorSound();
    
    // Limpar campo após delay
    setTimeout(() => {
        inputElement.value = '';
        feedbackElement.textContent = '';
        feedbackElement.className = 'feedback';
    }, 3000);
}

// Obter elemento de feedback baseado no tipo de feitiço
function getFeedbackElement(spellType) {
    switch(spellType) {
        case 'unlock':
            return document.getElementById('spell-feedback');
        case 'light':
            return document.getElementById('light-spell-feedback');
        case 'reveal':
            return document.getElementById('reveal-spell-feedback');
        default:
            return document.getElementById('spell-feedback');
    }
}

// Obter tipo de feitiço baseado no input
function getSpellTypeFromInput(inputElement) {
    const inputId = inputElement.id;
    if (inputId.includes('light')) return 'light';
    if (inputId.includes('reveal')) return 'reveal';
    return 'unlock';
}

// Mostrar feedback
function showFeedback(element, message, type) {
    element.textContent = message;
    element.className = `feedback ${type}`;
}

// Criar efeito visual de feitiço
function createSpellEffect(inputElement) {
    const rect = inputElement.getBoundingClientRect();
    const sparkles = [];
    
    for (let i = 0; i < 10; i++) {
        const sparkle = document.createElement('div');
        sparkle.style.position = 'fixed';
        sparkle.style.left = rect.left + rect.width / 2 + 'px';
        sparkle.style.top = rect.top + rect.height / 2 + 'px';
        sparkle.style.width = '4px';
        sparkle.style.height = '4px';
        sparkle.style.background = '#ffd700';
        sparkle.style.borderRadius = '50%';
        sparkle.style.pointerEvents = 'none';
        sparkle.style.zIndex = '9999';
        
        document.body.appendChild(sparkle);
        sparkles.push(sparkle);
        
        // Animar sparkle
        const angle = (i / 10) * Math.PI * 2;
        const distance = 50 + Math.random() * 50;
        const duration = 1000 + Math.random() * 500;
        
        sparkle.animate([
            { 
                transform: 'translate(0, 0) scale(1)',
                opacity: 1
            },
            { 
                transform: `translate(${Math.cos(angle) * distance}px, ${Math.sin(angle) * distance}px) scale(0)`,
                opacity: 0
            }
        ], {
            duration: duration,
            easing: 'ease-out'
        });
    }
    
    // Remover sparkles após animação
    setTimeout(() => {
        sparkles.forEach(sparkle => {
            if (sparkle.parentNode) {
                sparkle.parentNode.removeChild(sparkle);
            }
        });
    }, 2000);
}

// Efeito de fechar os olhos
function closeEyesEffect() {
    const overlay = document.createElement('div');
    overlay.style.position = 'fixed';
    overlay.style.top = '0';
    overlay.style.left = '0';
    overlay.style.width = '100%';
    overlay.style.height = '100%';
    overlay.style.background = '#000';
    overlay.style.zIndex = '9999';
    overlay.style.opacity = '0';
    overlay.style.transition = 'opacity 2s ease-in-out';
    
    document.body.appendChild(overlay);
    
    // Escurecer tela
    setTimeout(() => {
        overlay.style.opacity = '1';
    }, 100);
    
    // Clarear e mostrar revelação
    setTimeout(() => {
        overlay.style.opacity = '0';
        const finalRevelation = document.getElementById('final-revelation');
        if (finalRevelation) {
            finalRevelation.classList.remove('hidden');
            playVictorySound();
        }
    }, 4000);
    
    // Remover overlay
    setTimeout(() => {
        if (overlay.parentNode) {
            overlay.parentNode.removeChild(overlay);
        }
    }, 6000);
}

// Criar efeitos mágicos adicionais
function createMagicalEffects() {
    // Adicionar mais partículas flutuantes
    const container = document.querySelector('.floating-particles');
    
    for (let i = 0; i < 5; i++) {
        const particle = document.createElement('div');
        particle.style.position = 'absolute';
        particle.style.width = '3px';
        particle.style.height = '3px';
        particle.style.background = 'radial-gradient(circle, #ffd700, transparent)';
        particle.style.borderRadius = '50%';
        particle.style.top = Math.random() * 100 + '%';
        particle.style.left = Math.random() * 100 + '%';
        particle.style.animation = `float ${3 + Math.random() * 4}s ease-in-out infinite`;
        particle.style.animationDelay = Math.random() * 2 + 's';
        
        container.appendChild(particle);
    }
    
    // Efeito de hover nos botões
    const buttons = document.querySelectorAll('.magical-btn');
    buttons.forEach(button => {
        button.addEventListener('mouseenter', () => {
            createButtonSparkles(button);
        });
    });
}

// Criar sparkles nos botões
function createButtonSparkles(button) {
    const rect = button.getBoundingClientRect();
    
    for (let i = 0; i < 3; i++) {
        const sparkle = document.createElement('div');
        sparkle.style.position = 'fixed';
        sparkle.style.left = rect.left + Math.random() * rect.width + 'px';
        sparkle.style.top = rect.top + Math.random() * rect.height + 'px';
        sparkle.style.width = '2px';
        sparkle.style.height = '2px';
        sparkle.style.background = '#ffd700';
        sparkle.style.borderRadius = '50%';
        sparkle.style.pointerEvents = 'none';
        sparkle.style.zIndex = '9999';
        
        document.body.appendChild(sparkle);
        
        sparkle.animate([
            { opacity: 1, transform: 'scale(1)' },
            { opacity: 0, transform: 'scale(0)' }
        ], {
            duration: 800,
            easing: 'ease-out'
        });
        
        setTimeout(() => {
            if (sparkle.parentNode) {
                sparkle.parentNode.removeChild(sparkle);
            }
        }, 800);
    }
}

// Reiniciar jogo
function restartGame() {
    // Limpar todos os inputs
    const inputs = document.querySelectorAll('input[type="text"]');
    inputs.forEach(input => {
        input.value = '';
    });
    
    // Limpar feedbacks
    const feedbacks = document.querySelectorAll('.feedback');
    feedbacks.forEach(feedback => {
        feedback.textContent = '';
        feedback.className = 'feedback';
    });
    
    // Esconder revelação final
    const finalRevelation = document.getElementById('final-revelation');
    if (finalRevelation) {
        finalRevelation.classList.add('hidden');
    }

    // Reiniciar música de fundo
    const themeAudio = document.getElementById('theme-audio');
    if (themeAudio) {
        themeAudio.currentTime = 0;
        themeAudio.play();
    }
    
    // Voltar para página inicial
    showPage('intro-page');
    
    // Efeito de reinício
    createRestartEffect();
}

// Efeito visual de reinício
function createRestartEffect() {
    const container = document.querySelector('.container');
    container.style.transform = 'scale(0.8)';
    container.style.opacity = '0.5';
    
    setTimeout(() => {
        container.style.transition = 'all 1s ease-in-out';
        container.style.transform = 'scale(1)';
        container.style.opacity = '1';
    }, 100);
}

// Funções de áudio (simuladas - podem ser implementadas com Web Audio API)
function playBackgroundMusic() {
    // Não é mais necessário, o áudio é controlado pelo HTML
}

function playMagicalSound() {
    // Som mágico genérico
    console.log('✨ Som mágico reproduzido');
}

function playSuccessSound() {
    // Som de sucesso
    console.log('🎉 Som de sucesso reproduzido');
}

function playErrorSound() {
    // Som de erro
    console.log('❌ Som de erro reproduzido');
}

function playVictorySound() {
    // Som de vitória
    console.log('🏆 Som de vitória reproduzido');
}

// Adicionar efeitos de teclado mágico
document.addEventListener('keydown', function(e) {
    // Efeito especial para tecla Enter
    if (e.key === 'Enter') {
        createKeyboardSparkle(e);
    }
});

function createKeyboardSparkle(e) {
    const sparkle = document.createElement('div');
    sparkle.style.position = 'fixed';
    sparkle.style.left = Math.random() * window.innerWidth + 'px';
    sparkle.style.top = Math.random() * window.innerHeight + 'px';
    sparkle.style.width = '3px';
    sparkle.style.height = '3px';
    sparkle.style.background = '#ffd700';
    sparkle.style.borderRadius = '50%';
    sparkle.style.pointerEvents = 'none';
    sparkle.style.zIndex = '9999';
    
    document.body.appendChild(sparkle);
    
    sparkle.animate([
        { opacity: 1, transform: 'scale(1)' },
        { opacity: 0, transform: 'scale(0)' }
    ], {
        duration: 3000,
        easing: 'ease-out'
    });
    
    setTimeout(() => {
        if (sparkle.parentNode) {
            sparkle.parentNode.removeChild(sparkle);
        }
    }, 1000);
}

// Adicionar efeito de cursor mágico
document.addEventListener('mousemove', function(e) {
    if (Math.random() < 0.62) { // 2% de chance a cada movimento
        createCursorTrail(e.clientX, e.clientY);
    }
});

function createCursorTrail(x, y) {
    const trail = document.createElement('div');
    trail.style.position = 'fixed';
    trail.style.left = x + 'px';
    trail.style.top = y + 'px';
    trail.style.width = '2px';
    trail.style.height = '2px';
    trail.style.background = 'rgba(255, 215, 0, 0.6)';
    trail.style.borderRadius = '50%';
    trail.style.pointerEvents = 'none';
    trail.style.zIndex = '9998';
    
    document.body.appendChild(trail);
    
    trail.animate([
        { opacity: 1, transform: 'scale(1)' },
        { opacity: 0, transform: 'scale(0)' }
    ], {
        duration: 2000,
        easing: 'ease-out'
    });
    
    setTimeout(() => {
        if (trail.parentNode) {
            trail.parentNode.removeChild(trail);
        }
    }, 2000);
}

// Adicionar função para lidar com o Revelio na notícia
function handleNewsRevelio(inputElement) {
    const feedback = document.getElementById('revelio-spell-feedback');
    const dumbledoreContainer = document.getElementById('dumbledore-video-container');
    const dumbledoreVideo = document.getElementById('dumbledore-video');
    const themeAudio = document.getElementById('theme-audio');
    const userSpell = inputElement.value.toLowerCase().trim();
    if (userSpell === 'revelio') {
        showFeedback(feedback, 'Mensagem revelada! ✨', 'success');
        createSpellEffect(inputElement);
        playSuccessSound();
        setTimeout(() => {
            feedback.textContent = '';
            feedback.className = 'feedback';
            dumbledoreContainer.style.display = 'block';
            // Pausar música de fundo
            if (themeAudio) themeAudio.pause();
            // Tocar vídeo do Dumbledore com áudio
            if (dumbledoreVideo) {
                dumbledoreVideo.muted = false;
                dumbledoreVideo.currentTime = 0;
                dumbledoreVideo.play().catch(() => {});
                // Scroll para o vídeo
                dumbledoreVideo.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
        }, 1500);
    } else {
        showFeedback(feedback, 'Feitiço incorreto. Tente novamente! 🪄', 'error');
        inputElement.style.animation = 'shake 0.5s ease-in-out';
        playErrorSound();
        setTimeout(() => {
            inputElement.style.animation = '';
            inputElement.value = '';
            feedback.textContent = '';
            feedback.className = 'feedback';
        }, 2000);
    }
}

