const player1 = document.getElementById('player1');
const player2 = document.getElementById('player2');
const gameField = document.getElementById("game-container");
const player1IdleGif = "warrior1-stand.gif";
const player2IdleGif = "warrior25.gif";
const player1FightGif = "warrior1-attack.gif";
const player2FightGif = "warrior25-fight.gif";
const userTeams = {}; // Словарь { userId: 1 или 2 }
let nextTeam = 1; // Для очередного распределения
let maxHP = 1000;  // начальное значение максимума
let hp1 = maxHP;
let hp2 = maxHP;
let likeCounter = 0;

let p1Left = 0;
let p2Left = 300;

let direction = 1;
let speed = 2;
let collisionCooldown = false;
let collisionSpeed = 0.5;
let player1Attack = 1;
let player2Attack = 1;

function updateHP() {
  const hp1Bar = document.getElementById('hp1');
  const hp2Bar = document.getElementById('hp2');
  const hp1Value = document.getElementById('hp1-value');
  const hp2Value = document.getElementById('hp2-value');

  const hp1Percent = Math.max(0, Math.min((hp1 / maxHP) * 100, 100));
  const hp2Percent = Math.max(0, Math.min((hp2 / maxHP) * 100, 100));

  hp1Bar.style.width = `${(hp1Percent / 100) * 200}px`;
  hp2Bar.style.width = `${(hp2Percent / 100) * 200}px`;

  hp1Value.textContent = Math.round(hp1);
  hp2Value.textContent = Math.round(hp2);
};

function applySpeed() {
  const input = parseFloat(document.getElementById('speedInput').value);
  if (!isNaN(input) && input > 0) {
    collisionSpeed = input;
  }
}

function applyPlayer1Attack() {
  const input = parseFloat(document.getElementById('player1Attack').value);
  if (!isNaN(input) && input > 0) {
    player1Attack = input;
  }
}

function applyPlayer2Attack() {
  const input = parseFloat(document.getElementById('player2Attack').value);
  if (!isNaN(input) && input > 0) {
    player2Attack = input;
  }
}

function healPlayer1() {
  hp1 = Math.min(hp1 + 10, maxHP);
  updateHP();
}

function healPlayer2() {
  hp2 = Math.min(hp2 + 10, maxHP);
  updateHP();
}

let animationId = null;
let roundActive = false;

function startRound() {
  if (!roundActive) {
    roundActive = true;

    // Установить боевые гифки
    player1.style.backgroundImage = `url('${player1FightGif}')`;
    player1.style.backgroundSize = "100%";
    player2.style.backgroundImage = `url('${player2FightGif}')`;
    player2.style.backgroundSize = "100%";

    movePlayers();
    startCountdown();
  }
}

function updatePlayer1HP() {
  const input = parseFloat(document.getElementById('player1HPInput').value);
  if (!isNaN(input) && input >= 0) {
    hp1 = Math.min(input, maxHP);  // Убедимся, что HP не выходит за пределы maxHP
    updateHP();
  }
}

function updatePlayer2HP() {
  const input = parseFloat(document.getElementById('player2HPInput').value);
  if (!isNaN(input) && input >= 0) {
    hp2 = Math.min(input, maxHP);  // Убедимся, что HP не выходит за пределы maxHP
    updateHP();
  }
}

function applyMaxHP() {
  const input = parseFloat(document.getElementById('maxHPInput').value);
  if (!isNaN(input) && input >= 0) {
    maxHP = input;

    hp1 = Math.min(hp1, maxHP);
    hp2 = Math.min(hp2, maxHP);

    updateHP();
  }
}

function endRound() {
  roundActive = false;
  if (animationId) cancelAnimationFrame(animationId);
  stopCountdown();

  // Вернуть начальные гифки
  player1.style.backgroundImage = `url('${player1IdleGif}')`;
  player1.style.backgroundSize = "70%";
  player2.style.backgroundImage = `url('${player2IdleGif}')`;
  player2.style.backgroundSize = "70%";
}

