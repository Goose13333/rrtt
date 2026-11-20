// 1. Анимация фона Матрицы
const canvas = document.getElementById('matrixCanvas');
const ctx = canvas.getContext('2d');

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

const chars = '01ABCDEFGHIJKLMNOPQRSTUVWXYZ#$%&@';
const fontSize = 14;
let columns = Math.floor(canvas.width / fontSize);
let drops = Array(columns).fill(1);

function drawMatrix() {
  ctx.fillStyle = 'rgba(6, 9, 19, 0.08)';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = '#10b981';
  ctx.font = fontSize + 'px monospace';

  for (let i = 0; i < drops.length; i++) {
    const text = chars[Math.floor(Math.random() * chars.length)];
    ctx.fillText(text, i * fontSize, drops[i] * fontSize);
    if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
      drops[i] = 0;
    }
    drops[i]++;
  }
}
setInterval(drawMatrix, 45);

// 2. Переключатель темы
const themeToggle = document.getElementById('themeToggle');
themeToggle.addEventListener('click', () => {
  document.body.classList.toggle('light-theme');
  themeToggle.textContent = document.body.classList.contains('light-theme')
    ? '🌙 Тёмный неон'
    : '☀️ Светлый режим';
});

// 3. Модальные окна угроз
const threatsInfo = {
  phishing: {
    icon: '🎣',
    title: 'Фишинг: фальшивые копии',
    text: 'Мошенники создают точную копию страницы входа в соцсеть или банк. Отличие кроется в одной лишней букве в адресной строке браузера.',
    tip: 'Совет: всегда проверяй домен сайта перед вводом пароля!'
  },
  brute: {
    icon: '🔓',
    title: 'Брутфорс: атака перебором',
    text: 'Пароли вроде "123456" или "qwerty2026" взламываются меньше чем за 1 секунду специальными программами.',
    tip: 'Совет: используй длину от 12 символов, цифры и спецсимволы.'
  },
  social: {
    icon: '🎭',
    title: 'Социальная инженерия',
    text: 'Злоумышленник давит на страх или жадность: «Срочно переведи деньги», «Ты выиграл приз» или «Пришли код из SMS».',
    tip: 'Совет: никому и никогда не называй коды из SMS.'
  },
  twofa: {
    icon: '🔐',
    title: 'Двухфакторная аутентификация',
    text: 'Даже если хакер узнает твой основной пароль, без одноразового кода с твоего телефона он не попадёт в аккаунт.',
    tip: 'Совет: включи 2FA во всех соцсетях и на почте.'
  }
};

function openModal(key) {
  const item = threatsInfo[key];
  document.getElementById('modalIcon').textContent = item.icon;
  document.getElementById('modalTitle').textContent = item.title;
  document.getElementById('modalText').textContent = item.text;
  document.getElementById('modalTip').textContent = item.tip;
  document.getElementById('modalOverlay').style.display = 'flex';
}

function forceCloseModal() {
  document.getElementById('modalOverlay').style.display = 'none';
}

function closeModal(e) {
  if (e.target.id === 'modalOverlay') forceCloseModal();
}

// 4. Генератор и анализатор паролей
function generatePassword() {
  const len = Number(document.getElementById('lengthRange').value);
  document.getElementById('lengthVal').textContent = len;

  const lower = 'abcdefghijklmnopqrstuvwxyz';
  const upper = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const nums = '0123456789';
  const syms = '!@#$%^&*()_+-=';

  let pool = lower;
  if (document.getElementById('incUpper').checked) pool += upper;
  if (document.getElementById('incNumbers').checked) pool += nums;
  if (document.getElementById('incSymbols').checked) pool += syms;

  let pass = '';
  for (let i = 0; i < len; i++) {
    pass += pool[Math.floor(Math.random() * pool.length)];
  }
  document.getElementById('passwordOutput').value = pass;

  // Оценка сложности
  const bar = document.getElementById('strengthBar');
  const sText = document.getElementById('strengthText');
  const cTime = document.getElementById('crackTime');

  if (len < 9) {
    bar.style.width = '30%';
    bar.style.backgroundColor = '#ef4444';
    sText.textContent = 'Надёжность: Слабая';
    cTime.textContent = 'Время взлома: ~2 минуты';
  } else if (len < 13) {
    bar.style.width = '65%';
    bar.style.backgroundColor = '#f59e0b';
    sText.textContent = 'Надёжность: Средняя';
    cTime.textContent = 'Время взлома: ~3 года';
  } else {
    bar.style.width = '100%';
    bar.style.backgroundColor = '#10b981';
    sText.textContent = 'Надёжность: Броня!';
    cTime.textContent = 'Время взлома: > 10 000 лет';
  }
}

