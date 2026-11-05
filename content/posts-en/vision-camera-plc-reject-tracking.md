---
title: "How a PLC rejects the correct product after a vision NG result"
date: 2026-11-05
tag: "Industrial Automation"
color: "#1f9d4d"
cover: ""
excerpt: "Trigger timing, result IDs, encoder counts, reject queues and verification in an industrial vision station."
translation: camera-plc-loai-san-pham-loi
draft: false
---

A camera may report **NG** after an 80 ms inspection, but the item is already moving downstream. Firing a pneumatic reject immediately on receiving NG can eject the wrong item.

A robust line must **associate every vision result with the corresponding product and its physical position**.

## Real production-line reference

[**Vision Systems Design — Cognex In-Sight bottle inspection**](https://www.vision-systems.com/factory/article/14174407/cognex-in-sight-bottle-inspection-vision-system) discusses PLC recipe control and **encoder-based tracking to a downstream reject**.

[**addaScan — Where a station sits and how it rejects**](https://addascan.co.za/resources/machine-vision-basics/where-a-station-sits-and-how-it-rejects/) covers inspection placement, reject tracking and downstream verification.

## Typical architecture

```text
Photoeye trigger ---> Vision controller
       |                     |
       +----> PLC item ID <--+---- OK/NG with matching ID
                   |
              Item queue
                   |
           Position / encoder
                   |
             Reject actuator
                   |
           Reject confirmation
```

## Timer versus encoder tracking

A timed reject may work at constant conveyor speed. However, when conveyor speed changes or the line stops, fixed delay no longer represents travelled distance.

An encoder lets the PLC save the position at trigger time, link the result to an ID and command the reject based on measured travel.

Illustrative example: 600 mm from camera to reject at 2 encoder counts/mm means 1,200 counts of travel. Actual setup must account for actuator latency, belt slip and mechanical uncertainty.

## Design for failure

Timeouts and missing results should be **unknown**, not automatically accepted. Detect late or mismatched IDs. Decide what happens to in-flight products after a power loss. Confirm that rejected products actually leave the line using a downstream sensor.

Multi-lane lines or products that can overtake one another need more sophisticated tracking.

**Sources:** [Cognex In-Sight case study](https://www.vision-systems.com/factory/article/14174407/cognex-in-sight-bottle-inspection-vision-system) · [addaScan reject tracking guide](https://addascan.co.za/resources/machine-vision-basics/where-a-station-sits-and-how-it-rejects/).

*Independent technical analysis; demos and media belong to their cited sources.*
