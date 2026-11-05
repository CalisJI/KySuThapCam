---
title: "RGB vs HSV: making industrial color sorting more reliable"
date: 2026-11-05
tag: "Image Processing"
color: "#e8590c"
cover: "https://rajasekharguptha.github.io/assets/images/finalimage.png"
excerpt: "HSV segmentation in OpenCV, its limits under changing illumination, and practical validation steps."
translation: phan-loai-mau-rgb-hsv-opencv
draft: false
---

Color sorting sounds simple until changing illumination and reflective surfaces cause one product to receive different classifications.

## Reproducible demo

[**OpenCV — Thresholding Operations using inRange**](https://docs.opencv.org/4.x/da/d97/tutorial_threshold_inRange.html) provides Python/C++ examples with live HSV sliders. This is an algorithm demonstration, not a commissioned production-line video.

## RGB versus HSV

**RGB** encodes red, green and blue channel intensity; all three respond to illumination.

**HSV** separates hue, saturation and value. With controlled light and sufficiently saturated colors, hue thresholds can be easier to tune.

For standard 8-bit OpenCV HSV data, **Hue is normally encoded as 0–179**. Since red wraps around the hue boundary, red detection often uses two threshold bands.

## A practical pipeline

1. Stabilize lighting, product positioning and white balance.
2. Convert camera BGR to HSV with `cv2.cvtColor()`.
3. Apply `cv2.inRange()` for target color ranges.
4. Clean the mask and inspect relevant contours or an ROI.
5. Reject ambiguous cases instead of forcing every image into a class.

```python
import cv2

frame = cv2.imread("sample.jpg")
hsv = cv2.cvtColor(frame, cv2.COLOR_BGR2HSV)
low_red = cv2.inRange(hsv, (0, 80, 60), (10, 255, 255))
high_red = cv2.inRange(hsv, (170, 80, 60), (179, 255, 255))
red_mask = cv2.bitwise_or(low_red, high_red)
```

These are **illustrative**, not validated factory thresholds.

## Failure cases

Hue is unstable near zero saturation. Glare, shadows, mixed-spectrum lighting and automatic camera settings can break segmentation. For calibrated color judgement, consider controlled illumination, a reference chart and potentially Lab color-space measurements.

**Source:** [OpenCV — inRange HSV tutorial](https://docs.opencv.org/4.x/da/d97/tutorial_threshold_inRange.html).

*Independent technical analysis; demos and media belong to their cited sources.*

**Cover image:** OpenCV red-color segmentation result from [Rajasekhar Guptha's tutorial](https://rajasekharguptha.github.io/opencv/2020/07/18/color-detection.html); this is an algorithm demo, not a production line.
