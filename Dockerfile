# Usa imagem oficial do Node.js 20
FROM node:20

# Define o diretório de trabalho
WORKDIR /usr/src/app

# Copia apenas os arquivos de dependências primeiro (melhor para cache)
COPY app/package*.json ./

# Instala dependências
RUN npm install

# Copia o restante do código da aplicação
COPY app/ ./

# Copia credenciais do Google Speech
COPY google-speech/ /usr/src/google-speech/

# Define variável de ambiente para as credenciais do Google
ENV GOOGLE_APPLICATION_CREDENTIALS=/usr/src/google-speech/credenciais.json

# Expõe portas usadas pelo transcritor/Asterisk (ajuste se necessário)
EXPOSE 9099
EXPOSE 9999
EXPOSE 6000


# Mantém o container aberto para debug/exec
CMD ["tail", "-f", "/dev/null"]
