---
layout: post
title: Unity for Newborns
---
* TOC
{:toc}

# Important Notice
The contents of these labs are made to teach and stress some learning points and for mere “practice”; getting used to the terms, etc.

By no means we claim that they are the best practice, in fact some of the ways may be convoluted and they won’t be done exactly this way by experienced coder but we can’t teach the “best practices” right away because it relies on many prior knowledge.

Experienced coders: keep in mind that you too were once a noob. You made mistakes.

*If you realise that some parts are troublesome or ineffective, then good for you. It means that you’re **smart** and **experienced**, and from now on you can embark on the journey to customize it to a more fitting way: simpler, better, more efficient, whatever it is. You can tell our teaching team your personal opinion, and constructive criticism is always welcome after class. We however expect a certain kind of mutual respect during the lab hours.*

# Learning Objectives: 2D Basics

-   Unity editor: layout, arrangements of project files
-   Edit scene, add GameObject & elements, create prefabs
-   C# scripting basics   
-   Physics simulation basics: RigidBody2D, Collider2D
-   Binding keys for input
-   UI elements: Canvas, Text, Button
-   Unity Life Cycle introduction and callback functions: Update(), Start(), OnTriggerEnter(), etc.
-   Basic experience on events: OnClick() for Button


# Classic Mario
![Mario](https://www.dropbox.com/s/2qg4ix622q0zfta/mario.png?raw=1)

The goal of this simple lab is to recreate the classic platformer game: **Mario**, step by step and complete it by the end of Week 4. In Week 5 & 6, we upgrade our skills to explore Unity3D.

## Preparation
Download the assets [here](something)

Before we begin, create a **new unity project**.
![newproject](https://www.dropbox.com/s/90e1wy14v2nabp0/1.png?raw=1)

Then, import the asset you downloaded. You should see a list of assets on the Project tab in the Unity editor. 

It is also crucial to have a good code editor. Add your own script editor as shown. *Visual Studio Code is recommended.*
![add editor](https://www.dropbox.com/s/nzxmhogb9wfjfv7/2.png?raw=1)
  

See the guide : [https://code.visualstudio.com/docs/other/unity](https://code.visualstudio.com/docs/other/unity). For Mac users, simply: `brew install mono` on top of what the guide above told you to do. If you are NOT familiar with installing SDK or frameworks or editing `.json` files then just use the easy **MonoDevelop IDE** instead (heavier, not as pretty, but saves you the hassle).

Finally, check if `dotnet` is installed:
![dotnet check](https://www.dropbox.com/s/anhmyp4nlqe88c1/3.png?raw=1)


<!--stackedit_data:
eyJoaXN0b3J5IjpbMjE3NTE0ODM5XX0=
-->