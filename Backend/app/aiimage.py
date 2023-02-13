from app.unet import *
from tensorflow.keras.utils import array_to_img, img_to_array
from PIL import Image
import math

#xStart = 300
#yStart = 0
#xEnd = 1500
#yEnd = 1200
#height = 150

class AIOutOfImage(object):

	def __init__(self, network, xStart, yStart, xEnd, yEnd, height):

		self.xStart = xStart
		self.yStart = yStart
		self.xEnd = xEnd
		self.yEnd = yEnd
		self.height = height
		self.network = network

	def runProcess(self, image: Image):

		area = (self.xStart, self.yStart, self.xEnd, self.yEnd)
		size = max((self.xEnd - self.xStart), (self.yEnd - self.yStart))

		originalImage = image.copy()
		croppedImage = originalImage.crop(area)
		sizedCroppedImage = croppedImage.copy()
		sizedCroppedImage.thumbnail((512,512), Image.ANTIALIAS)
		originalImageArray = img_to_array(sizedCroppedImage)
		originalImageArrayNonCropped = img_to_array(croppedImage)

		imgdatas = np.ndarray((1,512,512,3), dtype=np.uint8)
		imgdatas[0] = originalImageArray

		imgdatas = imgdatas.astype('float32')
		imgdatas /= 255

		myunet = myUnet(1)

		model = myunet.get_unet()

		model.load_weights(self.network)

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
		image = image.resize((size, size), Image.Resampling.NEAREST)
		original = Image.fromarray(originalImageArrayNonCropped.astype("uint8"), "RGB")
		original = original.convert('RGBA')

		pathway = Image.composite(original, image, image)

		pixelsArray = img_to_array(pathway)
		pixelsCountTop = 0
		pixelsCountBottom = 0
		firstPositionBottom = -1
		for i in range(0, size):
			if pixelsArray[(size - self.height), i][3] > 0.0:
				pixelsCountTop = pixelsCountTop + 1
			if pixelsArray[(size - 1), i][3] > 0.0:
				pixelsCountBottom = pixelsCountBottom + 1
				if firstPositionBottom < 0:
					firstPositionBottom = i

		resizefactor = pixelsCountBottom / pixelsCountTop
		newSize = math.ceil(size * resizefactor)
		newHeight = math.ceil(self.height * resizefactor)

		pathway = pathway.resize((newSize, newSize), Image.Resampling.BICUBIC)

		pixelsArrayNew = img_to_array(pathway)
		firstPositionNew = -1
		for i in range(0, newSize):
			if pixelsArrayNew[(newSize - newHeight), i][3] > 0.0:
				if firstPositionNew < 0:
					firstPositionNew = i

		startPosition = firstPositionBottom - firstPositionNew

		resultImage = Image.new('RGBA', (size, size + (self.height)))

		resultImage.paste(pathway, (startPosition, size - (newSize - newHeight)))
		resultImage.paste(original, (0, 0))

		return resultImage