import os
import re

# Configuration
frontend_dir = r"c:\Users\user\Desktop\malik\exo\frontend"
content_dir = os.path.join(frontend_dir, "content")
assets_dir = os.path.join(frontend_dir, "assets")
unit_html_path = os.path.join(content_dir, "unit_1.html")

def run_superviseur():
    print("Superviseur: Début de l'audit pour Unit 1...")
    
    # 1. Verification de l'existence du fichier
    if not os.path.exists(unit_html_path):
        print("Superviseur (Erreur): Le fichier unitaire unit_1.html n'a pas été généré.")
        return
        
    with open(unit_html_path, 'r', encoding='utf-8') as f:
        html_content = f.read()

    errors = 0
    warnings = 0
    
    # 2. Vérification des assets img
    print("Superviseur: Audit des chemins d'images (Assets HD)...")
    img_tags = re.findall(r'<img\s+[^>]*src="([^"]+)"', html_content)
    
    modified_html = html_content
    
    for src in img_tags:
        # Resolve the relative path as written by scribe: "../frontend/assets/(name)"
        # Actually Scribe wrote: "../frontend/assets/page9_table.jpg"
        # Since the webpage runs in /frontend/index.html, it should just be "assets/xxx" or relative from root.
        # Wait, index.html is in `frontend/`, so an img in `frontend/content/` fetched from index won't need `../frontend/`
        # as it will be resolved by the browser relative to index.html (fetch loads it inline!).
        
        # If it's inline in index.html, `<img src="../frontend/assets/...` will try to load `localhost:8000/frontend/../frontend/assets/...` which is technically `/frontend/assets/...`. Which works.
        # Let's optimize it for direct "assets/page9_table.jpg" relative to index.html to be perfectly clean.
        
        if "../frontend/" in src:
            clean_src = src.replace("../frontend/", "")
            modified_html = modified_html.replace(src, clean_src)
            print(f"Superviseur (Correction): Chemin d'image corrigé '{src}' -> '{clean_src}' (Meilleure pratique de routage).")
            src = clean_src
        
        # Check if local file exists
        file_name = os.path.basename(src)
        local_path = os.path.join(assets_dir, file_name)
        if not os.path.exists(local_path):
            print(f"Superviseur (Erreur critique): Image introuvable '{local_path}'. Le composant UI sera cassé.")
            errors += 1
        else:
            print(f"Superviseur (Succès): Image trouvée '{file_name}'.")

    # 3. Vérification des champs interactifs (Gamification)
    print("Superviseur: Analyse des inputs d'exercices...")
    input_tags = re.findall(r'<input\s+type="text"', modified_html)
    if len(input_tags) < 10:
        print(f"Superviseur (Alerte): Constaté un sous-effectif de {len(input_tags)} champs. Est-ce normal pour cette unité?")
        warnings += 1
    else:
        print(f"Superviseur (Succès): QA passée. {len(input_tags)} champs de saisie identifiés sur la page d'exercice.")

    # Apply changes (auto-correction paths)
    if html_content != modified_html:
        with open(unit_html_path, 'w', encoding='utf-8') as f:
            f.write(modified_html)
        print("Superviseur: Auto-correction appliquée et sauvegardée pour une expérience optimale.")
        
    print(f"Superviseur: Audit terminé avec {errors} Erreur(s) et {warnings} Avertissement(s).")
    
    if errors == 0:
        print(">>> RESULTAT: Lot 1 100% Validé et publié. Le système est prêt à traiter le prochain Batch.")
    else:
        print(">>> RESULTAT: Echec de publication. Le Scribe doit repasser.")

if __name__ == "__main__":
    run_superviseur()
