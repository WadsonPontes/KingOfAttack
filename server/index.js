const app = require('./server');
const appWs = require('./server-ws');
 
const server = app.listen(process.env.PORT || 3000, () => {
    console.log(`Servidor online!`);
})
 
appWs(server);