import os
import json

def audit_project():
    print("--- Iniciando Auditoria de Segurança ---")
    
    # 1. Verifica arquivos proibidos que podem vazar info do Mac
    forbidden_files = ['.env', '.DS_Store', 'credentials.txt']
    for root, dirs, files in os.walk('.'):
        for file in files:
            if file in forbidden_files:
                print(f"[ALERTA] Arquivo sensível encontrado: {os.path.join(root, file)}")

    # 2. Auditoria de dependências (simulada)
    if os.path.exists('package.json'):
        with open('package.json', 'r') as f:
            data = json.load(f)
            deps = data.get('dependencies', {})
            # Exemplo: Versões muito antigas de bibliotecas
            for dep, version in deps.items():
                if "^1.0.0" in version:
                    print(f"[RISCO] A biblioteca {dep} está em uma versão possivelmente vulnerável.")

    # 3. Busca por padrões de 'hardcoded secrets' (ex: 'apiKey =')
    for root, dirs, files in os.walk('./src'):
        for file in files:
            if file.endswith(('.js', '.html', '.scss')):
                path = os.path.join(root, file)
                with open(path, 'r', errors='ignore') as f:
                    if 'api_key' in f.read().lower():
                        print(f"[CRÍTICO] Possível chave de API encontrada em: {path}")

audit_project()