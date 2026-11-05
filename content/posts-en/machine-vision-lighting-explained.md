---
title: "Why lighting can matter more than an expensive camera in machine vision"
date: 2026-11-05
tag: "Machine Vision"
color: "#e8590c"
cover: "https://www.planistar.de/fileadmin/_processed_/d/2/csm_Unternehmen_Loesungen_3611f85be8.jpg"
excerpt: "Backlight, dark field, ring and coaxial lighting: how illumination changes what a vision system can reliably detect."
translation: anh-sang-trong-machine-vision
draft: false
---

A scratch on a metal surface may disappear in a high-resolution image. Change the illumination angle and the same defect becomes obvious. In industrial machine vision, **optical setup often matters more than adding a more complex algorithm**.

## Real-world demonstrations

[**KEYENCE — Machine Vision Lighting Selection Guide**](https://www.keyence.com/products/vision/resources/vision-resources/basics-of-lighting-selection.jsp) includes before-and-after imaging examples for glass edges, rubber parts and metallic outlines. These are vendor demonstrations, not tests performed by this site.

[**CCS — Machine Vision Lighting Applications**](https://www.ccs-grp.com/product/vision/index.html) shows practical lighting families and mounting options.

## Four illumination approaches

| Lighting | How it works | Typical inspection |
|---|---|---|
| **Backlight** | Creates a high-contrast silhouette | Edges, holes, gaps and dimensional outlines |
| **Low-angle / dark field** | Grazing light makes surface defects scatter toward the lens | Scratches, burrs, dents |
| **Ring / direct** | Light surrounds the lens | Presence checks, labels, general inspection |
| **Coaxial / dome** | On-axis or diffuse illumination | Flat reflective parts, shiny surfaces, glare reduction |

No arrangement works everywhere. Reflective, curved and transparent workpieces need testing with actual samples.

## A small-factory retrofit

For a **cap-present inspection**, fix the camera geometry, select illumination for clear cap edges, lock exposure and gain, then test thresholding or contour detection. A narrow presence/absence problem may not need AI.

For **metal scratch detection**, try low-angle lighting before upgrading the sensor.

## What to validate

Compare good and defective samples under several lighting setups; judge feature-to-background contrast rather than perceived image quality; control ambient light; and account for motion blur, strobe timing and light aging.

**Key idea:** Make defects visible in a stable image before asking software to find them.

**Sources:** [KEYENCE lighting guide](https://www.keyence.com/products/vision/resources/vision-resources/basics-of-lighting-selection.jsp) · [CCS lighting applications](https://www.ccs-grp.com/product/vision/index.html).

*Independent technical analysis; demos and media belong to their cited sources.*

**Cover photo:** PCB inspection lighting installation from [planistar Lichttechnik](https://www.planistar.de/en/company), used as a lighting application example.
