let modalTargetId = '';
const appVersion = '1.2';
let currentSkillRangeEditorId = null;

function loadDefaultOperator() {
    populateForm(defaultOperatorData);
}

function openTab(evt, tabName) {
    let i, tabcontent, tablinks;
    tabcontent = document.getElementsByClassName("tab-content");
    for (i = 0; i < tabcontent.length; i++) { tabcontent[i].style.display = "none"; }
    tablinks = document.getElementsByClassName("tab-btn");
    for (i = 0; i < tablinks.length; i++) { tablinks[i].className = tablinks[i].className.replace(" active", ""); }
    document.getElementById(tabName).style.display = "block";
    evt.currentTarget.className += " active";
}

function showChangelogModal() {
    const modalBody = document.querySelector('#changelog-modal .modal-body');
    modalBody.innerHTML = ''; // Clear previous content to avoid duplication.

    // Iterate through the changelogData array (from changelog.js)
    // The data is already sorted newest to oldest.
    changelogData.forEach(versionInfo => {
        // Create a container for each version's entry.
        const entryContainer = document.createElement('div');
        
        // Add the version number as a paragraph with a strong tag.
        const versionHeader = document.createElement('p');
        versionHeader.innerHTML = `<strong>Version ${versionInfo.version}</strong>`;
        entryContainer.appendChild(versionHeader);

        // Create an unordered list for the changes for this version.
        const changesList = document.createElement('ul');
        changesList.className = 'changelog-list'; // Use the existing class for styling.
        
        // Populate the list with individual changes.
        versionInfo.changes.forEach(changeText => {
            const listItem = document.createElement('li');
            listItem.textContent = changeText;
            changesList.appendChild(listItem);
        });
        
        entryContainer.appendChild(changesList);
        modalBody.appendChild(entryContainer);
    });

    // Show the modal.
    document.getElementById('changelog-modal').classList.remove('hidden');
}


function closeChangelogModal() {
    document.getElementById('changelog-modal').classList.add('hidden');
}

let talentCount = 0, skillCount = 0, moduleAttrCount = 0;
const MAX_TALENTS = 2, MAX_SKILLS = 3;

const getValue = (id, defaultValue = '') => document.getElementById(id)?.value ?? defaultValue;
const setText = (id, text, defaultValue = '...') => { const el = document.getElementById(id); if (el) el.textContent = text || defaultValue; };
const setHtml = (id, html, defaultValue = '') => { const el = document.getElementById(id); if (el) el.innerHTML = html || defaultValue; };

function populateSelect(selectId, options, defaultOption = null) {
    const select = document.getElementById(selectId);
    select.innerHTML = '';
    options.forEach(option => {
        const opt = document.createElement('option');
        opt.value = option;
        opt.innerHTML = option;
        if (option === defaultOption) opt.selected = true;
        select.appendChild(opt);
    });
}
function removeElement(elementId) { document.getElementById(elementId)?.remove(); updateAddButtonsState(); updatePreview(); }

