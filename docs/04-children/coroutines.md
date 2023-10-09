---
sidebar_position: 4
---

import CollapsibleAnswer from '@site/src/components/CollapsibleAnswer';
import DeepDive from '@site/src/components/DeepDive';
import ImageCard from '@site/src/components/ImageCard';
import ChatBaseBubble from '@site/src/components/ChatBaseBubble';
import VideoItem from '@site/src/components/VideoItem';
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Polishing with Coroutines

To polish our game further, we need to ensure that:

1. All player actions have discernible **feedback**
2. The UI is coherent
3. There exist a main menu to properly start a game
4. Restart and pausing capability works as intended
5. There exist some modularity in the code structure of the game, for instance: powerups

What we have learned so far: animation, sound management, input system, scriptable objects, singleton pattern, and asset management are more than sufficient to polish the game. But another aspect of polishing that we want to have in our game is <span className="orange-bold">responsiveness</span>.

In certain situations, we might want to spread a sequence of events like procedural animations over time. We can utilise **coroutines** for this.

## C#: Coroutines

A coroutine lets us to spread tasks across several **frames**. It pauses execution and return control to Unity, and then continue where it left off on the following <span className="orange-bold">frame</span>. A normal function like `Update()` cannot do this and must run into completion before returning control to Unity.

Coroutines are very <span className="orange-bold">resource efficient</span> so it's okay to use them for your projects.

