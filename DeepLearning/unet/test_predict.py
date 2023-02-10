from unet import *
from data import *

mydata = dataProcess(512,512)

imgs_test = mydata.load_test_data('pipeline/test.tif')

myunet = myUnet(1)

model = myunet.get_unet()

model.load_weights('working-networks/sample14-nightly.hdf5')

imgs_mask_test = model.predict(imgs_test, verbose=1)

np.save('imgs_mask_test.npy', imgs_mask_test)

imgs = np.load('imgs_mask_test.npy')
for i in range(imgs.shape[0]):
    img = imgs[i]

    img = array_to_img(img)
    img.save("test-predict/%d.jpg"%(i))