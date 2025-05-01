const { WebcastPushConnection } = require('tiktok-live-connector');
const WebSocket = require('ws');
const http = require('http');

// WebSocket сервер
const server = http.createServer();
const wss = new WebSocket.Server({ server });

let sockets = [];

wss.on('connection', (ws) => {
    sockets.push(ws);
    ws.on('close', () => {
        sockets = sockets.filter(s => s !== ws);
    });
});

function broadcast(data) {
    const json = JSON.stringify(data);
    sockets.forEach(ws => ws.send(json));
}

// TikTok подключение
let tiktokUsername = "enfor.cross";
let tiktokLiveConnection = new WebcastPushConnection(tiktokUsername);

tiktokLiveConnection.connect().then(state => {
    console.info(`✅ Подключено к roomId ${state.roomId}`);
}).catch(err => {
    console.error('❌ Ошибка подключения:', err);
});

// Чат
tiktokLiveConnection.on('chat', data => {
    const message = `${data.uniqueId}: ${data.comment}`;
    console.log('💬', message);
    broadcast({
        type: 'chat',
        message,
        user: {
            id: data.userId, // ID пользователя
            uniqueId: data.uniqueId,
            nickname: data.nickname, // Имя пользователя
            profilePictureUrl: data.profilePictureUrl // URL аватарки пользователя
        }
    });
});

// Лайки
tiktokLiveConnection.on('like', data => {
    const message = `${data.uniqueId} поставил(а) ${data.likeCount} лайков`;
    console.log('❤️', message);

    // Передаем лайки с дополнительной информацией о пользователе
    broadcast({
        type: 'like',
        message,
        user: {
            id: data.userId, // ID пользователя
            uniqueId: data.uniqueId,
            nickname: data.nickname, // Имя пользователя
            profilePictureUrl: data.profilePictureUrl // URL аватарки пользователя
        }
    });

    firebaseCall();
});

// Подарки
tiktokLiveConnection.on('gift', data => {
    const message = `${data.uniqueId} отправил подарок`;
    console.log('🎁', message);
    broadcast({ type: 'gift', message });
});

// Запуск сервера на 3000
server.listen(3000, () => {
    console.log('🚀 WebSocket сервер запущен на http://localhost:3000');
});
