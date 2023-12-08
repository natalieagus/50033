---
sidebar_position: 1
---

import CollapsibleAnswer from '@site/src/components/CollapsibleAnswer';
import DeepDive from '@site/src/components/DeepDive';
import ImageCard from '@site/src/components/ImageCard';
import ChatBaseBubble from '@site/src/components/ChatBaseBubble';
import VideoItem from '@site/src/components/VideoItem';
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# ScriptableObject Game Architecture

:::caution Lab Checkoff Requrements
The lab handout uses Super Mario Bros as assets to demonstrate certain Unity features and functionalities. You are free to follow along and submit it for checkoff, **OR you can also create an entirely new project to demonstrate the requested feature(s)**.

The requirement(s) for the lab checkoff can be found [here](./checkoff.md).
:::

:::note
This [amazing talk](https://www.youtube.com/watch?v=raQ3iHhE_Kk) inspires the existence of this section. We simply do not have enough time (unfortunately) to go into every single detailed implementation of common concepts such as game inventory, skill tree, etc but we hope that this quick introduction will point you into the right direction in the future.
:::

This topic covers an entirely new game architecture which separates data from code to make your game more maintanable and all around pleasant to work with. You can choose to go down the Singleton Pattern Path for some appropriate parts of your project and utilise SO Architecture for others. The SO Architecture is <span className="orange-bold">not</span> strictly a replacement for the Singleton Pattern.

For example, Singleton Pattern and static pattern is ideal when you have a cache or repository for frequently accessed data (e.g., a level cache, asset loader, or a global configuration), as they can provide easy access from anywhere in the game without passing references explicitly. Singleton can be helpful to maintain <span className="orange-bold">consistency</span> and <span className="orange-bold">centralize control</span>.

On the other hand, SO Architecture is superior in promoting modularity and reusability, such as when you are creating different enemy types or power-ups, or creating **reusable** systems like event systems, dialogue systems, or inventory management systems that can be easily shared between different game elements. The SO Architecture provide for easy tweaking and tuning without code changes.

The decision regarding which approach to embrace is entirely yours. However, we take it upon ourselves to introduce you to another excellent game architecture leveraging Scriptable Objects. You'll need to overhaul your current lab project, but the advantages make it worthwhile:

- Scenes are clean slates
- No dependency between Systems and they are modular
- Prefabs work on their own
- Pluggable custom components

:::note Prototyping with your project idea
Since you would have to start prototyping your project anyway, it will be good to apply this week's lab for that. Think about small features in your game that you need to implement as proof of concept. However, feel free to still follow along and use the Mario assets if you want.
:::

## Preparation

We need at least two Scenes with completely clean slate. That’s right. <span className="orange-bold">Clean Slates</span>. We can’t reuse any of these Scripts anymore: GameManager, PowerupController, PlayerController, etc. To get you up to speed, you can:

1. Copy your main menu or loading scene if any, and World-1-1 and World-1-2 into a new folder
2. Copy all prefabs used in these two worlds into a new folder, name it something else
3. Replace the prefabs with the new prefabs (same, just another copy)
4. Remove **all scripts** attached to any GameObject, do the same for the new set of prefabs

Here's a complete recording on what we do to prepare for this lab. Lots of the setup is about step 3 above. If you want to simply copy the entire project and work on the copy directly, you may do so.

<VideoItem path={"https://50033.s3.ap-southeast-1.amazonaws.com/week-5/setup.mp4"} widthPercentage="100%"/>

:::playtest
If your main menu and loading screen is simple, you may leave it as-is. Some error might pop up because the event called in some animation clip, e.g: mario-jump animation doesn't exist and it's fine. We can fix that later. Also, do not forget to update the **build setting** to include these new scenes instead. The setting can be found at File >> Build Settings.
:::

## The Singleton Architecture

If you've been following the lab faithfully so far, your current game architecture utilising Singletons is somewhat as follows:

<ImageCard path={require("./images/singleton-archi.png").default} customClass="invert-color" widthPercentage="100%"/>

It's _decent_, in a way that there's no cross-referencing between scripts attached to gameObject instances, **except** to Singletons: `GameManager` and `PowerupManager`. Most chain of actions are triggered via events. Let's recap the event flow for powerup-related events and score change.

### Powerup Collection

Every Powerup box (brick or question box) is controlled by a script inheriting `BasePowerupController`.

- Whenever Mario hits a box (brick or question box), the `OnCollisionEnter2D` will be called by Unity, which will trigger an <span className="orange-bold">Animation</span> (bouncing box, etc).
- From this animation, we call `SpawnPowerup()` on the powerup inside the box. Any powerup (coin, starman, magic mushroom, and one-up mushroom) are spawned via `SpawnPowerup()` method. `SpawnPowerup()` **invokes** `powerupCollected` event in PowerupManager Singleton, passing **reference** to itself in the process

This calls the subscribers of `powerupCollected`: `FilterAndCastPowerup` which decides whether to invoke `powerupAffectsManager` or `powerupAffectsPlayer` based on the type of powerup invoking the event.

The subscribers of `powerupAffectsPlayer` or `powerupAffectsManager` (Mario or Manager) will then be called. Any gameObject subscribing to these two `powerupAffectsX` event should conform to `IPowerupApplicable` interface containing `RequestPowerupEffect` method, which is the method subscribing to `powerupAffectsX` event.

In `RequestPowerupEffect`, one simply passes itself (`this`) to the powerup triggering the chain of events from the start by calling `i.ApplyPowerup(this)`. Then, the **actual** implementation (how this powerup is affecting `this`) is implemented in that powerup script itself.

For instance, when Mario hits a question box containing MagicMushroom, it triggers `SpawnPowerup()` which will animate the spawning of the MagicMushroom.

- When Mario <span className="orange-bold">collides</span> with the MagicMushroom, `OnCollisionEnter2D` on MagicMushroom's BasePowerup will be triggered, which will **invoke** `powerupCollected` event, passing itself in the process.
- `FilterAndCastPowerup` (<span className="orange-bold">subscriber</span> of `powerupCollected`) will examine the `PowerupType` triggering this event (which is MagicMushroom) and hence it <span className="orange-bold">invokes</span> `powerupAffectsPlayer` event, passing MagicMushroom instance as the argument.
- This <span className="orange-bold">triggers</span> the callback `RequestPowerupEffect` in `PlayerMovement.cs` attached on Mario.
  - In `RequestPowerupEffect`, we pass `this` (which is Mario gameobject instance) to MagicMushroom via `ApplyPowerup` method.
- Finally, in the MagicMushroomPowerup script we can decide _what the effect of this powerup is to Mario_: which is to call `MakeSuperMario()` method implemented in `PlayerMovement`.

:::note
This is just one of the suggested method to prevent cross-referencing of scripts that needed to be done manually via inspector during runtime. The main idea is to modularise the implementation of the powerup effect as much as possible, implementing parts concerning that instances in the instance script and nowhere else. For instance: it is the MagicMushroom's responsibility to call Mario's: MakeSuperMario, and it is Mario's responsibility to decide what "Super Mario" should be.
:::

### Score Update

There are two ways currently to increase the current score: by stomping on Goomba from above or spawning a coin. Both `EnemyController` and `CoinPowerup` calls `GameManager.instance.IncreaseScore(int value)` anytime those conditions are valid. This calls the `SetScore` method inside `GameManager`, which invokes the `scoreChange` event and eventually triggers its subscriber: `SetScore` in `HUDManager` to update the UI. The actual score is stored at `GameScore`, an `IntVariable` Scriptable Object, which is updated inside `IncreaseScore` method.

## Thoughts

The Singleton pattern ensures that a class has only one instance and provides a global point of access to that instance. In Unity, it is often used to manage game-wide systems or managers that need to exist throughout the entire game's lifetime. They are commonly used for managing things like GameManager, AudioManager, UIManager, InputManager, and other central systems. These classes need to be accessible from different parts of the game, and a Singleton pattern ensures there is only one instance to coordinate these tasks. It is relatively easy to implement, but can lead to <span className="orange-bold">tight coupling</span> between the systems as discussed before. It can also be cumbersome to sharing data between different scenes or across multiple game objects.

We also utilise some Scriptable Objects to manage data assets (like score) that can be shared across different parts of the game, including scenes, game objects, and scripts. They are primarily used for _storing_ and _sharing_ data.

## Scriptable Object Game Architecture

In this new game architecture, we take everything one step further to promote a more modular and decoupled architecture. There's **no** interaction between scripts (well, at least not between scripts of unrelated gameObjects, interaction between scripts in the same perfab is understandable).

We first create various `GameEvents` based on Scriptable Objects. Each instance can subscribe to it `OnEnable()`, and unsubscribe from it `OnDisable()`. As per the previous lab, we also use SO to store persistent data so that new instances in the next scene can load values from there. This way, we do not need to implement any object as a Singleton.

A sketch of the architecture is as follows:

<ImageCard path={require("./images/soga-arch.png").default} customClass="invert-color" widthPercentage="100%"/>

### Scriptable Object Event System

Create two new scripts called `GameEvent.cs` and `GameEventListener.cs`. This SO-based event will store a **list** of `GameEventListeners`, and notify them whenever the GameEvent is **Raised**.

<Tabs>
<TabItem value="1" label="GameEvent.cs">

```cs
using System.Collections.Generic;
using Unity.VisualScripting;
using UnityEngine;


public class GameEvent<T> : ScriptableObject
{
    private readonly List<GameEventListener<T>> eventListeners =
        new List<GameEventListener<T>>();

    public void Raise(T data)
    {
        for (int i = eventListeners.Count - 1; i >= 0; i--)
            eventListeners[i].OnEventRaised(data);
    }

    public void RegisterListener(GameEventListener<T> listener)
    {
        if (!eventListeners.Contains(listener))
            eventListeners.Add(listener);
    }

    public void UnregisterListener(GameEventListener<T> listener)
    {
        if (eventListeners.Contains(listener))
            eventListeners.Remove(listener);
    }
}
```

</TabItem>

<TabItem value="2" label="GameEventListener.cs">

```cs

using UnityEngine;
using UnityEngine.Events;

// if attached to an object that might be disabled, callback will not work
// attach it on a parent object that wont be disabled
public class GameEventListener<T> : MonoBehaviour
{
    public GameEvent<T> Event;

    public UnityEvent<T> Response;

    private void OnEnable()
    {
        Event.RegisterListener(this);
    }

    // This is also called when the object is destroyed and can be used for any cleanup code. When scripts are reloaded after compilation has finished, OnDisable will be called, followed by an OnEnable after the script has been loaded.
    private void OnDisable()
    {
        Event.UnregisterListener(this);
    }

    public void OnEventRaised(T data)
    {
        Response.Invoke(data);
    }
}

```

</TabItem>
</Tabs>

These are currently of a `generic` type because `UnityEvent` can have any varying signature: zero parameter, one parameter, etc. For the sake of the lab, we need at least three different types: no argument, a single `int` type argument, and a single `IPowerup` type argument. For each type, we need a pair of scripts: the GameEvent and the GameEventListener variant.

The following creates the "no argument" variant:

<Tabs>
<TabItem value="1" label="SimpleGameEvent.cs">

```cs
using System.Collections;
using System.Collections.Generic;
using UnityEngine;
// no arguments
[CreateAssetMenu(fileName = "SimpleGameEvent", menuName = "ScriptableObjects/SimpleGameEvent", order = 3)]
public class SimpleGameEvent : GameEvent<Object>
{
 // leave empty
}
```

</TabItem>

<TabItem value="2" label="SimpleGameEventListener.cs">

```cs
using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class SimpleGameEventListener : GameEventListener<Object>
{

}
```

</TabItem>
</Tabs>

Do the same for the other two types.

<VideoItem path={"https://50033.s3.ap-southeast-1.amazonaws.com/week-5/setup-events.mp4"} widthPercentage="100%"/>

### Create Game Events

When done, create some SO Game Events as follows (your actual number of events may vary, but if we follow the suggested diagram then you shall make 11 events). Rename them properly based on their type.

<VideoItem path={"https://50033.s3.ap-southeast-1.amazonaws.com/week-5/create-game-events.mp4"} widthPercentage="100%"/>

### Subscribe/Register to Game Events with GameEventListener

Once created, each `GameEvent` serves as a "container" that store a list of GameEventListeners. Whenever any script calls their `Raise` method, it will call the `OnEventsRaised` method on all of its GameEventListener (subscribers), which will then call a list of methods registered under `Response` in `GameEventListener`. For instance, we want to **reset** our Camera to its starting location whenever `OnGameRestart` event is Raised. When we were using the Singleton Method, we first register some callback `GameRestart()` in `CameraController.cs`:

```cs title="CameraController.cs" showLineNumbers
    void Start()
    {
        GameManager.instance.gameRestart.AddListener(GameRestart);
    }

    void GameRestart()
    {
        // reset camera position
        transform.position = startPosition;
    }
```

**Delete** line 3 above, and we register `GameRestart` as a callback to `OnGameRestart` Game Event using `SimpleGameEventListener` Script component as follows:

<ImageCard path={require("./images/scriptobjgamearch/2023-09-22-16-16-26.png").default} widthPercentage="100%"/>

The `Event` field of the SimpleGameEventListener script is linked to `OnGameRestart` SO GameEvent, and as its `Response`, we register `CameraController`'s `GameRestart()` method. When another script calls `OnGameRestart.Raise()`, this will automatically cause `OnGameRestart` to loop through its `SimpleEventGameListeners` and call `OnEventRaised()` on it. This will then trigger `Response.Invoke()` where `Response` contains `GameRestart()` method from `CameraController`. Finally, the method `GameRestart()` is performed on the `CameraController`'s <span className="orange-bold">instance</span>.

What is this _other_ script who can call `OnGameRestart.Raise()`? One possible candidate is the `RestartButtonController`. We can have a following script:

```cs title="RestartButtonController.cs"

    public UnityEvent gameRestart;

    void ButtonClick()
    {
        gameRestart.Invoke();
    }

```

Attach this to the restart Button, and set `ButtonClick()` as the callback of the button component. Then link `OnGameRestart` SimpleGameEvent SO as `gameRestart` UnityEvent that is invoked by clicking the restart button.

<ImageCard path={require("./images/scriptobjgamearch/2023-09-22-16-25-30.png").default} widthPercentage="100%"/>

Now you can ask Mario and Goomba to do the same: attach a SimpleGameEvent script to both gameObjects, with `events` field referring to SO `OnGameRestart` and a `GameRestart()` callback in each of its controller as follows. The video below also shows that each gameObject (e.g: Mario) can contain multiple `GameEventListeners` so that you can register various callbacks from any script in that gameObject.

<VideoItem path={"https://50033.s3.ap-southeast-1.amazonaws.com/week-5/game-restart.mp4"} widthPercentage="100%"/>

:::note
It is <span className="red-bold">important</span> for you to be able to trace properly the chain of events that make this works. The following diagram illustrates what actually happened from the moment restart button is clicked to the moment all `GameRestart()` functions in the scripts attached to Mario, Camera, and all Goombas are called:

<ImageCard path={require("./images/gamerestart-soga.png").default} customClass="invert-color" widthPercentage="100%"/>
:::

## Migrate

Now that you know how ScriptableObject Event System work, carefully migrate your entire project (all scenes) to adopt this new event system.

- Delete each old `GameManager.instance.[event].AddListener(CallbackMethod)` line, and replace it by attaching the corresponding `GameEventListener` script to the GameObject
- Ensure that you select the correct `GameEventListener` type (no argument, `int`, or `IPowerup` type argument)
- Link up the right `GameEvent` in the Inspector to match that `[event]` you are replacing
- Link up `CallbackMethod` at the `GameEventListener` Inspector. Make sure that this method is <span className="orange-bold">public</span>

After a few tries, the procedure should be quite standard. Firstly, create the `GameEvent`s.

Secondly, figure out which callback methods should be run for each event. Create a `public` callback method where you will handle a particular event in a script. Then, on the same gameObject where that script is attached to, add a `GameEventListener` script with that `public` method as the `Response`.

Thirdly, figure out which scripts shall `Raise` the events. To `Raise` a `GameEvent`, attach that `GameEvent` `Raise` method as a listener to `public UnityEvent event` member in that script that wants to _cast_ (raise) it, for as written in the `RestartButtonController` above.

Here's a quick video for your reference:

<VideoItem path={"https://50033.s3.ap-southeast-1.amazonaws.com/week-5/migrate.mp4"} widthPercentage="100%"/>

:::caution For reference only
Your actual implementation might differ and that's alright, so don't be alarmed. As long as the game works as intended with this new architecture, that's fine.
:::