function handleImageUpload(event, previewId) {
    const file = event.target.files[0];
    if (file && file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (e) => {
            const imgEl = document.getElementById(previewId);
            imgEl.src = e.target.result;
            imgEl.dataset.base64 = e.target.result;
            updatePreview();
        };
        reader.readAsDataURL(file);
    }
}
function updateAddButtonsState() {
    document.getElementById('add-talent-btn').disabled = document.querySelectorAll('.talent-group').length >= MAX_TALENTS;
    document.getElementById('add-skill-btn').disabled = document.querySelectorAll('.skill-group').length >= MAX_SKILLS;
}
function addTalent(data = {}) {
    if (document.querySelectorAll('.talent-group').length >= MAX_TALENTS) return;
    talentCount++;
    const container = document.getElementById('talents-container');
    const newTalent = document.createElement('div');
    newTalent.id = `talent-group-${talentCount}`;
    newTalent.className = 'talent-group dynamic-group';
    newTalent.innerHTML = `<div class="form-group-header"><label>Talent</label><button class="btn-remove" onclick="removeElement('talent-group-${talentCount}')">&times;</button></div><input type="text" id="talent-name-${talentCount}" placeholder="Talent Name" onkeyup="updatePreview()" value="${data.name || ''}"><textarea id="talent-desc-${talentCount}" rows="3" placeholder="Talent Description" onkeyup="updatePreview()">${data.desc || ''}</textarea>`;
    container.appendChild(newTalent);
    updateAddButtonsState();
}
function addSkill(data = {}) {
    if (document.querySelectorAll('.skill-group').length >= MAX_SKILLS) return;
    skillCount++;
    const container = document.getElementById('skills-container');
    const newSkill = document.createElement('div');
    newSkill.id = `skill-group-${skillCount}`;
    newSkill.className = 'skill-group dynamic-group';
    newSkill.dataset.range = JSON.stringify(data.range || []);
    const defaultIcon = 'https://placehold.co/64x64/1a1a1a/444444?text=Icon';
    
    newSkill.innerHTML = `
        <div class="form-group-header">
            <label>Skill</label>
            <button class="btn-remove" onclick="removeElement('skill-group-${skillCount}')">&times;</button>
        </div>
        <div class="skill-input-row">
            <div class="skill-image-wrapper">
                <img id="skill-image-preview-${skillCount}" src="${data.imgData || defaultIcon}" alt="Skill Icon" style="width: 64px; height: 64px; border: 1px solid #555;">
                <div class="btn-add-icon" onclick="toggleIconMenu(${skillCount})">+</div>
                <div id="icon-menu-${skillCount}" class="icon-options-menu">
                    <input type="file" id="skill-image-upload-${skillCount}" class="hidden" accept="image/*" onchange="handleImageUpload(event, 'skill-image-preview-${skillCount}')">
                    <button type="button" class="btn-small" onclick="document.getElementById('skill-image-upload-${skillCount}').click()">Upload</button>
                    <button type="button" class="btn-small" onclick="openPresetLibrary('skill-image-preview-${skillCount}')">Library</button>
                    <button type="button" class="btn-small" onclick="promptForImageUrl('skill-image-preview-${skillCount}')">URL</button>
                </div>
            </div>
            <input type="text" id="skill-name-${skillCount}" placeholder="Skill Name" onkeyup="updatePreview()" value="${data.name || ''}">
        </div>
        <div class="sub-grid">
            <input type="number" id="skill-sp-cost-${skillCount}" placeholder="SP Cost" onkeyup="updatePreview()" value="${data.spCost || ''}">
            <input type="number" id="skill-initial-sp-${skillCount}" placeholder="Initial SP" onkeyup="updatePreview()" value="${data.initialSp || ''}">
            <input type="text" id="skill-duration-${skillCount}" placeholder="Duration" onkeyup="updatePreview()" value="${data.duration || ''}">
        </div>
        <button type="button" class="btn btn-small" style="width: 100%; margin: 8px 0 4px 0;" onclick="openSkillRangeModal(${skillCount})">Set Skill Attack Range</button>
        <textarea id="skill-desc-${skillCount}" rows="4" placeholder="Skill Description" onkeyup="updatePreview()">${data.desc || ''}</textarea>`;
    
    container.appendChild(newSkill);
    updateAddButtonsState();
}

function toggleIconMenu(skillId) {
    document.querySelectorAll('.icon-options-menu.visible').forEach(menu => {
        if (menu.id !== `icon-menu-${skillId}`) {
            menu.classList.remove('visible');
        }
    });
    const targetMenu = document.getElementById(`icon-menu-${skillId}`);
    if (targetMenu) {
        targetMenu.classList.toggle('visible');
    }
}

window.addEventListener('click', function(e) {
    if (!e.target.matches('.btn-add-icon') && !e.target.closest('.icon-options-menu')) {
        document.querySelectorAll('.icon-options-menu.visible').forEach(menu => {
            menu.classList.remove('visible');
        });
    }
});

function addModuleAttribute(data = {}) {
    moduleAttrCount++;
    const container = document.getElementById('module-attributes-container');
    const newAttr = document.createElement('div');
    newAttr.id = `module-attr-group-${moduleAttrCount}`;
    newAttr.className = 'module-attr-row';
    newAttr.innerHTML = `<select id="module-attr-stat-${moduleAttrCount}"><option>HP</option><option>ATK</option><option>DEF</option><option>RES</option><option>ASPD</option></select><input type="number" id="module-attr-value-${moduleAttrCount}" placeholder="Value" onkeyup="updatePreview()" value="${data.value || ''}"><button class="btn-remove" onclick="removeElement('module-attr-group-${moduleAttrCount}')">&times;</button>`;
    container.appendChild(newAttr);
    if (data.stat) document.getElementById(`module-attr-stat-${moduleAttrCount}`).value = data.stat;
}
function updateArchetypes() { populateSelect('operator-archetype', archetypeData[getValue('operator-class')] || []); updatePreview(); }
function toggleModule() {
    const isEnabled = document.getElementById('module-enabled').checked;
    document.getElementById('module-container').classList.toggle('hidden', !isEnabled);
    document.getElementById('preview-module-container').classList.toggle('hidden', !isEnabled);
    updatePreview();
}

