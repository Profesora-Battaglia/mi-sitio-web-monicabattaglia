import { createApp } from './app.js';

const PORT = Number(process.env.PORT || 4000);
const { server, db } = createApp();

server.listen(PORT, () => {
  console.log('==============================================================');
  console.log(` MoodleAI Creator corriendo en: http://localhost:${PORT}`);
  console.log(` Base de datos SQLite:          ${db.dbPath}`);
  console.log('==============================================================');
});
