from fastapi import FastAPI, Form, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi import FastAPI, UploadFile
from fastapi.responses import FileResponse
from PIL import Image, ImageFilter, ImageColor
from app.aiimage import AIOutOfImage
from app.HoughOutOfImage import HoughOutOfImage
import ssl
import os
from starlette.background import BackgroundTasks
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
async def get_blur(background_tasks: BackgroundTasks, file: UploadFile, xStart: str = Form(...), yStart: str = Form(...), xEnd: str = Form(...), yEnd: str = Form(...), blur: str = Form(...), paddingWidth: str = Form(...), paddingColor: str = Form(...)):
    img_path = 'app/bib/' + str(uuid.uuid4()) + ".png"
    contents = await file.read()

    with open(f"{img_path}", "wb") as f:
        f.write(contents)

    print('xStart: ' + xStart)
    print('yStart: ' + yStart)
    print('xEnd: ' + xEnd)
    print('yEnd: ' + yEnd)

    image = Image.open(img_path)  
    color = ImageColor.getcolor(paddingColor, "RGB")
    cropped_image = image.crop((int(xStart), int(yStart), int(xEnd), int(yEnd)))

    if(int(paddingWidth) > 0):
        padded_image = add_margin(cropped_image, int(paddingWidth), int(paddingWidth), int(paddingWidth), int(paddingWidth), color)

        blurred_image = image.filter(ImageFilter.GaussianBlur(radius=int(blur)))
        blurred_image.paste(padded_image, ((int(xStart) - int(paddingWidth)), (int(yStart) - int(paddingWidth)), (int(xEnd) + int(paddingWidth)), (int(yEnd) + int(paddingWidth))))
    else:
        blurred_image = image.filter(ImageFilter.GaussianBlur(radius=int(blur)))
        blurred_image.paste(cropped_image, (int(xStart), int(yStart), int(xEnd), int(yEnd)))

    blurred_image.save(img_path)

    # The background task runs after the File is returned completetly
    background_tasks.add_task(remove_file, img_path)
    return FileResponse(img_path)

@app.post("/get-outofimage/")
async def get_ai_outofimage(background_tasks: BackgroundTasks, file: UploadFile, xStart: str = Form(...), yStart: str = Form(...), xEnd: str = Form(...), yEnd: str = Form(...), height: str = Form(...), type: str = Form(...)):
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

    if(type == 'hough_logic'):
        hough = HoughOutOfImage(int(xStart), int(yStart), int(xEnd), int(yEnd), int(height))
        resultImage = hough.runProcess(image)
        if (isinstance(resultImage, int)):
            raise HTTPException(400, detail="Das Bild enthält keine erkennbaren Objekte")
    else:
        number = type.replace("ai_", "")
        if (int(number) > 7):
            raise HTTPException(400, detail="Bitte geben Sie eine valide Network-Kennung an")

        iWidth = int(xEnd) - int(xStart)
        iHeight = int(yEnd) - int(yStart)
        
        if (iWidth != iHeight):
            raise HTTPException(400, detail="Das angegebene Bild muss quadratisch sein")

        if (iWidth < 512):
            raise HTTPException(400, detail="Das angegebene Bild muss mindestens 512x512 Pixel groß sein")
        ai = AIOutOfImage('app/networks/network' + number + '.hdf5', int(xStart), int(yStart), int(xEnd), int(yEnd), int(height))
        resultImage = ai.runProcess(image)
        if (isinstance(resultImage, int)):
            raise HTTPException(400, detail="Das Bild enthält keine erkennbaren Objekte")
    

    resultImage.save(img_path)

    # The background task runs after the File is returned completetly
    background_tasks.add_task(remove_file, img_path)
    return FileResponse(img_path)

# Delete a file
def remove_file(path: str) -> None:
    os.unlink(path)

# Add margin to a picture
# source: https://note.nkmk.me/en/python-pillow-add-margin-expand-canvas/
def add_margin(pil_img, top, right, bottom, left, color):
    width, height = pil_img.size
    new_width = width + right + left
    new_height = height + top + bottom
    result = Image.new(pil_img.mode, (new_width, new_height), color)
    result.paste(pil_img, (left, top))
    return result