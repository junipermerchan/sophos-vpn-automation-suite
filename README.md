# Sophos VPN & Registry Automation Suite | SNR

Una suite web interactiva diseñada para automatizar el enrutamiento VPN Route-Based (VTI /30), la generación de objetos IP, reglas de firewall para Sophos SFOS y la creación/exportación del archivo de registro `.reg` para el aplicativo **IRIS DOCUMENTAL** (Superintendencia de Notariado y Registro).

![Sophos VPN Automation Suite](https://img.shields.io/badge/Sophos-SFOS_v18%2Fv19%2Fv20-blue?style=for-the-badge&logo=sophos)
![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)

---

## 🌟 Características Principales

- ⚡ **Generador de Parámetros Dinámico:** Configura sedes de origen/destino y sus direcciones IP.
- 🔒 **Soporte Oficial VTI /30:** Auto-generación y cálculo de direcciones IP de túnel punto a punto (`/30`).
- 📖 **Guía Integrada Sophos SFOS:** Genera el paso a paso exacto para Objetos IP, Túnel IPsec, Rutas Estáticas con Gateway `/30`, Rutas SD-WAN y Reglas de Firewall.
- 📄 **Generador & Descargador de Archivo `.reg`:** Crea en tiempo real y descarga el archivo `.reg` listo para ejecutar en las computadoras clientes para actualizar la conexión PostgreSQL de **IRIS DOCUMENTAL**.
- 🖥️ **Simulador Interactivo Tracert:** Simulación visual del comando `tracert` para verificar la conectividad por saltos de red.

---

## 🚀 Uso Rápido

### Ejecución Local
Simplemente abre el archivo `index.html` en cualquier navegador web o ejecuta un servidor web simple:

```bash
# Con Python
python3 -m http.server 8085
```

Luego accede en tu navegador a `http://localhost:8085`.

---

## 📂 Estructura del Proyecto

```
.
├── index.html     # Interfaz de usuario interactiva y componentes UI
├── styles.css     # Estilos CSS modernos (Dark Theme & Glassmorphism)
├── app.js         # Lógica de cálculo, generador de .REG y simulador
└── README.md      # Documentación del repositorio
```

---

## 📄 Licencia

Este proyecto está bajo la Licencia MIT.
