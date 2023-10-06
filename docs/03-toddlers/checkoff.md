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

:::caution Grading notes
As usual, the grading for this lab is **binary** (completed or not completed). This means you should implement <span className="orange-bold">all features</span> above to obtain the mark. If you're already experienced with Unity and would like to experiment, you're free to implement similar features. In this checkoff, the feature we are looking for are: meaningful usage of the use of AudioMixer in the game, and allowing the player to increment some kind of score or stats after overcoming an obstacle (can be enemies or alike), as well as utilisation of the Observer Pattern.
:::

### Utilize The Input System

You are required to utilise The Input System for this lab's checkoff. Implementing exactly as stated in this week's lab handout would <span className="orange-bold">suffice</span>.

### Add SFX

Also, apply a **meaningful** audio effect (apart from ducking background music when GameOver sound effect is playing):

1. Explain clearly in your video the purpose of that effect
2. Show how you set its properties in AudioMixer Window and Inspector window
3. Utilise Audio Groups to manage all audio sources
4. Record your video <span className="orange-bold">with sound</span>
5. If you don't have a microphone, then in your recording you need to show that relevant AudioGroups are playing sound effects

### Stomp Goomba

You are also asked to utilise Events and Delegates learned from this lab to implement <span className="orange-bold">stomping of Goomba</span>. Goomba must animate as shown and it should increase your score. Increasing score by jumping over Goomba **should be disabled**.

Here's a sample checkoff:

<VideoItem path={"https://50033.s3.ap-southeast-1.amazonaws.com/week-3/checkoff.mp4"} widthPercentage="100%"/>

## Next Time

:::think 🤔
What to do next?
:::

Whatever we have learned so far is sufficient to construct a working World 1-1 of Super Mario Bros, but are we happy with just that?

A video game usually consist of multiple scenes (if not multiple stages, then at least main menu or something). Besides, we need an <span className="orange-bold">enhanced</span> better way to manage **persistent state** so that our scores, powerups, etc persists between scene changes. Also, we will learn more advanced game architectures utilising Scriptable Objects so that we don't have to write so much boilerplate about UnityEvents, or writing that lengthy `GetComponent<GameManager>()` too many times in various scripts.
