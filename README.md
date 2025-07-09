# Patientenversand Portal

Dieses Portal ermöglicht es Ärzten und anderen medizinischen Leistungserbringern, Patientendaten sicher und direkt an Patienten zu senden. Das System wurde von erfahrenen Experten entwickelt und bietet eine einfache, sichere und DSGVO-konforme Lösung für den Austausch medizinischer Dokumente.

## Für Ärzte

### Kurze Erklärung des Portals

Das Patientenversand Portal ist ein sicherer Weg, um Patientendaten direkt an Patienten zu übermitteln. Die Besonderheit liegt darin, dass Ärzte keine eigenen Konten erstellen oder sich um komplexe technische Details kümmern müssen – der Patient hat bereits alles vorbereitet, einschließlich einer unterschriebenen Einwilligung für Ihre Dokumentation.

**So funktioniert es:**

- Der Patient schickt Ihnen einen Link zu seinem persönlichen Portal
- Sie können direkt und sicher Dateien bis zu 50 MB hochladen (Befunde, Rezepte, medizinische Berichte)
- Die Dateien werden direkt über eine gesicherte Verbindung (HTTPS) an das Portal des Patienten übertragen
- Die Sicherheit der Übertragung ist durch eine starke TLS-Verschlüsselung gewährleistet

Das Portal verfolgt keine kommerziellen Interessen und ist kostenfrei nutzbar.

## Für Patienten

### Anleitung zum Self-Hosting

Um Ihr eigenes Patientenversand Portal zu betreiben, folgen Sie diesen Schritten:

**Voraussetzungen:**

- Ein eigener Server oder Webhosting-Anbieter
- Grundkenntnisse in der Webserver-Administration
- SSL-Zertifikat für HTTPS-Verbindungen

**Installation:**

1. Laden Sie den Quellcode von [GitHub](https://github.com/lehmannerich/patientenversand) herunter
2. Laden Sie alle Dateien auf Ihren Webserver hoch
3. Konfigurieren Sie Ihren Webserver für HTTPS
4. Passen Sie die Konfigurationsdateien an Ihre Bedürfnisse an
5. Testen Sie die Upload-Funktionalität

**Wichtige Hinweise:**

- Stellen Sie sicher, dass Ihr Server die aktuellen Sicherheitsstandards erfüllt
- Führen Sie regelmäßige Backups durch
- Überprüfen Sie die Logs regelmäßig auf ungewöhnliche Aktivitäten

## Für Datenschützer

### Kurze Erklärung zur Architektur und Link zum Compliance Hub

Das Patientenversand Portal wurde mit Fokus auf Datenschutz und Sicherheit entwickelt:

**Architektur-Highlights:**

**Architektur-Highlights:**

- Starke Transportverschlüsselung (TLS 1.2+) für die gesamte Datenübertragung
- Verschlüsselung der Daten im Ruhezustand (Encryption-at-Rest) durch den Cloud-Anbieter
- Sofortige Löschung der Datei vom Webserver nach erfolgreicher Weiterleitung an den finalen Speicherort (Vercel Blob Storage)
- Minimale Datenverarbeitung und -speicherung
- Transparente Open-Source-Implementierung

**Datenschutz-Prinzipien:**

- Privacy by Design
- Datenminimierung
- Zweckbindung
- Transparenz

**Vollständige Compliance-Informationen:**
Alle rechtlichen Informationen, technischen Details zur Softwarearchitektur, DSGVO-Konformität und Sicherheitsmaßnahmen finden Sie übersichtlich zusammengefasst im [Compliance-Bereich](compliance.html) des Portals.

Der komplette Quellcode ist transparent einsehbar unter: [https://github.com/lehmannerich/patientenversand](https://github.com/lehmannerich/patientenversand)
