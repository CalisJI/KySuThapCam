---
title: "Camera calibration: why a sharp image can still give wrong dimensions"
date: 2026-11-05
tag: "Machine Vision"
color: "#1f9d4d"
cover: "https://user-images.githubusercontent.com/62354721/244020119-6f1f7cef-93df-42df-b728-15e5cc0c9f66.PNG"
excerpt: "Lens distortion, perspective, pixel-to-mm scaling, and a practical checkerboard calibration workflow."
translation: hieu-chuan-camera-do-kich-thuoc
draft: false
---

A crisp photograph is not necessarily a precise measurement. To inspect holes, jar dimensions or part positions, you need to know **how image coordinates map to real-world coordinates**.

## Hands-on references

[**OpenCV — Camera Calibration**](https://docs.opencv.org/4.x/dc/dbb/tutorial_py_calibration.html) demonstrates checkerboard-based calibration, camera matrices, distortion coefficients and undistortion.

[**OpenCV — Camera Calibration Guide**](https://docs.opencv.org/4.x/d4/d94/tutorial_camera_calibration.html) also discusses checkerboard, ChArUco and circle-grid targets.

## Common error sources

**Lens distortion:** Features near frame edges may be displaced or scaled differently.

**Perspective:** The imaging scale depends on object depth and orientation for conventional perspective lenses.

**Mechanical and processing variation:** Camera movement, focus drift, part fixturing and edge-detection uncertainty all affect a measurement.

## Practical calibration workflow

1. Fix the camera, lens, focus, working distance and acquisition resolution.
2. Use an accurately measured checkerboard or ChArUco target.
3. Capture multiple target orientations spanning the image field.
4. Estimate intrinsics and distortion using OpenCV.
5. Undistort images and, for a planar inspection surface, compute an image-to-world mapping such as a homography.
6. Verify dimensions using an **independent reference artifact** at several image locations.

## Why a single pixel/mm factor is risky

A constant scale factor assumes controlled geometry. Tilting the part or changing its height violates that assumption with ordinary perspective lenses.

For tight tolerances, include pixel sampling, edge localisation, fixture repeatability and geometry in the error budget. Consider a telecentric lens where dimensional accuracy and height variation demand it.

**Try this:** Measure a reference at the center and corners, before and after calibration, then raise it slightly and quantify the change.

**Sources:** [OpenCV Python calibration tutorial](https://docs.opencv.org/4.x/dc/dbb/tutorial_py_calibration.html) · [OpenCV calibration guide](https://docs.opencv.org/4.x/d4/d94/tutorial_camera_calibration.html).

*Independent technical analysis; demos and media belong to their cited sources.*

**Cover image:** Checkerboard calibration captures from [Camera Calibration with PiCamera2/OpenCV](https://github.com/Petros626/Camera-Calibration-with-PiCamera2-OpenCV).
