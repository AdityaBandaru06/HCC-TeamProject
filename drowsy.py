from scipy.spatial import distance
from imutils.video import VideoStream
from imutils import face_utils
import argparse
import imutils
import dlib
import sys
import cv2
import time

#calculating eye aspect ration
def eye_aspect_ratio(eye):
  A = distance.euclidean(eye[1], eye[5])
  B = distance.euclidean(eye[2], eye[4])  
  C = distance.euclidean(eye[0], eye[3])
  ear = (A+B) / (2.0 * C)
  return ear

#start video stream
def start_video_stream(arg):
  vs =VideoStream(src=arg).start()
  return vs

#executed when python shell is executed
ap = argparse.ArgumentParser()
ap.add_argument("-p", "--shape-predictor", help = "path to facial landmark predictor")
ap.add_argument("-w", "--webcam", type=int, default=0, help="index of webcam on system")
ap.add_argument("-s", "--stop", type=str, default='start', help="index of webcam on system")
args = vars(ap.parse_args())

if args['stop']== 'start':
  #eye aspect ration threshold
  EYE_AR_THRESH = 0.3
  #eye aspect ration in max consecutive frames
  COUNTER = 0
  TOTAL = 0
  #max number of consecutive frames
  EYE_AR_CONSEC_FRAMES = 48

  detector = dlib.get_frontal_face_detector()
  predictor = dlib.shape_predictor(args["shape_predictor"])
  (lStart, lEnd) = face_utils.FACIAL_LANDMARKS_IDXS["left_eye"]
  (rStart, rEnd) = face_utils.FACIAL_LANDMARKS_IDXS["right_eye"]
                                                  
  vs =VideoStream(src=args['webcam']).start()
  currentCount = 0
  face_cascade = cv2.CascadeClassifier('public/models/haarcascade_frontalface_default.xml')

  while True:
    frame = vs.read()
    frame = imutils.resize(frame, width=450)
    height, width, c = frame.shape

    gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
    face = face_cascade.detectMultiScale(gray, 1.15)

    min_dis = 100000
    x=0
    y=0
    w=0
    h=0
    for (mx, my, mw, mh) in face:
      d = distance.euclidean((mx+w/2, my+h/2), (width/2, height/2))
      if(d < min_dis):
        min_dis = d
        x = mx
        y = my
        w = mw
        h = mh

    rects = detector(gray, 0)
    prevcount = 0
    for rect in rects:
      shape = predictor(gray, rect)
      shape = face_utils.shape_to_np(shape)
      leftEye = shape[lStart:lEnd]
      rightEye = shape[rStart:rEnd]
      leftEAR = eye_aspect_ratio(leftEye)
      rightEAR = eye_aspect_ratio(rightEye)
      danger = 0
      ear = (leftEAR + rightEAR) / 2.0
      leftEyeHull = cv2.convexHull(leftEye)
      rightEyeHull = cv2.convexHull(rightEye)
      cv2.drawContours(frame, [leftEyeHull], -1, (135,62,35), 1)
      cv2.drawContours(frame, [rightEyeHull],  -1, (135,62,35), 1)
                                    
      if (ear<EYE_AR_THRESH):
        COUNTER = COUNTER + 1
        if(COUNTER>=EYE_AR_CONSEC_FRAMES):
          danger = 1
          #cv2.putText(frame, "Blinks count: {}".format(TOTAL), (10, 30), cv2.FONT_ITALIC, 0.7, (0, 255, 0), 2)
          #cv2.putText(frame, "DANGER!!: {}".format(danger), (10, 90), cv2.FONT_ITALIC, 0.7, (0, 255, 0), 2)
          #cv2.putText(frame, "Aspect ratio: {:.2f}".format(ear), (250, 30), cv2.FONT_ITALIC, 0.7, (0, 255, 0), 2)
          #cv2.imshow("Frame", frame)

          time.sleep(5)
          print("1")
          sys.exit(0)
    
      else:
          COUNTER = 0
else:
  print('stopped')
  sys.exit(0)