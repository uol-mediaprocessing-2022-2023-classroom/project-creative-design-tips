# DeepLearning
Der Bereich DeepLearning besteht aus zwei Bereichen, einerseits die Datasets (Bild-Daten mit Trains- und Testdaten) und andererseits dem unet, welches die grundlegenden Dateien für das neuronale Netzwerk (U-Net) enthält und auf dem Projekt unet von zhixuhao (https://github.com/zhixuhao/unet) basiert.

## Setup
1. Python wird benötigt und kann hier heruntergeladen werden: https://www.python.org/downloads/ (wir nutzen Python 3.10)
2. Bei der Installation kann den Schritten vom Backend gefolgt werden, diese sollten das Netz bereits fertig aufsetzen.
3. ggf. muss noch OpenCV installiert werden

## Anwendungen

### U-Net anlernen
1. Ordner results im Ordner unet erstellen
2. Sichergehen, dass der Ordner keine Unterordner enthält
3. Kommando ausführen, ggf. Anpassungen in der unet.py hinsichtlich Epochen etc. vornehmen
```
python3 unet.py
```
4. Das unet wird nach jeder Epoche automatisch ein neues Netz anlernen

### Ausgabe testen
1. Ordner pipeline im Ordner unet erstellen
2. Kommando ausführen, ggf. Anpassungen in der pipeline.py hinsichtlich des zu verwendenen Unets und der Grunddatei vornehmen
```
python3 pipeline.py
```
3. Das Endresultat wird im Ordner pipeline unter result.png gespeichert

### Maske testen
1. Ordner test-predict im Ordner unet erstellen
2. Kommando ausführen, ggf. Anpassungen in der test_predict.py hinsichtlich des zu verwendenen Unets vornehmen
```
python3 test_predict.py
```
3. Das Endresultat wird im Ordner test-predict für alle Test-Bilder gespeichert

## Test-Daten
Die Test-Daten im Ordner datasets enthalten sowohl die Original-Datein, als auch die Basis-Datein (GIMP .xcf-Datein) und die entsprechenden Labels sowie Bilder als .tif Datei, welche aus der .xcf-Datei entstehen.

Die Daten kommen von folgenden Bilder-Bibliotheken:
- https://unsplash.com/
- https://pixabay.com/

## Erstellte Netzwerke
Für die Bearbeitung der Aufgaben wurden unzählige Netzwerke erarbeitet. Diese wurden bereits sortiert und unbrauchbare Netze (Nur schwraz/weiß Bilder) aussortiert.

Alle Netze, sowie die für die Anwendung relevanten Netze (Used-Networks Unterordner) finden sich unter folgendem Link:
https://cloud.uni-oldenburg.de/s/azTfazyGeJTw2ga
