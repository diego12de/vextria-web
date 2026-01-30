// Vextria Admin Dashboard Logic

// State Management
let appState = {
    projects: [],
    notes: "",
    calculator: {
        revenue: "",
        expenses: "",
        taxRate: 20
    },
    projections: {
        leads: "",
        conversion: "",
        avgValue: "",
        expenses: "",
        taxRate: 20
    }
};

// Initialization
document.addEventListener('DOMContentLoaded', () => {
    loadState();
    renderProjects();
    updateDashboardStats();
    restoreInputs();

    // Notes auto-save binding
    const quickPad = document.getElementById('quick-note-pad');
    const mainPad = document.getElementById('main-notes-area');

    [quickPad, mainPad].forEach(pad => {
        pad.addEventListener('input', (e) => {
            appState.notes = e.target.value;
            // Sync both pads
            if (e.target === quickPad) mainPad.value = e.target.value;
            else quickPad.value = e.target.value;
            saveState();
        });
    });
});

// --- Navigation ---
function showSection(sectionId) {
    // Hide all sections
    ['dashboard', 'calculator', 'projects', 'projections', 'notes'].forEach(id => {
        document.getElementById(`section-${id}`).classList.add('hidden');
        const navEl = document.getElementById(`nav-${id}`);
        if (navEl) {
            navEl.classList.remove('bg-vextria-800', 'text-white', 'shadow-lg', 'shadow-indigo-500/10', 'border', 'border-gray-700');
            navEl.classList.add('text-gray-400');
            // Remove icon color highlight
            const icon = navEl.querySelector('i');
            if (icon) icon.className = icon.className.replace(/text-[a-z]+-400/, '');
        }
    });

    // Show active section
    document.getElementById(`section-${sectionId}`).classList.remove('hidden');

    // Highlight nav
    const activeNav = document.getElementById(`nav-${sectionId}`);
    if (activeNav) {
        activeNav.classList.remove('text-gray-400');
        activeNav.classList.add('bg-vextria-800', 'text-white', 'shadow-lg', 'shadow-indigo-500/10', 'border', 'border-gray-700');

        // Add specific color to icon based on section
        const icon = activeNav.querySelector('i');
        let colorClass = '';
        switch (sectionId) {
            case 'dashboard': colorClass = 'text-indigo-400'; break;
            case 'calculator': colorClass = 'text-emerald-400'; break;
            case 'projects': colorClass = 'text-purple-400'; break;
            case 'projections': colorClass = 'text-cyan-400'; break;
            case 'notes': colorClass = 'text-yellow-400'; break;
        }
        if (icon) icon.classList.add(colorClass);
    }
}

// --- Calculator Logic ---
function calculateProfit() {
    const revenue = parseFloat(document.getElementById('calc-revenue').value) || 0;
    const expenses = parseFloat(document.getElementById('calc-expenses').value) || 0;
    const taxRate = parseFloat(document.getElementById('calc-tax-rate').value) || 0;

    const gross = revenue - expenses;
    const taxAmount = gross > 0 ? (gross * (taxRate / 100)) : 0;
    const net = gross - taxAmount;

    // Update UI
    document.getElementById('display-gross').textContent = formatCurrency(gross);
    document.getElementById('display-gross').className = `text-xl font-semibold ${gross >= 0 ? 'text-white' : 'text-red-400'}`;

    document.getElementById('display-tax').textContent = formatCurrency(taxAmount);

    document.getElementById('display-net').textContent = formatCurrency(net);
    document.getElementById('display-net').className = `text-3xl font-bold ${net >= 0 ? 'text-emerald-400' : 'text-red-500'}`;

    // Save to state
    appState.calculator = { revenue, expenses, taxRate };
    saveState();
    updateDashboardStats(); // Update dashboard overview if needed
}

function resetCalculator() {
    document.getElementById('calc-revenue').value = '';
    document.getElementById('calc-expenses').value = '';
    calculateProfit();
}

// --- Project Management ---
function openAddProjectModal() {
    document.getElementById('project-modal').classList.remove('hidden');
    document.getElementById('project-modal').classList.add('flex');
}

function closeAddProjectModal() {
    document.getElementById('project-modal').classList.add('hidden');
    document.getElementById('project-modal').classList.remove('flex');
}

