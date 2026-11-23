(function() {
    'use strict';

    // UI Elements
    const UI = {
        themeToggle: document.getElementById('themeToggle'),
        tabEncrypt: document.getElementById('tabEncrypt'),
        tabDecrypt: document.getElementById('tabDecrypt'),
        messageInput: document.getElementById('messageInput'),
        keyInput: document.getElementById('keyInput'),
        toggleKeyBtn: document.getElementById('toggleKeyBtn'),
        encryptBtn: document.getElementById('encryptBtn'),
        decryptBtn: document.getElementById('decryptBtn'),
        clearBtn: document.getElementById('clearBtn'),
        resultOutput: document.getElementById('resultOutput'),
        keyLengthSel: document.getElementById('keyLengthSel'),
        customKeyLength: document.getElementById('customKeyLength'),
        generateKeyBtn: document.getElementById('generateKeyBtn'),
        generatedKeyDisplay: document.getElementById('generatedKeyDisplay'),
        useKeyBtn: document.getElementById('useKeyBtn'),
        copyResultBtn: document.getElementById('copyResultBtn'),
        downloadTxtBtn: document.getElementById('downloadTxtBtn'),
        downloadCsvBtn: document.getElementById('downloadCsvBtn'),
        keyAlignment: document.getElementById('keyAlignment'),
        processTableBody: document.querySelector('#processTable tbody'),
        processSection: document.getElementById('processSection'),
        copyStepsBtn: document.getElementById('copyStepsBtn'),
        downloadStepsBtn: document.getElementById('downloadStepsBtn'),
        tableau: document.getElementById('tableau'),
        messageError: document.getElementById('messageError'),
        keyError: document.getElementById('keyError'),
        toast: document.getElementById('toast'),
        exampleCards: document.querySelectorAll('.example-card')
    };

    const Stats = {
        chars: document.getElementById('statChars'),
        letters: document.getElementById('statLetters'),
        spaces: document.getElementById('statSpaces'),
        numbers: document.getElementById('statNumbers'),
        special: document.getElementById('statSpecial'),
        keyLen: document.getElementById('statKeyLen')
    };

    let currentMode = 'encrypt';
    let currentStepsData = [];

    const examples = [
        { msg: "ATTACK AT DAWN", key: "LEMON" },
        { msg: "HELLO WORLD", key: "KEY" },
        { msg: "Hello, World! 123", key: "SECRET" }
    ];

    // Initialization
    function initApp() {
        bindEvents();
        generateTableau();
        loadTheme();
        updateStatistics();
    }

    function bindEvents() {
        UI.themeToggle.addEventListener('click', toggleTheme);
        UI.tabEncrypt.addEventListener('click', () => setMode('encrypt'));
        UI.tabDecrypt.addEventListener('click', () => setMode('decrypt'));
        UI.toggleKeyBtn.addEventListener('click', toggleKeyVisibility);
        UI.clearBtn.addEventListener('click', handleClear);
        UI.encryptBtn.addEventListener('click', () => processCipher('encrypt'));
        UI.decryptBtn.addEventListener('click', () => processCipher('decrypt'));
        UI.messageInput.addEventListener('input', () => { clearErrors(); updateStatistics(); });
        UI.keyInput.addEventListener('input', () => { clearErrors(); updateStatistics(); });
        UI.keyLengthSel.addEventListener('change', handleKeyLengthChange);
        UI.generateKeyBtn.addEventListener('click', generateRandomKey);
        UI.useKeyBtn.addEventListener('click', useGeneratedKey);
        UI.copyResultBtn.addEventListener('click', copyResult);
        UI.downloadTxtBtn.addEventListener('click', downloadResult);
        UI.copyStepsBtn.addEventListener('click', copySteps);
        UI.downloadCsvBtn.addEventListener('click', downloadAnalysis);
        UI.downloadStepsBtn.addEventListener('click', downloadAnalysis);

        UI.exampleCards.forEach(card => {
            card.addEventListener('click', () => {
                const idx = parseInt(card.dataset.idx, 10);
                loadExample(idx);
            });
        });
    }

    // Theme Management
    function toggleTheme() {
        const html = document.documentElement;
        const current = html.getAttribute('data-theme');
        const next = current === 'dark' ? 'light' : 'dark';
        html.setAttribute('data-theme', next);
        UI.themeToggle.textContent = next === 'dark' ? '☀️' : '🌙';
        localStorage.setItem('vigenere_theme', next);
    }

    function loadTheme() {
        const saved = localStorage.getItem('vigenere_theme') || 'dark';
        document.documentElement.setAttribute('data-theme', saved);
        UI.themeToggle.textContent = saved === 'dark' ? '☀️' : '🌙';
    }

    // UI Updates
    function setMode(mode) {
        currentMode = mode;
        if (mode === 'encrypt') {
            UI.tabEncrypt.classList.add('active');
            UI.tabDecrypt.classList.remove('active');
            UI.messageInput.placeholder = "Enter plaintext to encrypt...";
        } else {
            UI.tabDecrypt.classList.add('active');
            UI.tabEncrypt.classList.remove('active');
            UI.messageInput.placeholder = "Enter ciphertext to decrypt...";
        }
        clearErrors();
    }

    function toggleKeyVisibility() {
        if (UI.keyInput.type === 'password') {
            UI.keyInput.type = 'text';
            UI.toggleKeyBtn.textContent = '🙈';
        } else {
            UI.keyInput.type = 'password';
            UI.toggleKeyBtn.textContent = '👁️';
        }
    }

    function handleClear() {
        UI.messageInput.value = '';
        UI.keyInput.value = '';
        UI.resultOutput.value = '';
        UI.keyAlignment.textContent = '';
        UI.processTableBody.innerHTML = '';
        UI.processSection.removeAttribute('open');
        clearTableauHighlight();
        clearErrors();
        updateStatistics();
    }

    function updateStatistics() {
        const msg = UI.messageInput.value;
        const key = UI.keyInput.value;
        
        Stats.chars.textContent = msg.length;
        Stats.letters.textContent = (msg.match(/[a-zA-Z]/g) || []).length;
        Stats.spaces.textContent = (msg.match(/\s/g) || []).length;
        Stats.numbers.textContent = (msg.match(/[0-9]/g) || []).length;
        Stats.special.textContent = msg.length - (msg.match(/[a-zA-Z0-9\s]/g) || []).length;
        Stats.keyLen.textContent = key.length;
    }

    function clearErrors() {
        UI.messageError.textContent = '';
        UI.keyError.textContent = '';
        UI.messageInput.classList.remove('error-shake');
        UI.keyInput.classList.remove('error-shake');
    }

    function showError(element, msgElement, message) {
        msgElement.textContent = message;
        element.classList.remove('error-shake');
        void element.offsetWidth; // trigger reflow
        element.classList.add('error-shake');
    }

    // Examples
    function loadExample(idx) {
        const ex = examples[idx];
        if (ex) {
            UI.messageInput.value = ex.msg;
            UI.keyInput.value = ex.key;
            updateStatistics();
            clearErrors();
        }
    }

    // Random Key Gen
    function handleKeyLengthChange() {
        if (UI.keyLengthSel.value === 'custom') {
            UI.customKeyLength.style.display = 'inline-block';
        } else {
            UI.customKeyLength.style.display = 'none';
        }
    }

    function generateRandomKey() {
        let len = UI.keyLengthSel.value;
        if (len === 'custom') {
            len = parseInt(UI.customKeyLength.value, 10);
            if (isNaN(len) || len < 1) len = 8;
        } else {
            len = parseInt(len, 10);
        }
        
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        let res = '';
        for (let i=0; i<len; i++) {
            res += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        
        UI.generatedKeyDisplay.textContent = res;
        UI.useKeyBtn.style.display = 'inline-block';
    }

    function useGeneratedKey() {
        UI.keyInput.value = UI.generatedKeyDisplay.textContent;
        updateStatistics();
    }

    // Core Crypto Logic
    function validateInput(text, key) {
        let valid = true;
        if (!text.trim()) {
            showError(UI.messageInput, UI.messageError, 'Message cannot be empty.');
            valid = false;
        }
        
        const alphaKey = key.replace(/[^a-zA-Z]/g, '');
        if (!alphaKey) {
            showError(UI.keyInput, UI.keyError, 'Key must contain at least one letter.');
            valid = false;
        }
        
        return valid;
    }

    function processCipher(mode) {
        const text = UI.messageInput.value;
        const key = UI.keyInput.value;
        
        if (!validateInput(text, key)) return;
        
        try {
            const { result, steps, expandedKey } = runVigenere(text, key, mode);
            
            UI.resultOutput.value = result;
            currentStepsData = steps;
            
            renderAlignment(text, expandedKey, result);
            renderProcessTable(steps, mode);
            UI.processSection.setAttribute('open', '');
            
        } catch (e) {
            alert('An error occurred during processing.');
            console.error(e);
        }
    }

    function runVigenere(text, key, mode) {
        let result = '';
        let steps = [];
        let expandedKeyArr = [];
        
        const cleanKey = key.toUpperCase().replace(/[^A-Z]/g, '');
        let keyIndex = 0;

        for (let i = 0; i < text.length; i++) {
            let char = text[i];
            
            if (/[a-zA-Z]/.test(char)) {
                let isUpper = char === char.toUpperCase();
                let p = char.toUpperCase().charCodeAt(0) - 65;
                let kChar = cleanKey[keyIndex % cleanKey.length];
                let k = kChar.charCodeAt(0) - 65;
                let c;
                
                if (mode === 'encrypt') {
                    c = (p + k) % 26;
                } else {
                    c = (p - k + 26) % 26;
                }
                
                let resChar = String.fromCharCode(c + 65);
                if (!isUpper) resChar = resChar.toLowerCase();
                
                result += resChar;
                expandedKeyArr.push(isUpper ? kChar : kChar.toLowerCase());
                
                steps.push({
                    pos: i + 1,
                    inChar: char,
                    inVal: p,
                    kChar: kChar,
                    kVal: k,
                    calc: mode === 'encrypt' ? `(${p} + ${k}) mod 26 = ${c}` : `(${p} - ${k} + 26) mod 26 = ${c}`,
                    resChar: resChar
                });
                
                keyIndex++;
            } else {
                result += char;
                expandedKeyArr.push(char === ' ' ? ' ' : '-');
                
                steps.push({
                    pos: i + 1,
                    inChar: char,
                    inVal: '-',
                    kChar: '-',
                    kVal: '-',
                    calc: 'Passthrough',
                    resChar: char
                });
            }
        }
        
        return { result, steps, expandedKey: expandedKeyArr.join('') };
    }

    // UI Rendering
    function renderAlignment(plain, key, result) {
        UI.keyAlignment.textContent = 
            `Input : ${plain}\n` +
            `Key   : ${key}\n` +
            `Output: ${result}`;
    }

    function renderProcessTable(steps, mode) {
        UI.processTableBody.innerHTML = '';
        steps.forEach(s => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${s.pos}</td>
                <td>${s.inChar}</td>
                <td>${s.inVal}</td>
                <td>${s.kChar}</td>
                <td>${s.kVal}</td>
                <td>${s.calc}</td>
                <td><strong>${s.resChar}</strong></td>
            `;
            
            // Interaction with Tableau
            if (s.inVal !== '-') {
                tr.addEventListener('mouseenter', () => highlightTableau(s.inVal, s.kVal, mode));
                tr.addEventListener('mouseleave', clearTableauHighlight);
                tr.style.cursor = 'pointer';
            }
            
            UI.processTableBody.appendChild(tr);
        });
    }

    function generateTableau() {
        let html = '<thead><tr><th></th>';
        for (let i = 0; i < 26; i++) {
            html += `<th>${String.fromCharCode(65 + i)}</th>`;
        }
        html += '</tr></thead><tbody>';
        
        for (let r = 0; r < 26; r++) {
            html += `<tr><th>${String.fromCharCode(65 + r)}</th>`;
            for (let c = 0; c < 26; c++) {
                let char = String.fromCharCode(((r + c) % 26) + 65);
                html += `<td data-r="${r}" data-c="${c}">${char}</td>`;
            }
            html += '</tr>';
        }
        html += '</tbody>';
        UI.tableau.innerHTML = html;
    }

    function highlightTableau(pVal, kVal, mode) {
        clearTableauHighlight();
        // In the tableau: row = plaintext index, col = key index
        let rowIdx = pVal;
        let colIdx = kVal;
        
        // Highlight the row header
        const rowHeader = UI.tableau.querySelector(`tbody tr:nth-child(${rowIdx + 1}) th`);
        if (rowHeader) rowHeader.classList.add('highlight');
        
        // Highlight the column header
        const colHeader = UI.tableau.querySelector(`thead th:nth-child(${colIdx + 2})`);
        if (colHeader) colHeader.classList.add('highlight');
        
        // Highlight all cells in the row (with a subtle class)
        const rowCells = UI.tableau.querySelectorAll(`tbody tr:nth-child(${rowIdx + 1}) td`);
        rowCells.forEach(td => td.classList.add('highlight-row'));
        
        // Highlight all cells in the column
        const allRows = UI.tableau.querySelectorAll('tbody tr');
        allRows.forEach(tr => {
            const td = tr.querySelector(`td:nth-child(${colIdx + 2})`);
            if (td) td.classList.add('highlight-col');
        });
        
        // Highlight the intersection cell strongly
        const cell = UI.tableau.querySelector(`td[data-r="${rowIdx}"][data-c="${colIdx}"]`);
        if (cell) cell.classList.add('highlight');
    }

    function clearTableauHighlight() {
        UI.tableau.querySelectorAll('.highlight, .highlight-row, .highlight-col').forEach(el => {
            el.classList.remove('highlight', 'highlight-row', 'highlight-col');
        });
    }

    // Export & Toast
    function showToast(msg) {
        UI.toast.textContent = msg;
        UI.toast.classList.add('show');
        setTimeout(() => UI.toast.classList.remove('show'), 2000);
    }

    async function copyResult() {
        if (!UI.resultOutput.value) return;
        try {
            await navigator.clipboard.writeText(UI.resultOutput.value);
            showToast('Result Copied!');
        } catch (e) {
            console.error('Failed to copy', e);
        }
    }

    async function copySteps() {
        if (currentStepsData.length === 0) return;
        const text = currentStepsData.map(s => 
            `${s.pos} | ${s.inChar} | ${s.inVal} | ${s.kChar} | ${s.kVal} | ${s.calc} | ${s.resChar}`
        ).join('\n');
        
        try {
            await navigator.clipboard.writeText(
                "Pos | In | InVal | Key | KeyVal | Calc | Out\n" + text
            );
            showToast('Steps Copied!');
        } catch (e) {
            console.error('Failed to copy', e);
        }
    }

    function downloadFile(content, filename, type) {
        const blob = new Blob([content], { type });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }

    function downloadResult() {
        if (!UI.resultOutput.value) return;
        downloadFile(UI.resultOutput.value, `vigenere_${currentMode}_result.txt`, 'text/plain');
    }

    function downloadAnalysis() {
        if (currentStepsData.length === 0) return;
        let csv = "Position,Input Char,Value,Key Char,Key Value,Calculation,Result Char\n";
        currentStepsData.forEach(s => {
            csv += `${s.pos},"${s.inChar}",${s.inVal},"${s.kChar}",${s.kVal},"${s.calc}","${s.resChar}"\n`;
        });
        downloadFile(csv, `vigenere_analysis.csv`, 'text/csv');
    }

    // Boot
    document.addEventListener('DOMContentLoaded', initApp);

})();
