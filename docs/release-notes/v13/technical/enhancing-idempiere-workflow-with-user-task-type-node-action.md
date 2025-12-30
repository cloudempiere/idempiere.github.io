---
id: enhancing-idempiere-workflow-with-user-task-type-node-action
title: "Enhancing iDempiere Workflow with User Task Type Node Action"
sidebar_label: "Enhancing iDempiere Workflow with User Task Type Node Action"
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

**Feature** **Ticket:** [IDEMPIERE-6246](https://idempiere.atlassian.net/browse/IDEMPIERE-6246)
### Enhancing iDempiere Workflow with User Task Type Node Action
**Limitations of User Choice for Offline Actions**

In workflows requiring **offline actions**—such as **validating data, calling a customer, or conducting a background check**. However, the existing **User Choice** node has the following constraints:

1. **Mandatory Value Assignment** – The User Choice node requires users to set a column value upon action confirmation. Some times user needs to just confirm that task done.
1. **Automatic Execution for Responsible Users** – If the current logged-in user is a **workflow responsible**, the node **does not suspend** for confirmation and directly completed execustion of node.
1. **Tasks Requiring Explicit Completion** – Workflow steps that involve tasks instead of approvals must **suspend** until the user confirms that the task is completed.

This behavior leads to a problem where a responsible user executing a workflow does not receive a task confirmation prompt, causing unintended automatic progression.

**Solution: Introducing User Task Type Nodes in iDempiere**

To overcome these limitations while **preserving User Choice behavior**, we introduce a new **User Task** option on workflow node action.

**Behavior of User Task Node**

- **Always Suspends** – The workflow **pauses at this step**, regardless of whether the current user is responsible for execution. This ensures explicit task confirmation before proceeding.
- **Mandatory User Confirmation** – The user must **manually confirm task completion**, preventing auto-advancement.
- **Accepts User Input** – Allows specifying columns for user selection during task confirmation (e.g., List type or Yes-No reference type).
![WF Node User ask Action](pathname:///img/release-notes/v13/WF_Node_User_ask_Action.png)
- **Does Not Abort Workflow** – Unlike User Choice, where selecting `"N"` aborts the workflow, User Task enables **reassignment or alternative routing** without terminating execution.
- **Supports Non-Aborting Approval Handling** – Allows workflows where rejection triggers task reassignment instead of stopping the workflow process.

**Example Use Case: Procurement Workflow Handling**

Consider a **purchase order (PO) approval workflow** where the **procurement department** finds an issue. Instead of aborting the workflow, the **User Task node** facilitates reassignment for corrective action.

**Configuration Steps**

1. **Define Approval Workflow Node as User Task Type**
1. * Configure the node to reference a **Yes-No** or **List** column.
1. **Setup Workflow Transitions**
1. * add **two or more transitions** with condition based on user input column:
1. ** **Success Flow** – Proceed when provided value is yes.
1. ** **Rejection Flow** – When user provide N, assign to another workflow node for corrective action.

- If the procurement team **rejects the PO**, the workflow reassigns it to the **initiator for corrections** instead of aborting it.

**Impact on iDempiere Workflow Execution**

By implementing the **User Task** type node action, workflows gain improved flexibility for handling **task-based execution**, ensuring **manual confirmation**, **explicit reassignment**, and **non-aborting approval** mechanisms.

---

_Source: [Wiki](https://wiki.idempiere.org/en/NF13_User_Task_Type_Workflow_Node)_