function movePlayers() {
  if (!roundActive) return;

  if (direction === 1) {
    if (p1Left + 200 + speed <= 250) p1Left += speed;
    if (p2Left - speed >= 250) p2Left -= speed;
  } else if (direction === -1) {
    if (p1Left - speed >= 0) p1Left -= speed;
    if (p2Left + 200 + speed <= 500) p2Left += speed;
  }

  player1.style.left = p1Left + 'px';
  player2.style.left = p2Left + 'px';

  if (!collisionCooldown && p1Left + 200 >= p2Left) {
    hp1 = Math.max(0, hp1 - player2Attack);
    hp2 = Math.max(0, hp2 - player1Attack);
    updateHP();

    collisionCooldown = true;
    direction = 0;

let recoil = 60, step = 0;

// 🔽 Сначала сближение
const advanceInterval = setInterval(() => {
  if (step < recoil) {
    if (p1Left + 1 + 200 <= 500) p1Left += 1;
    if (p2Left - 1 >= 0) p2Left -= 1;

    player1.style.left = p1Left + 'px';
    player2.style.left = p2Left + 'px';
    step++;
  } else {
    clearInterval(advanceInterval);
    step = 0;

    // 🔼 Потом отталкивание
    const recoilInterval = setInterval(() => {
      if (step < recoil) {
        if (p1Left - 1 >= 0) p1Left -= 1;
        if (p2Left + 1 + 200 <= 500) p2Left += 1;

        player1.style.left = p1Left + 'px';
        player2.style.left = p2Left + 'px';
        step++;
      } else {
        clearInterval(recoilInterval);
        setTimeout(() => {
          direction = 1;
          collisionCooldown = false;
          if (roundActive) movePlayers();
        }, collisionSpeed * 1000);
      }
    }, 10);
  }
}, 10);
    return; // прекратить цикл до recoil
  }

  if (hp1 > 0 && hp2 > 0) {
    animationId = requestAnimationFrame(movePlayers);
  } else {
    alert(hp1 <= 0 && hp2 <= 0 ? "Ничья!" : hp1 <= 0 ? "Игрок 2 победил!" : "Игрок 1 победил!");
    roundActive = false;
  }
}

let player1SuperAttack = 50;
let player2SuperAttack = 50;

function applySuperAttack(player) {
  const enemy = player === 1 ? player2 : player1;
  const damage = player === 1 ? player1SuperAttack : player2SuperAttack;
  const strikeGif = player === 1 ? "warrior1-death1.gif" : "warrior1-death1.gif";
  
  // 💥 Гифка реакции в зависимости от того, кто получает урон
  const hitReactionGif = player === 1 ? "warrior1-death2.gif" : "warrior1-death2.gif"; // Заменить на нужные гифки

  const originalBackground = enemy.style.backgroundImage;

  if (player === 1) {
    hp2 = Math.max(0, hp2 - damage);
  } else {
    hp1 = Math.max(0, hp1 - damage);
  }

  // 🔥 Эффект суперудара
  const effect = document.createElement("div");
  effect.style.position = "absolute";
  effect.style.left = "0";
  effect.style.top = "0";
  effect.style.width = "500px";
  effect.style.height = "500px";
  effect.style.backgroundImage = "url('bang.gif')";
  effect.style.backgroundSize = "cover";
  effect.style.zIndex = "999";
  effect.id = "fieldEffect";
  gameField.appendChild(effect);

  // 💢 Меняем гифку врага на "получает урон"
  enemy.style.backgroundImage = `url('${hitReactionGif}')`;

  setTimeout(() => {
    effect.remove();
    enemy.style.backgroundImage = originalBackground;
  }, 800);

  updateHP();
}

let countdown = 970; // Время раунда в секундах
let countdownInterval = null;

function startCountdown() {
  const timerEl = document.getElementById("countdown-timer");
  timerEl.style.display = "block";
  timerEl.textContent = countdown;

  countdownInterval = setInterval(() => {
    countdown--;
    timerEl.style.opacity = "0.2";
    setTimeout(() => {
      timerEl.textContent = countdown;
      timerEl.style.opacity = "1";
    }, 150);

    if (countdown <= 0) {
      clearInterval(countdownInterval);
      endRound();
    
      const resultDiv = document.createElement("div");
      resultDiv.id = "winner-announcement";
      resultDiv.style.position = "absolute";
      resultDiv.style.top = "120px";
      resultDiv.style.left = "50%";
      resultDiv.style.transform = "translate(-50%, -50%)";
      resultDiv.style.width = "300px";     
      resultDiv.style.backgroundColor = "rgba(223, 48, 48, 0.8)";
      resultDiv.style.color = "white";
      resultDiv.style.fontFamily = "Tahoma";
      resultDiv.style.padding = "30px 50px";
      resultDiv.style.fontSize = "17px";
      resultDiv.style.borderRadius = "12px";
      resultDiv.style.zIndex = "1000";
      resultDiv.style.textAlign = "center";
    
      if (hp1 > hp2) {
        resultDiv.textContent = "⏱ Время вышло! Победил Игрок 1 по HP!";
      } else if (hp2 > hp1) {
        resultDiv.textContent = "⏱ Время вышло! Победил Игрок 2 по HP!";
      } else {
        resultDiv.textContent = "⏱ Время вышло! Ничья!";
      }
    
      document.body.appendChild(resultDiv);
    
      // Автоматическое удаление через 5 секунд (по желанию)
      setTimeout(() => {
        resultDiv.remove();
      }, 5000);
    }
    
  }, 1000);
}



