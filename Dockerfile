# Estágio 1: Auditoria e Build
FROM node:20-slim AS builder

# Instalando Python para o script de auditoria
RUN apt-get update && apt-get install -y python3 && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Copia arquivos de configuração
COPY package*.json ./
RUN npm install

# Copia o restante do código e o script de auditoria
COPY audity_sec.py /app/audit_sec.py
COPY . .

# Comando para listar arquivos e nos mostrar o que o Docker "vê"
RUN ls -la /app

# EXECUÇÃO DA SEGURANÇA: O build falha se o script detectar riscos
RUN python3 audity_sec.py

# Gera a pasta 'dist' com o código otimizado pelo Vite
RUN npx vite build src --outDir dist
# Estágio 2: Produção (Servidor Web)
FROM nginx:alpine
# Copia apenas o resultado do build para o servidor Nginx
COPY --from=builder /app/src/dist /usr/share/nginx/html

# Exposição da porta padrão HTTP
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]