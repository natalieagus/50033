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

# The Singleton Pattern

When we switch from one game scene to another, we will <span className="orange-bold">destroy</span> all GameObjects (along with its components) in the previous scene. Sometimes we want some GameObjects to persist, or more specifically: its data or state. We can create a script that implement the Singleton pattern so that the GameObject (along with its children) is **not** destroyed upon loading to a new Scene. Note that this will only apply on <span className="orange-bold">root</span> GameObject. Before we begin, create a new scene and name it `World 1-2`. You don't have to follow exactly [how World 1-2 looks](https://nesmaps.com/maps/SuperMarioBrothers/SuperMarioBrosWorld1-2Map.html), but here's a sample:

<ImageCard path={require("./images/singletons/2023-08-20-17-37-39.png").default} widthPercentage="100%"/>

To allow Unity to know which Scenes are involved for run test and build, we need to add them to the Build Setting. Go to File >> Build Setting and add Scenes (drag it to this Build Setting window) that are relevant to your game:

<VideoItem path={"https://50033.s3.ap-southeast-1.amazonaws.com/week-4/build-setting.mp4"} widthPercentage="100%"/>

:::note The Singleton Pattern
The singleton pattern is a way to ensure a class has only a single globally accessible instance available at ALL times. Behaving much like a regular static class but with some advantages. This is very useful for making global manager type classes that hold global variables and functions that many other classes need to access.
:::

In the `Awake()` function of any script, you can add the following instructions to make it a Singleton:

```cs
// Property
private  static  MonoBehaviour _instance;

// Getter
public  static  MonoBehaviour instance
{
	get { return  _instance; }
}

private  void  Awake()
{
	// check if the _instance is not this, means it's been set before, return
	if (_instance  !=  null  &&  _instance  !=  this)
	{
		Destroy(this.gameObject);
		return;
	}

	// otherwise, this is the first time this instance is created
	_instance  =  this;
	// add to preserve this object open scene loading
	DontDestroyOnLoad(this.gameObject); // only works on root gameObjects
}
```

:::caution
Note that if `this.gameObject` is NOT root level GameObject, it will not work. The editor will warn you: `DontDestroyOnLoad` only work for root GameObjects or components on root GameObjects.
:::

Adding the above _static property_ and Singleton pattern will turn any gameObject to be persistent between screen changing.

### C#: Static Variable

The `static` keyword allows us to gain access to the instance via the **Class** name, and there will only be one instance that can be linked to this variable Instance at any given time.

### C#: Properties

Properties allow access control to a class variable. Writing C# getter and setter properties are very simple, here's a quick example:

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

> Optionally, you can have a `private` setter to disallow other classes from using it.

## Singleton Class

If you have several gameObjects to stay persistent, you can implement the above instructions on the relevant scripts, but this will result in many boilerplate code. To avoid this, we can create a dedicated script that can be inherited by any other scripts and turning them into Singletons.

Create a new script called Singleton.cs, and declare the following properties:

```cs title="Singleton.cs"
using UnityEngine;

public  class Singleton<T> : MonoBehaviour  where  T : MonoBehaviour
{
	private  static  T _instance;
	public  static  T instance
	{
		get
		{
			return  _instance;
		}
	}

	public  virtual  void  Awake ()
	{
		Debug.Log("Singleton Awake called");

		if (_instance  ==  null) {
			_instance  =  this  as T;
			DontDestroyOnLoad (this.gameObject);
		} else {
			Destroy (gameObject);
		}
	}
}
```

The `virtual` method allows override by members inheriting this class, and the member can utilise this base Singleton class as such:

```cs
using UnityEngine;

public  class Foo : Singleton<Foo>
{
	override  public  void  Awake(){
		base.Awake();
		Debug.Log("awake called");
		// other instructions that needs to be done during Awake
	}
}
```

### GameManager as Singleton

We are now ready to convert our `GameManager` into a Singleton as follows:

```cs title="GameManager.cs"
//highlight-start
public class GameManagerWeek : Singleton<GameManagerWeek>
//highlight-end
{
    // other instructions
}
```

This means that the GameManager instance will **not be destroyed** upon scene change.

## Changing Scene

Let's test the Singleton Pattern by changing scene from World-1-1 to World-1-2. Prepare the `castle` at the end of World-1-1 to contain an **edge collider**.

- Create and set castle's Layer to `interactive`
- Set the `IsTrigger` property of EdgeCollider2D

<ImageCard path={require("./images/singletons/2023-08-23-16-06-26.png").default} widthPercentage="100%"/>

To make Mario appear like he's "entering" the castle, you can set the `Sorting Layer` of the right side of the castle to be above Mario's sprite (Default):

<ImageCard path={require("./images/singletons/2023-08-23-16-06-57.png").default} widthPercentage="100%"/>

