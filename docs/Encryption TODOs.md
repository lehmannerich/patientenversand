### Implementierungs-Roadmap (Gold-Standard)

#### Phase 1: Schlüsselmanagement für den Patienten (Das Fundament)

Ziel: Dir als Patient ermöglichen, ein Schlüsselpaar zu erstellen und es in einer portablen, passwortgeschützten Keystore-Datei zu sichern.

**1.1. Erstelle `setup.html` & `setup.js`**

- **`setup.html`:** Eine neue, einfache Seite, die Folgendes enthält:
  - Ein `<input type="password">` für dein Master-Passwort (mit Bestätigungsfeld).
  - Einen `<button>` "Schlüsselpaar generieren & Keystore herunterladen".
  - Ein Status-`<p>`-Tag für Feedback und klare Anweisungen (z.B. "Bewahren Sie diese Datei und Ihr Passwort sicher auf!").
- **`setup.js`:** Ein neues JavaScript-File, das in `setup.html` eingebunden wird.

**1.2. Implementiere die Schlüsselgenerierung in `setup.js`**

- **Bei Button-Klick:**
  1.  **Passwörter validieren:** Stelle sicher, dass das Passwort nicht leer ist und die Bestätigung übereinstimmt.
  2.  **Schlüsselpaar generieren:** Nutze `window.crypto.subtle.generateKey` für `RSA-OAEP` (4096 Bit, SHA-256), wie zuvor besprochen.
  3.  **Privaten Schlüssel für die Verschlüsselung vorbereiten:**
      - Leite einen starken Verschlüsselungsschlüssel (`AES-GCM`, 256 Bit) aus deinem Master-Passwort ab. Nutze hierfür `PBKDF2`. Generiere ein zufälliges `salt` (16 Bytes) – dieses wird für die Entschlüsselung benötigt.
        ```javascript
        // Snippet: Schlüssel aus Passwort ableiten
        const salt = window.crypto.getRandomValues(new Uint8Array(16));
        const masterKey = await window.crypto.subtle.deriveKey(
          { name: "PBKDF2", salt, iterations: 250000, hash: "SHA-256" },
          /* importiertes Passwort-Key-Material */,
          { name: "AES-GCM", length: 256 },
          false, ["encrypt", "decrypt"]
        );
        ```
  4.  **Privaten Schlüssel exportieren & verschlüsseln:**
      - Exportiere den `privateKey` (`pkcs8`).
      - Verschlüssele den exportierten `privateKey` mit dem abgeleiteten `masterKey`. Generiere hierfür einen zufälligen `iv` (12 Bytes).
  5.  **Keystore-JSON erstellen:** Bündle alle notwendigen Informationen in einem JSON-Objekt. Alles, was nicht geheim ist, wird im Klartext gespeichert, der Rest als Base64-String.
      ```json
      // Snippet: Die Keystore-Datei-Struktur
      {
        "version": 1,
        "crypto": {
          "cipher": "aes-256-gcm", // Info über Verschlüsselung des priv. Schlüssels
          "kdf": "pbkdf2",
          "kdfparams": {
            "iterations": 250000,
            "hash": "sha-256",
            "salt": "BASE64_VOM_SALT..."
          },
          "ciphertext": "BASE64_VOM_VERSCHLUESSELTEN_PRIVATEN_SCHLUESSEL...",
          "iv": "BASE64_VOM_IV..."
        },
        "publicKey": {
          "algorithm": "rsa-oaep-4096",
          "data": "BASE64_VOM_OEFFENTLICHEN_SCHLUESSEL..."
        }
      }
      ```
  6.  **Keystore-Datei zum Download anbieten:** Wandle das JSON-Objekt in einen `Blob` um und löse den Download aus (z.B. als `patienten-keystore.json`).
  7.  **Öffentlichen Schlüssel an API senden:** Nimm den `publicKey.data` (Base64) aus dem JSON und sende ihn per `POST` an `/api/public-key`.

---

#### Phase 2: Server-Anpassungen (Die Brücke) - ✅ DONE

Diese Phase bleibt unverändert und einfach.

**2.1. Erstelle die API-Route `api/public-key.js` - ✅ DONE**

- **`POST`-Handler:** Empfängt den Base64-kodierten öffentlichen Schlüssel und speichert ihn (z.B. in Vercel KV).
- **`GET`-Handler:** Liest den öffentlichen Schlüssel aus dem Speicher und liefert ihn an den Arzt-Client aus.

**2.2. Passe `api/upload.js` an - ✅ DONE (No changes needed)**

- Die Funktion bleibt simpel, da sie nur noch eine einzelne, verschlüsselte Datei empfängt und im Vercel Blob Storage ablegt.