function addProject(e) {
    e.preventDefault();
    const form = e.target;
    const newProject = {
        id: Date.now(),
        name: form.name.value,
        client: form.client.value,
        value: parseFloat(form.value.value) || 0,
        status: form.status.value,
        date: new Date().toLocaleDateString()
    };

    appState.projects.push(newProject);
    saveState();
    renderProjects();
    updateDashboardStats();
    closeAddProjectModal();
    form.reset();
}

function deleteProject(id) {
    if (confirm('¿Seguro que quieres eliminar este proyecto?')) {
        appState.projects = appState.projects.filter(p => p.id !== id);
        saveState();
        renderProjects();
        updateDashboardStats();
    }
}

function renderProjects() {
    const tbody = document.getElementById('projects-table-body');
    const miniList = document.getElementById('mini-project-list');
    const noMsg = document.getElementById('no-projects-msg');

    tbody.innerHTML = '';
    miniList.innerHTML = '';

    if (appState.projects.length === 0) {
        noMsg.classList.remove('hidden');
        miniList.innerHTML = '<div class="text-center text-gray-500 py-4 text-sm">No hay proyectos activos</div>';
        return;
    }

    noMsg.classList.add('hidden');

    // Sort by newest first
    const sortedProjects = [...appState.projects].sort((a, b) => b.id - a.id);

    sortedProjects.forEach(p => {
        // Main Table Row
        const tr = document.createElement('tr');
        tr.className = 'border-b border-gray-700/50 hover:bg-white/5 transition';
        tr.innerHTML = `
            <td class="py-3 px-4 text-white font-medium">${p.name}</td>
            <td class="py-3 px-4 text-gray-400">${p.client}</td>
            <td class="py-3 px-4 text-gray-300">$${p.value.toLocaleString()}</td>
            <td class="py-3 px-4">
                <span class="px-2 py-1 rounded text-xs font-bold ${getStatusColor(p.status)}">
                    ${getStatusLabel(p.status)}
                </span>
            </td>
            <td class="py-3 px-4 text-right">
                <button onclick="deleteProject(${p.id})" class="text-gray-500 hover:text-red-400 transition ml-2">
                    <i class="fa-solid fa-trash"></i>
                </button>
            </td>
        `;
        tbody.appendChild(tr);

        // Mini List Item (Limit to 3)
        if (miniList.children.length < 3) {
            const item = document.createElement('div');
            item.className = 'flex items-center justify-between p-3 rounded-lg bg-vextria-900/50 border border-gray-800';
            item.innerHTML = `
                <div>
                    <div class="font-medium text-sm text-white">${p.name}</div>
                    <div class="text-xs text-gray-500">${p.client}</div>
                </div>
                <span class="w-2 h-2 rounded-full ${getStatusDotColor(p.status)}"></span>
            `;
            miniList.appendChild(item);
        }
    });
}

function getStatusColor(status) {
    if (status === 'active') return 'bg-purple-500/10 text-purple-400 border border-purple-500/20';
    if (status === 'completed') return 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20';
    return 'bg-gray-500/10 text-gray-400 border border-gray-500/20';
}
function getStatusLabel(status) {
    if (status === 'active') return 'En Desarrollo';
    if (status === 'completed') return 'Completado';
    return 'Pendiente';
}
function getStatusDotColor(status) {
    if (status === 'active') return 'bg-purple-500';
    if (status === 'completed') return 'bg-emerald-500';
    return 'bg-gray-500';
}

// --- Dashboard Stats ---
function updateDashboardStats() {
    // Calculate total estimated revenue from projects
    const projectRev = appState.projects.reduce((acc, curr) => acc + (curr.value || 0), 0);
    // Combine with Calculator revenue? No, let's keep them separate or just show project rev.
    // Let's us the Calculator "Revenue" as the "Ingresos Totales (Mes)" for simplicity as it allows manual entry
    // OR sum them up. Let's just use the Calculator's Revenue as the "Source of Truth" for monthly revenue 
    // since projects might technically be "potential" or spread out.
    // Re-reading requirements: "Calculate Earnings".

    // Let's bind "Ingresos Totales" to the Calculator Revenue Input.
    const revenue = parseFloat(appState.calculator.revenue) || 0;
    const expenses = parseFloat(appState.calculator.expenses) || 0;
    const gross = revenue - expenses;
    const taxRate = parseFloat(appState.calculator.taxRate) || 0;
    const net = gross - (gross > 0 ? gross * (taxRate / 100) : 0);

    const activeCount = appState.projects.filter(p => p.status === 'active').length;

    document.getElementById('stat-total-revenue').textContent = formatCurrency(revenue);
    document.getElementById('stat-active-projects').textContent = activeCount;
    document.getElementById('stat-net-profit').textContent = formatCurrency(net);
}