Then create new a script called `NextScene.cs` and attach it to the Castle. Set `nextSceneName` as `World-1-2` in the inspector (matching exactly the next scene's name).

```cs title="NextScene.cs"

using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.SceneManagement;
public class NextScene : MonoBehaviour
{
    public string nextSceneName;
    void OnTriggerEnter2D(Collider2D other)
    {
        if (other.tag == "Player")
        {
            Debug.Log("Change scene!");
            SceneManager.LoadSceneAsync(nextSceneName, LoadSceneMode.Single);
        }
    }
}
```

<ImageCard path={require("./images/singletons/2023-08-23-16-20-39.png").default} widthPercentage="100%"/>

We utilise the function `LoadSceneAsync` from `UnityEngine.SceneManagement.SceneManager`. Please consult its [documentation](https://docs.unity3d.com/ScriptReference/SceneManagement.SceneManager.html).

:::caution Why Async?
`LoadSceneAsync` loads the Scene asynchronously in the background. The name of the Scene to load **can be case insensitive**. There also exist the synchronous counterpart: `LoadScene`. To avoid pauses or performance hiccups while loading in most cases, you should use `LoadSceneAsync`.
:::

### LoadSceneMode

There are [two modes](https://docs.unity3d.com/ScriptReference/SceneManagement.LoadSceneMode.html) to load a scene: **single** and **additive**.

- In **single** mode, all currently loaded Scene will be closed before loading the new scene. This is suitable when you are moving a player from one region to another.
- In **additive mode**, we add the scene to currently loaded scene. This is suitable when you want to open fullscreen GUI for players to change gears, skill points, etc.

:::playtest
You should test your project and confirm that Mario can transition between scenes **smoothly**. Ensure that the castle in World-1-2 does <span className="orange-bold">NOT</span> have the `NextScene` script enabled that caused him to perpetually restart World-1-2.

<VideoItem path={"https://50033.s3.ap-southeast-1.amazonaws.com/week-4/scene-change.mp4"} widthPercentage="100%"/>
:::

## DontDestroyOnLoad Consequences

We are not out of the woods yet. The GameManager was made to refer to _instances_ in World-1-1 scene as such:

<ImageCard path={require("./images/singletons/2023-08-23-17-22-57.png").default} widthPercentage="100%"/>

These instances will be destroyed and **new** one will be created in World-1-2. This caused GameManager to have missing references:

<ImageCard path={require("./images/singletons/2023-08-23-17-23-38.png").default} widthPercentage="100%"/>

:::warning
`Mario` in World-1-1 is <span className="orange-bold">not</span> the same as `Mario` in World-1-2.
:::

As a consequence, we need to turn all root GameObjects that refers to World-1-1 GameManager instance into Singletons as well.

1. All scripts on Mario: `PlayerMovement.cs` and `ActionManager.cs` must inherit `Singleton`
2. All scriupts on Canvas: `HUDManager.cs` must also inherit `Singleton`

### `SceneManager.activeSceneChanged`

Since Mario persists, we need to transform Mario back to the beginning position in World-1-2. We need to subscribe to the event `SceneManager.activeSceneChanged` inside `PlayerMovement.cs` to reset Mario's starting position upon new scene being loaded:

```cs title="PlayerMovement.cs"
using UnityEngine.SceneManagement;

    void Start()
    {
        // other instructions
        //highlight-start
        // subscribe to scene manager scene change
        SceneManager.activeSceneChanged += SetStartingPosition;
//highlight-end
    }

//highlight-start
    public void SetStartingPosition(Scene current, Scene next)
    {
        if (next.name == "World-1-2")
        {
            // change the position accordingly in your World-1-2 case
            this.transform.position = new Vector3(-10.2399998f, -4.3499999f, 0.0f);
        }
    }
    //highlight-end

```

If you set any object in World-1-2 to refer to `Mario` instance there, e.g as such in Camera:

<ImageCard path={require("./images/singletons/2023-08-23-17-43-35.png").default} widthPercentage="100%"/>

Then, you need to modify `CameraController.cs` to reassign current Scene's mario under `Start` function:

```cs title="CameraController.cs"
    public Transform player; // Mario's Transform

    void Start()
    {
        // other instructions
        //highlight-start
        player = GameObject.FindGameObjectWithTag("Player").transform;
        //highlight-end
    }
```

:::playtest
In the end, you want to make sure that the HUD persists (the score), and that there's **no missing references** in World-1-2 scene:

<VideoItem path={"https://50033.s3.ap-southeast-1.amazonaws.com/week-4/dontdestroyonload.mp4"} widthPercentage="100%"/>
:::

## Controversy

The Singleton pattern has been somewhat [controversial](https://softwareengineering.stackexchange.com/questions/40373/so-singletons-are-bad-then-what/218322#218322), although at the end of the day it is up to the developer’s wisdom on whether the pattern should be used. It is prone to abuse, and it is quite difficult to debug, for reasons laid out below.

### Testing Difficulty

World-1-2 Scene is made without any GameManager or Canvas (UI) due to the intention that it will be brought over from World-1-1 Scene. However, Mario still exists in case we want to test some basic functionalities:

<ImageCard path={require("./images/singletons/2023-08-24-10-29-44.png").default} widthPercentage="100%"/>

We can still have GameManager and Canvas in World-1-2 for testing purposes, but that will mean _double the work_. We need to test both **cases**:

1. World-1-2 as standalone scene
2. Playing World-1-2 _from_ World-1-1

Nevertheless, testing case 1 does not straightaway imply that case 2 above will be bug free. Each cases must be treated separately. The complexity of testing will grow as we have more and more scenes. To ensure that every scene smoothly transitions to the next, you’d have to start from the first scene, and quickly dash to the end of the first scene to load the second scene to test. It will be quite ridiculous to continue doing this if you have ten separate scenes and more.

### Object Reference Bug

We have to be completely certain that any instance referred by the Singleton is **not** obsolete upon Scene changes. All gameobjects will be **destroyed** if we load new scene with the option `LoadSceneMode.Single` (unless we use LoadSceneMode.Additive but that will be pretty weird to just simply keep the objects alive if we aren’t using both scenes in parallel). This is why we need to make both PlayerMovement and HUDManager to be Singletons.

We also need to ensure that any instance in the current scene is referring to the Singleton instance and **not** the scene instance. This means we can't use the inspector to link up references. For instance, each scene (World-1-1 and World-1-2) has separate instances of `Camera` that refers to `Mario`'s `transform`. We need to handle reference to the correct (Singleton) Mario under `Start()`. It can be done in these two ways:

```cs
    // using tag (assuming Mario's tag is "Player")
    player = GameObject.FindGameObjectWithTag("Player").transform;

    // referring to the Singleton directly
    player = PlayerMovementWeek4.instance.gameObject.transform;

```

:::note
The point is that there's <span className="orange-bold">no way</span> we can get a reference to World-1-1's singleton Mario in World-1-2 _before_ running the game.
:::

<span className="orange-bold">Use Singleton Pattern with caution!</span>

## Static Class vs Singletons

Static Class and Singletons are similar at first glance: they can only have <span className="orange-bold">one</span> instance available in memory, and both can be used to maintain the global state of an application. They come with some subtle differences depending on your application.

:::note source
[The following information is obtained from here.](https://henriquesd.medium.com/singleton-vs-static-class-e6b2b32ec331#:~:text=A%20Singleton%20class%20can%20Dispose,are%20bonded%20on%20compile%20time.)
:::

#### Extension

- A Singleton class supports <span className="orange-bold">interface</span> implementation, while static classes **cannot** implement interfaces.
- A Singleton class supports <span className="orange-bold">inheritance</span>, while a Static class is a sealed class, and therefore cannot be inherited.
- A Singleton class <span className="orange-bold">can inherit from other classes</span>, while a Static class cannot (not even from other static classes).

#### Resource Management

- A Singleton class can be instantiated using the `new` keyword, while static can not be instantiated (static class can be used directly).
- Both Singleton and static are stored on the Heap memory, but static classes are stored in a special area of the Heap Memory called the <span className="orange-bold">High-Frequency Heap</span> (Objects in High Frequency Heap are not garbage collected by GC, and hence static members are available **throughout** the application lifetime).
- A Singleton class can [**Dispose**](https://learn.microsoft.com/en-us/dotnet/standard/garbage-collection/implementing-dispose) (release unmanaged resources held by an object explicitly), while a static class can not.

#### Performance

- A Static class has <span className="orange-bold">better</span> performance since static methods are bonded on compile time.
- A Singleton class can be <span className="orange-bold">lazy loaded</span> when needed, while static classes are always loaded. Static classes are loaded automatically by the .NET Framework common language runtime (CLR) when the program or namespace containing the class is loaded.

#### General Usage

- A Singleton class can have a <span className="orange-bold">constructor</span>, while a static class can only have a private static <span className="orange-bold">parameterless</span> constructor and cannot have instance constructors.
- A Singleton class can be <span className="orange-bold">destroyed</span> (for specific purpose like reset or restart) while Static Classes cannot.

Hence, it should be pretty straightforward for you to decide: <span className="orange-bold">if a class has no real need to use the Unity API (heavy dependence or computation on the attached object), make it static</span>. If you'd like to dive deeper in making your choices, give [this](https://vionixstudio.com/2022/06/18/unity-singleton-and-static-variables/#Singleton_vs_Static_variable_usage_in_Unity), [this](https://www.c-sharpcorner.com/UploadFile/akkiraju/singleton-vs-static-classes/), and [this](https://gamedevbeginner.com/singletons-in-unity-the-right-way/) articles a read on top of your own research. Good luck!
