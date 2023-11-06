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

# Scriptable Objects

A [ScriptableObject](https://docs.unity3d.com/Manual/class-ScriptableObject.html) (abbreviated as SO) is a **data container** that you can use to save large amounts of data, independent of class instances. An example scenario where this will be useful is when your game needs to instantiate tons of Prefab with a Script component that stores <span className="orange-bold">unchanging</span> variables. We can save memory by storing these data in a ScriptableObject instead and these Prefabs can refer to the content of the ScriptableObject at runtime.

ScriptableObject is also useful to store standard constants for your game, such as reset state, max health for each character, cost of items, etc.

> In the later weeks, we will also learn how to utilise ScriptableObjects to create a handy Finite State Machine.

From the official documentation, it's stated that the main use cases for ScriptableObjects are:

- Saving and storing data during an Editor session
- Saving data as an Asset in your Project to use at run time

This week, we mainly focus on the simplified version of the first use case: to use an SO instance to store **game constants**, accessible by any script.

:::danger
Scriptable objects are mainly used as **assets** in a project that can be referenced by other assets in the project, and they are serialised into your project. However, they <span className="orange-bold">cannot</span> be modified permanently in the exported build. Any changes would be <span className="orange-bold">reverted</span> when you restart your game as scriptable object are _serialized_ into the asset database and such assets <span className="orange-bold">can not be changed at runtime</span>.

You _can_ change the data it contains, and it will persist throughout your game (between scenes, etc) but you cannot expect it to persist upon restart in your exported build!

> In editor, changes stored in SO persist even after you stop and restart the game so they behave differently.

To properly save various game data, you can use Unity's [Binary Serialization](https://stuartspixelgames.com/2020/07/26/how-to-do-easy-saving-loading-with-binary-unity-c/), [PlayerPrefs](https://docs.unity3d.com/ScriptReference/PlayerPrefs.html), basic Serialization with [JSON files](https://docs.unity3d.com/ScriptReference/JsonUtility.html), or paid asset like [EasySave](https://assetstore.unity.com/packages/tools/utilities/easy-save-the-complete-save-data-serializer-system-768). There are many ways depending on the complexity of the data you save: simple settings like volume level, difficulty level, or primitive data type like `int`, `string`, `float`, or more complex stuffs like an array.
:::

## Scriptable Object Template

To begin creating this data container, create a new script under a new directory: `Assets/Scripts/ScriptableObjects/`and call it `GameConstants.cs`. Instead of inheriting MonoBehavior as usual, we let it inherit ScriptableObject:

```cs title="GameConstants.cs"
using UnityEngine;

[CreateAssetMenu(fileName =  "GameConstants", menuName =  "ScriptableObjects/GameConstants", order =  1)]
public  class GameConstants : ScriptableObject
{
	// set your data here
}
```

The header `CreateAssetMenu` allows us to create **instances** of this class in the Project in the Unity Project Window. Proceed by declaring a few constants that might be useful for your project inside the class, for example:

```cs
public  class GameConstants : ScriptableObject
{
	//highlight-start
    // lives
    public int maxLives;

    // Mario's movement
    public int speed;
    public int maxSpeed;
    public int upSpeed;
    public int deathImpulse;
    public Vector3 marioStartingPosition;

    // Goomba's movement
    public float goombaPatrolTime;
    public float goombaMaxOffset;
    //highlight-end
}

```

### Instantiate

Now you can <span className="orange-bold">instantiate</span> the scriptable object by right clicking on the Project window then >> Create >> ScriptableObjects >> GameConstants (this is possible since we have declared `CreateAssetMenu`). Give it a name, here we call it `SMBConstants` (SuperMarioBrosConstants).

<ImageCard path={require("./images/scriptableobjects/2023-09-12-11-41-15.png").default} widthPercentage="100%"/>

Over at the inspector, you can set the values to correspond to each constant that's been declared before in `PlayerMovement` and `EnemyMovement`.

> As of now, `maxLives` are not used yet, leave it at 10.

:::info
The values stored inside a ScriptableObject persists (unlike runtime variables that exists only in-memory), so you can store something in these data containers such as the player’s highest score, and load it again the next time the game starts. You can treat SO instances as files.
:::

### Usage in Runtime

To use the SO values in any script, simply declare it as a public variable and link it up in the inspector. For example, we can modify `PlayerMovement.cs` as follows:

```cs title="PlayerMovement.cs"
public class PlayerMovement : MonoBehaviour, IPowerupApplicable
{
    //highlight-start
    public GameConstants gameConstants;
    float deathImpulse;
    float upSpeed;
    float maxSpeed;
    float speed;
    //highlight-end

    // other attributes

    // Start is called before the first frame update
    void Start()
    {
        //highlight-start
        // Set constants
        speed = gameConstants.speed;
        maxSpeed = gameConstants.maxSpeed;
        deathImpulse = gameConstants.deathImpulse;
        upSpeed = gameConstants.upSpeed;
//highlight-end
        // Set to be 30 FPS
        Application.targetFrameRate = 30;
        marioBody = GetComponent<Rigidbody2D>();
        marioSprite = GetComponent<SpriteRenderer>();

        // update animator state
        marioAnimator.SetBool("onGround", onGroundState);

    }

}
```

By using SO as data container for your game constants, you can easily modify them later during testing stage without having to touch your scripts.

### Methods

You can also write regular methods in an SO. For instance, you can create an SO that represents a `Game Event`:

```cs
using System.Collections.Generic;
using UnityEngine;

[CreateAssetMenu(fileName = "GameEvent", menuName = "ScriptableObjects/GameEvent", order = 3)]
public class GameEvent : ScriptableObject
{
    private readonly List<GameEventListener> eventListeners =
        new List<GameEventListener>();

    public void Raise()
    {
        for(int i = eventListeners.Count -1; i >= 0; i--)
            eventListeners[i].OnEventRaised();
    }

    public void RegisterListener(GameEventListener listener)
    {
        if (!eventListeners.Contains(listener))
            eventListeners.Add(listener);
    }

    public void UnregisterListener(GameEventListener listener)
    {
        if (eventListeners.Contains(listener))
            eventListeners.Remove(listener);
    }
}
```

You can then create instances of these events, such as: `PlayerDeathEvent` or `ScoreIncreasedEvent` and use it in a Script (in place of Singleton pattern). An SO can also be used to represent a **state**, e.g: `CurrentScore` if that state is meant to be shared by many instances in the game (read). This allows you to retain the score of your _current progress_ should you exit the game. We will learn more about this next week when we dive deeper into <span className="orange-bold">Scriptable Object Game Architecture</span>.

## Storing Variables

In this section, we will mainly discuss the role of SO instances as persistent variable storage container. We can write custom getters and setters to make it more convenient to manage.

### C# Method Overloading

There are many states in the game that should be shared among different instances, such as whether Mario is alive or dead, current game score (for combo system if possible), where Mario currently is (which World to indicate progress), and many more. We can utilise SO by creating a generic variable container as follows:

```cs title="Variable.cs"

using System.Collections;
using System.Collections.Generic;
using UnityEngine;


public abstract class Variable<T> : ScriptableObject
{
#if UNITY_EDITOR
    [Multiline]
    public string DeveloperDescription = "";
#endif

    protected T _value;
    public T Value
    {
        get
        {
            return _value;
        }
        set
        {
            SetValue(value);

        }
    }

    public abstract void SetValue(T value);

}

```

Then, we can create a subclass called `IntVariable` (similarly you can create other variable types as well) that also store its highest value thus far:

```cs title="IntVariable.cs"
using UnityEngine;

[CreateAssetMenu(fileName = "IntVariable", menuName = "ScriptableObjects/IntVariable", order = 2)]
public class IntVariable : Variable<int>
{

    public int previousHighestValue;
    public override void SetValue(int value)
    {
        if (value > previousHighestValue) previousHighestValue = value;

        _value = value;
    }

    // overload
    public void SetValue(IntVariable value)
    {
        SetValue(value.Value);
    }

    public void ApplyChange(int amount)
    {
        this.Value += amount;
    }

    public void ApplyChange(IntVariable amount)
    {
        ApplyChange(amount.Value);
    }

    public void ResetHighestValue()
    {
        previousHighestValue = 0;
    }

}
```

Finally, you can instantiate `GameScore` from `IntVariable`. We suggest you organise your directory accordingly:

<ImageCard path={require("./images/scriptableobjects/2023-09-14-10-00-58.png").default} widthPercentage="100%"/>

You can use `GameScore` in `GameManager` (Singleton) in favour of a private score variable:

```cs title="GameManager.cs"

    public IntVariable gameScore;

    // use it as per normal

    // reset score
    gameScore.Value = 0;

    // increase score by 1
    gameScore.ApplyChange(1);

    // invoke score change event with current score to update HUD
    scoreChange.Invoke(gameScore.Value);

```

This way, we have a <span className="orange-bold">persistent</span> data storage for our highscore. Simply refer to it via another script, for instance:

```cs title="HUDManager"
public class HUDManager : MonoBehaviour
{

    public GameObject highscoreText;
    public IntVariable gameScore;


    public void GameOver()
    {
        // other instructions
//highlight-start
        // set highscore
        highscoreText.GetComponent<TextMeshProUGUI>().text = "TOP- " + gameScore.previousHighestValue.ToString("D6");
        // show
        highscoreText.SetActive(true);
//highlight-end
    }

}
```

And we can have highscore reported at the end of a run. This value is <span className="orange-bold">persistent</span> (even if you stop and start the game again):

<ImageCard path={require("./images/scriptableobjects/2023-09-14-10-33-09.png").default} widthPercentage="100%"/>