// --- Helpers ---
function formatCurrency(num) {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(num);
}

function saveState() {
    localStorage.setItem('vextria_dashboard_v1', JSON.stringify(appState));
}

function loadState() {
    const saved = localStorage.getItem('vextria_dashboard_v1');
    if (saved) {
        try {
            appState = JSON.parse(saved);
        } catch (e) { console.error("Corrupt state"); }
    }
}

function restoreInputs() {
    document.getElementById('quick-note-pad').value = appState.notes || "";
    document.getElementById('main-notes-area').value = appState.notes || "";

    if (appState.calculator) {
        document.getElementById('calc-revenue').value = appState.calculator.revenue || "";
        document.getElementById('calc-expenses').value = appState.calculator.expenses || "";
        document.getElementById('calc-tax-rate').value = appState.calculator.taxRate || 20;
        calculateProfit(); // Re-run calc to update display
    }

    if (appState.projections) {
        document.getElementById('proj-leads').value = appState.projections.leads || "";
        document.getElementById('proj-conversion').value = appState.projections.conversion || "";
        document.getElementById('proj-avg-value').value = appState.projections.avgValue || "";
        document.getElementById('proj-expenses').value = appState.projections.expenses || "";
        document.getElementById('proj-tax').value = appState.projections.taxRate || 20;
        calculateProjections(); // Re-run projections
    }
}

// --- Projections Logic ---
function calculateProjections() {
    const leads = parseFloat(document.getElementById('proj-leads').value) || 0;
    const conversionRate = parseFloat(document.getElementById('proj-conversion').value) || 0;
    const avgValue = parseFloat(document.getElementById('proj-avg-value').value) || 0;
    const expenses = parseFloat(document.getElementById('proj-expenses').value) || 0;
    const taxRate = parseFloat(document.getElementById('proj-tax').value) || 0;

    // Calculations
    const clientsPerMonth = leads * (conversionRate / 100);
    const monthlyRevenue = clientsPerMonth * avgValue;
    const quarterlyRevenue = monthlyRevenue * 3;
    const annualRevenue = monthlyRevenue * 12;

    const monthlyGross = monthlyRevenue - expenses;
    const monthlyTax = monthlyGross > 0 ? monthlyGross * (taxRate / 100) : 0;
    const monthlyNetProfit = monthlyGross - monthlyTax;

    // Update UI - Numbers
    document.getElementById('proj-clients').textContent = Math.round(clientsPerMonth);
    document.getElementById('proj-monthly').textContent = formatCurrency(monthlyRevenue);
    document.getElementById('proj-quarterly').textContent = formatCurrency(quarterlyRevenue);
    document.getElementById('proj-annual').textContent = formatCurrency(annualRevenue);
    document.getElementById('proj-net-profit').textContent = formatCurrency(monthlyNetProfit);

    // Update Visual Bars
    const maxValue = Math.max(monthlyRevenue, expenses, monthlyNetProfit);

    document.getElementById('bar-revenue-label').textContent = formatCurrency(monthlyRevenue);
    document.getElementById('bar-revenue').style.width = maxValue > 0 ? `${(monthlyRevenue / maxValue) * 100}%` : '0%';

    document.getElementById('bar-expenses-label').textContent = formatCurrency(expenses);
    document.getElementById('bar-expenses').style.width = maxValue > 0 ? `${(expenses / maxValue) * 100}%` : '0%';

    document.getElementById('bar-profit-label').textContent = formatCurrency(monthlyNetProfit);
    document.getElementById('bar-profit').style.width = maxValue > 0 ? `${(Math.max(0, monthlyNetProfit) / maxValue) * 100}%` : '0%';

    // Save to state
    appState.projections = { leads, conversion: conversionRate, avgValue, expenses, taxRate };
    saveState();
}

function resetProjections() {
    document.getElementById('proj-leads').value = '';
    document.getElementById('proj-conversion').value = '';
    document.getElementById('proj-avg-value').value = '';
    document.getElementById('proj-expenses').value = '';
    document.getElementById('proj-tax').value = '20';
    calculateProjections();
}
