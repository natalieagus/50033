---
sidebar_position: 2
title: The Game Project
---

import ImageCard from '@site/src/components/ImageCard';
import ChatBaseBubble from "@site/src/components/ChatBaseBubble";

# Game Project

The Game Project is a **term-long group project worth 45%** of your overall course grade.

You will work in a team to design, develop, test, and present a complete video game. The project applies the game-design principles taught throughout the course, with particular emphasis on:

- iterative development
- meaningful gameplay
- player feedback
- user testing
- design justification
- responsible teamwork

### Repository

<span class="orange-bold">Create a public Github repository for your project</span>. You are also free to use Github/Gitlab/self-host. Simply paste the link during submission of each Checkpoint (2-5) on eDimension so that your teaching team can review your code during each checkoff.

## Project Overview

| Item                           | Requirement                                                                                     |
| ------------------------------ | ----------------------------------------------------------------------------------------------- |
| **Weightage**                  | **45%**                                                                                         |
| **Team size**                  | **4–6 students**                                                                                |
| **Game engine**                | Unity recommended, but other engines are allowed                                                |
| **Platform**                   | Any suitable platform                                                                           |
| **Genre**                      | Any                                                                                             |
| **Singleplayer / Multiplayer** | Either is acceptable                                                                            |
| **Expected gameplay**          | Approximately **15 minutes of meaningful gameplay**, including tutorial and reasonable restarts |
| **Development model**          | Iterative development through 5 checkpoints                                                     |
| **Final deliverables**         | Playable game, final GDD, gameplay recording, presentation, repository and peer review          |

The project difficulty is **not scaled according to team size**. A team of four is held to the same project expectations as a team of six.

You are free to build for PC, mobile, web, console, VR, or another suitable platform. There is no requirement to implement both singleplayer and multiplayer modes.

:::danger[Minimum Requirement]

Your final submission must contain a **minimally functional, compilable, and playable game**.

Failure to submit a playable game at the end of the term will result in failure of the course.

:::

## Project Checkpoints

Each checkpoint represents a progressively more complete version of your game.

Starting from **Checkpoint 2**, every checkpoint must include an **executable release** of the game.

