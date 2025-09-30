---
sidebar_position: 6
---

import CollapsibleAnswer from '@site/src/components/CollapsibleAnswer';
import DeepDive from '@site/src/components/DeepDive';
import ImageCard from '@site/src/components/ImageCard';
import ChatBaseBubble from "@site/src/components/ChatBaseBubble";

# Using Sprite Resolver With Sprite Library

:::info
**Goal**: to make Animator run purely on Category/Label, while you hot-swap the SpriteLibraryAsset at runtime.

This approach is a good fit when you want to reuse the same animation data but present it with _different_ sprite sets. A common example is **cosmetic** systems in games: your character has a walk cycle, an attack animation, and a death animation, and all of those are driven purely by label changes (`Walk_01, Walk_02, …`).
:::

When creating a game, sometimes you have multiple NPCs that behave the same way (e.g: walk, attack, stunned, etc), only that they differ in skin. Instead of creating _new_ animation clips and controller per NPC, you might want to use the <span class="orange-bold">Sprite Resolver</span> with <span class="orange-bold">Sprite Library asset</span>.

You can **swap** the entire sprite library at runtime, so you can instantly turn the same underlying animation into a “pirate” skin, a “cyber” skin, or a “holiday event” variant without duplicating any clips.

:::note
This not only reduces animator workload but ensures timing and polish remain consistent across variants.
:::

Finally, it’s useful when you want to **scale** to multiple platforms or art directions. You can prepare low-resolution vs high-resolution atlases (mobile vs desktop), or censored vs uncensored regional art sets, and select the correct library at load time. Because the animator only cares about labels, you don’t need to maintain separate timelines, which keeps your project much leaner and easier to maintain.

## Preparing the Spritesheets

Consider a system you have a large cast of characters or NPCs that behave identically but should look different, such as: villagers in a town, enemies in a dungeon, or units in a strategy game.

**Recall the goal**: instead of authoring separate animation controllers, you keyframe the labels once and let different sprite libraries provide the art.

### Consistent Categories and Labels

:::important
You need to <span class="orange-bold">decide</span> your naming scheme up front.
:::

For example, every villager set should have a `Body` category with labels `Idle01, Idle02, Walk01, Walk02…`, and maybe a `Head` category with `Smile`, `Frown`, `Neutral`. If every variant follows this same label map, the Animator timeline will work for **all** of them.

Every variant needs the same category/label map:

```
Categories:
  Body:
    - Idle01
    - Idle02
    - Walk01
    - Walk02
    - Walk03
  Head:
    - Neutral
    - Smile
    - Frown
```

### Sprite slicing and import settings

:::important
For each art set, your sprite sheet must slice into the same frame count and naming scheme.

It is also important to ensure that each sprite has the <span class="orange-bold">same pivot</span> (e.g., at the feet), same Pixels Per Unit (PPU), and same orientation.
:::

For example, two different walk cycles, both sliced into 3 frames.

```
VillagerA_Walk.png
  -> Body_Walk01
  -> Body_Walk02
  -> Body_Walk03

VillagerB_Walk.png
  -> Body_Walk01
  -> Body_Walk02
  -> Body_Walk03
```