function createRangeGrids() {
    const configGrid = document.getElementById('range-config-grid');
    const previewGrid = document.getElementById('preview-range-grid');
    configGrid.innerHTML = ''; 
    previewGrid.innerHTML = '';

    const gridSize = 9 * 9;
    const operatorIndex = 40;

    for (let i = 0; i < gridSize; i++) {
        const configCell = document.createElement('div');
        configCell.classList.add('range-cell');
        configCell.dataset.index = i;
        if (i === operatorIndex) {
            configCell.classList.add('operator');
        } else {
            configCell.addEventListener('click', () => {
                configCell.classList.toggle('selected');
                updatePreview();
            });
        }
        configGrid.appendChild(configCell);

        const previewCell = document.createElement('div');
        previewCell.classList.add('range-cell');
        previewCell.dataset.index = i;
        if (i === operatorIndex) {
            previewCell.classList.add('operator');
        }
        previewGrid.appendChild(previewCell);
    }
}

function createGridInContainer(containerId, gridSize, operatorIndex) {
    const gridContainer = document.getElementById(containerId);
    gridContainer.innerHTML = '';
    for (let i = 0; i < gridSize; i++) {
        const cell = document.createElement('div');
        cell.classList.add('range-cell');
        if (i === operatorIndex) {
            cell.classList.add('operator');
        } else {
            cell.addEventListener('click', () => cell.classList.toggle('selected'));
        }
        gridContainer.appendChild(cell);
    }
}

function openSkillRangeModal(skillId) {
    currentSkillRangeEditorId = skillId;
    const skillName = getValue(`skill-name-${skillId}`) || `Skill ${skillId}`;
    document.getElementById('skill-range-modal-title').textContent = `Edit Range for: ${skillName}`;
    const skillGroup = document.getElementById(`skill-group-${skillId}`);
    const rangeData = JSON.parse(skillGroup.dataset.range || '[]');
    const gridCells = document.querySelectorAll('#skill-range-config-grid .range-cell');
    gridCells.forEach((cell, index) => {
        cell.classList.toggle('selected', rangeData.includes(index));
    });
    document.getElementById('skill-range-modal').classList.remove('hidden');
}

function closeSkillRangeModal() {
    document.getElementById('skill-range-modal').classList.add('hidden');
    currentSkillRangeEditorId = null;
}

function saveSkillRange() {
    if (currentSkillRangeEditorId === null) return;
    const newRange = [];
    document.querySelectorAll('#skill-range-config-grid .range-cell.selected').forEach(cell => {
        const index = Array.from(cell.parentNode.children).indexOf(cell);
        newRange.push(index);
    });
    const skillGroup = document.getElementById(`skill-group-${currentSkillRangeEditorId}`);
    skillGroup.dataset.range = JSON.stringify(newRange);
    closeSkillRangeModal();
    updatePreview();
}

function openPresetLibrary(target) {
    modalTargetId = target;
    const grid = document.getElementById('preset-library-grid');
    grid.innerHTML = '';
    presetIcons.forEach(iconUrl => {
        const img = document.createElement('img');
        img.src = iconUrl;
        img.onclick = () => selectPreset(iconUrl);
        grid.appendChild(img);
    });
    document.getElementById('preset-library-modal').classList.remove('hidden');
}

function selectPreset(iconUrl) {
    if (modalTargetId) {
        const targetImg = document.getElementById(modalTargetId);
        targetImg.src = iconUrl;
        targetImg.dataset.base64 = iconUrl;
        updatePreview();
    }
    closePresetLibrary();
}

function closePresetLibrary() {
    document.getElementById('preset-library-modal').classList.add('hidden');
}

function promptForImageUrl(targetId) {
    const url = prompt("Please enter the image URL:");
    if (url) {
        const targetImg = document.getElementById(targetId);
        targetImg.src = url;
        targetImg.dataset.base64 = url;
        updatePreview();
    }
}

