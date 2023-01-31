from unet import *
from data import *
from PIL import Image
import math

xStart = 300
yStart = 0
xEnd = 1500
yEnd = 1200
height = 150

area = (xStart, yStart, xEnd, yEnd)
size = max((xEnd - xStart), (yEnd - yStart))

mydata = dataProcess(512,512)

originalImage = Image.open("../datasets/original/testdata/11.jpg")
cropped_img = originalImage.crop(area)
cropped_img.save("pipeline/base.png")
sized_cropped = cropped_img.copy()
sized_cropped.thumbnail((512,512), Image.ANTIALIAS)
originalImageArray = img_to_array(sized_cropped)
originalImageArrayNonCropped = img_to_array(cropped_img)

imgdatas = np.ndarray((1,512,512,3), dtype=np.uint8)
imgdatas[0] = originalImageArray

imgdatas = imgdatas.astype('float32')
imgdatas /= 255

myunet = myUnet(1)

model = myunet.get_unet()

model.load_weights('unet.hdf5')

imgs_mask = model.predict(imgdatas, verbose=1)

img = imgs_mask[0]
img = img.astype('float32')
imgArrNew = img.copy()

imgArrNew[img > 0.59] = 0
imgArrNew[img <= 0.59] = 1

img = (imgArrNew * 255).round().astype(np.uint8)

image = Image.fromarray(img[:, :, 0].astype("uint8"), "L")

imgArray = np.asarray(image.convert('RGBA')).copy()

imgArray[:, :, 3] = (255 * (imgArray[:, :, :3] != 0).any(axis=2)).astype(np.uint8)

image = Image.fromarray(imgArray)
image = image.resize((size, size), Image.Resampling.NEAREST);
image.save("pipeline/mask.png")
original = Image.fromarray(originalImageArrayNonCropped.astype("uint8"), "RGB")
original = original.convert('RGBA')

pathway = Image.composite(original, image, image)

pathway.save("pipeline/pathway.png")

pixelsArray = img_to_array(pathway)
pixelsCountTop = 0
pixelsCountBottom = 0
firstPositionBottom = -1
for i in range(0, size):
    if pixelsArray[(size - height), i][3] > 0.0:
        pixelsCountTop = pixelsCountTop + 1
    if pixelsArray[(size - 1), i][3] > 0.0:
        pixelsCountBottom = pixelsCountBottom + 1
        if firstPositionBottom < 0:
            firstPositionBottom = i
print(pixelsCountTop)
print(pixelsCountBottom)

resizefactor = pixelsCountBottom / pixelsCountTop
print(resizefactor)
newSize = math.ceil(size * resizefactor)
newHeight = math.ceil(height * resizefactor)

pathway = pathway.resize((newSize, newSize), Image.Resampling.BICUBIC)

pixelsArrayNew = img_to_array(pathway)
firstPositionNew = -1
for i in range(0, newSize):
    if pixelsArrayNew[(newSize - newHeight), i][3] > 0.0:
        if firstPositionNew < 0:
            firstPositionNew = i
print(firstPositionNew)

startPosition = firstPositionBottom - firstPositionNew
print(newSize)
print(startPosition)

new_im = Image.new('RGB', (size, size + (height)))

new_im.paste(pathway, (startPosition, size - (newSize - newHeight)))
new_im.paste(original, (0, 0))

new_im.save("pipeline/result.png")