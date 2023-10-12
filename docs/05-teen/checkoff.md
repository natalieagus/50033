---
sidebar_position: 3
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
As usual, the grading for this lab is **binary** (completed or not completed). This means you should implement <span className="orange-bold">all features</span> above to obtain the mark. If you're already experienced with Unity and would like to experiment, you're free to implement similar features. In this checkoff, the feature we are looking for are: **usage** of Scriptable Object Game Architecture, **usage** of Pluggable FSM (must be at least as complex as the checkoff requirements below, similar number of states and transitions etc). Show it clearly in your recording by either showing your inspector for Mario when playing the game, or show us relevant scripts on your code editor for a few seconds.

We <span className="orange-bold">also</span> want you to demonstrate that there exist some kind of collectibles or powerup or buffs that will disappear after a few seconds. Game or level restart must also be demonstrated where every single component goes back to its original state.
:::

You are free to utilise whatever you have learned in this topic to implement the following (turn on the volume):

<VideoItem path={"https://50033.s3.ap-southeast-1.amazonaws.com/week-5/checkoff.mp4"} widthPercentage="100%"/>

Your submission must have all the following features to gain fullmarks (and not exceeding 5 minutes length):

### Implement Buffs and Powerups

You are required to implement the FSM as per these diagrams shown in the previous section:

<ImageCard path={require("./images/mario-fsm.png").default} customClass="invert-color" widthPercentage="50%"/>

These buffs are controlled using another FSM (not `MarioStateController`). You need to create a new script inheriting `StateController`, e.g: `BuffStateController` and attach it to Mario to manage his buffs:

<ImageCard path={require("./images/mario-fsm-buffs.png").default} customClass="invert-color" widthPercentage="30%"/>

### Utilise Scriptable Object Game Architecture

Your lab should <span className="orange-bold">not</span> contain any Singleton anymore. Demonstrate it clearly by recording your Hierarchy Window (there will be no `DontDestroyOnLoad` section). You must demonstrate that you can navigate between multiple scenes and values will persist.

### Maintain Sound Effects

You should record <span className="orange-bold">with sound</span> and demonstrate that each state change results in reasonable sound effects. You don't have to download more audio clips, you can just use the ones we have given to you.

## Summary

:::think 🤔
What to do next?
:::

This is our <span className="orange-bold">final lab</span>, congratulations for making it this far 🎉🍾. You are fully equipped now to complete actual World-1-1 on your own and document your lab properly so it might be useful for you in the future. You should start thinking about the architecture of your game project from now on, and polish your game idea. Prototype and ideate on paper / tablet first before jumping straight into digital prototype.

If you would like to read more about other game architectures, [this e-book by Unity is a great source to start](https://resources.unity.com/games/level-up-your-code-with-game-programming-patterns?ungated=true). There are plenty of other programming patterns that we can't cover in the Labs, such as the Factory, MVP (Model View Presenter), and Command patterns.

Be sure also to check out [**Unity Best Practices**](https://unity.com/how-to) that suits your game. We will populate our websites Resources tab in the weeks to come too based on selected articles on these sources so stay tuned.
