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
    const sidebarNav = document.getElementById('sidebar-nav');
    const brightnessSlider = document.getElementById('brightness-slider');
    const breadcrumbs = document.getElementById('breadcrumbs');

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
            const res = await fetch('../antigravity/lot1/navigation_map.json');
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

                        // --- Scribe Integration --- 
                        // Load HTML Content for this specific Unit
                        loadUnitContent(found.id_unit);
                    }
                    break;
                }
            }
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

    // Init the app logic
    initNavigation();

    // Listen for manual hash changes
    window.addEventListener('hashchange', () => {
        document.querySelectorAll('.nav-item').forEach(el => el.classList.remove('active'));
        highlightCurrentRoute();
    });
});
