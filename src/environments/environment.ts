export const environment = {
    production: typeof location !== 'undefined' && location.hostname !== 'localhost',
    apiUrl: typeof location !== 'undefined' && location.hostname !== 'localhost'
        ? 'https://bakai-backend.b3-home.space'
        : 'http://localhost:8080'
};
