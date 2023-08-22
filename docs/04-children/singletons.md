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

<VideoItem path={"https://50033.s3.ap-southeast-1.amazonaws.com/week-3/build-setting.mp4"} widthPercentage="100%"/>

:::note The Singleton Pattern
The singleton pattern is a way to ensure a class has only a single globally accessible instance available at ALL times. Behaving much like a regular static class but with some advantages. This is very useful for making global manager type classes that hold global variables and functions that many other classes need to access.
:::

In the `Awake()` function of any script, you can add the following instructions to make it a Singleton:

```cs
// Property
private  static  GameObject _instance;

// Getter
public  static  GameObject instance
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

> Optionally, you can have private set instead of just set to disallow other classes from setting it.
