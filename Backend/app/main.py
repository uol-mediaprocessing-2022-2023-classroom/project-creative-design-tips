from fastapi import FastAPI, Form
from fastapi.middleware.cors import CORSMiddleware
from fastapi import FastAPI, Request, Path, Body, Query, File, UploadFile
from fastapi.responses import FileResponse
from PIL import Image, ImageFilter
from app.aiimage import AIOutOfImage
from app.HoughOutOfImage import HoughOutOfImage
import ssl
import os
from starlette.background import BackgroundTasks
import urllib.request, urllib.parse
import uuid


app = FastAPI()
ssl._create_default_https_context = ssl._create_unverified_context

# List of URLs which have access to this API
origins = [
    "*",
    "http://localhost:8080/",
    "http://127.0.0.1:8080/",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def home():
    return{"Test": "test"}

# Endpoint for retrieving a blurred version of an image
# The image is fetched from the URL in the post body and a blur is applied to it, the result is returned
@app.post("/get-blur/")
async def get_blur(background_tasks: BackgroundTasks, file: UploadFile, xStart: str = Form(...), yStart: str = Form(...), xEnd: str = Form(...), yEnd: str = Form(...)):
    img_path = 'app/bib/' + str(uuid.uuid4()) + ".png"
    contents = await file.read()

    with open(f"{img_path}", "wb") as f:
        f.write(contents)

    print('xStart: ' + xStart)
    print('yStart: ' + yStart)
    print('xEnd: ' + xEnd)
    print('yEnd: ' + yEnd)

    image = Image.open(img_path)
    cropped_image = image.crop((int(xStart), int(yStart), int(xEnd), int(yEnd)))
    blurred_image = image.filter(ImageFilter.GaussianBlur(radius=50))
    blurred_image.paste(cropped_image, (int(xStart), int(yStart), int(xEnd), int(yEnd)))

    blurred_image.save(img_path)

    # The background task runs after the File is returned completetly
    background_tasks.add_task(remove_file, img_path)
    return FileResponse(img_path)

@app.post("/get-ai-outofimage/")
async def get_ai_outofimage(background_tasks: BackgroundTasks, file: UploadFile, xStart: str = Form(...), yStart: str = Form(...), xEnd: str = Form(...), yEnd: str = Form(...), height: str = Form(...)):
    img_path = 'app/bib/' + str(uuid.uuid4()) + ".png"
    contents = await file.read()

    with open(f"{img_path}", "wb") as f:
        f.write(contents)

    print('xStart: ' + xStart)
    print('yStart: ' + yStart)
    print('xEnd: ' + xEnd)
    print('yEnd: ' + yEnd)
    print('height: ' + height)

    image = Image.open(img_path)

    ai = AIOutOfImage(int(xStart), int(yStart), int(xEnd), int(yEnd), int(height))
    hough = HoughOutOfImage(int(xStart), int(yStart), int(xEnd), int(yEnd), int(height))
    resultImage = hough.runProcess(image)
    

    resultImage.save(img_path)

    # The background task runs after the File is returned completetly
    background_tasks.add_task(remove_file, img_path)
    return FileResponse(img_path)

# Delete a file
def remove_file(path: str) -> None:
    os.unlink(path)