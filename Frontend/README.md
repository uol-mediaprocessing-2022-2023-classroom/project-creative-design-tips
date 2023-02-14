# 🚀 Welcome to your new awesome project!

This project has been created using **webpack-cli**.

# Frontend Demo

## Setup

1. Zuerst muss Node.js installiert werden, für Windows kann ein Installer genutzt werden: https://nodejs.org/en/download/
2. Jetzt können die Dependencies installiert werden: ```npm install```
3. Im nächsten Schritt muss das Projekt gebaut werden ```npm run build```


## Compile und Start
```npm run serve```<br><br>
Nach dem starten kann man auf die Seite über localhost zugreifen.<br>

<br>

## Zu der App
<p>Um die App zu Nutzen ist ein CEWE myPhotos Konto notwendig (https://www.cewe-myphotos.com/en-gb/). In den Feldern 'Username' und 'Password' der App müssen der Nutzername sowie das Passwort des CEWE Kontos eingetragen werden, danach können die Fotos von dem Konto mithilfe von 'Load Images' in die App geladen werden.</p>
<p>Der "Bild auswählen" Button öffnet ein Modal "Bilder-Auswahl" in welchem man ein Bild auswählen kann. Das Modal enthält Bilder aus dem CEWE myPhotos Konto. In dem Modal gibt es zusätzlich Buttons zum Aktuallisieren der Bilder, zum Laden von mehr Bildern und zum Schließen des Modals.</p><br>
<p>Im der Navbar kann zwischen den Methoden "Bild im Bild" und "Out of Image" gewechselt werden.</p><br>
<p>Der "Einstellungen anpassen" Button öffnet das Modal "Einstellungen". In diesem können Parameter welche spezifisch zu dem ausgewählten Vorgang sind angegeben werden. Für "Bild im Bild" sind dies die Rahmenfarbe, die Rahmendicke und die Stärke des Weichzeichners. Für "Out of image" kann die Methode für den Vorgang gewählt werden, ob es eine Vorschau geben soll, und die Untergrenze im Bild kann angegeben werden.</p><br>
<p>Der "Effekt Anwenden" Button sendet eine Anfrage, die ein ausgewähltes Bild beinthaltet sowie Informationen über den gewählten Vorgang und Parameter enthält, an das lokale Backend und wartet auf eine Antwort.</p><br>
