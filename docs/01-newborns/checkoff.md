---
sidebar_position: 4
---

import CollapsibleAnswer from '@site/src/components/CollapsibleAnswer';
import DeepDive from '@site/src/components/DeepDive';
import ImageCard from '@site/src/components/ImageCard';
import ChatBaseBubble from '@site/src/components/ChatBaseBubble';
import VideoItem from '@site/src/components/VideoItem';
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Checkoff

Once you've implemented everything in this handout, then for **checkoff** you're required to add one new feature: A "Game Over" screen (can be overlaying canvas that's hidden when game starts) when Mario hits Goomba. In this GameOver screen, we should have:

1. Score highlighted
2. Restart button highlighted

You’re free to implement it in any way you want. It will not affect your checkoff score. The grading for this lab is **binary** (completed or not completed). Here's a sample result:

<VideoItem path={"https://50033.s3.ap-southeast-1.amazonaws.com/week-1/restart-game.mp4"} widthPercentage="100%"/>

### Housekeeping

While Debug messages are useful, please **clean them up** once you're done with the features. Manage your Scene with proper GameObject hierarchies. Manage your files under `Project` window properly too. For these lab series, we neatly manage our scripts and scenes by Week.

## Next Time

:::think 🤔
What to do next?
:::

It's been hours but we are nowhere near a completed game (unless of course you have prior experience with Unity):

- No **sound effect** or **animation** (lack of visual feedback)
- No **platforms** implemented yet (it's a platformer game!)
- There’s **no game manager** of any sort, and `score` is sloppily stored in `JumpOverGoomba.cs`
- There’s no _centralised_ way for keeping track of **states** (score, player state, etc), every component is referring to every other component. This is <span className="orange-bold">disastrous</span>.
- The “Enemy” is kinda predictable or boring, and Mario's scoring system doesn't work that way.

We will try to improve our game and learn some common C# coding practices in the next few parts.
