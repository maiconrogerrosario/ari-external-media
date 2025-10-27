# 🎙️ Transcriber RTP + Google Speech

Este projeto implementa um **servidor de transcrição em tempo real** que recebe **fluxos RTP (μ-law ou PCM16)** — enviados por Asterisk, MicroSIP ou outro softphone — e os envia diretamente para o **Google Cloud Speech-to-Text**.
Além disso, o áudio recebido é salvo localmente em formato **RAW**, permitindo análise posterior.

> 🧠 Desenvolvido como parte de um projeto de pesquisa de mestrado na UEL, com foco em **transcrição de voz em tempo real via RTP e Inteligência Artificial**.

---

## 📦 Estrutura do Projeto

```
.
├── docker-compose.yml
├── Dockerfile
├── app/
│   ├── index.js
│   ├── lib/
│   │   ├── rtp-udp-server.js
│   │   └── google-speech-provider.js
│   ├── package.json
    └── package-lock.json

    │
├── google-speech/
│   └── credenciais.json
└── captured_audio/
```

---

## ⚙️ Pré-requisitos

Antes de executar o projeto, você precisa ter instalado:

* [Docker](https://www.docker.com/)
* [Docker Compose](https://docs.docker.com/compose/)
* Uma conta no **Google Cloud Platform** com o serviço **Speech-to-Text** habilitado
* Um arquivo de credenciais JSON do Google Cloud (`credenciais.json`)

---

## 🔐 Configuração das Credenciais do Google

1. Acesse o [Google Cloud Console](https://console.cloud.google.com/).
2. Crie ou selecione um projeto.
3. Ative a API **Speech-to-Text**.
4. Gere uma **chave de serviço (Service Account Key)** no formato JSON.
5. Salve o arquivo em:

```
google-speech/credenciais.json
```

> ⚠️ **Atenção:** não compartilhe este arquivo. Ele contém credenciais sensíveis de autenticação na Google Cloud.

---

## 🌐 Variáveis de Ambiente

Estas variáveis podem ser definidas no seu ambiente ou dentro do `docker-compose.yml`:

| Variável                         | Descrição                                          | Valor padrão                                  |
| -------------------------------- | -------------------------------------------------- | --------------------------------------------- |
| `GOOGLE_APPLICATION_CREDENTIALS` | Caminho do arquivo de credenciais JSON             | `/usr/src/app/google-speech/credenciais.json` |
| `RTP_PORT`                       | Porta UDP que o servidor escutará para pacotes RTP | `6000`                                        |

---

## 🧱 Construindo o Contêiner

No diretório raiz do projeto, execute:

```bash
docker-compose build
```

---

## 🚀 Executando o Servidor

Inicie o container:

```bash
docker-compose up -d
```

O serviço será iniciado em **modo daemon**, e o servidor RTP ficará escutando na porta definida (padrão: `6000`).

---

## 🗂️ Diretórios Importantes

| Diretório          | Função                                                     |
| ------------------ | ---------------------------------------------------------- |
| `./app`            | Código principal da aplicação Node.js                      |
| `./captured_audio` | Onde os arquivos RAW são salvos                            |
| `./google-speech`  | Contém o arquivo `credenciais.json`                        |
| `./app/lib`        | Implementações auxiliares (RTP e integração Google Speech) |

---

## 🔊 Enviando Áudio RTP

Envie um fluxo RTP (μ-law ou PCM16) para:

```
IP_DO_HOST:6000
```

No asterisk você precia ter configurados momudlo extension.conf e ari.conf 

Exemplo de configuração no **Asterisk** (`extensions.conf`):

```
exten => 9000,1,NoOp(Canal ExternalMedia – Recebendo do 1000)
 same => n,Answer()
 same => n,Stasis(externalMedia)
 same => n,Hangup()

; Ramal 1000 - faz a ligação para o 9000 normalmente
exten => 1000,1,NoOp(Ramal 1000 ligando para 9000)
 same => n,Dial(PJSIP/9000)
 same => n,Hangup()
```

[general]
enabled = yes
pretty = yes

[asterisk]
type = user
read_only = no
password = asterisk



## 🧠 Saída Esperada

Durante a execução, o container exibirá logs de transcrição em tempo real, por exemplo:

```
PARCIAL: Olá, tudo bem
FINAL: Olá, tudo bem com você?
```

O áudio recebido será salvo em:

```
captured_audio/audio.raw
```

Saída JSON (exemplo para integrações futuras):

```json
{
  "timestamp": "2025-10-27T12:00:01Z",
  "transcript": "Olá, tudo bem com você?",
  "isFinal": true
}
```

---

## 🧹 Parando o Serviço

```bash
docker-compose down
```

---

## 🛠️ Debug e Execução Interativa

Para entrar no container e depurar:

```bash
docker exec -it transcriber bash
```

Dentro do container, você pode executar manualmente:

```bash
node index.js
```

---

## 🔄 Fluxo de Funcionamento

```
Asterisk → RTP (UDP) → Servidor Node.js → Google Speech API → Transcrição em tempo real
```

---

## 🧾 Licença

Este projeto é distribuído sob a licença **MIT**.

---

## ✨ Autor

**Maicon Roger**
Mestrado em Computação – Universidade Estadual de Londrina (UEL)
Projeto: *Transcrição de Voz em Tempo Real via RTP + IA*
