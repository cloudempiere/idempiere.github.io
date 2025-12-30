---
id: new-workflow-responsible-types-initiator-and-supervisor
title: "New Workflow Responsible Types Initiator and Supervisor"
sidebar_label: "New Workflow Responsible Types Initiator and Supervisor"
description: "This is not yet integrated into core"
tags: [v13, technical]
---

:::warning
This is not yet integrated into core
:::

:::warning
This is not yet integrated into core
:::

**Goal:** Technical

**Developer:** Deepak Pansheriya [Logilite Tchnologies](https://www.logilite.com)

**Feature** **Ticket:** [IDEMPIERE-6346](https://idempiere.atlassian.net/browse/IDEMPIERE-6346)
### New Workflow Responsible Types Initiator and Supervisor
This enhancement introduces two new **Responsible Types** in the **Workflow Responsible** window to improve workflow assignment and execution in iDempiere.

**New Responsible Types Added**

**1. Initiator**

![WF responsible initiator](pathname:///img/release-notes/v13/WF_responsible_initiator.png)

- Represents the **user who initiated the workflow**. In case of Sales order it is sales representative.
- **Difference from Invoker:**

- The existing **Invoker** type considers the **current logged-in user** who triggered an action.
- The **Initiator** type ensures tracking of the **original workflow creator**, maintaining distinction even if multiple users interact with the document later.

**2. Supervisor**

![WF Responsible Supervisor](pathname:///img/release-notes/v13/WF_Responsible_Supervisor.png)

- Identifies the **supervisor** of current logged in user and set it as workflow responsible.
- Supervisor is determined based on:
    - The **immediate supervisor** of the **User who started the workflow**.
    - If no supervisor is set, the system assigns the **Organization’s supervisor**.

---

_Source: [Wiki](https://wiki.idempiere.org/en/NF13_Workflow_Responsible_Type_Initiator_Supervisor)_