:::warning
It is important to understand that Coroutines are <span className="orange-bold">not</span> threads. Synchronous operations that run within coroutines are still executed on Unity main thread. Do <span className="orange-bold">not</span> use blocking operation in a coroutine. If you want to use threads for consuming an `HTTP` request, for example, you can use [async methods](#async-methods) instead.
:::

You can declare and call Coroutine like this:

```cs
    IEnumerator  functionName(){
        // implementation here
        // typically contain a yield return statement
    }

    void UseCoroutine()
    {
        // call it
        StartCoroutine(functionName());
        // do other things (can be done immediately after coroutine yields)
    }
```

#### Basic Idea

When you start a coroutine using `StartCoroutine`, the coroutine runs on the Unity main thread, just like the rest of your game code. It <span className="orange-bold">doesn't block</span> the execution of the `Update` or other functions in your script. You also <span className="orange-bold">don't need to wait for the coroutine to finish</span> before the Update function or other Unity event functions are called as per normal.

The Unity main thread continues to execute other code and events while the coroutine is running in the background. The coroutine itself will `yield` control back to the main thread when it encounters a `yield` statement, such as yield return new `WaitForSecondsRealtime(time)` (see later section), allowing other code to run during the specified time delay <span className="orange-bold">without freezing</span> the entire game. Once the time delay is over, the coroutine resumes its execution.

In short, you can think of coroutines in Unity as a way to perform tasks over time or in the background without blocking the main thread and the normal execution of Unity's event functions like `Update`.

### Examples

#### Health Replenish UI

One example of procedural animation is gradually increasing the health bar over time (e.g: after drinking a potion, etc):

```cs title="HealthBar.cs"
using System.Collections;
using UnityEngine;

public class HealthBar : MonoBehaviour
{
   // an SO instance containing hp
   public IntVar playerHP;

   public void RefillHealth(int amount)
   {
       StartCoroutine(HealthIncrease(amount));
   }

   IEnumerator HealthIncrease(float amount){
       for(int x=1; x <= amount && playerHP.Value <= playerHP.maxValue >; x++){
           playerHP.Value += x;
           GameManager.instance.UpdateUI(); // calls for update
           yield return new WaitForSeconds(0.2f);
       }
   }
}
```

#### Temporary Invincibility

For those making casual (chaotic) couch multiplayer game, you will also want to use coroutines to prevent the same player to be hit again after 0.5 seconds. This will create temporary invincibility to avoid an unjust game experience. We would deactivate the player's hitbox or some `vulnerable` state for 0.5 seconds before enabling it again.

#### Fading Loading Screen

Another example is to fade UI elements in the loading scene right before game starts:

```cs title="LoadAndWait.cs"
using UnityEngine;
using UnityEngine.SceneManagement;

public class LoadAndWait : MonoBehaviour
{
    public CanvasGroup c;

    void Start()
    {
        StartCoroutine(Fade());
    }
    IEnumerator Fade()
    {
        for (float alpha = 1f; alpha >= -0.05f; alpha -= 0.05f)
        {
            c.alpha = alpha;
            yield return new WaitForSecondsRealtime(0.1f);
        }

        // once done, go to next scene
        SceneManager.LoadSceneAsync("World-1-1", LoadSceneMode.Single);
    }

    public void ReturnToMain()
    {
        // TODO
        Debug.Log("Return to main menu");
    }
}

```

We can tryout `Fade` above by creating another scene called `LoadingScene` with the following configuration. Feel free to create a Main Menu as well.

<VideoItem path={"https://50033.s3.ap-southeast-1.amazonaws.com/week-4/fadescene.mp4"} widthPercentage="100%"/>

:::note highlight on hover button
It's common to highlight a button by showing some image beside it, like the mushroom cursor on SuperMarioBros main menu. To do this, simply set the `Normal Color` of a button to have an alpha value of 0, and its `Highlighted Color` to have an alpha value of 1.

<VideoItem path={"https://50033.s3.ap-southeast-1.amazonaws.com/week-4/hover-highlight-button.mp4"} widthPercentage="100%"/>

When you select a button on the UI, the button will remain "selected" even after you have finished clicking. In order to "reset" the button state, add the following instructions in the callback of that button (e.g: we want to reset highscore but not leave the button in the state of "pressed" after highscore is reset):

```cs
        GameObject eventSystem = GameObject.Find("EventSystem");
        eventSystem.GetComponent<UnityEngine.EventSystems.EventSystem>().SetSelectedGameObject(null);
```

This is what the `EventSystem` GameObject in your scene is for, which is to manage events of mouse clicks and keyboard presses to interact with the UI elements (automatically created when you added your first UI Element GameObject to your scene).

:::

<br/>

### `yield return`

On a coroutine, the yield return `[something]` returns control to Unity until that `[something]` condition is fulfilled. If we do `yield return null`, your coroutine execution <span className="orange-bold">pauses</span> for the next frame and **continues** where it left off (after the `yield return`) afterwards, depending on whether that `[something]` condition is fulfilled, <span className="orange-bold">all these done without blocking the caller of the coroutine</span>. That `[something]` can be also be any of the things below:

1. [Wait for a few seconds](https://docs.unity3d.com/ScriptReference/WaitForSeconds.html) (scaled): `yield return new WaitForSeconds(0.1f)`
2. Wait for a few seconds ([realtime](https://docs.unity3d.com/ScriptReference/WaitForSecondsRealtime.html)): `yield return new WaitForSecondsRealtime(0.1f)`
3. Wait until [next fixed update frame](https://docs.unity3d.com/ScriptReference/WaitForFixedUpdate.html) or [until end of frame](https://docs.unity3d.com/ScriptReference/WaitForEndOfFrame.html):
   - `yield return new WaitForEndOfFrame()`
   - `yield return new WaitForFixedUpdate()`
4. Wait until a certain _delegate_ value is [true](https://docs.unity3d.com/ScriptReference/WaitUntil.html) or [false](https://docs.unity3d.com/ScriptReference/WaitWhile.html)
   - `yield return new WaitUntil(() => some_value > some_condition)`
   - `yield return new WaitWhile(() => some_value < some_condition)`

The example below illustrates the behavior using `WaitForSecondsRealtime`:

```cs showLineNumbers
using System.Collections;
using UnityEngine;

public class Coroutines : MonoBehaviour
{

   void Start(){
       Debug.Log("Begin Start event");
       StartCoroutine(WaitCoroutine(2f));
       Debug.Log("End Start event");
   }

   private IEnumerator WaitCoroutine(float time){
       Debug.Log("Inside coroutine");
       yield return new WaitForSecondsRealtime(time);
       Debug.Log("Finish coroutine after "+time+" seconds");
   }
}

// Printed output:
//
// Begin Start event
// Inside coroutine
// End Start event
// Finish coroutine after 2 seconds
```

The order of execution of the code at first begin as per normal: line 8, 9, then line 14, and 15. When `yield return` statement is met, we return control to Unity first (hence line 10 is executed). Two seconds later, line 16 is then executed.

Here's another example using `WaitWhile` (taken from [Unity official documentation](https://docs.unity3d.com/ScriptReference/WaitWhile.html)):

```cs showLineNumbers
using UnityEngine;
using System.Collections;

public class WaitWhileExample : MonoBehaviour
{
    public int enemies = 10; // we assume something else is reducing this value, one per second

    void Start()
    {
        Debug.Log("Begin rescue mission");
        StartCoroutine(Rescue("Toad"));
        Debug.Log("Rescue mission started");
    }

    IEnumerator Rescue(string name)
    {
        Debug.Log($"Waiting for Mario to rescue {name}...");
        yield return new WaitWhile(() => enemies > 0);
        Debug.Log($"Finally, all enemies are eliminated and {name} have been rescued!");
    }

}

// Printed output:
//
// Begin rescue mission
// Waiting for Mario to rescue Toad...
// Rescue mission started
// Finally, all enemies are eliminated and I have been rescued!
```

:::important
When you start a coroutine using `StartCoroutine`, it doesn't block the execution of the calling method (in the above case, `Start`). The coroutine runs _separately_ in the background, and the calling method continues to execute immediately after starting the coroutine.

Remember that Unity coroutines are not executed on separate threads. They run on the Unity main thread, just like the rest of your Unity game code. Coroutine provides a way to perform asynchronous-like operations <span className="orange-bold">without</span> introducing threading complexities.
:::

#### Waiting for a Coroutine to Finish

If you have a very specific case such as to wait for Coroutine launched in a `Start` function _before_ the `Update` function is launched, then you need to use some kind of `flag` to make this happen, for instance:

```cs
using System.Collections;
using UnityEngine;

public class SomeScript : MonoBehaviour
{
    private bool isStartComplete = false;

    void Start()
    {
        Debug.Log("Begin Start event");
        StartCoroutine(StartEventCoroutine());
        Debug.Log("Start Invoked");
    }

    private IEnumerator StartEventCoroutine()
    {
        // Perform any initialization or tasks you need in Start here.
        // ...

        // Assume you want to delay for 2 seconds before Update() works
        yield return new WaitForSeconds(2f);

        // Mark the Start as complete.
        isStartComplete = true;
    }

    void Update()
    {
        // Only execute Update when StartEventCoroutine completes
        if (isStartComplete)
        {
            // Your Update code here.
            // ...
        }
    }
}
```

### Starting Multiple Coroutines

You can also start many coroutines at once, such as:

```cs
    void Start()
    {
        Debug.Log("Begin rescue mission");
        StartCoroutine(Rescue("Toad"));
        StartCoroutine(Rescue("Peach"));
        Debug.Log("Rescue mission started");
    }
```

The output:

<ImageCard path={require("./images/scriptableobjects/2023-09-15-11-49-56.png").default} widthPercentage="100%"/>

### Stopping Coroutines

You can stop any coroutines by using the `StopCoroutine` method, with the name of the `IEnumerator` as string:

```cs
StopCoroutine("Rescue");
StopCoroutine("Fade");
```

:::note
A coroutine will also <span className="orange-bold">automatically</span> stop if the object that it’s attached to is disabled by SetActive(false) or by destroying the object with Destroy().
:::

If you would like to <span className="orange-bold">stop all Coroutines in the Behavior</span> (Coroutines on the script), then you can use the method `StopAllCoroutines()`. Note that this will only stop coroutines that are in the same script so other scripts won't be effected.

## C#: Async Methods and Multithreading With Task{#async-methods}

:::warning
It is highly unlikely that you will need to implement async methods with extra threads in your game, but this section is added here to highlight _differences_ between async methods and coroutines.

Unity's coroutines and C#'s async methods are <span className="orange-bold">separate</span> mechanisms for handling asynchronous operations. Unity's coroutines are specific to the Unity game engine and provide a way to perform tasks over time or in the background without blocking the main thread. C#'s async/await feature, on the other hand, is a **general-purpose** mechanism for handling asynchronous operations in C#.
:::

Async methods running on a separate threads are useful **if** you need to perform <span className="orange-bold">very extensive computation</span> that requires millions of CPU cycles while keeping your game responsive. In other words, we want to utilise the CPU _only after it's done_ computing whatever it needs for each frame.

Consider the following script. Here we test **three** different approach to perform an expensive `PerlinNoise` computation: the vanilla way (just sequential), using a coroutine, and using another thread (`Task`) asynchronously. When key `c` is pressed, this heavy computation will begin.

```cs title="HeavyComputation.cs"
using System.Collections;
using UnityEngine;
using System.Threading;
using System.Threading.Tasks;

public enum method
{
    useVanilla = 0,
    useCoroutine = 1,
    useAsync = 2
}

public class AsyncAwaitTest : MonoBehaviour
{
    public method method;
    public int size = 10000;
    private bool calculationState = false;


    void Update()
    {
        if (Input.GetKeyDown("c"))
        {
            Debug.Log("Key c is pressed");
            if (!calculationState)
            {
                switch (method)
                {
                    case (method.useVanilla):
                        PerformCalculationsVanilla();
                        break;
                    case (method.useCoroutine):
                        StartCoroutine(PerformCalculationsCoroutine());
                        break;
                    case (method.useAsync):
                        PerformCalculationsAsync();
                        break;
                    default:
                        break;
                }
                Debug.Log("Perform calculations dispatch done");
            }
        }

        if (Input.GetKeyDown("q"))
        {
            Destroy(this.gameObject);
        }
    }

    void PerformCalculationsVanilla()
    {
        System.Diagnostics.Stopwatch stopwatch = new System.Diagnostics.Stopwatch();
        stopwatch.Start();
        calculationState = true;
        float[,] mapValues = new float[size, size];
        for (int x = 0; x < size; x++)
        {
            for (int y = 0; y < size; y++)
            {
                mapValues[x, y] = Mathf.PerlinNoise(x * 0.01f, y * 0.01f);
            }
        }
        calculationState = false;
        stopwatch.Stop();
        UnityEngine.Debug.Log("Real time elapsed using vanilla method: " + (stopwatch.Elapsed));
        stopwatch.Reset();
    }


    IEnumerator PerformCalculationsCoroutine()
    {
        System.Diagnostics.Stopwatch stopwatch = new System.Diagnostics.Stopwatch();
        stopwatch.Start();

        calculationState = true;
        float[,] mapValues = new float[size, size];
        for (int x = 0; x < size; x++)
        {
            for (int y = 0; y < size; y++)
            {
                mapValues[x, y] = Mathf.PerlinNoise(x * 0.01f, y * 0.01f);
            }
            yield return null; // takes super long, only called at 60 times a second
        }
        calculationState = false;
        stopwatch.Stop();
        UnityEngine.Debug.Log("Real time elapsed Coroutine: " + (stopwatch.Elapsed));
        stopwatch.Reset();
        yield return null;
    }

    async void PerformCalculationsAsync()
    {
        System.Diagnostics.Stopwatch stopwatch = new System.Diagnostics.Stopwatch();
        stopwatch.Start();
        var result = await Task.Run(() =>
        {
            calculationState = true;
            float[,] mapValues = new float[size, size];
            for (int x = 0; x < size; x++)
            {
                for (int y = 0; y < size; y++)
                {
                    mapValues[x, y] = Mathf.PerlinNoise(x * 0.01f, y * 0.01f);
                }
            }
            return mapValues;
        });

        calculationState = false;
        stopwatch.Stop();
        UnityEngine.Debug.Log("Real time elapsed using Async & Await: " + (stopwatch.Elapsed));
        stopwatch.Reset();

    }
}

```

In this video below, we bind the mouse right button click and movement with camera rotation to demonstrate how each method differs.
<VideoItem path={"https://50033.s3.ap-southeast-1.amazonaws.com/week-4/async-vs-coroutine.mp4"} widthPercentage="100%"/>

#### Vanilla Method

The vanilla method causes the game to be <span className="orange-bold">unresponsive</span> for about 2 seconds.

#### Coroutine

When the method is changed into using a Coroutine, the time taken to complete the computation becomes close to 17 seconds instead (too long!). This is because of the `yield` statement at each outer loop (means the next loop is only resumed at the next frame). When `x` is set to 1000 and the game is run at 60fps, it takes $$\frac{1000}{60} = 16.67$$ seconds to complete just this computation. This is way too long of a wait even though the system stays responsive in the meantime.

#### Async & Await with Task

What we wanted is to **utilise** our CPU as much as possible _while staying responsive_. To do so, we can run `async` function and await for Task completion. Remember that `Update` is only called 60 times a second (where we check for inputs, execute basic game logic, etc), so there’s plenty of leftover time that we can use to complete this calculation function. It still takes slightly more than 2 seconds to complete the computation. This shows that using `async` function does not (necessarily) make any computation time faster than the vanilla method, but in the meantime, the system is still **responsive**.

:::warning
Calling an `async` function without any `await` in its body results in synchronous execution. We need to `await` some `Task` as shown in the example above, e.g: `var result = await Task.Run(()`.
:::

## Comparison With Coroutine

This section briefly covers the comparison between the two. There’s no better or worse solution, and you can simply choose the solution that suits your project best. The content for this section is distilled from [this](https://www.youtube.com/watch?v=7eKi6NKri6I) video.

### Async Functions Always Complete

Async functions <span className="orange-bold">always</span> runs into completion because they continue to run even after the MonoBehavior is destroyed, while Coroutines are run <span className="orange-bold">on</span> the GameObject. Therefore, disabling the gameobject will cause any coroutine running on it to stop but <span className="orange-bold">doesn’t exit</span> naturally.

Consider the following script:

```cs title="TestDestroy.cs showLineNumbers"
using System.Collections;
using UnityEngine;
using System.Threading.Tasks;
public class TestDestroy : MonoBehaviour
{
    async void Start()
    {
        StartCoroutine(Sampletask());
        SampleTaskAsync();
        await Task.Delay(1000);
        Destroy(gameObject);
    }

    async void SampleTaskAsync()
    {
        // This task will finish, even though it's object is destroyed
        Debug.Log($"Async Task Started for object {this.gameObject.name}");
        await Task.Delay(5000);
        Debug.Log($"Async Task Ended for object {this.gameObject.name}");
    }

    IEnumerator Sampletask()
    {
        // This task won't finish, it will be stopped as soon as the object is destroyed
        Debug.Log($"Coroutine Started for object {this.gameObject.name}");
        yield return new WaitForSeconds(5);
        Debug.Log($"Coroutine Ended for object {this.gameObject.name}");
    }
}
```

Attaching the above script and running it will result in the output:

<VideoItem path={"https://50033.s3.ap-southeast-1.amazonaws.com/week-4/test-destroy-async.mp4"} widthPercentage="100%"/>

Notice how the message `Coroutine Ended...` never gets printed out, but instruction at line 19 causes an error because we tried to access the already destroyed GameObject's name (since `async` function always completes). Therefore you have to be careful when accessing the instance's member in async functions.

#### Memory Leak With Coroutine

On the other hand, Coroutines might result in <span className="orange-bold">memory leak</span> if not used properly since it does not exit if the gameObject has been destroyed. Assets in Unity (textures, materials, etc) are <span className="orange-bold">not</span> garbage collected as readily as other types. Unity will clean up unused assets on scene loads, but to keep them from piling up it's our responsibility to manage the assets we're creating, and `Destroy()` them when we're finished.

In the following example, the `finally` block never gets executed and thus results in memory leak.

```cs
    IEnumerator RenderEffect(UnityEngine.UI.RawImage r)
    {
        var texture = new RenderTexture(1024, 1024, 0);
        try
        {
            for (int i = 0; i < 1000; i++)
            {
                // do something with r and texture
                // then give control back to Unity after one interation
                yield return null;
            }
        }
        finally
        {
            texture.Release();
        }
    }
```

### Stopping Async Functions

To be sure that Coroutines always exit especially on destroyed GameObjects, we need to be mindful to `StopCoroutine(...)` during `onDisable` of the GameObject. Likewise, we can also cancel the running of async functions using cancellation **tokens**.

```cs
    // declare and initialise at Start()
    CancellationTokenSource token;

    void Start(){
        token = new CancellationTokenSource();
    }


    async void PerformCalculation(){

        // passed the token when defining Task
        var result = await Task.Run(() =>
        {
            calculationState = true;
            float[,] mapValues = new float[size, size];
            // ... implementation
            for (.....){
                // ... implementation
                // periodically check for cancellation token request
                if (token.IsCancellationRequested)
                {
                    Debug.Log("Task Stop Requested");
                    return mapValues;
                    }
            }
            return result;
        }, token.Token); // token passed as second argument of Task.Run()
    }

    // set the token to Cancel the function on object disable
    void OnDisable()
    {
        Debug.Log("itemDisabled");
        token.Cancel();
    }

```

### Return Values

We cannot return anything in a Coroutine, but async functions can the following return types (thats why we can `await` its results!):

- [Task](https://learn.microsoft.com/en-us/dotnet/api/system.threading.tasks.task?view=net-7.0), for an async method that performs an operation but returns no value.
- [Task<TResult\>](https://learn.microsoft.com/en-us/dotnet/api/system.threading.tasks.task-1?view=net-7.0), for an async method that returns a value.
- `void`, for an event handler.

For example, the following async function returns a `Sprite` placed at a `path`.

:::note Resource Path
Using `Resources.Load` or `Resources.LoadAsync`, you can load an asset of the requested `type` stored at a `path` in the `Resources` folder. You must first create the `Assets/Resources` folder for this to work. Note that the `path` is case insensitive and must <span className="orange-bold">not</span> contain a file extension. [Read the full documentation here](https://docs.unity3d.com/ScriptReference/Resources.Load.html).
:::

```cs
    async Task<Sprite> LoadAsSprite_Task(string path)
    {
        // getting sprite inside Assets/Resources/ folder
        var resource = await Resources.LoadAsync<Sprite>(path);
        return (resource as Sprite);
    }
```

We can call them as such in `Start()` (notice how the Start method has to be `async` now to `await` this `Task`), and print some quick test in `Update()` to confirm if `Update()` is run at least for **one** frame before `Start()` is continued, and we can obtain some information about the return value of `LoadAsSprite_Task` async function. Here's an example:

```cs title="AsyncReturnValue.cs"

using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using System.Threading;
using System.Threading.Tasks;

public class AsyncReturnValue : MonoBehaviour
{
    // Start is called before the first frame update
    private bool testTask = false;
    private int frame = 0;
    async void Start()
    {
        Debug.Log("Start method begins...");
        Sprite s = await LoadAsSprite_Task("Sprites/play-button"); // the actual file is at Assets/Resources/play-button.png
        testTask = true;
        Debug.Log("The sprite: " + s.name + " has been loaded.");
        Debug.Log("Start method completes in frame: " + frame.ToString());
    }
    void Update()
    {
        frame++;
        if (!testTask)
            Debug.Log("Update called at frame: " + frame);
    }

    async Task<Sprite> LoadAsSprite_Task(string path)
    {
        // getting sprite inside Assets/Resources/ folder
        ResourceRequest request = Resources.LoadAsync<Sprite>(path);
        // While the request is not done, yield to Unity's coroutine system.
        while (!request.isDone)
        {
            await Task.Yield();
        }

        return (Sprite)request.asset;
    }

}

```

Here's the console output:
<ImageCard path={require("./images/coroutines/2023-09-15-17-59-59.png").default} widthPercentage="100%"/>

It shows that `Start` is called first as usual, but **asynchronously**, allowing `Update` to advance and increase the frame value. When the sprite has been loaded, the Start method resumes and print the `Start method completes` message.

:::warning
We can't `await` a Coroutine, it does not make sense because Unity's coroutines are not Task-based and don't return a Task object that you can `await`. However you can achieve similar result such as using a flag that will be set to `true` once a Coroutine completes.
:::

## Summary

Choosing between coroutines and async/await Task isn't always straightforward due to their differing functionalities.

It's essential to understand that asynchronous code <span className="orange-bold">doesn't always imply multithreading</span>, and the behavior can vary depending on the specific APIs and libraries you're working with.

Coroutines are best for _fire-and-forget_ tasks like fading the screen, replenishing health bar, triggering explosion on crates two seconds after it collides with the player and similar tasks, while async is essential for processing intensive tasks in the background _without_ causing game stalls. Coroutines can be **tricky**, but async functions can get **complex** when handling task cancellation. In practice, using both methods in your project is common. As a broadly general rule, it may be simpler to employ coroutines for object-related game logic and reserve async for situations like executing lengthy background tasks.

## Fix The Powerup Bug {#powerup-bug}

If you follow the tutorial exactly, you will have a particular powerup bug. While our powerup works at first glance, having the collider placed above the box will cause problems if Mario approached it from above as follows:

<VideoItem path={"https://50033.s3.ap-southeast-1.amazonaws.com/week-4/bug-powerup.mp4"} widthPercentage="100%"/>

The Starman powerup looks alright if we only collide with it from below, however it mistakenly collided with Mario even before spawned. On the other hand, the Magic Mushroom powerup didn't have that.

You need to disable the collider and set its `RigidBody2D.type` to `static` at first, and then enable the collider and set the `RigidBody2D.type` to `dynamic` upon `SpawnPowerup()`. However, you can't do it all in the same function because adding Impulse Force to a currently static body type will <span className="orange-bold">not work</span>. Even though you have changed its type to `dynamic` in this frame, the Engine does not know yet and so you technically need to wait until the **next frame** to add the Impulse force to move the powerup once spawned. You can utilise Coroutine or utilise `await Task.Delay()` for this.
