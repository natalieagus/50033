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

Once you've implemented everything in this handout, then for **checkoff** you're required to add these new features listed below.

:::caution Grading notes
As usual, the grading for this lab is **binary** (completed or not completed). This means you should implement <span className="orange-bold">all features</span> above to obtain the mark.
:::

### Question Box

As per how question box works in Mario:

1. The question box bounces only when hit from below (not when Mario is jumping on top of it)
2. Animate "blinking" of the question box
3. It will spawn a coin, animated as shown
4. Plays a sound effect when the coin lands back **inside** the box
5. The box sprite is changed to indicate that it's disabled once coin is spawned
6. The question box, once disabled, should not bounce anymore

### Brick

The brick should behave as follows:

1. It bounces once when hit from below, but not from anywhere else
2. You should make two variant: can spawn a coin, or not
3. It should not "break" (yet, because Mario is not in Super Mario form)
4. Sound effect to be played when coin is collected
5. You do not need to increase any score yet

Please watch the demo below for reference (turn on the sound):

<VideoItem path={"https://50033.s3.ap-southeast-1.amazonaws.com/week-2/checkoff2.mp4"} widthPercentage="100%"/>

:::tip
As shown in the recording above, the question box is comprised of three gameObjects: the parent GameObject called `QuestionBox-Coin`, and two children called `Question-Box` and `Coin`. The spawning of the coin is another animation clip, which triggers an event to play the sound once the coin drops back to the box. The RigidBody type of the `Question-Box` is then set into `Static` to disable the joint. We also apply three edge collider 2D at the parent GameObject `QuestionBox-Coin` so that the spring is not triggered when Mario hits the box from above (or stand on it).

The bouncing brick in the demo video above is implemented using animation rather than Spring Joint, which is easier to control (bounce exactly **once**). We use a hierarchy of GameObject, so that we can control the animation of the **local coordinate** of the Brick and the coin separately.

:::
