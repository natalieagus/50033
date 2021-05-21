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

The values on the right side represents the frame (60 frames per second). We can change any element on Mario and it will be automatically recorded. For example, we can do the following actions:
1. Click on Frame 0, and then change Mario's sprite into `mario_run1`
2. Click on Frame 5, and then change Mario's sprite into `mario_run2`
3. Click on Frame 10, then again change Mario's sprite into `mario_run3`
4. Click on Frame 15, and keep Mario's sprite at `mario_run3`

At the end, you should see something like on the Animation tab. Click play on the right side (inspector window) to observe the animation. You're free to edit which frame to show whichever sprite, as long as you're happy that the output is smooth. 

![run](https://www.dropbox.com/s/fslieknnpwvywdn/6a.png?raw=1)

To create more clip, click the dropdown containing the animation clip name (e.g: *Run* in the screenshot above) on the left, just under the record button. 

Do the same to obtain the skidding, jumping, and idle animation. For idle animation, you simply don't have to record anything. Below is the screenshot of suggested animation clips:

![animclips](https://www.dropbox.com/s/b7zn99la5t9j2id/7.png?raw=1)

For the jumping animation, we need to do more than just a sprite change. We want to have a **sound effect** as well:
1. Add AudioSource element to Mario, and load the sound `smb_jump-small` to the AudioClip. Disable it and ensure that Play On Awake is also disabled
2. During the first frame of the clip, enable it and also click Play On Awake
3. During the fourth frame of the clip, disable it. 


## Transition
Now head to the Animator tab, and you now see all the clips as separate **states**. We need to now draw the *transitions*. You can right click on each state to make transition, and click on the destination state. Make something like this:

![statemachine](https://www.dropbox.com/s/q9fidx7lu8u9gpk/8.png?raw=1)

### Animator Parameters
To enable correct transition conditions, we need to create **parameters**. These parameters will be used to trigger transition between each animation clip (motion). Create these three parameters:
1. `onGround` of type `bool`
2. `xSpeed` of type `float`
3. `onSkid` of type `trigger` (a boolean parameter that is **reset** by the controller when consumed by a transition)

Here's all the parameters that you should have in the end:
![params](https://www.dropbox.com/s/jzs519y7evy8it0/9.png?raw=1) 

Now it's time to manage the transitions. Let's consider the transition from **idle** state into **run** state. This transition should happen if Mario's speed is larger than a certain number. Click on the arrow pointing from idle state to run state, and set its inspector to be the following:

![transit1](https://www.dropbox.com/s/b4q3f7rnaenp2mo/10.png?raw=1)

Pay attention to the following settings:
1. **Conditions**: Utilises the *Parameters* to trigger this transition. It is right now set to be triggered when `xSpeed` parameter value is greater than 0.01. We will of course control this value via `PlayerController.cs` script later on. 
2. **Has Exit Time**: Make sure this is unticked, so that transition happens **immediately**. Otherwise, we need to wait for the entire clip to finish (however many frames you set it to be). 
3. **The transition graph**: It tells us whether to fade or mix between the current clip and the next clip *if exit time is enabled*. Right now the setting is such that we transit **abruptly** so the graph doesn't matter. 

Let's take a look at another transition where we **want  to have an *exit* time**, that is the transition between **skidding state** and **running state**. What we want is for the entire skidding state to **complete** (all frames played) before transitioning to the running state. The transition itself takes **no time**. 

You can read more about transition properties [here](https://docs.unity3d.com/Manual/class-Transition.html). 

![transit2](https://www.dropbox.com/s/5quef0fzzdnapcw/11.png?raw=1)
 
For the rest of the transition arrows, make use of the parameters in a way that you seem fit, for example, transition between jump and run should happen when `onGround` is `false` and when `xSpeed` is greater than `0.01`, and so on. 

## Controlling Animator Parameters via Script


# Checkoff

![checkoff2](https://www.dropbox.com/s/uhdirkzz1q9dr55/checkoff2.gif?raw=1)
<!--stackedit_data:
eyJoaXN0b3J5IjpbMTEzNTc2MDYyNiwxNjQ2NTEzMzU0LDg4Nj
UzODksMTg0MzIwNTQ2NiwtMTI1ODU2MjEzMiwtMTg1NDUzMzY4
Niw2NjQ3MDExNzYsLTE0OTI5MzQ5NjYsMzE0OTA5NDY4LC0zMz
g0Nzc4NzUsLTIwMTA2NTU3ODEsLTM2NjA4Njc5MCw5NTc3MzU5
OTFdfQ==
-->