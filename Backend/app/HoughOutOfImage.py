import cv2 as cv
import numpy as np
from sympy import Point, Line 
from PIL import Image

class HoughOutOfImage(object):

    def __init__(self, xStart, yStart, xEnd, yEnd, height):
        self.xStart = xStart
        self.yStart = yStart
        self.xEnd = xEnd
        self.yEnd = yEnd
        self.height = height

    def runProcess(self, image: Image):
        # Load an image
        imagesrc = image.copy()
        imagesrc = np.array(imagesrc)
        src = cv.cvtColor(imagesrc, cv.COLOR_BGR2GRAY)
        
        x = [self.yStart,self.yEnd,self.xStart,self.xEnd]  #[y_oben,y_unten,x_links,x_rechts]

        # Check if image exists
        if src is None:
            print ('Error opening image!')
            return -1

        # apply canny edge detection
        def cannyFilter(img):
            return cv.Canny(img, 50, 200, None, 3)


        # takes the furthest rightmost line and leftmost line and returns the coordinates in an array
        # returns false if there are less than 2 lines
        def getScalingFactor(lines):
            if(len(lines) < 2):
                return False
            minLine = lines[0]
            maxLine = lines[0]
            for n in range(0, len(lines)):
                line = lines[n]
                if(line[0] < minLine[0]):
                    minLine = line
                if(line[2] > maxLine[2]):
                    maxLine = line
            upperValueMinLine = minLine[2]
            lowerValueMinLine = minLine[0]
            upperValueMaxLine = maxLine[2]
            lowerValueMaxLine = maxLine[0]
            # the check below checks if the min and max line are equal to their starting values
            if((minLine == lines[0]).all() and (maxLine == lines[0]).all()):
                return False
            return (upperValueMaxLine,lowerValueMinLine,lowerValueMaxLine, upperValueMinLine)

        dst = cannyFilter(src)
        # get the Houristic HoughLines with specified metrics, parameters used are from https://docs.opencv.org/3.4/d9/db0/tutorial_hough_lines.html
        linesP = cv.HoughLinesP(dst, 1, np.pi / 180, 50, None, 50, 10)
        
        # get the dimensions of the image
        imageSize = src.shape
        # sets the valid edge bound as coordinate based on the image size, 5-10 is the range that should be used for the bounds constant based on testing
        validEdgeBound = imageSize[0]-10

        # initialize an empty array of values for the lines that are deemed valid (in the selection)
        validLines = []
        edgeLine = Line(Point(x[2], x[0]),Point(x[3],x[0]))
        # the following code block is inspired by https://docs.opencv.org/3.4/d9/db0/tutorial_hough_lines.html
        if linesP is not None:
            for i in range(0, len(linesP)):
                l = linesP[i][0]
                # check if lines are in range of image Selection, the code has to check for x coordinates below half the width 
                # and over half the width separately because of how they are handled
                if(x[2] < l[0] and x[3] > l[2]):
                    if(l[3] > validEdgeBound or l[1] > validEdgeBound):
                        if(l[1] > validEdgeBound):
                            l[1] = imageSize[0]
                        else:
                            l[3] = imageSize[0]
                        if(l[1] > l[3]):
                            #lineToCut = LineString([(l[0],l[2]), (l[1],l[3])]);
                            lineToCut = Line(Point(l[0], l[1]),Point(l[2],l[3]))
                        else:
                            #lineToCut = LineString([(l[0],l[2]), (l[3],l[1])]);
                            lineToCut = Line(Point(l[0], l[1]),Point(l[2],l[3]))
                        inter = lineToCut.intersection(edgeLine)
                        if(l[1] > l[3]):
                            l[3] = inter[0].y
                            l[2] = inter[0].x
                        else:
                            l[1] = inter[0].y
                            l[0] = inter[0].x
                        #the code snippet below can most likely be optimised out, the reason for it existing is 
                        # that the way the intersections are currently calculated causes them to be extended outside of the image selection
                        if(x[2] < l[0] and x[3] > l[2]):
                            validLines.append(l)

        # takes the selected image area and creates a new image with it
        test = imagesrc[x[0]:x[1],x[2]:x[3]]

        # calculates the scaling factor based on coordinates
        scalingFactor = getScalingFactor(validLines)
        if(scalingFactor == False):
            return -1
        multiplier = (scalingFactor[0] - scalingFactor[1]) / (scalingFactor[2] - scalingFactor[3])

        # gets the size of the original image and calculates the new dimensions based on the multiplier
        outputSize = test.shape
        height = round(outputSize[0]*multiplier)
        width = round(outputSize[1]*multiplier)
        output = cv.resize(test, (width, height))
        offset = round((scalingFactor[3]-x[2])*multiplier-scalingFactor[1])

        # creates a new image with the required dimensions based on the size of the two images
        size = output.shape[0]+imageSize[0]
        new_image = Image.new('RGB',(output.shape[1],size), (250,250,250))
        image1 = Image.fromarray(np.uint8(imagesrc))
        new_image.paste(image1,(offset,0))
        image2 = Image.fromarray(np.uint8(output))
        new_image.paste(image2,(0,image1.size[1]))
        return new_image