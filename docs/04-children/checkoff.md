---
sidebar_position: 5
---

import CollapsibleAnswer from '@site/src/components/CollapsibleAnswer';
import DeepDive from '@site/src/components/DeepDive';
import ImageCard from '@site/src/components/ImageCard';
import ChatBaseBubble from '@site/src/components/ChatBaseBubble';
import VideoItem from '@site/src/components/VideoItem';
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Checkoff

:::caution Grading notes
As usual, the grading for this lab is **binary** (completed or not completed). This means you should implement <span className="orange-bold">all features</span> above to obtain the mark.
:::

You are free to utilise whatever you have learned in this topic to implement the following (turn on the volume):
<VideoItem path={"https://50033.s3.ap-southeast-1.amazonaws.com/week-4/checkoff.mp4"} widthPercentage="100%"/>

Your submission must have **all** the following features to gain fullmarks (and not exceeding 5 minutes length):

### Good Player Feedback

Have sound effect (please record your audio) for the most part (don't have to be 100% SMB accurate):

- Game paused/play background sound stopping and starting
- Powerups spawning (coin or mushroom)
- Goomba dying
- Game Over

### Navigate Between Scenes

Have a main menu and a loading scene (design is up to you) before the main game. The loading scene should allow you to go back to the main menu

### Persistent Highscore

Have have a **persistent highscore** that can be reset in the main menu. Persistent means: when stopped and started again in unity editor, the same value stays. You also need to have at least **two** worlds where **current** score can be properly **carried over** (show it).

### Powerup

Have at least **two** powerup system: Coin, Starman, Mushroom, or Invisible Brick (1-UP mushroom), any 2 or any other designs you want. Fix the powerup **bug** described (or show that you don't have such bug, approach the powerup from both above and below the box).

### Game Polishing

Restart should work **properly**: reset ALL Goombas, all powerups, music, and current score. You need to utilise Scriptable Object as part of your solution (show your code editor or inspector while recording).

## Next Time

:::think 🤔
What to do next?
:::

We have learned quite a bit of things in the past month to implement most general stuffs we need in a game. We _can_ make a game and google (or ChatGPT) along the way as we go to make most games work, but there's one last thing to touch: that is to _properly_ separate your data from your code for even better management. In game development, various architectural patterns and frameworks are used to structure and organize code for managing game objects, scenes, and gameplay mechanics. We will explore one design pattern that leverages Scriptable Objects to create **flexible** and **reusable** systems for defining and configuring game objects and their behaviors.
