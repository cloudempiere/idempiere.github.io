---
id: add-option-to-disable-insufficient-inventory-popup
title: 'Add option to Disable "Insufficient Inventory" Popup'
sidebar_label: 'Add option to Disable "Insufficient Inventory" Popup'
description: "**Goal:** User experience - Usability"
tags: [v12, user-experience]
---

**Goal:** User experience - Usability

**Developer:**  Diego Ruiz

**Feature Ticket:** [IDEMPIERE-6549](https://idempiere.atlassian.net/browse/IDEMPIERE-6549)

**Description**
Currently, users always receive a popup message indicating "Insufficient Inventory" when creating a Sales Order Line, even if the associated warehouse is configured to allow negative inventory.

With this improvement, a flag was added to the Warehouse window to control this behavior. When enabled, the system does not show the warning dialog.

![WarehouseNewFlag](pathname:///img/release-notes/v12/WarehouseNewFlag.png)

---

_Source: [Wiki](https://wiki.idempiere.org/en/NF12_Disable_Insufficient_Inventory_Popup)_