function showSkillRangeOverlay(skillId) {
    hideSkillRangeOverlay();
    const skillGroup = document.getElementById(`skill-group-${skillId}`);
    if (!skillGroup) return;
    const rangeData = JSON.parse(skillGroup.dataset.range || '[]');
    if (rangeData.length === 0) return;
    const previewCells = document.querySelectorAll('#preview-range-grid .range-cell');
    rangeData.forEach(index => {
        if (previewCells[index]) {
            previewCells[index].classList.add('skill-range-overlay');
        }
    });
}

function hideSkillRangeOverlay() {
    document.querySelectorAll('#preview-range-grid .skill-range-overlay').forEach(cell => {
        cell.classList.remove('skill-range-overlay');
    });
}

function updatePreview() {
    setText('preview-codename', getValue('operator-codename'), 'Operator Name');
    setText('preview-faction', getValue('operator-faction'), 'Faction');
    setText('preview-class-icon', getValue('operator-class'), 'Class');
    const selectedArchetype = getValue('operator-archetype');
    setText('preview-archetype', selectedArchetype, 'Archetype');

    const traitText = archetypeTraits[selectedArchetype] || 'Select an archetype to see the corresponding trait.';
    setHtml('operator-trait-desc', traitText);
    
    const artEl = document.getElementById('preview-art');
    if (!artEl.src.startsWith('data:image') && !artEl.src.startsWith('https') && !artEl.src.startsWith('file:')) { artEl.src = 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQBAWe9-3wfVT-XVEr8UJ7lpH5FOZfNQH0Kng&s'; }
    
    setText('preview-rarity', '★'.repeat(parseInt(getValue('operator-rarity', '6'))));
    setHtml('preview-profile-text', getValue('operator-profile-text').replace(/\n/g, '<br>'), 'Profile description.');
    
    ['gender', 'combat-exp', 'birthplace', 'birthday', 'race', 'height'].forEach(s => setText(`preview-${s}`, getValue(`operator-${s}`)));
    setText('preview-infection', getValue('operator-infection'));
    setHtml('preview-clinical-text', getValue('operator-clinical-text').replace(/\n/g, '<br>'));
    ['assimilation', 'density'].forEach(s => setText(`preview-${s}`, getValue(`operator-${s}`)));

    ['strength', 'mobility', 'resilience', 'acumen'].forEach(s => setText(`preview-${s}`, getValue(`operator-${s}`)));
    setText('preview-cs', getValue('operator-combat-skill'));
    setText('preview-oa', getValue('operator-arts'));

    ['hp', 'atk', 'def', 'res', 'cost', 'block', 'aspd', 'redeploy'].forEach(s => setText(`preview-${s}`, getValue(`operator-${s}`, '0')));

    let talentsHtml = '';
    document.querySelectorAll('.talent-group').forEach(el => { const id = el.id.split('-')[2]; const name = getValue(`talent-name-${id}`); const desc = getValue(`talent-desc-${id}`); if (name || desc) talentsHtml += `<div class="preview-item"><strong>${name || 'Unnamed Talent'}</strong><p>${desc.replace(/\n/g, '<br>') || '...'}</p></div>`; });
    setHtml('preview-talents', talentsHtml || '<p class="placeholder-text">No talents defined.</p>');

    let skillsHtml = '';
    document.querySelectorAll('.skill-group').forEach((el, index) => {
        const id = el.id.split('-')[2];
        const name = getValue(`skill-name-${id}`), desc = getValue(`skill-desc-${id}`), spCost = getValue(`skill-sp-cost-${id}`), initialSp = getValue(`skill-initial-sp-${id}`), duration = getValue(`skill-duration-${id}`);
        const imgSrc = document.getElementById(`skill-image-preview-${id}`)?.src;
        if (name || desc) {
            skillsHtml += `<div class="preview-skill-card preview-item" onmouseover="showSkillRangeOverlay(${id})">
                <img src="${imgSrc}" alt="skill icon">
                <div>
                    <h4>${name || `Skill ${index + 1}`}</h4>
                    <div class="skill-stats">
                        ${spCost ? `<span><strong>SP:</strong> ${spCost}</span>` : ''}
                        ${initialSp ? `<span><strong>Initial:</strong> ${initialSp}</span>` : ''}
                        ${duration ? `<span><strong>Duration:</strong> ${duration}</span>` : ''}
                    </div>
                    <p>${desc.replace(/\n/g, '<br>') || '...'}</p>
                </div>
            </div>`;
        }
    });
    setHtml('preview-skills', `<div onmouseout="hideSkillRangeOverlay()">${skillsHtml || '<p class="placeholder-text">No skills defined.</p>'}</div>`);

    let potentialLines = [];
    for (let i = 2; i <= 6; i++) {
        const potText = getValue(`operator-potential-${i}`);
        if (potText) { 
            const imageUrl = potentialImageUrls[i - 2];
            potentialLines.push(`<li><img src="${imageUrl}" class="potential-icon" alt="Potential ${i}"><span>${potText}</span></li>`);
        }
    }
    if (potentialLines.length > 0) { setHtml('preview-potentials', `<ul class="preview-potentials-list">${potentialLines.join('')}</ul>`); } 
    else { setHtml('preview-potentials', '<p class="placeholder-text">No potentials defined.</p>'); }

    if (document.getElementById('module-enabled').checked) {
        document.getElementById('preview-module-icon').src = document.getElementById('module-image-preview').src;
        setText('preview-module-name', getValue('module-name'), 'Module Name');
        setHtml('preview-module-trait', getValue('module-trait').replace(/\n/g, '<br>'));
        const t1 = getValue('module-talent1'); document.getElementById('preview-module-talent1-wrapper').classList.toggle('hidden', !t1); setHtml('preview-module-talent1', t1.replace(/\n/g, '<br>'));
        const t2 = getValue('module-talent2'); document.getElementById('preview-module-talent2-wrapper').classList.toggle('hidden', !t2); setHtml('preview-module-talent2', t2.replace(/\n/g, '<br>'));
        let attrs = [];
        document.querySelectorAll('[id^="module-attr-group-"]').forEach(el => {
            const id = el.id.split('-')[3];
            const stat = getValue(`module-attr-stat-${id}`);
            const value = getValue(`module-attr-value-${id}`);
            if (value) {
                attrs.push(`${stat} ${stat !== 'ASPD' ? '+' : ''}${value}`);
            }
        });
        setText('preview-module-attributes', attrs.join(', ') || 'None');
    }

    ['1', '2', '3', '4'].forEach(n => { const text = getValue(`operator-archive${n}`), cont = document.getElementById(`preview-archive${n}-container`); if (text) { setHtml(`preview-archive${n}`, text.replace(/\n/g, '<br>')); cont.classList.remove('hidden'); } else { cont.classList.add('hidden'); } });
    
    const configCells = document.querySelectorAll('#range-config-grid .range-cell');
    const previewCells = document.querySelectorAll('#preview-range-grid .range-cell');
    configCells.forEach((cell, index) => {
        previewCells[index].classList.toggle('selected', cell.classList.contains('selected'));
    });
}

function saveOperator() {
    const operatorData = {
        basic: { codename: getValue('operator-codename'), faction: getValue('operator-faction'), class: getValue('operator-class'), archetype: getValue('operator-archetype'), rarity: getValue('operator-rarity'), gender: getValue('operator-gender'), combat_exp: getValue('operator-combat-exp'), birthplace: getValue('operator-birthplace'), birthday: getValue('operator-birthday'), race: getValue('operator-race'), height: getValue('operator-height'), art: document.getElementById('preview-art').dataset.base64 || '' },
        profile: { text: getValue('operator-profile-text') },
        clinical: { text: getValue('operator-clinical-text'), infection: getValue('operator-infection'), assimilation: getValue('operator-assimilation'), density: getValue('operator-density')},
        exam: { strength: getValue('operator-strength'), mobility: getValue('operator-mobility'), resilience: getValue('operator-resilience'), acumen: getValue('operator-acumen'), combat_skill: getValue('operator-combat-skill'), arts: getValue('operator-arts') },
        stats: { hp: getValue('operator-hp'), atk: getValue('operator-atk'), def: getValue('operator-def'), res: getValue('operator-res'), cost: getValue('operator-cost'), block: getValue('operator-block'), aspd: getValue('operator-aspd'), redeploy: getValue('operator-redeploy') },
        talents: [], skills: [],
        potentials: Array.from({length: 5}, (_, i) => getValue(`operator-potential-${i+2}`)),
        module: { enabled: document.getElementById('module-enabled').checked, name: getValue('module-name'), trait: getValue('module-trait'), talent1: getValue('module-talent1'), talent2: getValue('module-talent2'), attributes: [], imgData: document.getElementById('module-image-preview').dataset.base64 },
        archives: { a1: getValue('operator-archive1'), a2: getValue('operator-archive2'), a3: getValue('operator-archive3'), a4: getValue('operator-archive4') },
        range: []
    };
    document.querySelectorAll('.talent-group').forEach(el => { const id = el.id.split('-')[2]; operatorData.talents.push({ name: getValue(`talent-name-${id}`), desc: getValue(`talent-desc-${id}`) }); });
    document.querySelectorAll('.skill-group').forEach(el => {
        const id = el.id.split('-')[2];
        operatorData.skills.push({
            name: getValue(`skill-name-${id}`),
            spCost: getValue(`skill-sp-cost-${id}`),
            initialSp: getValue(`skill-initial-sp-${id}`),
            duration: getValue(`skill-duration-${id}`),
            desc: getValue(`skill-desc-${id}`),
            imgData: document.getElementById(`skill-image-preview-${id}`).dataset.base64,
            range: JSON.parse(el.dataset.range || '[]')
        });
    });
    document.querySelectorAll('[id^="module-attr-group-"]').forEach(el => { const id = el.id.split('-')[3]; operatorData.module.attributes.push({ stat: getValue(`module-attr-stat-${id}`), value: getValue(`module-attr-value-${id}`) }); });
    document.querySelectorAll('#range-config-grid .range-cell').forEach(cell => { if (cell.classList.contains('selected')) { operatorData.range.push(parseInt(cell.dataset.index)); }});
    
    const a = document.createElement('a'); a.href = URL.createObjectURL(new Blob([JSON.stringify(operatorData, null, 2)], { type: 'application/json' })); a.download = `${operatorData.basic.codename || 'UnnamedOperator'}.json`; a.click(); URL.revokeObjectURL(a.href);
}

function loadOperator(event) {
    const file = event.target.files[0]; if (!file) return;
    const reader = new FileReader();
    reader.onload = e => { try { populateForm(JSON.parse(e.target.result)); } catch (err) { alert('Error: Invalid operator file.'); console.error(err); } };
    reader.readAsText(file);
    event.target.value = '';
}

function loadLocalIcons(event) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = e => {
        try {
            const filenames = JSON.parse(e.target.result);
            if (!Array.isArray(filenames)) {
                throw new Error("Manifest must be a JSON array.");
            }
            window.presetIcons = filenames.map(name => `skill_icons/${name}`);
            alert(`Successfully loaded ${window.presetIcons.length} local icons. Open the library to see them.`);
        } catch (err) {
            alert('Error reading manifest file. Make sure it is a valid JSON array of filenames.');
            console.error(err);
        }
    };
    reader.readAsText(file);
    event.target.value = '';
}


