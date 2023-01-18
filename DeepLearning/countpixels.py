# importing libraries 
import cv2 
import numpy as np
from pathlib import Path
  
# reading the image data from desired directory

number_of_white_pix = 0
number_of_black_pix = 0

pathlist = Path('datasets/train/label').glob('**/*.tif')
for path in pathlist:
    # because path is object not string
    path_in_str = str(path)

    img = cv2.imread(path_in_str) 
    cv2.imshow('Image',img) 
  
    # counting the number of pixels 
    number_of_white_pix += np.sum(img == 255) 
    number_of_black_pix += np.sum(img == 0) 
  
print('Number of white pixels:', number_of_white_pix) 
print('Number of black pixels:', number_of_black_pix)

factor = number_of_white_pix / number_of_black_pix

print('Factor: ', factor)