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

Once you've implemented everything in this handout, then for **checkoff** you're required to add one new feature: A "Game Over" screen (can be overlaying canvas that's hidden when game starts) when Mario hits Goomba. In this GameOver screen, we should have the following brought to the player's attention:

1. Score
2. Restart button

You’re free to implement it in any way you want. It will **not** affect your checkoff score. The grading for **each** of this lab's feature is **binary** (completed or not completed). Here's a sample result:

<VideoItem path={"https://50033.s3.ap-southeast-1.amazonaws.com/week-1/complete-checkoff-1.mp4"} widthPercentage="100%"/>

:::caution Grading notes
The grading for this lab is **binary** (completed or not completed) **for each feature**. This means you should implement each <span className="orange-bold">feature</span> fully to obtain the mark for that feature. Don't worry, we are _lenient_ and will give you the marks as long as we see some form of the requested feature.

If you're already experienced with Unity and would like to experiment, you're free to implement similar features. You can even use your own asset or an entirely new project to demonstrate the requested feature(s). In this checkoff, the feature we are looking for is some kind of "GameOver" screen where everything stops moving and reporting of stats.
:::

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