function populateForm(data) {
    resetForm(true);
    
    Object.keys(data.basic || {}).forEach(k => { const keyMap = { 'name': 'codename', 'combat_exp': 'combat-exp' }; const elId = `operator-${keyMap[k] || k}`; const el = document.getElementById(elId); if (el) el.value = data.basic[k] ?? ''; });
    if (data.basic?.art) { const artEl = document.getElementById('preview-art'); artEl.src = data.basic.art; artEl.dataset.base64 = data.basic.art; }
    updateArchetypes(); document.getElementById('operator-archetype').value = data.basic.archetype ?? '';
    
    if(data.profile) document.getElementById('operator-profile-text').value = data.profile.text ?? '';
    if(data.clinical) { Object.keys(data.clinical).forEach(k => { const elId = k === 'text' ? 'operator-clinical-text' : `operator-${k}`; const el = document.getElementById(elId); if (el) el.value = data.clinical[k] ?? ''; }); }
    if(data.exam) { Object.keys(data.exam).forEach(k => { const elId = `operator-${k.replace('_', '-')}`; const el = document.getElementById(elId); if (el) el.value = data.exam[k] ?? ''; }); }
    Object.keys(data.stats || {}).forEach(k => { const el = document.getElementById(`operator-${k}`); if (el) el.value = data.stats[k] ?? ''; });
    Object.keys(data.archives || {}).forEach(k => { const el = document.getElementById(`operator-archive${k.substring(1)}`); if (el) el.value = data.archives[k] ?? ''; });
    
    (data.talents || []).forEach(t => addTalent(t)); 
    (data.skills || []).forEach(s => addSkill(s));

    if (data.potentials) { (data.potentials || []).forEach((potText, index) => { const el = document.getElementById(`operator-potential-${index + 2}`); if (el) el.value = potText || ''; }); }
    
    const moduleEnabled = data.module?.enabled ?? false; document.getElementById('module-enabled').checked = moduleEnabled;
    if (moduleEnabled && data.module) {
        if(data.module.imgData) {
            const moduleImg = document.getElementById('module-image-preview');
            moduleImg.src = data.module.imgData;
            moduleImg.dataset.base64 = data.module.imgData;
        }
        document.getElementById('module-name').value = data.module.name ?? '';
        document.getElementById('module-trait').value = data.module.trait ?? '';
        document.getElementById('module-talent1').value = data.module.talent1 ?? '';
        document.getElementById('module-talent2').value = data.module.talent2 ?? '';
        (data.module.attributes || []).forEach(a => addModuleAttribute(a));
    }
    if (data.range) { (data.range || []).forEach(index => { document.querySelector(`#range-config-grid .range-cell[data-index='${index}']`)?.classList.add('selected'); }); }

    toggleModule(); updatePreview();
}

