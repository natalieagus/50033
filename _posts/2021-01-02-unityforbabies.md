---
layout: post
title: Unity for Babies
---
* TOC
{:toc}


# Learning Objectives: Basic Game Components

-   Creating animator and animation clip   
-   Transition between animations
-   Setting up parameters and triggers for animation
-   Timing animations and creating events
-   Coroutines: to execute methods over a number of frames or seconds
-   Exploring the 2D physics engine: Colliders, 2D effectors, 2D joints
-   Adding sound effects
- Creating physics materials and scripting


# Introduction
We will continue where we left off [last week](https://natalieagus.github.io/50033/2021/01/01/unityfornewborns.html) by trying to polish our game a little bit better with sound effects, animation, and platforms. As usual, Unity pros can jump straight to the [Checkoff](https://natalieagus.github.io/50033/2021/01/02/unityforbabies.html#checkoff) heading to find out more information about the required final state of this Lab without having to read all the details. 

# Animation 
Mario's animation is broken down into **four** main state:
1. Idle state, when he's not moving at all
2. Running state, when he's moving left or right
3. Skidding state, when he switches direction while running
4. Jumping state, when he's off the ground 

The Mario sprite given in the starter asset already contain the corresponding sprite that's suitable for each state, mainly `mario_idle, mario_jump, mario_run1, mario_run2, mario_run3,`and `mario_skid`. 

To begin animating a game object, we always an Animati


# Checkoff

![checkoff2](https://www.dropbox.com/s/uhdirkzz1q9dr55/checkoff2.gif?raw=1)
<!--stackedit_data:
eyJoaXN0b3J5IjpbMjYxMTgwMjI1LDE4NDMyMDU0NjYsLTEyNT
g1NjIxMzIsLTE4NTQ1MzM2ODYsNjY0NzAxMTc2LC0xNDkyOTM0
OTY2LDMxNDkwOTQ2OCwtMzM4NDc3ODc1LC0yMDEwNjU1NzgxLC
0zNjYwODY3OTAsOTU3NzM1OTkxXX0=
-->