function copyPassword() {
  const input = document.getElementById('passwordOutput');
  navigator.clipboard.writeText(input.value);
  const btn = document.getElementById('copyBtn');
  btn.textContent = 'Скопировано!';
  setTimeout(() => (btn.textContent = 'Копировать'), 1500);
}

// 5. Тренажёр фишинга
const scenarios = [
  {
    sender: 'От: support@vk-security-login.ru',
    text: '«Ваш аккаунт будет заблокирован через 2 часа! Срочно перейдите по ссылке и введите пароль для подтверждения.»',
    isPhishing: true,
    explain: 'Верно! Поддельный домен vk-security-login.ru и запугивание блокировкой — классический признак фишинга.'
  },
  {
    sender: 'От: noreply@gosuslugi.ru',
    text: '«Выполнен вход в вашу учётную запись с нового устройства. Если это были не вы, смените пароль в официальном приложении.»',
    isPhishing: false,
    explain: 'Правильно! Официальный домен и письмо не просит переходить по подозрительным ссылкам и вводить данные.'
  },
  {
    sender: 'От: Друг в мессенджере',
    text: '«Привет! Проголосуй за мою племянницу в конкурсе по ссылке, очень нужно, остался 1 час!»',
    isPhishing: true,
    explain: 'Точно! Аккаунт друга взломали и рассылают ссылку для угона твоей учётной записи.'
  },
  {
    sender: 'От: Школьный электронный дневник',
    text: '«Расписание уроков на завтра обновлено. Ознакомиться с изменениями можно в личном кабинете.»',
    isPhishing: false,
    explain: 'Верно! Обычное информационное уведомление без ссылок на ввод пароля или карты.'
  }
];

let currentRound = 0;
let score = 0;

function answerPhishing(userChoice) {
  const item = scenarios[currentRound];
  const fb = document.getElementById('gameFeedback');
  document.getElementById('gameButtons').style.display = 'none';
  fb.style.display = 'block';

  if (userChoice === item.isPhishing) {
    score++;
    document.getElementById('scoreCounter').textContent = `Очки: ${score}`;
    fb.style.backgroundColor = 'rgba(16, 185, 129, 0.2)';
    fb.style.color = '#34d399';
    fb.textContent = '✅ ' + item.explain;
  } else {
    fb.style.backgroundColor = 'rgba(239, 68, 68, 0.2)';
    fb.style.color = '#f87171';
    fb.textContent = '❌ Ошибка! ' + item.explain;
  }

  const nextBtn = document.getElementById('nextRoundBtn');
  nextBtn.style.display = 'block';
  nextBtn.textContent = currentRound < scenarios.length - 1 ? 'Следующая ситуация →' : 'Показать итог';
}

function nextRound() {
  currentRound++;
  if (currentRound < scenarios.length) {
    document.getElementById('roundCounter').textContent = `Ситуация ${currentRound + 1} из ${scenarios.length}`;
    document.getElementById('msgSender').textContent = scenarios[currentRound].sender;
    document.getElementById('msgText').textContent = scenarios[currentRound].text;
    document.getElementById('gameButtons').style.display = 'grid';
    document.getElementById('gameFeedback').style.display = 'none';
    document.getElementById('nextRoundBtn').style.display = 'none';
  } else {
    document.getElementById('messageCard').innerHTML = `<h3>Тренажёр пройден!</h3><p style="margin-top:0.5rem;">Твой результат: <strong>${score} из ${scenarios.length}</strong>. Теперь мошенникам тебя не провести!</p>`;
    document.getElementById('gameFeedback').style.display = 'none';
    document.getElementById('nextRoundBtn').style.display = 'none';
  }
}

generatePassword();