| Checkpoint                                                 |    Week |  Weight | Expected Stage                             | Executable Release |
| ---------------------------------------------------------- | ------: | ------: | ------------------------------------------ | ------------------ |
| [**Checkpoint 1**](#checkpoint-1-draft-gdd)                |  Week 6 | **10%** | Game concept and design                    | Not required       |
| [**Checkpoint 2**](#checkpoint-2-first-playable-prototype) |  Week 8 |  **3%** | First playable prototype                   | **Required**       |
| [**Checkpoint 3**](#checkpoint-3-internal-testing-build)   | Week 10 |  **3%** | Core game loop and internal testing        | **Required**       |
| [**Checkpoint 4**](#checkpoint-4-user-testing-build)       | Week 12 |  **4%** | Near-final build and external user testing | **Required**       |
| [**Checkpoint 5**](#checkpoint-5-final-release)            | Week 13 | **25%** | Final game, GDD and presentation           | **Required**       |

### Executable Releases

:::danger[Checkpoint Releases]
For Checkpoints 2–5, you must provide a **standalone playable build** of your game and package it as **Github Release** or equivalent.
:::

You <span class="red-bold">must</span> package **each checkpoint build** as a **GitHub Release**. A Release is a fixed, downloadable snapshot of your game at that checkpoint, separate from your normal source-code history.

The teaching team should be able to download and run the submitted build **without opening the Unity Editor or compiling the project themselves**.

Examples include:

- Windows build packaged as a ZIP
- macOS application packaged as a ZIP
- Android APK
- WebGL build
- another suitable standalone build for your target platform

Recommended release naming:

- `v0.2-checkpoint-2`
- `v0.3-checkpoint-3`
- `v0.4-checkpoint-4`
- `v1.0` for the final submission

Attach the executable build to the corresponding GitHub Release.

:::note
Your **source code should continue to be maintained normally in your repository**. The Release is simply the fixed playable version associated with that checkpoint.
:::

## Project Development Stages

### Stage 1: Brainstorming and Game Design

**Weeks 1–4**

Start by exploring several possible game ideas before committing to one.

When evaluating your ideas, consider:

- completeness of the formal elements
- strength of the core mechanic
- familiarity with the genre
- technical feasibility
- project scope
- whether the idea can sustain approximately 15 minutes of meaningful gameplay

You should progressively narrow your ideas and document the selected concept in your **Game Design Document (GDD)**.

:::note
The GDD should explain not only **what** you intend to build, but also **why** you made the major design decisions.
:::

#### Checkpoint 1: Draft GDD

**Week 6 · 10%**

:::info[Checkpoint 1 Release]

#### Deliverable

Submit the **proposal-stage draft of your Game Design Document**.

**Due:** Friday, 23 October 2026, 09:00  
**Executable release:** Not required

[**GDD Template**](https://docs.google.com/document/d/1lHJUf-IeGTzXYDUF9l9ziWfCnvAeJA3BWRWDzdTA6vY/edit?usp=sharing)

[**Checkpoint Rubric**](https://docs.google.com/spreadsheets/d/1Wkg6RepJ_qm4G0Imsajb_64UxfumRszM5iDtrIPaoUo/edit?usp=sharing)

:::

#### What We Expect

Your draft should establish:

- game concept
- intended player experience
- core mechanics
- formal elements
- game rules
- proposed progression
- project scope
- initial division of responsibilities

This checkpoint is primarily about validating your **idea and scope** before significant development effort is committed. You will receive personalised, individualised feedback per group throughout Week 8.

### Stage 2: Early Development

**Weeks 5–8**

Begin implementing your digital prototype.

At this stage, focus on making the fundamental interaction work. Placeholder artwork, models, UI, and audio are acceptable.

The important question is:

> **Can someone run the game and experience the basic mechanic?**

#### Checkpoint 2: First Playable Prototype

**Week 8 · 3%**

:::info[Checkpoint 2 Release]

#### Required deliverables

1. **Executable prototype release**
2. Current source code pushed to your repository
3. Live checkpoint demonstration

Your executable should represent the **first independently runnable version of your game**.

:::

#### Rubric: Expected Development Stage

Your game does **not** need to look polished yet.

However, the fundamental interaction of the proposed game should now exist and be demonstrable.

| Area                                    | Weight | Expectation                                                                                                                                                                                                                                  |
| --------------------------------------- | -----: | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Player Character and Basic Mechanic** | **1%** | A controllable player character exists and the initial implementation of a simple game mechanic is functional. Placeholder assets are acceptable. Examples include jumping, shooting, movement or another mechanic appropriate to your game. |
| **Basic Animation**                     | **1%** | At least one form of animation is implemented to demonstrate player or enemy movement.                                                                                                                                                       |
| **Game Scene, Prefabs and Assets**      | **1%** | A preliminary game scene exists, either as a planned scene or implemented using placeholders. Approximately 2–3 useful prefabs or game assets should be created and ready for use.                                                           |

#### Executable Release Requirement

The submitted build should allow the teaching team to:

- launch the game
- control the player
- demonstrate the basic mechanic
- observe at least one animation
- enter or view the preliminary game environment

:::note

Placeholder sprites, models, sounds and environments are completely acceptable at Checkpoint 2.

The focus is on proving that the **game concept is technically viable**.

:::

### Stage 3: Core Game Loop and Internal Testing

**Weeks 9–10**

Development should now move beyond isolated mechanics.

Individual systems should begin forming a coherent **gameplay loop**.

At this stage, your team should be able to play a meaningful portion of the game internally and start identifying problems through playtesting.

#### Checkpoint 3: Internal Testing Build

**Week 10 · 3%**

:::info[Checkpoint 3 Release]

#### Required deliverables

1. **Playable executable release**
2. Current source code pushed to your repository
3. Live checkpoint demonstration

The submitted build should be sufficiently playable for your team to begin **internal playtesting**.

:::

#### Expected Development Stage

| Area                               | Weight | Expectation                                                                                                                                                                                                                                     |
| ---------------------------------- | -----: | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Core Game Loop with Polish**     | **1%** | A substantial portion of the main game loop is implemented and functional. Some sound effects and visual feedback should be present for player actions.                                                                                         |
| **Obstacles**                      | **1%** | Basic obstacles, challenges or equivalent gameplay elements have been implemented, and scene or level design has begun to take shape.                                                                                                           |
| **Player Control and Playability** | **1%** | Controls are more polished and actual sprites/models should increasingly replace placeholders. The game should be somewhat playable, with obstacles and an initial scoring, reward or equivalent progression system ready for internal testing. |

#### Executable Release Requirement

Someone launching the Checkpoint 3 build should be able to experience a recognizable portion of the intended game loop.

For example:

**Start → Play → Encounter challenge → Receive feedback/reward → Continue**

The exact loop will naturally differ depending on your game.

Compared with Checkpoint 2, the build should demonstrate clear progress in:

- player control
- visual presentation
- game feedback
- environment or level design
- obstacles or challenges
- scoring, rewards or progression
- overall playability

:::important

Checkpoint 3 should no longer feel like a collection of disconnected technical prototypes.

It should begin to feel like **a game**.

:::

### Stage 4: Advanced Development and User Testing

**Weeks 11–12**

Your game should now approach its intended final form.

By this stage, the majority of the important gameplay systems should exist and the build should be sufficiently stable for people **outside your development team** to test.

The objective now shifts from:

> "Can we implement this?"

to:

> "Does this actually produce a good player experience?"

#### Checkpoint 4: User Testing Build

**Week 12 · 4%**

:::info[Checkpoint 4 Release]

#### Required deliverables

1. **Near-final executable release**
2. Current source code pushed to your repository
3. Evidence of external user testing
4. Live checkpoint demonstration

The submitted executable should be suitable for testing by someone who is **not part of your development team**.
:::

#### Expected Development Stage

| Area                                               | Weight | Expectation                                                                                                                                                                                   |
| -------------------------------------------------- | -----: | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Core Game Loop with Polish**                     | **1%** | The main mechanic should be smooth and free of significant bugs. The build should provide at least **2–3 minutes of continuous gameplay**, or allow completion of the first meaningful stage. |
| **Player Feedback**                                | **1%** | Visual and auditory feedback should be integrated throughout the game, such as environmental ambience, menu feedback and feedback for player actions.                                         |
| **Iterative Improvement and Playtesting Feedback** | **1%** | Show evidence of feedback from at least **two external testers**, together with identified concerns and improvements made or planned as a result of testing.                                  |
| **UI and Controls**                                | **1%** | The game should contain appropriate progress-tracking UI, such as score or level indicators, together with functional controls such as a main menu or pause system.                           |

#### Executable Release Requirement

The Checkpoint 4 build should be sufficiently self-contained that an external tester can meaningfully play it.

A tester should be able to:

1. launch the game
2. understand how to begin
3. control the game without developer intervention
4. experience the core gameplay loop
5. receive appropriate visual and auditory feedback
6. understand basic progress or game state
7. complete at least a short meaningful segment of gameplay

#### External User Testing

You must test the game with at least **two people outside your project team**.

For each testing session, record concise observations such as:

| Observation                              | Player Feedback / Behaviour     | Action Taken                                              |
| ---------------------------------------- | ------------------------------- | --------------------------------------------------------- |
| Player repeatedly missed the jump        | Jump timing was unclear         | Increased anticipation animation and adjusted jump timing |
| Player did not notice health was low     | Health feedback was too subtle  | Added stronger visual and audio feedback                  |
| Player could not find the next objective | Level guidance was insufficient | Added environmental cues                                  |

You do not need to write an essay.

The important part is demonstrating the cycle:

**Test → Observe → Identify Problem → Improve → Test Again**

:::tip

Do not rely only on asking testers whether the game is "fun".

Watch what they actually do.

Confusion, repeated mistakes, hesitation, unexpected strategies and ignored UI elements are often more useful than verbal feedback.

:::

### Stage 5: Final Polish

After Checkpoint 4, concentrate on turning the tested build into a <span class="red-bold">coherent final experience</span>.

Prioritise:

- major bug fixes
- game balance
- player feedback
- game feel
- UI and UX
- visual consistency
- audio
- onboarding and tutorial
- level progression
- overall polish

Avoid adding large new systems unless they are genuinely necessary.

#### Checkpoint 5: Final Release

**Week 13 · 25%**

:::danger[Final Project Release]

#### Required deliverables

1. **Final executable release**
2. Final source code in your repository
3. **Final Game Design Document**
4. Gameplay recording
5. Final presentation
6. Peer review

**Due:** Friday, 11 December 2026, 11:00

**Presentation:** Friday, 11 December 2026, 11:30–15:30

[**Final Project Rubric**](https://docs.google.com/spreadsheets/d/1Wkg6RepJ_qm4G0Imsajb_64UxfumRszM5iDtrIPaoUo/edit?usp=sharing)

:::

The final executable represents the version of the game that will be graded.

:::danger[Minimum Requirements]

The final game must be **functional, compilable and playable**.

Always test the exact executable package that you submit.

A project that works only inside your development environment is **not considered a playable release**.

:::

### Final Presentation

The final presentation should focus primarily on **your game and the player experience**.

Think of it as a **game showcase**, rather than a technical conference presentation.

Show us:

- what makes your game interesting
- the core gameplay
- your strongest features
- what makes the player experience unique
- how the game evolved through iteration and testing

A **live demonstration or gameplay video is essential**.

You may invite members of the audience to try your game where appropriate.

You do not need to spend significant presentation time showing source code or explaining implementation details unless they are particularly relevant to the game.

You may prepare approximately **5–6 slides** to support your presentation. The slides themselves are not graded.

Presentation order will be randomised unless there is a valid scheduling conflict communicated to the instructors beforehand.

## Game Design Document

The **Game Design Document (GDD)** should evolve together with your game throughout the semester.

It should document both the final game and the reasoning behind its development.

Your GDD should make it possible to understand:

- game concept
- intended player experience
- core mechanics
- formal elements
- important design decisions
- application of relevant course concepts
- major design changes
- playtesting findings
- iterations made in response to testing
- responsibilities assigned to each team member

:::important[Keep the Tasks Section Updated]

Record the responsibilities agreed upon by each team member throughout the project.

If responsibilities change, record the new agreement.

This information may be used if there is later a disagreement regarding peer-review ratings.

:::

## Project Budget

Each team may claim up to **S$50** for approved project assets, such as:

- 2D assets
- 3D assets
- audio assets
- game controllers
- other relevant project resources

Obtain approval from the instructor before making a purchase intended for reimbursement. The budget is self-sponsored by the instructor.

## Peer Review

The project uses a **multiplier-based peer-review system**.

Peer review does not contribute a separate percentage to the course grade. Instead, it may scale your individual Game Project grade according to how reliably you completed the responsibilities agreed upon by your team.

:::danger[Peer Review is Mandatory]

Completion of the peer-review process is **mandatory** to receive your individual Game Project grade.

:::

### What You Are Rating

In Week 13, you will rate:

- every other member of your team
- **yourself**

Ratings use a continuous scale from **0 to 10**.

The rating should reflect how completely and responsibly each person fulfilled the **work that the team agreed they were responsible for**.

Peer review is **not intended to compare absolute workload**.

Different members may have different responsibilities depending on their strengths and skills. What matters is whether each member completed the responsibilities agreed upon by the team.

### Rating Guide

|   Rating | Approximate Completion | Interpretation                                                       |
| -------: | ---------------------: | -------------------------------------------------------------------- |
|    **0** |                     0% | No meaningful contribution to assigned responsibilities              |
| **>0–1** |                  5–10% | Very little of the agreed work completed                             |
|  **2–3** |                 10–30% | Significant portions of assigned work left for others                |
|  **3–4** |                 30–40% | Less than half of assigned work completed                            |
|  **4–6** |                 40–60% | Partial completion, with substantial work remaining                  |
|  **6–7** |                 60–70% | Good effort, but a meaningful portion remained incomplete            |
|  **7–8** |                 70–80% | Most responsibilities completed, with some unfinished work or polish |
| **9–10** |               90–100%+ | Assigned responsibilities completed well and responsibly             |

Intermediate scores may be used.

For example, **7.5** approximately represents someone who successfully completed around **75% of their agreed responsibilities**.

If you give another team member a rating below **10**, provide a short justification. Bullet points are sufficient.

## Effective Project Grade

Your individual Game Project grade is calculated using your team's project grade and your peer-review multiplier.

Your own self-rating is **not included** when calculating your peer average.

The ratings submitted by your teammates are averaged and then rounded up before being converted to the multiplier.

For example:

|                             |              |
| --------------------------- | -----------: |
| Team Project Grade          |  **40 / 45** |
| Peer Average Rating         | **6.5 / 10** |
| Rounded Rating              |   **7 / 10** |
| Multiplier                  |      **0.7** |
| **Effective Project Grade** |  **28 / 45** |

Therefore:

**Effective Project Grade = Team Project Grade × Peer Multiplier**

In this example:

**40 × 0.7 = 28 / 45**

If your peer rating is **10/10**, you retain the full team project grade.

:::note

If your self-rating differs substantially from the average rating given by your teammates, you may challenge the result.

Use the **Tasks** section of your GDD, repository history and other written records as evidence of the responsibilities agreed upon and the work completed.

Contact the instructor as soon as possible if you believe a peer-review result requires review.

:::
