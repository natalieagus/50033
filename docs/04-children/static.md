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

It is very common in a game to have various types of buttons, powerups, or enemies, but they should have common methods that will be called by other scripts such as `cast` or `consume`, or `click`, etc. To do this more uniformly, we can utilise an interface. Interface members must be <span className="orange-bold">public</span> by default, because they’re meant to define the public API of a type, hence the name <span className="orange-bold">interface</span>: a contract meant to be use by other classes.

### Interactive Button

Let's try to create one simple interface for all interactive buttons:

```cs title="InteractiveButton.s"

public interface InteractiveButton
{
    void ButtonClick();
}

```

> There's no need to declare `public` in the methods

Rename your `ButtonController.cs` script into `RestartButton.cs`, and create another `PauseButton.cs` script to pause the game. Both controllers must inherit `InteractiveButton` interface:

<Tabs>
<TabItem value="1" label="RestartButton.cs">

```cs
using System.Collections;
using System.Collections.Generic;
using UnityEngine;

// later on, teach interface
public class RestartButtonController : MonoBehaviour, InteractiveButton
{
    // implements the interface
    public void ButtonClick()
    {
        Debug.Log("Onclick restart button");
        GameManagerWeek4.instance.GameRestart();
    }
}

```

</TabItem>

<TabItem value="2" label="PauseButton.cs">

```cs

using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.UI;

public class PauseButtonController : MonoBehaviour, InteractiveButton
{
    private bool isPaused = false;
    public Sprite pauseIcon;
    public Sprite playIcon;
    private Image image;
    // Start is called before the first frame update
    void Start()
    {
        image = GetComponent<Image>();
    }

    // Update is called once per frame
    void Update()
    {

    }

    public void ButtonClick()
    {
        Time.timeScale = isPaused ? 1.0f : 0.0f;
        isPaused = !isPaused;
        if (isPaused)
        {
            image.sprite = playIcon;
        }
        else
        {
            image.sprite = pauseIcon;
        }
    }
}

```

</TabItem>

</Tabs>

An error will be raised if we do not implement `ButtonClick` method:
<ImageCard path={require("./images/static/2023-08-25-10-42-12.png").default} widthPercentage="50%"/>

### Powerups

