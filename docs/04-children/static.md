---
sidebar_position: 2
---

import CollapsibleAnswer from '@site/src/components/CollapsibleAnswer';
import DeepDive from '@site/src/components/DeepDive';
import ImageCard from '@site/src/components/ImageCard';
import ChatBaseBubble from '@site/src/components/ChatBaseBubble';
import VideoItem from '@site/src/components/VideoItem';
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# C# Quick Tour

We shall refactor our existing game further so that it becomes more modular and maintainable, especially when we want to create multiple **scenes** (stages) in our game.

## C# Static Variable

When a variable is declared as static, then a **single** copy of the variable is created and shared among all objects at the class level. Static variables are accessed with the **name** of the class, they do not require any instance for access. In the Singleton class, we define `instance` getter and setter:

```cs
    private static T _instance;
    public static T instance
    {
        get
        {
            return _instance;
        }
    }
```

### Utilise `static instance` with Singleton

This allows any Singleton to be referenced directly by other scripts as such:

<Tabs> 
<TabItem value="1" label="PlayerMovement.cs">

```cs title="PlayerMovement.cs"

    void Awake(){
        // other instructions
        //highlight-start
        // subscribe to Game Restart event
        GameManagerWeek4.instance.gameRestart.AddListener(GameRestart);
        //highlight-end
    }

```

</TabItem>

<TabItem value="2" label="EnemyManager.cs">

```cs
    void Awake()
    {
        // other instructions
        //highlight-start
        GameManagerWeek4.instance.gameRestart.AddListener(GameRestart);
    //highlight-end
    }

```

</TabItem>

<TabItem value="3" label="HUDManager.cs">

```cs

    void Awake()
    {
        // other instructions
        //highlight-start
        // subscribe to events
        GameManagerWeek4.instance.gameStart.AddListener(GameStart);
        GameManagerWeek4.instance.gameOver.AddListener(GameOver);
        GameManagerWeek4.instance.gameRestart.AddListener(GameStart);
        GameManagerWeek4.instance.scoreChange.AddListener(SetScore);
        //highlight-end

    }
```

</TabItem>

</Tabs>

This way, we <span className="orange-bold">remove</span> references to `PlayerMovement` and `EnemyManager` instance from `GameManager` Singleton, going from here:
<ImageCard path={require("./images/static/2023-08-24-11-52-07.png").default} widthPercentage="100%"/>

... to here:

<ImageCard path={require("./images/static/2023-08-24-12-02-34.png").default} widthPercentage="100%"/>

:::caution
We need to ensure that GameManager Singleton is created _before_ we try to reference `instance` in each `Awake()` function via other scripts above. Ensure your order of execution prioritizes GameManager first:
<ImageCard path={require("./images/static/2023-08-24-14-02-56.png").default} widthPercentage="100%"/>
:::

### Remove Mario and HUDManager Singleton

We can then <span className="orange-bold">only</span> put GameManager under `DontDestroyOnLoad`, while the rest of the objects (Mario, Canvas, Enemies, etc) can remain normal (new instance per scene). A few housekeeping:

1. Ensure that Mario does **not** refer to GameManager instance on the scene, <span className="orange-bold">all</span> references to `GameManager` should be obtained via `static instance` property.
2. Ensure that `GameManager` is a **root** GameObject, best if it does NOT have any children. You can easily make a mistake referring to GameManager's children who are not Singletons

Don't forget to <span className="orange-bold">remove</span> subscription to `activeSceneChanged` in `PlayerMovement.cs` because your Mario will not need to "reset" its position anymore in the new scene.

### Restart Button

Initially, the restart button is made to call `GameRestart` function at that scene's GameManager instance.
<ImageCard path={require("./images/static/2023-08-24-13-39-56.png").default} widthPercentage="100%"/>

You need to call `GameRestart` via script instead. Create a new script called `ButtonController.cs`:

```cs title="ButtonController.cs"
    public void ButtonClick()
    {
        GameManagerWeek4.instance.GameRestart();
    }
```

Then attach the script to the restart button, and select the `ButtonClick()` function as a callback.

<ImageCard path={require("./images/static/2023-08-24-13-42-53.png").default} widthPercentage="100%"/>

:::note
If your button somehow is **not** Clickable in `World-1-2`, remember to check if you have the `EventSystem` enabled with the **new** InputSystem:

<ImageCard path={require("./images/static/2023-08-24-13-44-04.png").default} widthPercentage="100%"/>

Typically this will be automatically created the moment you create any interactive UI GameObject.
:::

### Setting Score Upon Scene Change

You may not need to reset Mario's position anymore because you have a new Mario instance in World-1-2 that you have placed in the correct starting position. However, the GameManager must do some housekeeping:

1. Remove the HUD when scene changes, this used to be done at `Start()` in GameManager
2. Set the score to curent score (from World-1-1)

The GameManager can now subscribe to `activeSceneChanged`:

```cs title="GameManager.cs"
using UnityEngine.SceneManagement;


    void Start()
    {

        gameStart.Invoke();
        Time.timeScale = 1.0f;
        //highlight-start
        // subscribe to scene manager scene change
        SceneManager.activeSceneChanged += SceneSetup;
        //highlight-end
    }

    public void SceneSetup(Scene current, Scene next)
    {
        gameStart.Invoke();
        SetScore(score);
    }

```

If everything works right, you can then have <span className="orange-bold">everything</span> (HUD, Mario, GameManager) in each World independently (for testing):

<VideoItem path={"https://50033.s3.ap-southeast-1.amazonaws.com/week-4/singleton-static.mp4"} widthPercentage="100%"/>

:::note Notable features

1. World-1-1 works as per normal: score increase, Goomba respawn and death, coins, game restart must all work as usual
2. World-1-2 carries over scores from World-1-1 to demonstrate persistence
3. World-1-2 can be played independently for testing, restart and scoring works too
4. Only GameManager is part of `DontDestroyOnLoad`
5. There's no `NullReferenceError` on the Console
6. There's only one Goomba for demonstration purposes in World-1-2. We have not managed Green Goombas (underground) yet

<ImageCard path={require("./images/static/2023-08-24-14-16-55.png").default} widthPercentage="100%"/>
:::

## C#: Interface

It is very common in a game to have various types of buttons, powerups, or enemies, but they should have common methods that will be called by other scripts such as `cast` or `consume`, or `click`, etc. To do this more uniformly, we can utilise an interface. Interface members must be public by default, because they’re meant to define the public API of a type, hence the name <span className="orange-bold">interface</span>: a contract meant to be use by other classes.

Let's try to create one simple interface for all interactive buttons:

```cs title="InteractiveButton.s"

public interface InteractiveButton
{
    void ButtonClick();
}

```

Rename your `ButtonController.cs` script into `RestartButton.cs`, and create another `PauseButton.cs` script to pause the game:

<Tabs>

</Tabs>

Complain when not implemented

/images/static/2023-08-25-10-42-12.png
