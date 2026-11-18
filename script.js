/**
 * Quiz Funnel: Namoro ou União Estável?
 * Arquitetura fluida inspirada em Apple Design (WWDC Fluid Interfaces):
 * - Resposta imediata no pointer-down
 * - Feedback táctil e sonoro sutil (Web Audio API synthetized haptic tick)
 * - Transições fluidas com preservação de estado e reversão instantânea
 * - Auto-avanço com micro-delay intencional para percepção de escolha
 */

document.addEventListener('DOMContentLoaded', () => {
  // Estado do Funil
  const state = {
    currentStep: 1,
    totalSteps: 9,
    answers: {},
    isTransitioning: false,
    history: [1]
  };

  // Elementos do DOM
  const quizApp = document.getElementById('quizApp');
  const screens = Array.from(document.querySelectorAll('.screen'));
  const btnBack = document.getElementById('btnBack');
  const stepCounter = document.getElementById('stepCounter');
  const progressBarFill = document.getElementById('progressBarFill');
  const progressBarContainer = document.getElementById('progressBarContainer');
  const btnStartQuiz = document.getElementById('btnStartQuiz');

  // Sistema de Áudio e Feedback Multimodal Apple (Click / Check)
  let audioCtx = null;

  function initAudio() {
    if (!audioCtx) {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      if (AudioContextClass) {
        audioCtx = new AudioContextClass();
      }
    }
    if (audioCtx && audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
  }

  // Desbloqueia áudio no primeiro toque do usuário
  document.addEventListener('pointerdown', initAudio, { once: true });
  document.addEventListener('click', initAudio, { once: true });

  /**
   * Som de Click / Check autêntico e tátil
   * Combina um clique seco acústico com uma breve confirmação harmônica
   */
  function playClickSound() {
    initAudio();
    if (!audioCtx) return;

    try {
      const now = audioCtx.currentTime;

      // 1. Componente de Impacto / Click (Sweep rápido de alta definição)
      const oscClick = audioCtx.createOscillator();
      const gainClick = audioCtx.createGain();

      oscClick.type = 'triangle';
      oscClick.frequency.setValueAtTime(1400, now);
      oscClick.frequency.exponentialRampToValueAtTime(120, now + 0.035);

      gainClick.gain.setValueAtTime(0.28, now);
      gainClick.gain.exponentialRampToValueAtTime(0.001, now + 0.035);

      oscClick.connect(gainClick);
      gainClick.connect(audioCtx.destination);

      oscClick.start(now);
      oscClick.stop(now + 0.04);

      // 2. Componente de "Pop" ressonante de confirmação (Check macio)
      const oscPop = audioCtx.createOscillator();
      const gainPop = audioCtx.createGain();

      oscPop.type = 'sine';
      oscPop.frequency.setValueAtTime(520, now + 0.008);
      oscPop.frequency.exponentialRampToValueAtTime(260, now + 0.06);

      gainPop.gain.setValueAtTime(0.22, now + 0.008);
      gainPop.gain.exponentialRampToValueAtTime(0.001, now + 0.065);

      oscPop.connect(gainPop);
      gainPop.connect(audioCtx.destination);

      oscPop.start(now + 0.008);
      oscPop.stop(now + 0.07);

      // 3. Vibração tátil no celular (se suportado)
      if (typeof navigator !== 'undefined' && navigator.vibrate) {
        navigator.vibrate(22);
      }
    } catch (e) {
      // Degradação silenciosa em caso de restrição do navegador
    }
  }

  /**
   * Atualiza a barra de progresso e o contador
   */
  function updateHeader() {
    const step = state.currentStep;
    const progressPercent = Math.round((step / state.totalSteps) * 100);

    // Barra de progresso com animação suave
    progressBarFill.style.width = `${progressPercent}%`;
    progressBarContainer.setAttribute('aria-valuenow', progressPercent);

    // Rótulo da Etapa
    if (step === 1) {
      stepCounter.textContent = 'Início';
      btnBack.style.visibility = 'hidden';
      btnBack.style.opacity = '0';
    } else if (step === state.totalSteps) {
      stepCounter.textContent = 'Resultado';
      btnBack.style.visibility = 'visible';
      btnBack.style.opacity = '1';
    } else {
      stepCounter.textContent = `Etapa ${step} de ${state.totalSteps}`;
      btnBack.style.visibility = 'visible';
      btnBack.style.opacity = '1';
    }
  }

  /**
   * Navega para um passo específico com transição fluida
   */
  function goToStep(targetStep, direction = 'forward') {
    if (targetStep < 1 || targetStep > state.totalSteps || state.isTransitioning) return;
    if (targetStep === state.currentStep) return;

    state.isTransitioning = true;
    const currentScreen = document.getElementById(`screen-${state.currentStep}`);
    const nextScreen = document.getElementById(`screen-${targetStep}`);

    if (!currentScreen || !nextScreen) {
      state.isTransitioning = false;
      return;
    }

    // Scroll para o topo suavemente no container
    const screensWrapper = document.querySelector('.screens-wrapper');
    if (screensWrapper) screensWrapper.scrollTo({ top: 0, behavior: 'smooth' });

    // Apple Style Transition
    if (direction === 'forward') {
      currentScreen.style.transform = 'translateX(-28px) scale(0.98)';
      currentScreen.style.opacity = '0';
      
      setTimeout(() => {
        currentScreen.classList.remove('active');
        currentScreen.style.transform = '';
        currentScreen.style.opacity = '';

        nextScreen.classList.add('active');
        nextScreen.style.transform = 'translateX(28px) scale(0.98)';
        nextScreen.style.opacity = '0';

        // Força reflow
        void nextScreen.offsetWidth;

        nextScreen.style.transform = 'translateX(0) scale(1)';
        nextScreen.style.opacity = '1';

        state.currentStep = targetStep;
        if (!state.history.includes(targetStep)) {
          state.history.push(targetStep);
        }
        updateHeader();
        state.isTransitioning = false;
      }, 160);

    } else {
      // Reversão fluida para trás
      currentScreen.style.transform = 'translateX(28px) scale(0.98)';
      currentScreen.style.opacity = '0';

      setTimeout(() => {
        currentScreen.classList.remove('active');
        currentScreen.style.transform = '';
        currentScreen.style.opacity = '';

        nextScreen.classList.add('active');
        nextScreen.style.transform = 'translateX(-28px) scale(0.98)';
        nextScreen.style.opacity = '0';

        void nextScreen.offsetWidth;

        nextScreen.style.transform = 'translateX(0) scale(1)';
        nextScreen.style.opacity = '1';

        state.currentStep = targetStep;
        updateHeader();
        state.isTransitioning = false;
      }, 160);
    }
  }

  /**
   * Volta para a tela anterior
   */
  function goBack() {
    if (state.currentStep > 1 && !state.isTransitioning) {
      playClickSound();
      goToStep(state.currentStep - 1, 'backward');
    }
  }

  // Evento do botão Voltar
  btnBack.addEventListener('click', (e) => {
    e.preventDefault();
    goBack();
  });

  // Botão Começar (Tela 1)
  if (btnStartQuiz) {
    btnStartQuiz.addEventListener('click', (e) => {
      e.preventDefault();
      playClickSound();
      goToStep(2, 'forward');
    });
  }

  // Botões de Continuar das Telas Visuais (Telas 4 e 7)
  const nextButtons = document.querySelectorAll('[data-action="next"]');
  nextButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      playClickSound();
      goToStep(state.currentStep + 1, 'forward');
    });
  });

  // Manipulação das Opções de Pergunta (Auto-Avanço Apple-grade)
  const optionButtons = document.querySelectorAll('.quiz-option');
  optionButtons.forEach(option => {
    // Feedback sonoro/tátil imediato no clique da pergunta (som de click / check)
    option.addEventListener('click', (e) => {
      const button = e.currentTarget;
      const screen = button.closest('.screen');
      const stepIndex = parseInt(screen.dataset.step, 10);
      const answerValue = button.dataset.value;

      // Executa som nítido de click/check instantâneo
      playClickSound();

      // Desmarca outras opções da mesma tela
      const siblings = screen.querySelectorAll('.quiz-option');
      siblings.forEach(s => s.classList.remove('selected'));

      // Marca a opção clicada
      button.classList.add('selected');
      state.answers[stepIndex] = answerValue;

      // Micro-delay calculado para percepção de escolha sem frustração (240ms)
      setTimeout(() => {
        goToStep(stepIndex + 1, 'forward');
      }, 240);
    });
  });

  // Suporte a Navegação por Teclado
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Backspace' || e.key === 'ArrowLeft') {
      if (state.currentStep > 1 && !['INPUT', 'TEXTAREA'].includes(document.activeElement.tagName)) {
        goBack();
      }
    }
  });

  // Inicialização do Header
  updateHeader();
});