In Super Mario Bros, there are a few [powerups](<https://www.mariowiki.com/World_1-1_(Super_Mario_Bros.)>). Power-ups are unique items that give special abilities to characters that use them.

1. **Magic Mushroom**: Upgrades Mario to Super Mario
2. **1-up Mushroom** (green mushroom): Grants Mario extra life
3. **Starman**: Grants Mario invincibility for a period of time
4. **Coin**: Increases score (not exactly special abilities, but something to "interact" with)

The main idea is that no matter which powerup is being collected by the player, we <span className="orange-bold">filtered</span> and invoke the right subscribers for _that_ powerup:

<ImageCard customClass="invert-color" path={require("./images/static/50033-2023.drawio.png").default} widthPercentage="100%"/>

Create a new script called `Powerup.cs`, where we can declare the following interfaces:

```cs title="Powerup.cs"
using UnityEngine;

// interface for powerup item
public interface Powerup
{
    // getters
    PowerupType powerupType
    {
        get;
    }

    bool hasSpawned
    {
        get;
    }

    // methods
    void DestroyPowerup();
    void SpawnPowerup();
    void ApplyPowerup(MonoBehaviour i);
}

// interface for objects that can be affected by powerups
public interface PowerupApplicable
{
    public void RequestPowerupEffect(Powerup i);
}
```

## C#: Properties

We can get (and set) C# properties to allow access control over class members. It's pretty straightforward to implement just like in any other programming language. This example explains itself:

```cs
//Member variables can be referred to as fields.
private  int _healthPoints;

//healthPoints is a basic property
public  int healthPoints {
	get {
		//Some other code
		// ...
		return _healthPoints;
	}
	set {
		// Some other code, check etc
		// ...
		_healthPoints = value; // value is the amount passed by the setter
	}
}

// usage
Debug.Log(player.healthPoints); // this will call instructions under get{}
player.healthPoints += 20; // this will call instructions under set{}, where value is 20
```

Optionally, you can have `private set` instead of just `set` to disallow other classes from setting that member.

## C#: `enums`

Right now we have four different types of powerups. Sure, we can use _tags_, or object _name_ or some kind of pre-determined `id` to _name_ each of them but we would benefit more if we use the `enum` type as we can name them more intuitively.

:::note enum type
An enumeration type (or enum type) is a [value type](https://learn.microsoft.com/en-us/dotnet/csharp/language-reference/builtin-types/value-types) defined by a set of named constants of the underlying [integral numeric](https://learn.microsoft.com/en-us/dotnet/csharp/language-reference/builtin-types/integral-numeric-types) type.
:::

Add the following code to `Powerup.cs`:

```cs

public enum PowerupType
{
    Coin = 0,
    MagicMushroom = 1,
    OneUpMushroom = 2,
    StarMan = 3
}

```

:::tip
If you wish, you can create two separate files: `PowerupInterface.cs` and `PowerupType.cs` to physically separate the two.
:::

## C#: Abstract Class

Apart from sharing the same interface, each of our powerups will also share certain similar **characteristics** (properties and protected methods, or interface implementation), for instance:

1. Properties: `PowerupType type`
2. `GetPowerupType()` has the same implementation no matter which Powerup implements it

We can create an **abstract** base class.

:::note Abstract Class
In C#, an abstract class is a class that cannot be instantiated directly but serves as a **blueprint** for other classes. It's meant to be subclassed (derived) by other classes, which provide implementations for its abstract members (methods, properties, events, and indexers). It can contain both **abstract** or **concrete** members.

Abstract classes are useful for creating hierarchies of related classes while ensuring a consistent structure and behavior across those classes.
:::

```cs title="BasePowerup.cs"
using UnityEngine;


public abstract class BasePowerup : MonoBehaviour, Powerup
{
    public PowerupType type;
    public bool spawned = false;
    protected bool consumed = false;
    protected bool goRight = true;
    protected Rigidbody2D rigidBody;

    // base methods
    protected virtual void Start(){
        rigidBody = GetComponent<RigidBody2D>();
    }

    // interface methods
    // 1. concrete methods
    public PowerupType powerupType
    {
        get // getter
        {
            return type;
        }
    }

    public bool hasSpawned
    {
        get // getter
        {
            return spawned;
        }
    }

    public void DestroyPowerup()
    {
        Destroy(this.gameObject);
    }

    // 2. abstract methods, must be implemented by derived classes
    public abstract void SpawnPowerup();
    public abstract void ApplyPowerup(MonoBehaviour i);
}

```

We can typically add the `abstract` or `virtual` keywords on methods/properties/events etc in the base class.

### Abstract Keyword

Methods or properties with `abstract` keywords indicate that the thing being modified has a _missing_ or _incomplete_ implementation. We are <span className="orange-bold">supposed</span> to `override` these methods in the derived classes (otherwise there will be errors).

### Virtual Keyword

Methods or properties with `virtual` keywords means that we _can_ modify this method or property, and allow for it to be **overridden** in a derived class. In other words, we _may_ `override` virtual methods if we would like to modify or extend it. We can still call the base class' method using `base.methodName()`.

:::note
Both abstract and virtual method <span className="orange-bold">cannot</span> be declared as `private` because they're meant to be modified by the derived class. You need to use either the `protected` or `public` keyword, but the former makes more sense as `public` methods should've been declared on the interface instead and implemented either in the base class or the derived class.
:::

### New Keyword

If your base class has implemented some concrete method and you would like to <span className="orange-bold">hide</span> it in your derived classes (with completely new implementation), use the `new` keyword in your method or property declaration.

### `override` vs `new`

:::note `override` vs `new` Keyword
The override modifier **extends** the **base** class **virtual or abstract** method, and the new modifier **hides** an accessible base class method. At first glance, using concrete method implementation in the base class and calling `new` in the derived class (then using `base.someMethod()` to invoke the base class method too) might seem to have the same effect as using virtual method in the base class and overriding it in the derived class. However, this is not always quite the expected behavior.

TL;DR: If you're expecting **standard** polymorphism behavior, use `virtual` methods in base class and `override` keyword in derived classes, and call `base.methodName()` wherever appropriate.

[Read more about when to use `override` vs new `keyword` here](https://learn.microsoft.com/en-us/dotnet/csharp/programming-guide/classes-and-structs/knowing-when-to-use-override-and-new-keywords).
:::

<DeepDive>

The difference between the two is very apparent in this example, especially when we declare object type `BaseClass` using `DerivedClass` constructor. The output of line `40` will be **different** to the output of line `39`.

```cs showLineNumbers
using UnityEngine;


class BaseClass
{
    public virtual void Method1()
    {
        Debug.Log("Base - Method1");
    }
    public void Method2()
    {
        Debug.Log("Base - Method2");
    }
}

class DerivedClass : BaseClass
{
    public override void Method1()
    {
        base.Method1();
        Debug.Log("Derived - Method1");
    }
    public new void Method2()
    {
        base.Method2();
        Debug.Log("Derived - Method2");
    }
}

public class Playground : MonoBehaviour
{
    // Start is called before the first frame update
    void Start()
    {
        // here, both methods behave similarly
        DerivedClass dc = new DerivedClass();
        dc.Method1();
        dc.Method2();
        // but here, these methods behave differently
        //highlight-start
        BaseClass bc = new DerivedClass();
        bc.Method1();
        bc.Method2();
        //highlight-end
    }

    // Update is called once per frame
    void Update()
    {

    }
}
```

The output is:

<ImageCard path={require("./images/static/2023-08-29-10-40-05.png").default} widthPercentage="100%"/>

Notice how `bc.Method2()` does **not** have any reference to `DerivedClass`' `Method2` due to the `new` implementation in the derived class.

</DeepDive >

## Implement Powerups

We can now use the `BasePowerup` class to create MagicMushroom powerup and we want to **extend** `Start()` virtual method in MagicMushroomPowerup.

```cs title="MagicMushroomPowerup.cs"

using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class MagicMushroomPowerup : BasePowerup
{
    // setup this object's type
    // instantiate variables
    protected override void Start()
    {
        base.Start(); // call base class Start()
        this.type = PowerupType.StarMan;
    }

    void OnCollisionEnter2D(Collision2D col)
    {
        if (col.gameObject.CompareTag("Player") && spawned)
        {
            // TODO: do something when colliding with Player

            // then destroy powerup (optional)
            DestroyPowerup();

        }
        else if (col.gameObject.layer == 10) // else if hitting Pipe, flip travel direction
        {
            if (spawned)
            {
                goRight = !goRight;
                rigidBody.AddForce(Vector2.right * 3 * (goRight ? 1 : -1), ForceMode2D.Impulse);

            }
        }
    }

    // interface implementation
    public override void SpawnPowerup()
    {
        spawned = true;
        rigidBody.AddForce(Vector2.right * 3, ForceMode2D.Impulse); // move to the right
    }


    // interface implementation
    public override void ApplyPowerup(MonoBehaviour i)
    {
        // TODO: do something with the object

    }
}
```

The question box that spawned the Magic Mushroom must be set into some kind of disabled state after the mushroom is spawned. You can create a simple controller for that:

<Tabs>
<TabItem value="1" label="PowerupController.cs">

```cs
public interface PowerupController
{
    void Disable();
}

```

</TabItem>

<TabItem value="2" label="QuestionBoxPowerupController.cs">

```cs
using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class QuestionBoxPowerupController : MonoBehaviour, PowerupController
{
    public Animator powerupAnimator;
    public BasePowerup powerup; // reference to this question box's powerup

    void Start()
    {

    }

    // Update is called once per frame
    void Update()
    {

    }


    private void OnCollisionEnter2D(Collision2D other)
    {
        {
        if (other.gameObject.tag == "Player" && !powerup.hasSpawned)
            // show disabled sprite
            this.GetComponent<Animator>().SetTrigger("spawned");
            // spawn the powerup
            powerupAnimator.SetTrigger("spawned");
        }
    }

    // used by animator
    public void Disable()
    {
        this.GetComponent<Rigidbody2D>().bodyType = RigidbodyType2D.Static;
        transform.localPosition = new Vector3(0, 0, 0);
    }



}
```

</TabItem>
</Tabs>

Then create a simple prefab extending the bouncy question box you did in the earlier week. There are many ways to implement this prefab, here's one sample:

<VideoItem path={"https://50033.s3.ap-southeast-1.amazonaws.com/week-4/setup-magic-mushroom.mp4"} widthPercentage="100%"/>

### Important Notes

Note that methods that are declared on the interface are meant to be **public**: used by other instances.

- `SpawnPowerup` might be called by Animators or events
- `ApplyPowerup` might be called by some PowerupManager or instances that consumes
- `DestroyPowerup` might be called after some timeout

On the contrary, if you have some methods that are meant to be extended within the powerup only, then these methods should be declared in the BaseClass instead (either as abstract, virtual, or concrete methods).

:::playtest
Refactor your Coin box to implement `Powerup` and inherit `BasePowerup` as well so you can have similar functionalities. You can begin by creating `BrickPowerupController.cs` which implements `PowerupController` interface, because how a brick is controlled is eventually different from the question box (brick is _breakable_ by SuperMario). Here's an example where we can dynamically set whether the coin brick is eventually breakable (by SuperMario) or not:

<VideoItem path={"https://50033.s3.ap-southeast-1.amazonaws.com/week-4/powerup-coin.mp4"} widthPercentage="100%"/>
:::
