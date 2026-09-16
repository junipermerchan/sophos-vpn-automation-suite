document.addEventListener('DOMContentLoaded', () => {
    // DOM Inputs
    const inputs = {
        sedeOrigenNombre: document.getElementById('sedeOrigenNombre'),
        sedeOrigenIp: document.getElementById('sedeOrigenIp'),
        sedeDestinoNombre: document.getElementById('sedeDestinoNombre'),
        sedeDestinoIp: document.getElementById('sedeDestinoIp'),
        vtiIpLocal: document.getElementById('vtiIpLocal'),
        vtiIpRemota: document.getElementById('vtiIpRemota'),
        dbName: document.getElementById('dbName'),
        dbPort: document.getElementById('dbPort')
    };

    // DOM Outputs
    const outputs = {
        objOrigen: document.getElementById('outObjOrigen'),
        ipOrigenVal: document.getElementById('outIpOrigenVal'),
        objDestino: document.getElementById('outObjDestino'),
        ipDestinoVal: document.getElementById('outIpDestinoVal'),
        vpnName: document.getElementById('outVpnName'),
        vtiLocal: document.getElementById('outVtiLocal'),
        vtiRemota: document.getElementById('outVtiRemota'),
        routeDest: document.getElementById('outRouteDest'),
        routeIf: document.getElementById('outRouteIf'),
        routeGw: document.getElementById('outRouteGw'),
        sdwanSrc: document.getElementById('outSdwanSrc'),
        sdwanDst: document.getElementById('outSdwanDst'),
        sdwanGw: document.getElementById('outSdwanGw'),
        ruleName: document.getElementById('outRuleName'),
        ruleSrc: document.getElementById('outRuleSrc'),
        ruleDst: document.getElementById('outRuleDst'),
        regFilename: document.getElementById('regFilename'),
        regCodeDisplay: document.getElementById('regCodeDisplay'),
        simCmdText: document.getElementById('simCmdText')
    };

    // Buttons & Elements
    const btnPresetBogota = document.getElementById('btnPresetBogota');
    const btnReset = document.getElementById('btnReset');
    const btnGenVti = document.getElementById('btnGenVti');
    const btnCopyReg = document.getElementById('btnCopyReg');
    const btnDownloadReg = document.getElementById('btnDownloadReg');
    const btnRunSim = document.getElementById('btnRunSim');
    const toast = document.getElementById('toast');
    const terminalOutput = document.getElementById('terminalOutput');
    const simStatus = document.getElementById('simStatus');

    // Helper: Clean string for object names
    function cleanName(str, defaultVal) {
        const trimmed = str ? str.trim() : '';
        if (!trimmed) return defaultVal;
        return trimmed.replace(/[^a-zA-Z0-9_]/g, '_');
    }

    // Helper: Format IP value
    function formatVal(val, placeholder) {
        const trimmed = val ? val.trim() : '';
        return trimmed ? trimmed : `<${placeholder}>`;
    }

    // Main Update Function
    function updateOutputs() {
        const srcNameRaw = inputs.sedeOrigenNombre.value;
        const srcIpRaw = inputs.sedeOrigenIp.value;
        const dstNameRaw = inputs.sedeDestinoNombre.value;
        const dstIpRaw = inputs.sedeDestinoIp.value;
        const vtiLocRaw = inputs.vtiIpLocal.value;
        const vtiRemRaw = inputs.vtiIpRemota.value;
        const dbNameRaw = inputs.dbName.value;
        const dbPortRaw = inputs.dbPort.value;

        const srcName = cleanName(srcNameRaw, 'Sede_Origen');
        const srcIp = formatVal(srcIpRaw, 'IP_ORIGEN');
        const dstName = cleanName(dstNameRaw, 'Sede_Destino');
        const dstIp = formatVal(dstIpRaw, 'IP_DESTINO');
        const vtiLoc = formatVal(vtiLocRaw, 'IP_VTI_LOCAL');
        const vtiRem = formatVal(vtiRemRaw, 'IP_VTI_REMOTA');
        const dbNameVal = formatVal(dbNameRaw, 'BD_PRINCIPAL');
        const dbPortVal = formatVal(dbPortRaw, '5432');

        // 1. SOP Outputs
        outputs.objOrigen.textContent = `HOST_${srcName}`;
        outputs.ipOrigenVal.textContent = srcIp;
        outputs.objDestino.textContent = `HOST_${dstName}`;
        outputs.ipDestinoVal.textContent = dstIp;
        
        outputs.vpnName.textContent = `TO_${dstName}`;
        outputs.vtiLocal.textContent = `${vtiLoc} / 255.255.255.252 (/30)`;
        outputs.vtiRemota.textContent = `${vtiRem} / 255.255.255.252 (/30)`;

        outputs.routeDest.textContent = `${dstIp} / 255.255.255.255 (/32)`;
        outputs.routeIf.textContent = `xfrm_${dstName}`;
        outputs.routeGw.textContent = vtiRem;

        outputs.sdwanSrc.textContent = srcIp;
        outputs.sdwanDst.textContent = dstIp;
        outputs.sdwanGw.textContent = `Gateway xfrm (${vtiRem})`;

        outputs.ruleName.textContent = `RULE_${srcName}_TO_${dstName}`;
        outputs.ruleSrc.textContent = `LAN | HOST_${srcName}`;
        outputs.ruleDst.textContent = `VPN | HOST_${dstName}`;

        // 2. REG File Output
        outputs.regFilename.textContent = `REG_${dstName}.reg`;
        const regContent = `Windows Registry Editor Version 5.00

[HKEY_LOCAL_MACHINE\\SOFTWARE\\WOW6432Node\\ASD S.A.\\Iris Documental ASD5\\Datos]
"Conex0"="Predeterminada"
"ConexCad0"="Provider=Microsoft.Jet.OLEDB.4.0;Data Source=C:\\\\Program Files (x86)\\\\ASD S.A.\\\\Iris Documental ASD Version\\\\Data\\\\IrisDoc5.mdb"
"Conex1"="CONEX_${dstName.toUpperCase()}"
"ConexCad1"="Driver={PostgreSQL UNICODE};Server=${dstIp};Port=${dbPortVal};Database=${dbNameVal};Uid=postgres;Pwd=postgres;"
"Conexiones"="2"
"PreConex"="1"`;

        outputs.regCodeDisplay.textContent = regContent;

        // 3. Simulator CMD Text
        outputs.simCmdText.textContent = `tracert ${dstIp}`;
    }

    // Attach Event Listeners to Inputs (input, keyup, change, paste)
    ['input', 'keyup', 'change', 'paste'].forEach(evtType => {
        Object.values(inputs).forEach(input => {
            if (input) {
                input.addEventListener(evtType, updateOutputs);
            }
        });
    });

    // Auto calculate remote VTI IP when local VTI IP is typed
    inputs.vtiIpLocal.addEventListener('input', () => {
        const val = inputs.vtiIpLocal.value.trim();
        const parts = val.split('.');
        if (parts.length === 4 && !isNaN(parts[3]) && parts[3] !== '') {
            const lastOctet = parseInt(parts[3], 10);
            if (lastOctet % 2 === 1) { // If odd (.1, .5), remote is +1 (.2, .6)
                inputs.vtiIpRemota.value = `${parts[0]}.${parts[1]}.${parts[2]}.${lastOctet + 1}`;
            } else if (lastOctet % 2 === 0 && lastOctet > 0) { // If even (.2, .6), remote is -1 (.1, .5)
                inputs.vtiIpRemota.value = `${parts[0]}.${parts[1]}.${parts[2]}.${lastOctet - 1}`;
            }
            updateOutputs();
        }
    });

    // Helper: Show Toast
    function showToast(msg) {
        toast.textContent = msg;
        toast.classList.remove('hidden');
        setTimeout(() => {
            toast.classList.add('hidden');
        }, 2500);
    }

    // Tab Switching Logic
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');

    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            tabBtns.forEach(b => b.classList.remove('active'));
            tabContents.forEach(c => c.classList.remove('active'));

            btn.classList.add('active');
            const targetTab = document.getElementById(btn.dataset.tab);
            if (targetTab) targetTab.classList.add('active');
        });
    });

    // Auto-generate random safe VTI /30 IPs
    btnGenVti.addEventListener('click', () => {
        const octet = Math.floor(Math.random() * 250) + 1;
        inputs.vtiIpLocal.value = `169.254.${octet}.1`;
        inputs.vtiIpRemota.value = `169.254.${octet}.2`;
        updateOutputs();
        showToast('IPs /30 auto-generadas');
    });

    // Preset Bogotá
    btnPresetBogota.addEventListener('click', () => {
        inputs.sedeOrigenNombre.value = 'Bogota_Centro';
        inputs.sedeOrigenIp.value = '10.2.0.223';
        inputs.sedeDestinoNombre.value = 'Bogota_Norte';
        inputs.sedeDestinoIp.value = '10.4.0.13';
        inputs.vtiIpLocal.value = '169.254.10.1';
        inputs.vtiIpRemota.value = '169.254.10.2';
        inputs.dbName.value = 'BD_PRINCIPAL';
        inputs.dbPort.value = '5432';
        updateOutputs();
        showToast('Ejemplo Bogotá cargado');
    });

    // Reset Form
    btnReset.addEventListener('click', () => {
        inputs.sedeOrigenNombre.value = '';
        inputs.sedeOrigenIp.value = '';
        inputs.sedeDestinoNombre.value = '';
        inputs.sedeDestinoIp.value = '';
        inputs.vtiIpLocal.value = '';
        inputs.vtiIpRemota.value = '';
        inputs.dbName.value = '';
        inputs.dbPort.value = '';
        updateOutputs();
        showToast('Formulario limpiado');
    });

    // Copy to Clipboard buttons
    document.querySelectorAll('.copy-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const targetId = btn.dataset.copyTarget;
            const element = document.getElementById(targetId);
            if (element) {
                navigator.clipboard.writeText(element.textContent.trim());
                showToast(`Copiado: "${element.textContent.trim()}"`);
            }
        });
    });

    // Copy REG File
    btnCopyReg.addEventListener('click', () => {
        navigator.clipboard.writeText(outputs.regCodeDisplay.textContent);
        showToast('Registro copiado al portapapeles');
    });

    // Download REG File
    btnDownloadReg.addEventListener('click', () => {
        const filename = outputs.regFilename.textContent;
        const text = outputs.regCodeDisplay.textContent;
        const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
        const url = URL.createObjectURL(blob);

        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);

        showToast(`Descargando ${filename}`);
    });

    // Run Tracert Simulator Animation
    btnRunSim.addEventListener('click', () => {
        const srcIp = inputs.sedeOrigenIp.value.trim() || '10.2.0.223';
        const dstIp = inputs.sedeDestinoIp.value.trim() || '10.4.0.13';
        const vtiRem = inputs.vtiIpRemota.value.trim() || '169.254.10.2';
        const srcName = inputs.sedeOrigenNombre.value.trim() || 'Bogota_Centro';
        const dstName = inputs.sedeDestinoNombre.value.trim() || 'Bogota_Norte';

        btnRunSim.disabled = true;
        simStatus.textContent = 'Ejecutando traza...';

        terminalOutput.innerHTML = `<p class="term-line">C:\\Users\\Administrador> <strong>tracert ${dstIp}</strong></p>
        <p class="term-line">Traza a ${dstIp} sobre caminos de 30 saltos como máximo.</p><br>`;

        const hops = [
            { num: 1, time: '<1 ms', ip: `${srcIp.split('.').slice(0,3).join('.') || '10.2.0'}.1 (Gateway Sophos ${srcName})` },
            { num: 2, time: '14 ms', ip: `${vtiRem} (Interfaz Túnel /30 VTI -> ${dstName})` },
            { num: 3, time: '15 ms', ip: `${dstIp} (Servidor BD PostgreSQL Iris Documental)` }
        ];

        let index = 0;
        const interval = setInterval(() => {
            if (index < hops.length) {
                const hop = hops[index];
                const line = document.createElement('p');
                line.className = 'term-line';
                line.innerHTML = `  ${hop.num}   ${hop.time}   ${hop.time}   ${hop.time}   <strong>${hop.ip}</strong>`;
                terminalOutput.appendChild(line);
                index++;
            } else {
                clearInterval(interval);
                const doneLine = document.createElement('p');
                doneLine.className = 'term-line term-success';
                doneLine.innerHTML = `<br>Traza completa. Conexión de red verificada hacia ${dstName} (${dstIp}).<br>Conexión PostgreSQL Puerto 5432: [OK]`;
                terminalOutput.appendChild(doneLine);

                simStatus.textContent = '✔ Traza Exitosa';
                btnRunSim.disabled = false;
            }
        }, 600);
    });

    // Initial update
    updateOutputs();
});
