---
sidebar_position: 1
---

import CollapsibleAnswer from '@site/src/components/CollapsibleAnswer';
import DeepDive from '@site/src/components/DeepDive';
import ImageCard from '@site/src/components/ImageCard';
import ChatBaseBubble from '@site/src/components/ChatBaseBubble';
import VideoItem from '@site/src/components/VideoItem';
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# ScriptableObject Game Architecture

:::note
This [amazing talk](https://www.youtube.com/watch?v=raQ3iHhE_Kk) inspires the existence of this section. We simply do not have enough time (unfortunately) to go into every single detailed implementation of common concepts such as game inventory, skill tree, etc but we hope that this quick introduction will point you into the right direction in the future.
:::

This topic covers an entirely new game architecture which separates data from code to make your game more maintanable and all around pleasant to work with. You can choose to go down the Singleton Path and utilising some SO for parts of your data that is supposed to be persistent. The choice is entirely up to you but we feel that it is our responsibility to introduce you to another great alternative using Scriptable Objects. This will revamp our existing project by quite a lot, but the benefits are worth it:

- Scenes are clean slates
- No dependency between Systems and they are modular
- Prefabs work on their own
- Pluggable custom components

## Preparation

We need at least two Scenes with completely clean slate. That’s right. <span className="orange-bold">Clean Slates</span>. We can’t reuse any of these Scripts anymore: GameManager, PowerupController, PlayerController, etc. To get you up to speed, you can:

1. Copy your main menu or loading scene if any, and World-1-1 and World-1-2 into a new folder
2. Copy all prefabs used in these two worlds into a new folder, name it something else
3. Replace the prefabs with the new prefabs (same, just another copy)
4. Remove **all scripts** attached to any GameObject, do the same for the new set of prefabs

Here's a complete recording on what we do to prepare for this lab. Lots of the setup is about step 3 above. If you want to simply copy the entire project and work on the copy directly, you may do so.

<VideoItem path={"https://50033.s3.ap-southeast-1.amazonaws.com/week-5/setup.mp4"} widthPercentage="100%"/>

:::playtest
If your main menu and loading screen is simple, you may leave it as-is. Some error might pop up because the event called in some animation clip, e.g: mario-jump animation doesn't exist and it's fine. We can fix that later. Also, do not forget to update the **build setting** to include these new scenes instead. The setting can be found at File >> Build Settings.
:::

## The Singleton Architecture

If you've been following the lab faithfully so far, your current game architecture utilising Singletons is somewhat as follows:

<ImageCard path={require("./images/singleton-archi.png").default} customClass="invert-color" widthPercentage="100%"/>

It's _decent_, in a way that there's no cross-referencing between scripts attached to gameObject instances, **except** to Singletons: `GameManager` and `PowerupManager`. Most chain of actions are triggered via events.

### Powerup Collection

Every Powerup box (brick or question box) is controlled by a script inheriting `BasePowerupController`.

- Whenever Mario hits a box (brick or question box), the `OnCollisionEnter2D` will be called by Unity, which will trigger an <span className="orange-bold">Animation</span> (bouncing box, etc).
- From this animation, we call `SpawnPowerup()` on the powerup inside the box. Any powerup (coin, starman, magic mushroom, and one-up mushroom) are spawned via `SpawnPowerup()` method. `SpawnPowerup()` **invokes** `powerupCollected` event in PowerupManager Singleton, passing **reference** to itself in the process

This calls the subscribers of `powerupCollected`: `FilterAndCastPowerup` which decides whether to invoke `powerupAffectsManager` or `powerupAffectsPlayer` based on the type of powerup invoking the event.

The subscribers of `powerupAffectsPlayer` or `powerupAffectsManager` (Mario or Manager) will then be called. Any gameObject subscribing to these two `powerupAffectsX` event should conform to `IPowerupApplicable` interface containing `RequestPowerupEffect` method, which is the method subscribing to `powerupAffectsX` event.

In `RequestPowerupEffect`, one simply passes itself (`this`) to the powerup triggering the chain of events from the start by calling `i.ApplyPowerup(this)`. Then, the **actual** implementation (how this powerup is affecting `this`) is implemented in that powerup script itself.

For instance, when Mario hits a question box containing MagicMushroom, it triggers `SpawnPowerup()` which will animate the spawning of the MagicMushroom. When Mario collides with the MagicMushroom, `OnCollisionEnter2D` on MagicMushroom's BasePowerup will be triggered, which will **invoke** `powerupCollected` event, passing itself in the process. `FilterAndCastPowerup` (subscriber of `powerupCollected`) will examines the `PowerupType` triggering this event, which is MagicMushroom and hence it invokes `powerupAffectsPlayer` event instead, passing MagicMushroom instance in the process. This triggers the callback `RequestPowerupEffect` in `PlayerMovement.cs` attached on Mario. In `RequestPowerupEffect`, we pass `this` (which is Mario gameobject instance) to MagicMushroom via `ApplyPowerup` method. Finally, in the MagicMushroomPowerup script we can decide _what the effect of this powerup is to Mario_: which is to call `MakeSuperMario()` method implemented in `PlayerMovement` attached to Mario.

:::note
This is just one of the suggested method to prevent cross-referencing of scripts that needed to be done manually via inspector during runtime. The main idea is to modularise the implementation of the powerup effect as much as possible, implementing parts concerning that instances in the instance script and nowhere else. For instance: it is the MagicMushroom's responsibility to call Mario's: MakeSuperMario, and it is Mario's responsibility to decide what "Super Mario" should be.
:::

## Scriptable Object Game Architecture