---

#### Phase 3: Arzt-seitiger Upload (Der magische Teil)

Diese Phase bleibt ebenfalls unverändert zum vorherigen Plan der asymmetrischen Kryptografie.

**3.1. Passe `erichlehmann.html` & `app.js` an**

- Der `sendBtn` Event-Listener in `app.js` implementiert den hybriden Verschlüsselungs-Workflow:
  1.  `fetch('/api/public-key')` & `importKey`.
  2.  Dateien mit `JSZip` packen.
  3.  Temporären `AES-GCM` Sitzungsschlüssel generieren.
  4.  ZIP-Daten mit dem AES-Schlüssel verschlüsseln.
  5.  AES-Schlüssel mit dem öffentlichen `RSA-OAEP` Schlüssel verschlüsseln ("wrappen").
  6.  Ein Paket aus `[verschlüsselter AES-Schlüssel, AES-IV, verschlüsselte Daten]` schnüren.
  7.  Dieses eine Paket an `/api/upload` senden.

---

#### Phase 4: Patient-seitige Entschlüsselung (Der Lohn der Arbeit)

Ziel: Dir ermöglichen, mit deiner Keystore-Datei und deinem Passwort die Daten zu entschlüsseln.

**4.1. Erstelle `decrypt.html` & `decrypt.js`**

- **`decrypt.html`:** Die UI benötigt:
  - Ein `<input type="file">` für die verschlüsselte Datendatei (`.zip.enc`).
  - Ein `<input type="file">` für deine Keystore-Datei (`.json`).
  - Ein `<input type="password">` für dein Master-Passwort.
  - Einen `<button>` "Entschlüsseln".
  - Ein `<div>` für die entschlüsselten Download-Links.

**4.2. Implementiere die Entschlüsselungslogik in `decrypt.js`**

- **Bei Klick auf "Entschlüsseln":**
  1.  **Dateien und Passwort einlesen:** Hole die Datendatei, die Keystore-Datei und das Passwort aus den Inputs.
  2.  **Keystore parsen:** Lese die Keystore-Datei als Text und parse sie mit `JSON.parse()`. Extrahiere alle Krypto-Parameter (`salt`, `iv`, `ciphertext`, etc.).
  3.  **Master-Schlüssel ableiten:** Leite mit dem eingegebenen Passwort und dem `salt` aus der Keystore-Datei den `masterKey` ab (mit `PBKDF2`, denselben Parametern wie bei der Erstellung).
  4.  **Privaten Schlüssel entschlüsseln:** Nutze den `masterKey` und den `iv` aus der Keystore-Datei, um den `ciphertext` (deinen privaten Schlüssel) zu entschlüsseln (`AES-GCM decrypt`).
  5.  **Privaten Schlüssel importieren:** Importiere den nun entschlüsselten privaten Schlüssel (`pkcs8`, `RSA-OAEP`).
  6.  **Datendatei parsen:** Lese die `.zip.enc`-Datei und trenne sie in ihre Bestandteile (verschlüsselter AES-Schlüssel, AES-IV, verschlüsselte Daten).
  7.  **Sitzungsschlüssel entschlüsseln:** Nutze deinen importierten **privaten Schlüssel**, um den verschlüsselten AES-Sitzungsschlüssel zu entschlüsseln (`RSA-OAEP decrypt`).
  8.  **Daten entschlüsseln:** Nutze den nun entschlüsselten AES-Sitzungsschlüssel und den AES-IV, um die Haupt-ZIP-Daten zu entschlüsseln.
  9.  **ZIP-Inhalte anzeigen:** Lade den resultierenden `zipBlob` mit `JSZip` und zeige die enthaltenen Dateien als individuelle Download-Links an.

---

#### Phase 5: Text-Anpassungen

Diese Phase ist entscheidend für das Vertrauen der Nutzer.

**5.1. Passe `index.html`, `README.md`, `compliance.html` an.**

- Entferne Verweise auf "passwortgeschützte ZIPs".
- Beschreibe präzise die neue **Ende-zu-Ende-Verschlüsselung** mit einem hybriden Verfahren.
- Betone das **Zero-Knowledge-Prinzip** deines Servers.
- Erkläre im README, wie ein Patient seine eigene Instanz aufsetzt, inklusive der Notwendigkeit, `setup.html` einmalig auszuführen.

Dieser Plan gibt dir eine solide, sichere und zukunftsfähige Architektur. Du hast die volle Kontrolle, ohne die Nachteile der manuellen Schlüsselverwaltung. Viel Erfolg bei der Umsetzung
