---
id: enhancing-idempiere-workflow-for-multi-level-approvals
title: "Enhancing iDempiere Workflow for Multi-Level Approvals"
sidebar_label: "Enhancing iDempiere Workflow for Multi-Level Approvals"
description: "This is not yet integrated into core"
tags: [v13, technical]
---

:::warning
This is not yet integrated into core
:::

:::warning
This is not yet integrated into core
:::

:::warning
This is not yet integrated into core
:::

:::warning
This is not yet integrated into core
:::

**Goal:** Technical

**Developer:** Deepak Pansheriya [Logilite Tchnologies](https://www.logilite.com)

**Feature** **Ticket:** [IDEMPIERE-6499](https://idempiere.atlassian.net/browse/IDEMPIERE-6499)
### Enhancing iDempiere Workflow for Multi-Level Approvals
    - Enhancing iDempiere Workflow for Multi-Level Approvals****Limitations in Existing Approval Workflow**
In iDempiere, **User Choice** is used as the action type for approval workflows. However, the existing implementation has the following constraints:

1. **Mandatory isApproved Column** – The approval logic requires the **isApproved** column set on column field of node.
1. **Issues with Multi-Level Approvals** – When multiple approvals are required for a document, this approach does **not work** as for each approval, needs to record user input on different column. So if we add any other column name, System do not consider node as approval.
1. **Custom Columns Not Recognized** – If a user adds a **custom approval column**, iDempiere treats it as a **normal value-setting action** rather than an approval.

**Solution: Adding an Approval Column to Workflow Nodes**

To overcome these limitations, we have introduced a new **Approval Column** on workflow nodes, which becomes visible when **Action Type = User Choice**.

**Behavior of the Enhanced Approval Workflow in iDempiere**

- **Custom Approval Columns Supported** – If a column is set in the **Approval Column** field, iDempiere recognizes it as an approval node.
- ![Custom Approval Column](pathname:///img/release-notes/v13/Custom_Approval_Column.png)
- **Consistent Approval Logic** – The system **attaches the same behavior** as when using the **isApproved** column.
- **Multi-Level Approvals Enabled** – Supports workflows where multiple approvals nodes are required which each set different flag.

**Example Use Case: Multi-Level Approval in Procurement**

---

_Source: [Wiki](https://wiki.idempiere.org/en/NF13_Approval_Column_on_Workflow_Node)_