function resetForm(isSilent = false) {
    const doReset = () => {
        document.querySelectorAll('input[type=text],input[type=number],textarea,input[type=file]').forEach(el => el.value = '');
        document.querySelectorAll('select').forEach(el => el.selectedIndex = 0);
        ['talents-container', 'skills-container', 'module-attributes-container'].forEach(id => document.getElementById(id).innerHTML = '');
        document.querySelectorAll('#range-config-grid .range-cell.selected').forEach(c => c.classList.remove('selected'));
        talentCount = 0; skillCount = 0; moduleAttrCount = 0;
        const artEl = document.getElementById('preview-art');
        artEl.src = 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQBAWe9-3wfVT-XVEr8UJ7lpH5FOZfNQH0Kng&s';
        delete artEl.dataset.base64;
        document.getElementById('module-image-preview').src = 'https://placehold.co/128x128/1a1a1a/444444?text=Icon';
        delete document.getElementById('module-image-preview').dataset.base64;
        document.getElementById('operator-rarity').value = "6";
        document.getElementById('operator-class').value = "Sniper";
        ['operator-strength', 'operator-mobility', 'operator-resilience', 'operator-acumen', 'operator-combat-skill', 'operator-arts'].forEach(id => document.getElementById(id).value = "Standard");
        document.getElementById('module-enabled').checked = false;
        updateArchetypes(); 
        toggleModule();
    }
    if (isSilent) { doReset(); } 
    else if (confirm("Are you sure you want to reset all fields? This action cannot be undone.")) { doReset(); }
}

