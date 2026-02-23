import json
import os
import re
import shutil

# Configuration
base_dir = r"c:\Users\user\Desktop\malik\exo\antigravity\lot1"
frontend_dir = r"c:\Users\user\Desktop\malik\exo\frontend"
scan_results_path = os.path.join(base_dir, "scan_results.json")
content_dir = os.path.join(frontend_dir, "content")
assets_dir = os.path.join(frontend_dir, "assets")

os.makedirs(content_dir, exist_ok=True)
os.makedirs(assets_dir, exist_ok=True)

def run_scribe():
    print("Scribe: Démarrage de la retranscription pour Unit 1...")
    with open(scan_results_path, 'r', encoding='utf-8') as f:
        data = json.load(f)
        
    pages = data.get("pages", [])
    
    # Extraction ciblée pour l'Accueil (pages 3 et 4)
    page3 = next((p for p in pages if p["filename"] == "page3.jpg"), None)
    page4 = next((p for p in pages if p["filename"] == "page4.jpg"), None)
    
    # Extraction ciblée pour l'Unité 1 : "Addition, equation & conclusion" (pages 9 et 10)
    page9 = next((p for p in pages if p["filename"] == "page9.jpg"), None)
    page10 = next((p for p in pages if p["filename"] == "page10.jpg"), None)
    
    if not page9 or not page10 or not page3 or not page4:
        print("Scribe: Erreur - Pages source introuvables.")
        return

    # ============== 1. GÉNÉRATION DE L'ACCUEIL (home.html) ==============
    sem_intro = page3.get("semantics", {})
    sem_method = page4.get("semantics", {})
    
    home_html = f"""
    <div class="home-layout fadeIn">
        <section class="home-intro">
            <ion-icon name="sparkles-outline" class="hero-icon"></ion-icon>
            <h1>Bienvenue dans le système Antigraphique</h1>
            <p>Votre outil interactif d'apprentissage immersif.</p>
        </section>
        
        <div class="home-grid">
            <div class="home-card">
                <h3><ion-icon name="information-circle-outline"></ion-icon> Introduction</h3>
                <p>{sem_intro.get('target_audience', 'Plongez dans un apprentissage modulaire conçu pour optimiser votre rétention.')}</p>
            </div>
            <div class="home-card">
                <h3><ion-icon name="bulb-outline"></ion-icon> Conseils de l'auteur</h3>
                <p>{sem_intro.get('advice', 'Travaillez par petites sessions, utilisez les indices et pratiquez la répétition espacée.')}</p>
            </div>
            <div class="home-card">
                <h3><ion-icon name="list-outline"></ion-icon> Règles d'utilisation</h3>
                <p>{sem_method.get('rules', 'Suivez les cours avec régularité et complétez les exercices chronologiquement.')}</p>
            </div>
            <div class="home-card">
                <h3><ion-icon name="laptop-outline"></ion-icon> Guide de transition numérique</h3>
                <p>{sem_method.get('digital_guide', 'Profitez du mode interactif avec correction instantanée.')}</p>
            </div>
        </div>
    </div>
    """
    with open(os.path.join(content_dir, "home.html"), "w", encoding="utf-8") as f:
        f.write(home_html)
    print(f"Scribe: Accueil (home.html) généré avec succès.")

    # ============== 2. GÉNÉRATION DE L'UNITÉ 1 (unit_1.html) ==============

    # Copie de l'image screenshot vers frontend/assets/
    for element in page9.get("complex_elements", []):
        if element["type"] == "table":
            src = os.path.join(base_dir, element["hd_screenshot_path"])
            dst = os.path.join(assets_dir, "page9_table.jpg")
            if os.path.exists(src):
                shutil.copy2(src, dst)
                print(f"Scribe: Asset HD copié -> {dst}")

    # Fonction pour remplacer "........." par <input> interactif
    def interactify(text):
        # Cherche au moins 5 points successifs
        return re.sub(r'\.{5,}', r'<input type="text" class="exercise-input" placeholder="...">', text)

    # Parsing et structuration de la Page 9
    p9_text = page9["ocr_text"]
    # Nettoyage brutal (pour simuler l'IA Scribe, on le fait avec split)
    parts = p9_text.split("\n")
    
    title = parts[0]
    instruction1 = parts[1]
    word_list = parts[2]
    
    # On isole l'instruction 2
    idx_instr2 = next((i for i, line in enumerate(parts) if line.startswith("2 Complete")), -1)
    instruction2 = parts[idx_instr2] if idx_instr2 > -1 else ""
    sentence1 = parts[-1] 
    
    html_content = f"""
    <div class="unit-container fadeIn">
        <header class="unit-header">
            <h2>{title}</h2>
        </header>

        <section class="exercise-section">
            <h3 class="instruction-title">{instruction1}</h3>
            <p style="color: var(--text-muted); font-size: 0.9rem; margin-bottom: 12px; font-style: italic;">Explication : Familiarisez-vous avec les mots proposés avant de les placer dans le tableau.</p>
            <div class="word-bank">
                {word_list}
            </div>
            
            <div class="complex-asset" style="position: relative; display: inline-block; margin-top: 20px;">
                <img src="../frontend/assets/page9_table.jpg" alt="Table of categorization" class="hd-screenshot" />
                <div class="overlay-inputs" style="position: absolute; top: 0; left: 0; width: 100%; height: 100%;">
                    <!-- Inputs invisibles superposés pour l'illusion numérique -->
                    <input type="text" class="exercise-input" style="position: absolute; top: 32%; left: 10%; width: 20%; background: var(--bg-secondary); border: 1px solid var(--accent-primary);" placeholder="Catégorie 1" />
                    <input type="text" class="exercise-input" style="position: absolute; top: 32%; left: 40%; width: 20%; background: var(--bg-secondary); border: 1px solid var(--accent-primary);" placeholder="Catégorie 2" />
                    <input type="text" class="exercise-input" style="position: absolute; top: 32%; left: 70%; width: 20%; background: var(--bg-secondary); border: 1px solid var(--accent-primary);" placeholder="Catégorie 3" />
                </div>
            </div>

            <div class="action-bar" style="gap: 12px;">
                <button class="btn-correction" onclick="alert('Superviseur : Correction activée')">Correction</button>
                <button class="btn-primary btn-check" onclick="alert('Superviseur : Validation en cours...')">Check</button>
            </div>
        </section>

        <section class="exercise-section">
            <h3 class="instruction-title">{instruction2}</h3>
            <p style="color: var(--text-muted); font-size: 0.9rem; margin-bottom: 12px; font-style: italic;">Explication : Analysez le contexte et le ton de chaque phrase pour trouver le bon mot de transition.</p>
            <span class="notice">{page10.get("semantics", dict()).get("notice_hint", "Remember to fill out all the gaps properly!")}</span>
            <ol class="fill-in-blanks">
                <li>{interactify(sentence1.replace("1. ", ""))}</li>
    """

    # Parsing et structuration de la Page 10
    p10_text = page10["ocr_text"]
    sentences = [line for line in p10_text.split("\n") if re.match(r'^\d+\.', line)]
    
    for s in sentences:
        # Enlever le nombre du début (ex: "2. ")
        clean_s = re.sub(r'^\d+\.\s*', '', s)
        html_content += f"                <li>{interactify(clean_s)}</li>\n"
        
    html_content += """
            </ol>
            
            <div class="action-bar" style="gap: 12px;">
                <button class="btn-correction" onclick="alert('Superviseur : Correction activée')">Correction</button>
                <button class="btn-primary btn-check" onclick="alert('Superviseur : Validation en cours...')">Check</button>
            </div>
        </section>
    </div>
    """

    # Écriture du fichier pour l'UI
    out_file = os.path.join(content_dir, "unit_1.html")
    with open(out_file, "w", encoding="utf-8") as f:
        f.write(html_content)

    print(f"Scribe: Unité 1 générée avec succès : {out_file}")

if __name__ == "__main__":
    run_scribe()
