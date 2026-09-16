# Sophos VPN & Registry Automation Suite

> 🚀 **[¡HAGA CLIC AQUÍ PARA EJECUTAR LA APLICACIÓN EN VIVO!](https://junipermerchan.github.io/sophos-vpn-automation-suite/)**

Una suite web interactiva diseñada para automatizar el enrutamiento VPN Route-Based (VTI /30), la generación de objetos IP, reglas de firewall para Sophos SFOS y la creación/exportación del archivo de registro `.reg` para el aplicativo **IRIS DOCUMENTAL**.

[![Ejecutar en Vivo](https://img.shields.io/badge/▶_EJECUTAR_EN_VIVO-GitHub_Pages-22c55e?style=for-the-badge&logo=github)](https://junipermerchan.github.io/sophos-vpn-automation-suite/)
![Sophos](https://img.shields.io/badge/Sophos-SFOS_v18%2Fv19%2Fv20-blue?style=for-the-badge&logo=sophos)
![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)

---

## 🔗 Enlaces Rápidos

- 🌐 **Aplicación Web en Vivo:** [https://junipermerchan.github.io/sophos-vpn-automation-suite/](https://junipermerchan.github.io/sophos-vpn-automation-suite/)
- 📁 **Código Fuente GitHub:** [https://github.com/junipermerchan/sophos-vpn-automation-suite](https://github.com/junipermerchan/sophos-vpn-automation-suite)

---

## 🌟 Características Principales

- ⚡ **Generador de Parámetros Dinámico:** Configura sedes de origen/destino y sus direcciones IP.
- 🔒 **Soporte Oficial VTI /30:** Auto-generación y cálculo de direcciones IP de túnel punto a punto (`/30`).
- 📖 **Guía Integrada Sophos SFOS:** Genera el paso a paso exacto para Objetos IP, Túnel IPsec, Rutas Estáticas con Gateway `/30`, Rutas SD-WAN y Reglas de Firewall.
- 📄 **Generador & Descargador de Archivo `.reg`:** Crea en tiempo real y descarga el archivo `.reg` listo para ejecutar en las computadoras clientes para actualizar la conexión PostgreSQL de **IRIS DOCUMENTAL**.
- 🖥️ **Simulador Interactivo Tracert:** Simulación visual del comando `tracert` para verificar la conectividad por saltos de red.

---

## 🚀 Uso Rápido en Servidor Local

Si prefieres ejecutarlo localmente:

```bash
# Servidor local con Python
python3 -m http.server 8085
```
Luego abre `http://localhost:8085` en tu navegador.

---

## 📄 Licencia

Este proyecto está bajo la Licencia MIT.