window.onload = () => {
    showChangelogModal();
    
    createRangeGrids();
    createGridInContainer('skill-range-config-grid', 9 * 9, 40);

    populateSelect('operator-race', races);
    ['operator-strength', 'operator-mobility', 'operator-resilience', 'operator-acumen', 'operator-combat-skill', 'operator-arts'].forEach(id => populateSelect(id, physicalRatings));

    resetForm(true);
    document.getElementById("defaultOpen").click();
};

function saveAsImage() {
    const captureElement = document.getElementById('operator-preview-area');
    const codename = getValue('operator-codename') || 'UnnamedOperator';
    const filename = `${codename}-profile.jpg`;

    const options = {
        backgroundColor: '#282828',
        useCORS: true,
        scale: 2
    };

    html2canvas(captureElement, options).then(canvas => {
        const link = document.createElement('a');
        
        link.download = filename;
        link.href = canvas.toDataURL('image/jpeg', 0.95);

        link.click();
    }).catch(err => {
        console.error('Error saving image:', err);
        alert('Could not save image. See the browser console for more details.');
    });
}

const scrollToTopBtn = document.getElementById("scrollToTopBtn");

window.onscroll = function() {
    if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
        scrollToTopBtn.style.display = "block";
    } else {
        scrollToTopBtn.style.display = "none";
    }
};

function scrollToTop() {
    window.scrollTo({top: 0, behavior: 'smooth'});
}