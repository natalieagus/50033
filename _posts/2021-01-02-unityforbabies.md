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

To begin animating a GameObject, we need:
* An **Animator** element  attached to the GameObject,
* An **Animator Controller**, 
* and several **Animation Clips** to be managed by the controller. 

Right click inside the Animation folder in your Assets, and create an Animator Controller. Name it `MarioController`. 

![animatorcreate](https://www.dropbox.com/s/7h9rz8w0bwuoc9q/1.png?raw=1)

Then, **add an Animator element** to Mario, and load `MarioController` as the Animator controller, as shown:

![animatormario](https://www.dropbox.com/s/b5zrnkagarfylrm/2.png?raw=1) 


Open the **Animation tab** and you can see some kind of *state machine*. This will the place for us to edit the Animator and dictate which Animation Clip to play under certain condition. 

![animator](https://www.dropbox.com/s/cnnqaf8sdy3rurw/3.png?raw=1)

Now let's create some clips. The first clip we need to do is to *animate Mario running*. Click the **Animation tab** instead, and click on the *Create* button. 
![createclip](https://www.dropbox.com/s/04twws9hdbj9w9d/4.png?raw=1)

Now, click the **record** button, and you should see that the window turns red. 
![record](https://www.dropbox.com/s/ik8cj703rc8z389/5.png?raw=1)

The values on the right side represents the frame (60 frames per second). We can tell the clip 

# Checkoff

![checkoff2](https://www.dropbox.com/s/uhdirkzz1q9dr55/checkoff2.gif?raw=1)
<!--stackedit_data:
eyJoaXN0b3J5IjpbLTE1ODA4MzEzMjIsMTg0MzIwNTQ2NiwtMT
I1ODU2MjEzMiwtMTg1NDUzMzY4Niw2NjQ3MDExNzYsLTE0OTI5
MzQ5NjYsMzE0OTA5NDY4LC0zMzg0Nzc4NzUsLTIwMTA2NTU3OD
EsLTM2NjA4Njc5MCw5NTc3MzU5OTFdfQ==
-->