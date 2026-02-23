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
    
    # Extraction ciblée pour l'Unité 1 : "Addition, equation & conclusion" (pages 9 et 10)
    page9 = next((p for p in pages if p["filename"] == "page9.jpg"), None)
    page10 = next((p for p in pages if p["filename"] == "page10.jpg"), None)
    
    if not page9 or not page10:
        print("Scribe: Erreur - Pages 9 ou 10 introuvables.")
        return

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
            <div class="word-bank">
                {word_list}
            </div>
            
            <div class="complex-asset">
                <img src="../frontend/assets/page9_table.jpg" alt="Table of categorization" class="hd-screenshot" />
            </div>
        </section>

        <section class="exercise-section">
            <h3 class="instruction-title">{instruction2}</h3>
            <span class="notice">Remember to fill out all the gaps properly!</span>
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
