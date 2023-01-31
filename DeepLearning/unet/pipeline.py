from unet import *
from data import *
from PIL import Image

mydata = dataProcess(512,512)

originalImage = load_img(os.path.realpath("../datasets/test/image/5.tif"))
originalImageArray = img_to_array(originalImage)

imgdatas = np.ndarray((1,512,512,3), dtype=np.uint8)
imgdatas[0] = originalImageArray

imgdatas = imgdatas.astype('float32')
imgdatas /= 255

myunet = myUnet(1)

model = myunet.get_unet()

model.load_weights('results/2/unet.hdf5')

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
original = Image.fromarray(originalImageArray.astype("uint8"), "RGB")
original = original.convert('RGBA')

original = Image.composite(original, image, image)

original.save("pipeline/0.png")