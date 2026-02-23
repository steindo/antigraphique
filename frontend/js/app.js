/**
 * app.js - Agent Design (Architecte)
 * Handles Dynamic UI rendering, Settings, and Routing.
 */

document.addEventListener("DOMContentLoaded", () => {

    // --- State & Settings Management --- //
    const State = {
        theme: localStorage.getItem('ag_theme') || 'light',
        font: localStorage.getItem('ag_font') || 'inter',
        brightness: localStorage.getItem('ag_brightness') || 100,
        currentRoute: window.location.hash || '#/',
        navMap: null,
        stats: {
            progress: 0,
            score: 0
        }
    };

    // DOM Elements
    const rootLayout = document.documentElement;
    const body = document.body;
    const sidebar = document.getElementById('sidebar');
    const sidebarToggle = document.getElementById('sidebar-toggle');
    const sidebarNav = document.getElementById('sidebar-nav');
    const brightnessSlider = document.getElementById('brightness-slider');
    const breadcrumbs = document.getElementById('breadcrumbs');
    const btnPrev = document.getElementById('btn-prev');
    const btnNext = document.getElementById('btn-next');
    const currentPageSpan = document.getElementById('current-page');
    const totalPagesSpan = document.getElementById('total-pages');
    const renderArea = document.getElementById('content-render-area');

    // Sidebar Toggle
    if (sidebarToggle) {
        sidebarToggle.addEventListener('click', () => {
            sidebar.classList.toggle('expanded');
        });
    }

    /**
     * Settings Initialization
     */
    function applySettings() {
        rootLayout.setAttribute('data-theme', State.theme);
        rootLayout.setAttribute('data-font', State.font);

        // Brightness logic using CSS filter on body
        const filterVal = State.brightness == 100 ? 'none' : `brightness(${State.brightness}%)`;
        body.style.filter = filterVal;
        brightnessSlider.value = State.brightness;
    }

    applySettings(); // Run immediately

    // Theme Buttons Setup
    document.querySelectorAll('[data-action="theme"]').forEach(btn => {
        btn.addEventListener('click', (e) => {
            State.theme = e.target.getAttribute('data-value');
            localStorage.setItem('ag_theme', State.theme);
            applySettings();
        });
    });

    // Font Buttons Setup
    document.querySelectorAll('[data-action="font"]').forEach(btn => {
        btn.addEventListener('click', (e) => {
            State.font = e.target.getAttribute('data-value');
            localStorage.setItem('ag_font', State.font);
            applySettings();
        });
    });

    // Brightness Slider Setup
    brightnessSlider.addEventListener('input', (e) => {
        State.brightness = e.target.value;
        localStorage.setItem('ag_brightness', State.brightness);
        applySettings();
    });


    /**
     * Sidebar Data Fetching & Rendering
     */
    async function initNavigation() {
        try {
            // Using a fetch request to get local JSON created by Cartographe
            // Running python -m http.server to avoid CORS issues locally
            const res = await fetch('data/navigation_map.json');
            if (!res.ok) throw new Error("Navigation Map non trouvée");

            State.navMap = await res.json();
            renderSidebar();

        } catch (err) {
            console.error(err);
            // Fallback render just to show UI if dev server is missing
            sidebarNav.innerHTML = `<div style="padding: 20px; color: var(--accent-primary)">
                La carte de navigation est introuvable. Avez-vous exécuté l'Agent Cartographe ?
            </div>`;
        }
    }

    function renderSidebar() {
        if (!State.navMap) return;

        sidebarNav.innerHTML = ''; // clear

        State.navMap.categories.forEach(category => {
            // Create Category Header
            const catElem = document.createElement('div');
            catElem.className = 'nav-category';

            const catTitle = document.createElement('h4');
            catTitle.className = 'category-title';
            catTitle.textContent = category.title;

            catElem.appendChild(catTitle);

            // Create Units for Category
            category.units.forEach(unit => {
                const link = document.createElement('a');
                link.href = `#${unit.route}`;
                link.className = 'nav-item';
                link.id = `nav_${unit.id_unit}`;

                link.innerHTML = `
                    <ion-icon name="document-text-outline"></ion-icon>
                    <span>${unit.title}</span>
                `;

                link.addEventListener('click', () => {
                    document.querySelectorAll('.nav-item').forEach(el => el.classList.remove('active'));
                    link.classList.add('active');
                    updateBreadcrumbs(category.title, unit.title);
                });

                catElem.appendChild(link);
            });

            sidebarNav.appendChild(catElem);
        });

        // Setup initial active route if hash exists
        highlightCurrentRoute();
    }

    function updateBreadcrumbs(catName, unitName) {
        breadcrumbs.innerHTML = `
            <span>Accueil</span> 
            <ion-icon name="chevron-forward-outline"></ion-icon> 
            <span>${catName}</span>
            <ion-icon name="chevron-forward-outline"></ion-icon>
            <strong style="color: var(--accent-primary)">${unitName}</strong>
        `;
    }

    // Nav Footer management
    function getFlatUnits() {
        if (!State.navMap) return [];
        return State.navMap.categories.reduce((acc, cat) => acc.concat(cat.units), []);
    }

    function updateFooterNavigation(currentRouteStr) {
        const flatUnits = getFlatUnits();
        if (flatUnits.length === 0) return;

        totalPagesSpan.textContent = flatUnits.length;

        let currentIndex = flatUnits.findIndex(u => u.route === currentRouteStr);
        if (currentIndex === -1) {
            // Probably at Home
            currentPageSpan.textContent = "-";
            btnPrev.style.opacity = '0.5';
            btnPrev.style.pointerEvents = 'none';
            btnNext.style.opacity = '1';
            btnNext.style.pointerEvents = 'auto';

            // Set next to unit 1
            btnNext.onclick = () => window.location.hash = flatUnits[0].route;
            return;
        }

        currentPageSpan.textContent = currentIndex + 1;

        // Prev buttons
        if (currentIndex > 0) {
            btnPrev.style.opacity = '1';
            btnPrev.style.pointerEvents = 'auto';
            btnPrev.onclick = () => window.location.hash = flatUnits[currentIndex - 1].route;
        } else {
            // First unit -> go to home
            btnPrev.style.opacity = '1';
            btnPrev.style.pointerEvents = 'auto';
            btnPrev.onclick = () => window.location.hash = "";
        }

        // Next buttons
        if (currentIndex < flatUnits.length - 1) {
            btnNext.style.opacity = '1';
            btnNext.style.pointerEvents = 'auto';
            btnNext.onclick = () => window.location.hash = flatUnits[currentIndex + 1].route;
        } else {
            // Last unit
            btnNext.style.opacity = '0.5';
            btnNext.style.pointerEvents = 'none';
        }
    }

    async function highlightCurrentRoute() {
        if (window.location.hash) {
            const currentRouteStr = window.location.hash.replace('#', '');
            if (!State.navMap) return;

            // Find active link
            for (let cat of State.navMap.categories) {
                let found = cat.units.find(u => u.route === currentRouteStr);
                if (found) {
                    const el = document.getElementById(`nav_${found.id_unit}`);
                    if (el) {
                        el.classList.add('active');
                        // Expand parent if needed, update breadcrumbs
                        updateBreadcrumbs(cat.title, found.title);
                        // Auto scroll to active
                        el.scrollIntoView({ behavior: "smooth", block: "center" });

                        // --- Nav Footer Update ---
                        updateFooterNavigation(currentRouteStr);

                        // --- Scribe Integration --- 
                        // Load HTML Content for this specific Unit
                        loadUnitContent(found.id_unit);
                    }
                    break;
                }
            }
        } else {
            // Route vide (Accueil)
            updateFooterNavigation('');
            document.querySelectorAll('.nav-item').forEach(el => el.classList.remove('active'));
            breadcrumbs.innerHTML = `<span>Accueil</span> <ion-icon name="chevron-forward-outline"></ion-icon> <span>Sélectionnez une unité</span>`;

            // --- Scribe Integration for Home --- 
            loadUnitContent('home');
        }
    }

    async function loadUnitContent(unitId) {
        const renderArea = document.getElementById('content-render-area');

        // Simulating the Scribe / AI extraction delay
        renderArea.innerHTML = `
            <div class="loader-container">
                <ion-icon name="sync-outline" class="spin"></ion-icon>
                <p>Transfert Scribe en cours...</p>
            </div>
        `;

        try {
            // For lot1, unit_1 corresponds to unit_1.html.
            const response = await fetch(`content/${unitId}.html`);
            if (!response.ok) throw new Error("Unité non transcrite");

            const html = await response.text();

            // Add a slight delay for smooth transition feel
            setTimeout(() => {
                renderArea.innerHTML = html;
            }, 500);

        } catch (error) {
            console.warn(error);
            renderArea.innerHTML = `
                <div class="welcome-banner">
                    <ion-icon name="construct-outline"></ion-icon>
                    <h1>Unité en cours de numérisation</h1>
                    <p>L'Agent Scribe n'a pas encore traité cette partie du livre.</p>
                </div>
            `;
        }
    }

    // Input Protection (Gamification anti-cheat / anti-duplicate)
    renderArea.addEventListener('input', (e) => {
        if (e.target.classList.contains('exercise-input')) {
            const val = e.target.value.trim().toLowerCase();
            if (!val) return;

            // Limit search scope to the current exercise section
            const container = e.target.closest('.exercise-section');
            if (!container) return;

            const inputs = container.querySelectorAll('.exercise-input');
            inputs.forEach(input => {
                if (input !== e.target && input.value.trim().toLowerCase() === val) {
                    input.value = ''; // Prevent duplication
                    // Visual Feedback for user
                    input.style.borderBottomColor = 'red';
                    input.style.backgroundColor = 'rgba(255,0,0,0.1)';
                    setTimeout(() => {
                        input.style.borderBottomColor = '';
                        input.style.backgroundColor = '';
                    }, 1000);
                }
            });
        }
    });

    // Handle Check & Correction Buttons
    renderArea.addEventListener('click', (e) => {
        const target = e.target;

        if (target.classList.contains('btn-check')) {
            const section = target.closest('.exercise-section');
            if (section) {
                const inputs = section.querySelectorAll('.exercise-input');
                let allCorrect = true;
                inputs.forEach(input => {
                    // Logic Simulation: currently marks green if not empty
                    if (input.value.trim() !== '') {
                        input.style.borderBottomColor = 'var(--accent-primary)';
                        input.style.backgroundColor = 'rgba(79, 70, 229, 0.1)';
                        input.style.color = 'var(--accent-primary)';
                        input.style.fontWeight = 'bold';
                    } else {
                        input.style.borderBottomColor = 'red';
                        allCorrect = false;
                    }
                });
                if (allCorrect && inputs.length > 0) {
                    target.textContent = "✓ Validé";
                    target.style.background = "#10B981"; // Green success
                }
            }
        }

        if (target.classList.contains('btn-correction')) {
            const section = target.closest('.exercise-section');
            if (section) {
                const inputs = section.querySelectorAll('.exercise-input');
                inputs.forEach(input => {
                    if (input.value.trim() === '') {
                        // Reveal fake solution for demo
                        input.value = "Solution";
                        input.style.color = "var(--text-muted)";
                        input.style.borderBottomColor = "var(--text-muted)";
                        input.style.fontStyle = "italic";
                    }
                });
            }
        }
    });

    // Init the app logic
    initNavigation();

    // Listen for manual hash changes
    window.addEventListener('hashchange', () => {
        document.querySelectorAll('.nav-item').forEach(el => el.classList.remove('active'));
        highlightCurrentRoute();
    });
});
