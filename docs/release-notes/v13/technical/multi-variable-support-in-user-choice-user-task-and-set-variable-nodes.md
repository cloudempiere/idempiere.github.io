---
id: multi-variable-support-in-user-choice-user-task-and-set-variable-nodes
title: "Multi-Variable Support in User Choice, User Task and Set Variable Nodes"
sidebar_label: "Multi-Variable Support in User Choice, User Task and Set Variable Nodes"
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

**Feature** **Ticket:** [IDEMPIERE-6460](https://idempiere.atlassian.net/browse/IDEMPIERE-6460)
### Multi-Variable Support in User Choice, User Task and Set Variable Nodes
This enhancement addresses the limitation of **User Choice,User Task** and **Set Variable** workflow nodes, which currently allow setting **only a single column value**. The inability to update **multiple values within the same node** requires the use of **multiple Set Variable nodes**, leading to inefficiencies and execution performance.

**Existing Limitations**

- **Single Column Restriction** – User Choice and Set Variable nodes only allow updating one column at a time.
- **Complexity in Multi-Value Updates** – Multiple Set Variable nodes are needed, making workflows cumbersome and less user-friendly.
- **Independent Execution Issues** – If multiple set variable nodes are added for value updates, the workflow execution does not ensure **successful completion of user task**. This can lead to situations where a **User choice** node failed due to validation, but related variable settings already committed show wrong value set on record.

**Solution: Introducing the Variable Sub-Tab**

To resolve these challenges, a **Variable sub-tab** is added under Node tab which is visible when the **workflow action type** is either:

1. **User Choice**
1. **Set Variable**
1. **User Task**

**Design & Implementation**

- **New Variable Sub-Tab**
    - Displays relevant configurations when a workflow node action is **User Choice, Set Variable, or User Task**. ![Variable sub tab](pathname:///img/release-notes/v13/Variable_sub_tab.png)
- **Fields in the Variable Tab:**

1. **Column Name** – Specifies the target **column name on the record** where the variable should be set.
1. **Attribute Value** – Allows defining a **constant value or context variable** for assignment. ![Variable Tab Form](pathname:///img/release-notes/v13/Variable_Tab_Form.png)

**Impact on iDempiere Workflow Execution**

- **Enhanced Multi-Variable Support** – Allows updating multiple columns within **a single workflow node**.
- **Improved User Experience** – Eliminates the need for multiple Set Variable nodes, streamlining workflow design.
- **Consistency in Execution** – Ensures all **variable assignments complete successfully** only if node execution successful.

---

_Source: [Wiki](https://wiki.idempiere.org/en/NF13_Multiple_Variable_on_Workflow_Node)_