function stopCountdown() {
  clearInterval(countdownInterval);
  document.getElementById("countdown-timer").style.display = "none";
  countdown = 970; // сбросим на след. раунд
}




let currentLikeTarget = 1; // 1 или 2 — для чередования

function spawnAvatarLike(profilePictureUrl, team, nickname) {
  const likesContainer = team === 1 ? document.getElementById('likes-container1') : document.getElementById('likes-container2');

  // Проверяем, есть ли уже контейнер для этого пользователя
  if (document.getElementById(`user-${nickname}`)) {
    return; // Если уже есть, ничего не добавляем
  }

  // Создаем контейнер для одного пользователя
  const userContainer = document.createElement('div');
  userContainer.id = `user-${nickname}`;
  userContainer.classList.add('user-container');

  // Создаем элемент аватарки
  const avatar = document.createElement('img');
  avatar.src = profilePictureUrl;
  avatar.alt = nickname;
  avatar.classList.add('avatar');

  // Создаем элемент имени
  const name = document.createElement('div');
  name.textContent = nickname;
  name.classList.add('username');

  // Добавляем аватарку и имя в контейнер пользователя
  userContainer.appendChild(avatar);
  userContainer.appendChild(name);

  // Добавляем контейнер пользователя в основной контейнер лайков
  likesContainer.appendChild(userContainer);
}


function addPlayerToTeam(userId, user, team) {
  const teamContainer = document.getElementById(`players-${team}`);
  
  // Проверка, чтобы не добавить того же игрока дважды
  if (document.getElementById(`player-${userId}`)) return;

  // Создаем элемент для игрока
  const playerDiv = document.createElement('div');
  playerDiv.classList.add('player');
  playerDiv.id = `player-${userId}`;

  // Создаем аватар игрока
  const avatar = document.createElement('img');
  avatar.src = user.profilePictureUrl;
  avatar.alt = user.nickname;
  avatar.className = 'avatar';

  // Создаем имя игрока
  const nickname = document.createElement('div');
  nickname.className = 'nickname';
  nickname.innerText = user.nickname;

  // Добавляем аватар и имя в контейнер игрока
  playerDiv.appendChild(avatar);
  playerDiv.appendChild(nickname);

  // Добавляем игрока в команду
  teamContainer.appendChild(playerDiv);
}

function displayMessage(team, userNickname, likeCount) {
  const messageContainer = team === 1 ? document.getElementById('message-container1') : document.getElementById('message-container2');

  // Создаём новый div для сообщения
  const messageDiv = document.createElement('div');
  messageDiv.classList.add('message');
  messageDiv.textContent = `${userNickname} пополнил ХП на ${likeCount}`;

  // Добавляем сообщение в контейнер
  messageContainer.appendChild(messageDiv);

  // Удаляем сообщение через 1 секунду
  setTimeout(() => {
    messageDiv.remove();
  }, 2000);
}



function resetMonsters() {
  const effect = document.createElement("div");
  effect.style.position = "absolute";
  effect.style.left = "0";
  effect.style.top = "0";
  effect.style.width = "500px";
  effect.style.height = "500px";
  effect.style.backgroundImage = "url('bang.gif')";
  effect.style.backgroundSize = "cover";
  effect.style.zIndex = "999"; 
  effect.id = "fieldEffect";

  gameField.appendChild(effect);

  setTimeout(() => {
    effect.remove();
  }, 1000);
}

function superStrike1() {
  const effect = document.createElement("div");
  effect.style.position = "absolute";
  effect.style.left = "0";
  effect.style.top = "0";
  effect.style.width = "500px";
  effect.style.height = "500px";
  effect.style.backgroundImage = "url('superstrike3.gif')";
  effect.style.backgroundSize = "cover";
  effect.style.zIndex = "999"; 
  effect.id = "fieldEffect";

  gameField.appendChild(effect);

  setTimeout(() => {
    effect.remove();
  }, 1000);
}

