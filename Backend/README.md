# Backend
Das Backend basiert grundlegend auf der vorgestellten Demo

## Setup
1. Python wird benötigt und kann hier heruntergeladen werden: https://www.python.org/downloads/ (Python 3.10 wird empfohlen, zum jetzigen Zeitpunkt unterstürtzen neure Versionen tensorflow nicht, auch relevant für uvicorn)
2. Führe diesen Befehlt in der Konsole aus:
```
pip install -r .\requirements.txt
```

## Starten der App
```
uvicorn app.main:app --reload
```

## Bei Problemen mit Pillow
Überprüfen, ob es ggf. an der alten Pillow-Version liegt, ggf. auf Fork umsteigen ( https://pillow.readthedocs.io/en/stable/installation.html )

## Zum Backend
<p>Die Anwendung dient als ein simples Python basiertes Backend für die Webapp.</p>
<p>Die Endpoints ("/get-blur") und ("/get-outofimage") generieren aus einem Inputbild und Parametern ein neues Bild und antworten mit dem bearbeitetem Bild.</p>

## Endpoint /get-blur
Der Endpoint ("/get-blur") bietet die Methode Bild-im-Bild an und verlangt folgende Parameter:
file: Inputbild
xStart: Start-X-Koordinate der vom Nutzer ausgewählten Fläche
yStart: Start-Y-Koordinate der vom Nutzer ausgewählten Fläche
xEnd: End-X-Koordinate der vom Nutzer ausgewählten Fläche
yEnd: End-Y-Koordinate der vom Nutzer ausgewählten Fläche
blur: Radius des anzuwendenen Gaussian Blurs
paddingWidth: Breite des Rahmens zwischen Auswahl und Hintergrund
paddingColor: Farbe des Rahmens zwischen Auswahl und Hintergrund

## Endpoint /get-outofimage
Der Endpoint ("/get-outofimage") bietet die Methode Out-of-Image an und verlangt folgende Parameter:
file: Inputbild
xStart: Start-X-Koordinate der vom Nutzer ausgewählten Fläche
yStart: Start-Y-Koordinate der vom Nutzer ausgewählten Fläche
xEnd: End-X-Koordinate der vom Nutzer ausgewählten Fläche
yEnd: End-Y-Koordinate der vom Nutzer ausgewählten Fläche
height: Höhe zur Eingrenzung des Bildabschnittes, welcher zur Erweiterung des Inputbildes mit dem KI-Ansatz verwendet wird
type: 'hough_logic' oder 'ai_X' (X ist hier Nummer des genutzen unets) / Gibt an, welche Logik zur Erweiterung des Inputbildes angewandt wird

## unets
Die trainierten Netze sind aufgrund von Dateigrößen nicht im Repository zu finden.
Vortrainierte Netze sind unter https://cloud.uni-oldenburg.de/s/azTfazyGeJTw2ga zu finden, diese müssen zur Nutzung unter DeepLearning/unet/data hinterlegt werden.
