# PokéVault – Pokémon Collection PWA

App statica gratuita per iPhone: ricerca catalogo Pokémon, scansione foto OCR sperimentale, quantità/condizioni/varianti, prezzi indicativi Cardmarket forniti da TCGdex, backup JSON/CSV, supporto offline parziale.

## Pubblicazione gratuita su GitHub Pages

1. Crea su GitHub un nuovo repository pubblico (per esempio `pokevault`).
2. Carica **tutti i file della cartella** nella radice del repository (non il file ZIP).
3. Apri **Settings → Pages → Build and deployment**, scegli **Deploy from a branch**, `main`, `/(root)`, quindi **Save**.
4. La URL sarà `https://TUO-USERNAME.github.io/pokevault/` (il nome dipende dal repository).
5. Su iPhone apri la URL in **Safari**, premi **Condividi → Aggiungi alla schermata Home**.

## Limitazioni e sicurezza

- Le scansioni non hanno un limite artificiale, ma l'OCR Tesseract.js può sbagliare (specie carta inclinata, riflessi e nomi stilizzati). Conferma sempre la carta esatta.
- I prezzi TCGdex/Cardmarket non sono garantiti e non considerano automaticamente lingua, prima edizione, condizione, variante o vendite completate. Se manca un prezzo viene visualizzato come non disponibile.
- I dati sono conservati solo nel browser con localStorage: **esporta regolarmente un backup**. Non sincronizza tra dispositivi e la cancellazione dei dati del sito può eliminare il catalogo.
- Il riconoscimento OCR può scaricare asset esterni da CDN e richiede una connessione la prima volta.
- Non caricare nel repository file personali o export della collezione.

Fonte catalogo: https://tcgdex.dev/it ; dati e immagini copyright dei rispettivi proprietari.