function superStrike2() {
  const effect = document.createElement("div");
  effect.style.position = "absolute";
  effect.style.left = "0";
  effect.style.top = "0";
  effect.style.width = "500px";
  effect.style.height = "500px";
  effect.style.backgroundImage = "url('superstrike8.gif')";
  effect.style.backgroundSize = "100%";
  effect.style.zIndex = "999"; 
  effect.id = "fieldEffect";

  gameField.appendChild(effect);

  setTimeout(() => {
    effect.remove();
  }, 3200);
}

updateHP();
movePlayers();

player1.style.backgroundImage = `url('${player1IdleGif}')`;

player2.style.backgroundImage = `url('${player2IdleGif}')`;


const socket = new WebSocket('ws://localhost:3000');

socket.onmessage = (event) => {
  const data = JSON.parse(event.data);

  const user = data.user || {};
  const userId = user.id;

  if (!userId) {
    console.warn('Пользователь без ID, пропускаем');
    return;
  }

  if (!userTeams[userId]) {
    userTeams[userId] = nextTeam;
    console.log(`Пользователь ${user.nickname} присоединился к команде ${nextTeam}`);
    nextTeam = nextTeam === 1 ? 2 : 1; // Чередуем: 1 -> 2 -> 1 -> 2
  }

  const team = userTeams[userId];

  if (data.type === 'like') {
    const match = data.message.match(/(\d+)\s+лайк/);
    const likeCount = match ? parseInt(match[1]) : 1;
  
    // Увеличиваем ХП соответствующей команде
    if (team === 1) {
      hp1 = Math.min(hp1 + likeCount, maxHP);
      console.log(`Пользователь ${user.nickname} из команды 1 пополнил ХП на ${likeCount} (Текущее ХП: ${hp1})`);
    } else {
      hp2 = Math.min(hp2 + likeCount, maxHP);
      console.log(`Пользователь ${user.nickname} из команды 2 пополнил ХП на ${likeCount} (Текущее ХП: ${hp2})`);
    }
    updateHP();
  
    spawnAvatarLike(user.profilePictureUrl, team, user.nickname); // передаем nickname
  
    // Выводим сообщение о пополнении ХП
    displayMessage(team, user.nickname, likeCount);
  
    const db = firebase.database();
    const usersRef = db.ref("users");
    
    if (!user.id || !user.nickname || !user.uniqueId) {
      console.warn('Ошибка: отсутствуют обязательные данные', user);
      return;
    }
    
    usersRef.once("value", (snapshot) => {
      let users = snapshot.val() || [];
    
      // Ищем пользователя по user.id
      let userIndex = users.findIndex(u => u.userId === user.id);
    
      if (userIndex !== -1) {
        users[userIndex].likes += likeCount;
      } else {
        users.push({
          id: users.length > 0 ? users[users.length - 1].id + 1 : 0,
          userId: user.id,           // ID из TikTok (userId)
          uniqueId: user.uniqueId,   // Юзернейм из TikTok
          username: user.nickname,   // Отображаемое имя
          likes: likeCount
        });
      }
    
      usersRef.set(users);
    });
  }
  


  if (data.type === 'chat') {
    const message = data.message.toLowerCase();
    console.log(`[CHAT] Сообщение от ${userId} — команда ${team}:`, message);

    // Немного лечим игрока по команде
    if (team === 1) {
      hp1 = Math.min(hp1 + 5, maxHP);
    } else {
      hp2 = Math.min(hp2 + 5, maxHP);
    }
    updateHP();

    // Если сообщение содержит ключевое слово "монстр"
    if (message.includes('бабах')) {
      console.log(`👾 Команда ${team} взовала все к ебаной матери`);
      superStrike1(); // Можешь по желанию вызывать спецэффект
    }
    if (message.includes('привет')) {
      console.log(`👾 Команда ${team} написала ${team}`, message);
      superStrike2(); // Можешь по желанию вызывать спецэффект
    }


    if (message.includes('начало')) {
      console.log(`👾 Команда ${team} написала ${team}`, message);
      resetMonsters();
      startRound(); // Можешь по желанию вызывать спецэффект
    }

    if (message.includes('конец')) {
      console.log(`👾 Команда ${team} написала ${team}`, message);
      resetMonsters();
        endRound(); // Можешь по желанию вызывать спецэффект
    }

    if (message.includes('огонь')) {
      console.log(`👾 Команда ${team} призвала монстра!`);
      resetMonsters(); // Можешь по желанию вызывать спецэффект
      superStrike2();
      applySuperAttack(1);
      applySuperAttack(2);
    }
}
  
};