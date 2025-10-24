// index.js
/*
 * Recebe áudio RTP em μ-law ou PCM16 do Asterisk/MicroSIP
 * e salva exatamente como recebido em arquivo RAW.
 */

const { RtpUdpServerSocket } = require('./lib/rtp-udp-server');

// -------------------- GOOGLE SPEECH --------------------
const { GoogleSpeechProvider } = require('./lib/google-speech-provider');


const fs = require('fs');
const path = require('path');

// Caminho onde o RAW será salvo
const audioDir = path.join(__dirname, 'audio');
if (!fs.existsSync(audioDir)) {
    fs.mkdirSync(audioDir, { recursive: true });
}
const rawFilePath = path.join(audioDir, 'audio.raw');

// Cria stream de escrita para RAW
const rawWriter = fs.createWriteStream(rawFilePath, { flags: 'a' });

// Inicia servidor RTP ouvindo a porta 6000
const server = new RtpUdpServerSocket('0.0.0.0:6000', false, null);

console.log('Servidor RTP iniciado em 0.0.0.0:6000, salvando em:', rawFilePath);

// Escuta os dados que chegam
//server.on('data', (chunk) => {
    //rawWriter.write(chunk); // salva exatamente como recebido
    //console.log(`Recebido chunk de ${chunk.length} bytes`);
// });

// Trata encerramento do servidor
process.on('SIGINT', () => {
    console.log('Finalizando servidor...');
    server.close();
    rawWriter.end();
    process.exit();
});



// Configuração do Google Speech
const speechConfig = {
    encoding: 'MULAW',        // ou 'MULAW' se o áudio vier em μ-law
    sampleRateHertz: 8000,       // ajuste conforme seu canal RTP
    languageCode: 'pt-BR'
};

//Callback para transcrição parcial/final
function transcriptCallback(transcript, isFinal) {
   console.log(isFinal ? 'FINAL:' : 'PARCIAL:', transcript);
}

// Callback para resultados completos
function resultsCallback(results) {
    console.log(results);
}

// Cria provedor de transcrição e conecta ao servidor UDP
const speechProvider = new GoogleSpeechProvider(
    speechConfig,
    server,                // conecta o UDP que já recebe RTP
    transcriptCallback,
    resultsCallback
);

console.log('Integração com Google Speech ativada. Transcrição em tempo real iniciada.');
