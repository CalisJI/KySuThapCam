---
title: "Test PLC logic before building the machine: a transport-conveyor Digital Twin demo"
date: 2026-11-05
tag: Digital Twin
color: "#1f9d4d"
cover: https://img.youtube.com/vi/Xj_XoUGncQ8/hqdefault.jpg
excerpt: "Watch TIA Portal, PLCSIM Advanced and NX MCD work together to validate conveyor sorting logic through virtual commissioning."
translation: digital-twin-bang-tai-phan-loai-plc
draft: false
---

**Can you test a machine's PLC program before its conveyors, sensors and actuators physically exist?** Yes — through *virtual commissioning*.

This demonstration was shared by **Domenico Madeo** and uses an educational Digital Twin example combining **TIA Portal, S7-PLCSIM Advanced and Siemens NX Mechatronics Concept Designer (MCD)**. The original example was published in 2021: this article explains a useful engineering technique rather than presenting breaking news.

## Watch the transport-conveyor Digital Twin demo

<div style="position:relative;width:100%;aspect-ratio:16/9;margin:20px 0 12px"><iframe src="https://www.youtube-nocookie.com/embed/Xj_XoUGncQ8" title="Digital Twin of a Transport Conveyor — TIA Portal, PLCSIM Advanced and NX MCD" loading="lazy" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen style="border:0;width:100%;height:100%;border-radius:12px"></iframe></div>

*If the embedded player does not appear, [watch the original video on YouTube](https://www.youtube.com/watch?v=Xj_XoUGncQ8). The video belongs to its original creator and is embedded here with attribution.*

## What's happening inside the demonstration?

- **NX MCD** represents the mechanical model and dynamic behaviour of the 3D conveyor plant.
- **TIA Portal** provides the PLC and HMI engineering environment.
- **PLCSIM Advanced** simulates a PLC controller that exchanges signals with the virtual system.
- Sensor changes in the model feed into the control logic, while PLC outputs drive virtual mechanisms.

The essential point is the **closed-loop relationship**: the simulated machine generates signals → the PLC processes them → simulated actuators move → the machine state changes. This goes beyond a visual 3D animation.

## A practical engineering challenge

Imagine designing a sorting machine with **three conveyors, photoelectric sensors, two diverters, an S7-1200 PLC and an HMI**. Before fabrication, a virtual test environment could help answer:

1. What happens when products arrive too close together?
2. Does the logic detect a sensor stuck ON or a missing signal?
3. Can the sequence recover safely after Stop and Restart?
4. Are any conflicting actuator commands possible?

Virtual commissioning helps test control logic and sequencing, but **does not replace physical verification** of inertia, friction, mechanical tolerances or machine safety.

## Relevance to machine builders

For machine builders, system integrators and PLC training teams, a digital twin can make it easier to evaluate designs jointly before assembly. Conveyor sorting, feeding, packaging and multi-actuator workstations are promising examples.

**Original demonstration and learning resources:**
- [Original YouTube video](https://www.youtube.com/watch?v=Xj_XoUGncQ8)
- [Domenico Madeo's project page](https://domenicomadeo.com/demo-application-examples-digital-twin-of-a-transport-conveyor-tia-portal-plcsim-advanced-and-nx-mcd/)
- [Siemens SCE digital twin application example](https://www.automation.siemens.com/sce-static/learning-training-documents/tia-portal/digital-twin/application/digitaltwin-at-education-introduction-transport-system-ser-0420-en.pdf)

*The cover thumbnail is supplied by YouTube for the original video and was not AI-generated. Kỹ Sư Thập Cẩm independently prepared this commentary and does not claim ownership of the video.*