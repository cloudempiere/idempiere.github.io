---
id: warning-on-password-expiration
title: "Warning on Password Expiration"
sidebar_label: "Warning on Password Expiration"
description: "**Goal:** User Experience (Usability)"
tags: [v6.2, user-experience]
---

**Goal:** User Experience (Usability)

**Developer:** Nicolas Micoud

**Description:**

When defined a maximum password age (in [USER_LOCKING_MAX_PASSWORD_AGE_DAY](https://wiki.idempiere.org/en/System_Configurator_(Window_ID-50006)#USER_LOCKING_MAX_PASSWORD_AGE_DAY)), the system can now also issue a warning to the user several days before the expiration, in order to let them know about the change that will be required.

In order to define that simply update the System Configurator key [USER_LOCKING_PASSWORD_NOTIFY_DAY](https://wiki.idempiere.org/en/System_Configurator_(Window_ID-50006)#USER_LOCKING_PASSWORD_NOTIFY_DAY) with the number of days desired to start notifying users.

The result will look like:

![01 WarningOnPasswordExpiration](pathname:///img/release-notes/v6.2/01_WarningOnPasswordExpiration.png)

**Technical Info:** [IDEMPIERE-3696](https://idempiere.atlassian.net/browse/IDEMPIERE-3696)

See also [User Locking](https://wiki.idempiere.org/en/NF1.0_User_Locking)

---

_Source: [Wiki](https://wiki.idempiere.org/en/NF6.2_Warning_on_Password_Expiration)_
