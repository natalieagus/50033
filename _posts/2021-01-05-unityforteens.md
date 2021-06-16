---
layout: post
title: Unity for Teens
---
* TOC
{:toc}


# Learning Objectives: Advanced Managements
- Persistence between Scenes using Singletons
- Game Architecture with Scriptable Objects
	- ScriptableObject Event System
	- UnityEvents, Custom UnityEvents stored in  ScriptableObjects
	- Custom EventListeners to attach to GameObjects
	- Sample ScriptableObject scripts for Inventory system
-   C#:
	-  Using properties,
	- Method overloading,
 
*Prepare your brain.* Today's objectives may look pretty simple but it is our most difficult lab yet. We will be learning an entire game architecture with Scriptable Objects. It will be painful, but worth it. It will make your game modular and easy to develop, debug, and manage. It wasn't taught earlier since you need to have sufficient fundamental knowledge to know what goes on in the Scene. This architecture requires immense planning and more-than-basic knowledge. You're now ready. 




# Introduction
Most things that will be done in this lab will not be immediately visible (unlike Shaders, spawning new enemies, etc that we have done in the previous weeks), but they can be handy tool to manage your project.

As usual, veterans can head straight to the [Checkoff](https://natalieagus.github.io/50033/2021/01/05/unityforteens.html#checkoff) section and implement the required features any way you deem fit.
> Quick check: you have learned about ScriptableObjects Event System and Game Architecture, you're good to skip the tutorial.

You still need to know the contents of this lab though, as that will be used for our quizzes.

# GameObject Persistence Between Scenes
When we switch from one game scene to another, we will **destroy** all GameObjects (along with its components) in the previous scene. Sometimes we want some GameObjects to persist, or more specifically: its data or state. We can definitely use Scriptable Objects to store some relevant data like GameScore, Player items, stats, current buffs, etc that can be carried over to the next scene, and then load it up when the new scene is ready. We can present the player with some kind of loading screen when we load these information for the new GameObject instances to process. 

An alternative to this will be to allow some GameObjects to be not destroyed upon loading of a new scene. We can create a script that implement the Singleton pattern so that the GameObject (along with its children) is not destroyed upon load. Note that this will only apply on **root** GameObject. 

**Create a new scene** and name it something that makes sense. In this example, we create a new scene and name it `MarioLevel2`. It is just a simple scene with a few platforms and question boxes from prefabs we created in the earlier tutorials. 

![scene2](https://www.dropbox.com/s/sj3butbjgl8dewt/2a.png?raw=1)


To allow Unity to know which Scenes are involved for run test and build, we need to add them to the **Build Setting**. Go to File >> Build Setting and add Scenes that are relevant to your game:

> From Unity Documentation: Select **Add Open Scenes** to add all currently open Scenes to the build. You can also drag Scene Assets from your **Project window**[](https://docs.unity3d.com/Manual/ProjectView.html)  
into this window. 

You should see something like this for example after adding a couple of Scenes:

![buildsetting](https://www.dropbox.com/s/tto5ebkzpqj6ax1/1.png?raw=1)

Some preparation before we proceed:

Move the script `GameManager.cs` to the **Root** GameManager GameObject, instead of having it attached to a child object like we did in the previous Lab:

![managerscript](https://www.dropbox.com/s/4dumikbkjkklb3e/3.png?raw=1)


## C#: Properties
Open `GameManager.cs` and add the following lines:

```java

// Singleton Pattern
private  static  GameManager _instance;
// Getter
public  static  GameManager Instance
{
	get { return  _instance; }
}
```

We know from before that the `static` keyword allows us to gain access to the instance via the Class name, and there will only be one instance that can be linked to this variable `Instance` at any given time. This time round, we use `Properties` to allow access control to the variable, instead of having the usual `Public` fields. We can get properties very simply as shown above, and setting properties is also equally simple as shown in the example below:

```java
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

> Optionally, you can have `private set` instead of just `set` to disallow other classes from setting it.

## The Singleton Pattern
Directly quoted straight from [here](https://wiki.unity3d.com/index.php/Singleton): *The [singleton](http://en.wikipedia.org/wiki/Singleton_pattern) pattern is a way to ensure a class has **only a single globally accessible instance** available at **ALL** times. Behaving much like a regular static class but with some advantages. This is very **useful for making global manager type** classes that hold global variables and functions that many other classes need to access.*

In the `Awake()` function of any script, add the following instructions:

```java
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

> Note that if `this.gameObject` is **NOT root level** GameObject, **it will not work**. The editor will warn you: *DontDestroyOnLoad only work  for  root GameObjects or components on root GameObjects*.

Adding the above property and Singleton pattern will turn any gameObject to be persistent between screen changing. 

## Singleton Class
If you have several gameObjects to stay persistent, you can implement the above instructions on the relevant scripts, but this will result in many **boilerplate** code. To avoid this, we can create a dedicated script that can be inherited by any other scripts and turning them into Singletons. 

**Create** a new script called `Singleton.cs`, and declare the following properties:
> This code is obtained from [this site](http://wiki.unity3d.com/index.php/Singleton) with modifications

```java
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

The `virtual` method allows `override` by members inheriting this class, and the member can utilise this base `Singleton` class as such in a new script `GameUI.cs`:

```java
using UnityEngine;

public  class GameUI : Singleton<GameUI>
{
	override  public  void  Awake(){
		base.Awake();
		Debug.Log("awake called");
		// other instructions...
	}
}
```
Attach this script `GameUI.cs` in the UI GameObject, and you will observe that `UI` gameobject along with ALL its children it will be under `DontDestroyOnLoad` list at runtime. Modify `GameManager.cs` as well to adopt the Singleton Pattern.


![dontdestroy](https://www.dropbox.com/s/wctzufnf7hy1ik6/4.png?raw=1)


Now suppose Mario reaches the end of the level (hits the castle door, you can download the castle prefab at the course handout or use your own), and would like to go to the next scene, we need to detect some Collision as such:

```csharp
using System.Collections;
using UnityEngine;

public  class ChangeScene : MonoBehaviour
{
	public  AudioSource changeSceneSound;
	void  OnTriggerEnter2D(Collider2D other)
	{
		if (other.tag  ==  "Player")
		{
			changeSceneSound.PlayOneShot(changeSceneSound.clip);
			StartCoroutine(LoadYourAsyncScene("MarioLevel2"));
		}
	}

	IEnumerator  LoadYourAsyncScene(string sceneName)
	{
		yield  return  new  WaitUntil(() =>  !changeSceneSound.isPlaying);
		CentralManager.centralManagerInstance.changeScene();
	}
}
```

And implement `changeScene` method in `CentralManager.cs` using `LoadSceneAsync`. There's more details on this API that can be found [here](https://docs.unity3d.com/ScriptReference/SceneManagement.SceneManager.LoadSceneAsync.html). Its Synchronous version can be found [here](https://docs.unity3d.com/ScriptReference/SceneManagement.SceneManager.LoadScene.html). 

```java
    public void changeScene()
    {
        StartCoroutine(LoadYourAsyncScene("MarioLevel2"));
    }


    IEnumerator LoadYourAsyncScene(string sceneName)
    {
        // The Application loads the Scene in the background as the current Scene runs.
        // This is particularly good for creating loading screens.
        AsyncOperation asyncLoad = SceneManager.LoadSceneAsync(sceneName, LoadSceneMode.Single);
        // Wait until the asynchronous scene fully loads
        while (!asyncLoad.isDone)
        {
            yield return null;
        }
    }
```
* Add your own Castle Door in the prefab as show, with `IsTrigger` property enabled
* Add your own change-scene sound effect 

![changescene](https://www.dropbox.com/s/lz88io3bqd9rg3b/5.png?raw=1)


Now test run and observe how you can load to the next scene preserving the **score** as well as PowerUp, whatever powerup that you have collected in the previous scene, if not yet consumed will be carried over to the next scene. 

## Controversy
The Singleton pattern has been somewhat [controversial](https://softwareengineering.stackexchange.com/questions/40373/so-singletons-are-bad-then-what/218322#218322), although at the end of the day it is up to the developer's wisdom on whether the pattern should be used. It is prone to abuse, and it is quite difficult to debug, for reasons laid out below.

### Testing Difficulty

Our second scene, `MarioLevel2` does not have any managers or UI system: the score text, the powerup icons, overlay panel and restart button (if you implement that), etc. This is because the UI GameObject, and the Managers GameObjects are instantiated in the first Scene, and carried over. They're under the `DontDestroyOnLoad` list:

![scene2ddol](https://www.dropbox.com/s/vwjuzze5t9et8y5/6.png?raw=1)

This makes it **impossible** to test the correctness of the second scene *by itself*. You'd have to start from the first scene, and quickly dash to the end of the scene to load this second scene to test. It will be quite ridiculous to continue doing this if you have ten separate scenes and more. 

### Object Reference Bug
Another issue with Singletons is that **ANY references** in the singleton scripts has to be persistent across scenes as well. This is the reason why we made the UI gameobject along with all its children Singleton. Take a look at this example reference in `GameManager.cs`:

```java
public  Text score;

public void increaseScore(){
    Debug.Log("Player score is : " + playerScore);
    playerScore += 1;
    setScore();
    OnEnemyDeath();
}

public void setScore(){
    score.text = "SCORE: " + playerScore.ToString();
}
```

The reference `score` is probably linked up in the Editor in the first scene, as shown below:
![ref](https://www.dropbox.com/s/u34q6erzp0lc3g9/7.png?raw=1)

We have to be **completely certain** that the reference `score` is **NOT obsolete** in the next scene. All gameobjects will be **destroyed** if we load new scene with the option `LoadSceneMode.Single` (unless we use `LoadSceneMode.Additive` but that will be pretty weird to just simply keep the objects alive if we aren't using both scenes in parallel). 

It is quite a chore to do this, especially if our project is large enough and we have too many Managers controlling different things in the Scene (and not just UI as shown in this simple Lab example). The usage of `events` definitely help though, so for instance `OnEnemyDeath();` will invoke any subscribers in any Scene -- the *current* enemy being killed in either Scene. 


# Game Architecture With Scriptable Object
Ultimately, if you choose to go down the Singleton Path, the choice is entirely up to you but we feel that it is our responsibility to introduce you to another great alternative using Scriptable Objects. This will revamp our existing project by quite a lot, but the benefits are worth it:
* Scenes are clean slates
* No dependency between Systems and they are modular
* Prefabs work on their own
* *Pluggable* custom components

This [talk](https://www.youtube.com/watch?v=raQ3iHhE_Kk) inspires the existence of this section. We simply do not have enough time (unfortunately) to go into every single detailed implementation of common concepts such as game inventory, skill tree, etc but we hope that this quick introduction will point you into the right direction in the future. 

## Preparation

We need two Scenes with completely *clean slate*. That's right. **Clean Slates**. We can't reuse any of these Scripts anymore: `EnemyController`, `GameManager`, `SpawnManager`, `PowerupManager`, `Consume`, `PlayerController`, among others because we are changing the whole architecture. 

To get you up to speed, you can **create** a new Scene and name it `MarioLevel1`:

![scene1](https://www.dropbox.com/s/f1e0kzgv0yjstsr/8.png?raw=1)

* Remove any scripts from `Mario` 
* You can leave EnemySpawnPool gameobject with `ObjectPooler.cs` attached. Set the `Items To Pool` to 0. 
* The rest of the stuffs that can be in the Scene is simply stuffs with **no script at all**: just the Brick, some Pipe, and the Castle. 

**Create another Scen**e `MarioLevel2` as such:

![scene2](https://www.dropbox.com/s/ejqnlh7udzy74u0/9.png?raw=1)

Leave Mario out for now. 

For the UI on both Scenes, simply have a ScoreText placed on the upper right hand corner like we did in the first lab. 

## Using Scriptable Objects as Reference

Previously, to control Mario we have public variables in `PlayerController`:
```java
    public float jumpSpeed;
    public float maxSpeed;
```
that we can set in the Inspector to get the right feel on Mario's max speed and jump speed. We also have implemented **powerups**, that changes directly these values when the powerup is consumed, something like this:
```java
    public void consumedBy(GameObject player){
        // give player jump boost
        player.GetComponent<PlayerController>().jumpSpeed += 10;
        StartCoroutine(removeEffect(player));
    }

    IEnumerator removeEffect(GameObject player){
        yield return new WaitForSeconds(5.0f);
        player.GetComponent<PlayerController>().upSpeed -= 10;
    }
```

Allowing a direct interaction between script, and passing references around like this is not a good idea. For prototyping, *sure, maybe just or a quick proof of concept*. We can also use Managers to aid interaction between scripts, and usually these managers have to be made **Singletons**. As discussed, this potentially bring about bugs if the Singleton script refers to Scene-dependent instances. 

A better way is to decouple their interaction:

![so-pc](https://www.dropbox.com/s/f5835k8m07kzey9/10.png?raw=1)

The nodes in black denote ScriptableObjects instances. The idea is to store Mario's max speed and jump speed variable somewhere else, and then refer to it at runtime. Powerup controller can also modify these values at runtime, and since Player controller are reading from these data containers, the changes will be reflected at runtime. 

### C#: Method Overloading
**Create a script** called `IntVariable.cs`:

```java
using UnityEngine;

[CreateAssetMenu(fileName = "IntVariable", menuName = "ScriptableObjects/IntVariable", order = 2)]
public class IntVariable : ScriptableObject
{
#if UNITY_EDITOR
    [Multiline]
    public string DeveloperDescription = "";
#endif
    private int _value = 0;
    public int Value{
        get{
            return _value;
        }
    }

    public void SetValue(int value)
    {
        _value = value;
    }

    // overload
    public void SetValue(IntVariable value)
    {
        _value = value._value;
    }

    public void ApplyChange(int amount)
    {
        _value += amount;
    }

    public void ApplyChange(IntVariable amount)
    {
        _value += amount._value;
    }
}

```
* You can write helper functions in the ScriptableObject
* You can also write handy description in the Inspector when you instantiate this Object
* Notice the method **overloading** for `SetValue` and `ApplyChange`

Afterwards, create two instances of these `IntVariable` ScriptableObject by right clicking in Project tab >> Create >> ScriptableObjects >> IntVariable and name them:
* MarioJumpSpeed
* MarioMaxSpeed

In `GameConstants.cs` that you have created before, add these two fields:
```java
    // Mario basic starting values
    public int playerStartingMaxSpeed = 5;
    public int playerMaxJumpSpeed = 30;
    public int playerDefaultForce = 150;
```

Then, **create a new script** named: `PlayerControllerEV.cs`  to control Mario, with the following declarations:
```java
using System.Collections;
using UnityEngine;


public class PlayerControllerEV : MonoBehaviour
{
    private float force;
    public IntVariable marioUpSpeed;
    public IntVariable marioMaxSpeed;
    public GameConstants gameConstants;
	  
	// other components and interal state
}
```

As for the components and internal Mario state, you're free to modify them as you wish, according to however you implement Mario's movement earlier. 

Then in the `Start` method, set the values based on what's set in `gameConstants`, our go-to reference for anything that is invariant in the game. 

```java
        marioUpSpeed.SetValue(gameConstants.playerMaxJumpSpeed);
        marioMaxSpeed.SetValue(gameConstants.playerMaxSpeed);
        force = gameConstants.playerDefaultForce;
```

Then simply utilise `marioUpSpeed` and `marioMaxSpeed` accordingly in your game. This is a sample implementation in `FixedUpdate`:
```java
    void FixedUpdate()
    {
        if (!isDead)
        {
            //check if a or d is pressed currently
            if (!isADKeyUp)
            {
                float direction = faceRightState ? 1.0f : -1.0f;
                Vector2 movement = new Vector2(force * direction, 0);
                if (marioBody.velocity.magnitude < marioMaxSpeed.Value)
                    marioBody.AddForce(movement);
            }

            if (!isSpacebarUp && onGroundState)
            {
                marioBody.AddForce(Vector2.up * marioUpSpeed.Value, ForceMode2D.Impulse);
                onGroundState = false;
                // part 2
                marioAnimator.SetBool("onGround", onGroundState);
                countScoreState = true; //check if Gomba is underneath
            }
        }
```

Bool `isDead`, `isADKeyUp`, and `isSpacebarUp` is set at `Update()` using `GetKeyUp` or `GetKeyDown` accordingly since these APIs are refreshed at each frame, and hence more suitable to be called in `Update` rather than `FixedUpdate`.

Test run and you should be able to control your Mario around as per normal: move left, right, and  jump. 

## Scriptable Objects Event System

Now **create a new script** called `EnemyControllerEV.cs`, and paste the code from `EnemyController.cs` we completed in the previous lab. **Delete any instructions** regarding `CentralManager` or `GameManager`. We will not be using any Singleton Managers right now. 

Our logic stays the same: if the enemy prefab detects collision with Mario:
* If Mario "lands" on it from above, then some `OnEnemyDeath` event must be invoked to trigger:
	* Creation of one more new enemy
	* Increment of score
* Else, some `OnPlayerDeath` event must be invoked to trigger:
	* Enemy's winning dance
	* Player death animation 
	* Probably a panel + restart button to let players repeat the stage

Since we are not using any GameManagers, the event system created relies entirely on ScriptableObjects. 

We need to create a `GameEvent` object and its `Listeners`. **Create a new script** called `GameEvent.cs`. This Scriptable Object-based event will store a list if `GameEventListeners`, and `Raise` them whenever the event is invoked. 

```java
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

Naturally, **create a script** called `GameEventListener.cs` that can be attached to any GameObject meant to subscribe to the `GameEvent`:
```java

using UnityEngine;
using UnityEngine.Events;

public class GameEventListener : MonoBehaviour
{
    public GameEvent Event;

    public UnityEvent Response;

    private void OnEnable()
    {
        Event.RegisterListener(this);
    }

    private void OnDisable()
    {
        Event.UnregisterListener(this);
    }

    public void OnEventRaised()
    {
        Response.Invoke();
    }
}
```

To test this concept, create **two** GameEvent ScriptableObjects called `OnPlayerDeath` and `OnEnemyDeath` in your Assets. It is **strongly suggested** that you're highly organised for this, creating folders with meaningful names as we will be creating quite a lot of events later on.

Then, in `EnemyControllerEV.cs`, declare the two `Unity Event` variables. Don't forget to include the Events library: 

```java
using UnityEngine.Events;

... 
    // events to subscribe
    public UnityEvent onPlayerDeath;
    public UnityEvent onEnemyDeath;
```

As usual, invoke the events when there's collision between the enemy and the player:
```java
    void OnTriggerEnter2D(Collider2D other)
    {
        // check if it collides with Mario
        if (other.gameObject.tag == "Player")
        {
            // check if collides on top
            float yoffset = (other.transform.position.y - this.transform.position.y);
            if (yoffset > 0.75f)
            {
                enemyAudioSource.PlayOneShot(enemyAudioSource.clip);
                KillSelf();
                onEnemyDeath.Invoke();
            }
            else
            {
                // hurt player
                onPlayerDeath.Invoke();
            }
        }
    }
```
## UnityEvent.Invoke
What does `Invoke` do? Well, as the name said it invoke **all registered callbacks** (runtime and persistent). Who are these items? That, is set on the **Inspector**, which is none other than the `Raised` methods of our ScriptableObject `OnPlayerDeath` and `OnEnemyDeath`. 

Attach the script into a **new Gomba prefab** (pretty much the same as before, just with a new script and name it differently so you can look back and differentiate between the previous version without scriptable object event system):

![gombaprefab](https://www.dropbox.com/s/gtke683pef2mfhh/11.png?raw=1)

* Load our previously created `OnPlayerDeath` and `OnEnemyDeath` Scriptable Object instances
* On the right side, select the Raise() method as the **registered callback** when `Invoke()` is called. 


## UnityEvent Callback Signature
**Now who are the Listeners (subscribers) to these events?** We haven't set any subscribers yet. One obvious subscriber **is the enemy itself**, it is supposed to do the *victory dance* upon player's death. We can call the method directly after  `onPlayerDeath.Invoke();` instruction or we can be fancy and put the `GameEventListener` component into use. Add the **callback** for the response in `EnemyControllerEV.cs`:

```java
	// callbacks must be PUBLIC
    public void PlayerDeathResponse()
    {
        GetComponent<Animator>().SetBool("playerIsDead", true);
        velocity = Vector3.zero;
    }
```

We learned before that the **signature** of an Event must match the delegate. Since we are using **UnityEvent** instead of our own custom event, the **default signature** will be to have **no argument at all**. Notice that `Raise()` and `PlayerDeathResponse()` both have these signatures. 

> It is also important to notice that **Events DO NOT have return values**, because it simply doesn't make sense. Who do we return the values to? The Invoker? What if there's many subscribers, do we collect all return values? It doesn't make sense. 

Now to simply set this **callback** `PlayerDeathResponse` as the method called whenever `onPlayerDeath.Invoke();` is called, we attach the `GameEventListener` component for the Enemy gomba prefab, **set** `OnPlayerDeath` event as the event to listen to and **set** the response **Object** and **Method** at the inspector directly: 

![listenergomba](https://www.dropbox.com/s/47fdg86j477ssbb/12.png?raw=1)
 
Another listener to this `OnPlayerDeath` event should be the Player. Add the following method in `PlayerControllerEV.cs` as the callback (notice the same argument-less signature):

```java
    public void PlayerDiesSequence()
    {
        isDead = true;
        marioAnimator.SetBool("isDead", true);
        GetComponent<Collider2D>().enabled = false;
        marioBody.AddForce(Vector3.up * 30, ForceMode2D.Impulse);
        marioBody.gravityScale = 30;
        StartCoroutine(dead());
    }
    
    IEnumerator dead()
    {
        yield return new WaitForSeconds(1.0f);
        marioBody.bodyType = RigidbodyType2D.Static;
    }
```
> You're free to implement whatever Mario should do when he died, in the example above we have set the Animator to play some mario_death animation. 

Then similarly, attach another GameEventListener component in the Player gameobject, and link the method as the Response() and the `OnPlayerDeath` event as the event to listen to:

![marioev](https://www.dropbox.com/s/cw6bt5m0tuas7w7/13.png?raw=1)

Spawn a few enemy prefabs in the Scene to test. You can use the ObjectPooler if you want. Set the gameObject with `ObjectPooler` script attach to spawn the new prefabs:

![spawnpool](https://www.dropbox.com/s/y4a6nlfr5dyacel/14.png?raw=1)

Then to utilise the pool, **create a new script** called `SpawnManagerEV.cs` with pretty much the same code as we have seen before, but without any references to Managers:

```java
using UnityEngine;
using UnityEngine.SceneManagement;

public class SpawnManagerEV : MonoBehaviour
{
    public GameConstants gameConstants;
    void Start()
    {
        Debug.Log("Spawnmanager start");
        for (int j = 0; j < 2; j++)
            spawnFromPooler(ObjectType.greenEnemy);

    }

    void startSpawn(Scene scene, LoadSceneMode mode)
    {
        for (int j = 0; j < 2; j++)
            spawnFromPooler(ObjectType.gombaEnemy);
    }


    void spawnFromPooler(ObjectType i)
    {
        GameObject item = ObjectPooler.SharedInstance.GetPooledObject(i);

        if (item != null)
        {
            //set position
            item.transform.localScale = new Vector3(1, 1, 1);
            item.transform.position = new Vector3(Random.Range(-4.5f, 4.5f), gameConstants.groundDistance + item.GetComponent<SpriteRenderer>().bounds.extents.y, 0);
            item.SetActive(true);
        }
        else
        {
            Debug.Log("not enough items in the pool!");
        }
    }

    public void spawnNewEnemy()
    {
        ObjectType i = Random.Range(0, 2) == 0 ? ObjectType.gombaEnemy : ObjectType.greenEnemy;
        spawnFromPooler(i);
    }

}
```
where `gameConstants.groundDistance` is simply the offset required to place the enemy nicely above ground declared in `GameConstants.cs`:
```java
// use your own value, it might not be -1.0 for your case
public  float groundDistance =  -1.0f;
```

**Create a root GameObject** where we can attach this `SpawnManagerEV` script. Recall that as part of the previous checkoff, you need to spawn one new enemy when an enemy died. Now this can be done **very conveniently** by attaching a `GameEventListener` component to this gameobject, and attach the `spawnNewEnemy()` as the response + the `OnEnemyDeath` event as the event to listen to:

![spawn](https://www.dropbox.com/s/hy7qegmc9e86vbr/15.png?raw=1)

Now when Mario hits the Enemy, he died and the Enemy animates. When Mario kills the enemy, a new enemy is spawned. Hopefully you can see how **convenient** it is to use Scriptable Object Event Based System. When there's a need to add new subscriber, simply:
* Write a callback with the correct signature 
* Attach the Listener script to the gameobject 
* Set the appropriate event to listen to and the callback as the Response


The figure below summarises the relationship between the listeners and the events:

![rsevents](https://www.dropbox.com/s/3b3d3jkw97y5hgo/16.png?raw=1)

## Persistent Scoring System

Updating score is fairly easy with this architecture. Suppose we want to add the Player's score every time the enemy is stomped by Mario (every time `OnEnemyDeath` is Raised), we can lay out a plan like this:

![raisescore](https://www.dropbox.com/s/yvtyl73ndk34g2u/17.png?raw=1)

We can subscribe more than one responses in the GameEventListener, and each method will be called **in sequence**, that is `ApplyChange` first and then `UpdateScore`. 

**Create** a new Scriptable Object IntVariable **instance** and name it MarioScore. This will hold Mario's current score. 

Then, **create a script** called `ScoreMonitor.cs` and attach it to the Score Text Gameobject. This component monitors the value contained in `marioScore`.

```java
using UnityEngine.UI;
using UnityEngine;

public class ScoreMonitor : MonoBehaviour
{
    public IntVariable marioScore;
    public Text text;
    public void UpdateScore()
    {
        text.text = "Score: " + marioScore.Value.ToString();
    }
}
```

Then create a **root GameObject** called ScoreEventListener, with a GameEventListener component attached. Set up two responses for `OnEnemyDeath` as follows:

![scoreevent](https://www.dropbox.com/s/bxzrcrse0qdr7d8/18.png?raw=1)

## Resetting the Score
We probably want to clear player score back to zero `OnPlayerDeath` event, so we can add another Game Event Listener Script and set the Response to modify `MarioScore` directly as follows:

![reset](https://www.dropbox.com/s/exhoexx3hca1bkz/19.png?raw=1)

Another event where we want to reset the score is when **application quits**. **Create** a new ScriptableObject GameEvent instance named `OnApplicationExit` for this, and a simple `GameManager.cs` Script to do basic stuffs like invoking this event when application exits:

```java
using UnityEngine;
using UnityEngine.Events;
using UnityEngine.SceneManagement;

public class GameManagerEV : MonoBehaviour
{
    public UnityEvent onApplicationExit;
	void OnApplicationQuit()
    {
        onApplicationExit.Invoke();
    }
}
```
You can create a root gameobject with this script, acting as a simple current-Scene-only Game Manager. Set the `OnApplicationExit` scriptable object as the unity event `onApplicationExit` field in the inspector. Then, head to **ScoreEventListener** GameObject and add yet another listener that resets Mario's score upon application exit:

![exitevent](https://www.dropbox.com/s/sxiejq92y5l1m1l/20.png?raw=1)

Test run by increasing the score (stomp on some monsters) and then stopping the application. Press play again and ensure that the scoreText is back at zero. 

## Updating ScoreText when Scene starts
We only have one Scene for now, so the value of the score printed will always be `Score: 0` as set in the **scene**, but when we load the second scene later on, this will not work well. We need to update the ScoreText based on whatever the content of `MarioScore` is when Scene starts. 

This can be  done naturally in `ScoreMonitor.cs` by implementing the regular `Start` callback:
```java
public void Start()
{
    UpdateScore();
}
```

Obviously, we don't need the `OnApplicationQuit` game event, since we can just set Mario's score into zero in `ScoreMonitor` by implementing something like:
```java
void OnApplicationQuit(){
	marioScore.SetValue(0);
}
```
... but it will be pretty weird to set `marioScore` with a score monitor. 

## Changing Scenes 
We previously tried hard to preserve the value of Score using Singleton GameManager and Singleton UI (along with their children). Fortunately with this new architecture, we no longer need to do so. Our score inherently persistent inside `MarioScore` ScriptableObject, we just need to reset them accordingly when application quits or when Mario dies as we did above. 

**Create a new script** `ChangeSceneEV.cs` to be attached to the Castle Door GameObject with a BoxCollider2D (isTrigger checked) and AudioSource (optional):
```java
using System.Collections;
using UnityEngine;
using UnityEngine.SceneManagement;
public class ChangeSceneEV : MonoBehaviour
{
    public AudioSource changeSceneSound;
    void OnTriggerEnter2D(Collider2D other)
    {
        if (other.tag == "Player")
        {
            changeSceneSound.PlayOneShot(changeSceneSound.clip);
            StartCoroutine(ChangeScene("MarioGameEVLevel2"));
        }
    }

    IEnumerator WaitSoundClip(string sceneName)
    {
        yield return new WaitUntil(() => !changeSceneSound.isPlaying);
        StartCoroutine(ChangeScene("MarioGameEVLevel2"));

    }
    IEnumerator ChangeScene(string sceneName)
    {
        AsyncOperation asyncLoad = SceneManager.LoadSceneAsync(sceneName, LoadSceneMode.Single);
        // Wait until the asynchronous scene fully loads
        while (!asyncLoad.isDone)
        {
            yield return null;
        }
    }
}
```

![castledoor](https://www.dropbox.com/s/zhcw97xi3lblavr/21.png?raw=1)

Now store `GameManager`, `ScoreEventListener`, `UI` (or whatever gameobject containing that `ScoreText`) and `Mario` as a **prefab**. Then place them in the second scene. Make sure to set up whatever you need in each GameObject inspector properly. 

Here's a gif to aid you. Ignore the PowerupManager for now. 
![settings](https://www.dropbox.com/s/sty9xmua42jl9nr/settings.gif?raw=1)

Make sure both scenes are added to the BuildSetting. Open the first Scene, and test the transition. You should see that the score persists in the second scene. 
![score](https://www.dropbox.com/s/251ipxt56bintyv/score.gif?raw=1)

You can also *test* the second Scene **independently** now. **With this new architecture, each Scene is a clean slate.** 

# Inventory System
Another useful application of ScriptableObject is to utilise them as an **inventory system**. The idea is to have an Inventory Scriptable Object, and a Scriptable Object for every possible *item*. We can apply this idea to our Powerup system. 

Recall that in the previous lab, we created the UI for powerups in the Scene: 
> They were initially disabled so we won't see them until we collect the powerup. 

![scenepowerup](https://www.dropbox.com/s/oc5pplcwozru3b1/22.png?raw=1)


We used the *actual instances* of the consumable GameObject (red or orange mushroom) to `cast` the effect on the Player's maxSpeed or jumpSpeed when the key z or x is pressed. This does not allow us to *carry over* the powerup effect to the next scene when used.

**This gif below shows the result when we used the Singleton implementation.** The redmushroom powerup, although it wasn't used yet, wasn't carried over in the second scene. Notice the RedMushroom(Clone) **exist** in the hierarchy despite being *unseen* because the gameobject has to be there if we want to cast the skill
> Bad design, we know. They were made like that initially for easy planning.

![powerupgone](https://www.dropbox.com/s/vu1gfppmcw3y22q/powerupgone.gif?raw=1)

With the new architecture utilising Scriptable Object Events, we can retain our powerup to the next scene, without having any object under DontDestroyOnLoad, hence effectively making **each Scene a clean slate**.

![powerupstay](https://www.dropbox.com/s/cudcegnxt9q1ndf/powerupstay.gif?raw=1)

In order to do this, we need to plan our *Inventory system* for our powerups. 

## Inventory ScriptableObject
**Create** a new script `Inventory.cs` that serves as a base class. There's a few methods to add or remove items from the inventory, and also a state that indicate whether a game is started for the first time or not.
```java
using System.Collections;
using System.Collections.Generic;
using UnityEngine;

[SerializeField]
public class Inventory<T> : ScriptableObject
{
    public bool gameStarted = false;
    public List<T> Items = new List<T>();

    public void Setup(int size){
        for (int i = 0; i < size; i++){
            Items.Add(default(T));
        }
    }

    public void Clear(){
        Items = new List<T>();
        gameStarted = false;
    }

    public void Add(T thing, int index)
    {
        if (index < Items.Count)
            Items[index] = thing;
    }

    public void Remove(int index)
    {
       if (index < Items.Count)
            Items[index] = default(T);
    }

    public T Get(int index){
        if (index < Items.Count){
            return Items[index];
        }
        else return default(T);
    }
}
```
> Note: T indicate a generic type. If T is a reference type, then default(T) means `null`.

Then **create** another Scriptable Object script `Powerup.cs` to define each Powerup in **general**. This serves as a base template for all kinds of powerup, so you need to think carefully all kinds of effects from all powerup. For this example, we can decide that a powerup can either affect player's speed, or jump speed (or both). 

> Add other effects and methods as you wish. 

```java
using System.Collections;
using System.Collections.Generic;
using UnityEngine;

[CreateAssetMenu(fileName = "Powerup", menuName = "ScriptableObjects/Powerup", order = 5)]
public class Powerup : ScriptableObject
{
#if UNITY_EDITOR
    [Multiline]
    public string DeveloperDescription = "";
#endif
	// index in the UI
    public PowerupIndex index;
	// texture in the UI
    public Texture powerupTexture;
    
    // list of things any powerup can do
    public int aboluteSpeedBooster;
    public int absoluteJumpBooster;

	// effect of powerup
    public int duration;

    public List<int> Utilise(){
        return new List<int> {aboluteSpeedBooster, absoluteJumpBooster};
    }

    public void Reset(){
        aboluteSpeedBooster = 0;
        absoluteJumpBooster = 0;
    }

    public void Enhance(int speedBooster, int jumpBooster){
        aboluteSpeedBooster += speedBooster;
        absoluteJumpBooster += jumpBooster;
    }
}
```
`PowerupIndex` is an enum type, declared in `PowerupManagerEV.cs` script. For now, **create** this script and add the following code to silent the error in `Powerup.cs`:
```java
using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.UI;

public enum PowerupIndex
{
    ORANGEMUSHROOM = 0,
    REDMUSHROOM = 1
}
public class PowerupManagerEV : MonoBehaviour
{
}
```

Then **create another script** to utilise the above base Inventory, called `PowerupInventory.cs`. We don't have to implement anything, just simply inherit `Inventory` with `Powerup` as the object type in the inventory. 
```java
using System.Collections;
using System.Collections.Generic;
using UnityEngine;

[CreateAssetMenu(fileName = "PowerupInventory", menuName = "ScriptableObjects/PowerupInventory", order = 6)]
public class PowerupInventory : Inventory<Powerup>
{
}
```

> Sanity check: you should have created 4 new scripts by now, `Inventory.cs`, `Powerup.cs`, `PowerupInventory.cs`, `PowerupManagerEV.cs`. 

## Create Powerup Scriptable Object for Each Type of Powerup

As the title said, go to your Assets folder, and create this powerup scriptable object. One example is as such:

![redmush](https://www.dropbox.com/s/l7acflc9zh8aufc/23.png?raw=1)

Notice how we store the metadata of this powerup in this scriptable object. You can easily create other powerups of your choice.


## Create PowerupInventory Scriptable Object 
It simply looks like this:
![inventory](https://www.dropbox.com/s/5dpktr4fm8pwt3l/26a.png?raw=1)

## Create Powerup Prefab
**Create a new Prefab** resembling the item that you can collect to obtain this powerup. We can reuse our Consumable Mushroom. If you forget, it is just a regular GameObject with BoxCollider2D, Rigidbody, Animator, and a script controlling its patrol location:

![redMush](https://www.dropbox.com/s/vtsyrxigtdzzcey/24.png?raw=1)

Now what we want to happen is to detect collision between this mushroom and the player, and this will add the powerup UI on the top left hand corner like the previous lab using ScriptableObject events. However this time round, we need to **have some sort of custom parameters** to indicate the effect of the powerup to the Powerup Manager. 

To do this, we cannot use the vanilla `UnityEvent`. We need to create our own event.

## UnityEvents with Parameter
We need to create a `PowerupEvent` together with the **matching** `PowerupEventListener` for this, not the previous `GameEvent` and `GameEventListener` which don't require any parameters.

Here's the script to modify UnityEvents with Parameter, simply declare a new class inheriting `UnityEvent`and add in the `<Powerup>` parameter. This script can be named as `PowerupEventListener.cs`
```java

using UnityEngine;
using UnityEngine.Events;


[System.Serializable]
public class CustomPowerupEvent : UnityEvent<Powerup>
{
}

public class PowerupEventListener : MonoBehaviour
{
    public PowerupEvent Event;
    public CustomPowerupEvent Response;
    private void OnEnable()
    {
        Event.RegisterListener(this);
    }

    private void OnDisable()
    {
        Event.UnregisterListener(this);
    }

    public void OnEventRaised(Powerup p)
    {
        Response.Invoke(p);
    }
}
```

And here's the matching `PowerupEvent.cs` ScriptableObject:
```java
using System.Collections.Generic;
using UnityEngine;


[CreateAssetMenu(fileName = "PowerupEvent", menuName = "ScriptableObjects/PowerupEvent", order = 3)]
public class PowerupEvent : ScriptableObject
{
    private readonly List<PowerupEventListener> eventListeners = 
        new List<PowerupEventListener>();

    public void Raise(Powerup p)
    {
        for(int i = eventListeners.Count -1; i >= 0; i--)
            eventListeners[i].OnEventRaised(p);
    }

    public void RegisterListener(PowerupEventListener listener)
    {
        if (!eventListeners.Contains(listener))
            eventListeners.Add(listener);
    }

    public void UnregisterListener(PowerupEventListener listener)
    {
        if (eventListeners.Contains(listener))
            eventListeners.Remove(listener);
    }
}
```

Then, create a `OnPowerupCollected` Scriptable Object PowerupEvent **instance** in your Assets. 

Finally, **create a script** `ConsumableTriggerChecker.cs` to be attached to the mushroom, triggering this **CustomPowerupEvent event with `Powerup stats` passed as parameter:**
```java
using System.Collections;
using UnityEngine;
using UnityEngine.Events;

public class ConsumableTriggerChecker : MonoBehaviour
{
    public Powerup stats;
    public CustomPowerupEvent onCollected;

    void OnCollisionEnter2D(Collision2D col)
    {
        if (col.gameObject.CompareTag("Player"))
        {
            onCollected.Invoke(stats);
			Destroy(this.gameObject);
        }
    }
}
```

We can set up the inspector to be:
![setupmushred](https://www.dropbox.com/s/r7abz7uxdkm2tqe/25.png?raw=1)

## Powerup Listener
Now the final job is to implement the gameObject that acts as the listener to this `OnPowerupCollected` event. 

**Create** a root gameobject PowerupManager, and attach the previously created `PowerupManagerEV.cs` script to it. 

Add a few more instructions inside it:
* References to all ScriptableObjects containing Powerup-affected player values such as max speed and jump speed 
* Reference to current PowerupInventory 
* References to the Scene's Powerup Slots GameObjects
```java
public class PowerupManagerEV : MonoBehaviour
{
    // reference of all player stats affected
    public IntVariable marioJumpSpeed;
    public IntVariable marioMaxSpeed;
    public PowerupInventory powerupInventory;
    public List<GameObject> powerupIcons;

    void Start()
    {
        if (!powerupInventory.gameStarted)
        {
            powerupInventory.gameStarted = true;
            powerupInventory.Setup(powerupIcons.Count);
            resetPowerup();
        }
        else
        {
            // re-render the contents of the powerup from the previous time
            for (int i = 0; i < powerupInventory.Items.Count; i++)
            {
                Powerup p = powerupInventory.Get(i);
                if (p != null)
                {
                    AddPowerupUI(i, p.powerupTexture);
                }
            }
        }
    }
    
    public void resetPowerup()
    {
        for (int i = 0; i < powerupIcons.Count; i++)
        {
            powerupIcons[i].SetActive(false);
        }
    }
    
    void AddPowerupUI(int index, Texture t)
    {
        powerupIcons[index].GetComponent<RawImage>().texture = t;
        powerupIcons[index].SetActive(true);
    }

    public void AddPowerup(Powerup p)
    {
        powerupInventory.Add(p, (int)p.index);
        AddPowerupUI((int)p.index, p.powerupTexture);
    }

    public void OnApplicationQuit()
    {
        ResetValues();
    }
 }
```
The `Start` method contains a quick check on whether the game is started the first time or not. If not, we shall render whatever powerup exists in our inventory. 

The `AddPowerup` method is the callback for `PowerupEventListener` script we are going to attach on this PowerUpManager GameObject. **Set everything up in your scene as follows:**

![powerupmanager1](https://www.dropbox.com/s/3ox1b3lyq0xzj18/27.png?raw=1)

To summarise, here's the relationship between `OnPowerupCollected` Powerup Event and the Listener, and the update of Powerup UI (Slot 1 and 2):
![rspowerup](https://www.dropbox.com/s/g39abxm6npalsv5/28a.png?raw=1)

Since the powerup collected is now **added to the PowerupInventory**, the **content** of PowerupInventory will persist between Scene changes. Transform this `PowerupManager` gameobject as a prefab and instantiate it in the Second Scene, linking the necessary UI elements in that new Scene:

![scene2powerup](https://www.dropbox.com/s/x26yr0fz3m2e0n7/29.png?raw=1)

The check at `Start()` method of `PowerupControllerEV.cs` will set the PowerupUI according to the content of `PowerupInventory` regardless on which Scene we are on. The contents of `PowerupInventory` ScriptableObject instance will be reset on each application quit.

We shall also reset PowerupInventory's content on player's death. Simply add the GameEventListener component to the PowerupManager Gameobject prefab:

![gameevent](https://www.dropbox.com/s/qpl7dr69h9oz8tv/30.png?raw=1)

Test run and obtain some powerup in the first scene. When you proceed to the next scene, you should still have the powerup with you. 

# Checkoff
Implement a **Powerup Cast** feature using the ScriptableObject Event system. 
* When key Z is pressed, attempt to cast powerup in the first slot. Nothing should happen if you haven't collected anything there. Else, it must affect Mario's max or jump speed for a *specific duration* as dictated in the Powerup ScriptableObject instance. 
* Similarly with key X, for the powerup in the second slot. 
* You need to have at least **two different powerups** as per previous lab. 

To do this, will need to create another `CastEventListener.cs` and its matching `CastEvent` scriptable object. It works with custom `UnityEvent<KeyCode>` since we need want to pass the `Keycode` to the listener attached at `PowerupManager` and know exactly whether the first slot or the second slot is casted. The diagram below shows a possible architecture:

![checkoff](https://www.dropbox.com/s/0qrp8a8uwm88xdn/31.png?raw=1)

The gif below summarises the end result:
* You can carry over unused powerup to the next scene
* Score is carried over
* Usage of powerup should dissipate after a  `duration`
* There's more than 1 kind of powerup
* Restart functionality is **optional**, but cool to have and not easy to implement. Simply implement another GameEventListener for OnPlayerDeath that shows the panel and restart button, and callback to reload **this scene** again.  
* You may use Singleton pattern and totally ignore the ScriptableObject architecture if you want

![checkoff](https://www.dropbox.com/s/b9p1tw128c117ma/checkoff.gif?raw=1)




<!--stackedit_data:
eyJoaXN0b3J5IjpbNDc3NjU0MDUxLC0xMDE4NzcwMzIyXX0=
-->