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

1. All player actions constitute a reaction
2. The UI is coherent
3. There exist a main menu to properly start a game
4. Restart and pausing capability works as intended
5. There exist some modularity in the code structure of the game, for instance: powerups

What we have learned so far: animation, sound management, input system, scriptable objects, singleton pattern, and asset management are more than sufficient to polish the game. But another aspect of polishing that we want to have in our game is <span className="orange-bold">responsiveness</span>.

In certain situations, we might want to spread a sequence of events like procedural animations over time. We can utilise **coroutines** for this.

## C#: Coroutines

A coroutine lets us to spread tasks across several **frames**. It pauses execution and return control to Unity, and then continue where it left off on the following <span className="orange-bold">frame</span>. A normal function like Update() cannot do this and must run into completion before returning control to Unity.

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
        StartCoroutine(functionName());.
    }
```

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

On a coroutine, the yield return `[something]` returns control to Unity until that `[something]` condition is fulfilled. If we do `yield return null`, your coroutine code <span className="orange-bold">pauses</span> for the next frame and **continues** where it left off (after the `yield return`) afterward, depending on whether that `[something]` condition is fulfilled. That `[something]` can be also be any of the things below:

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

If you would like to <span className="orange-bold">stop all Coroutines in the game</span>, then you can use the method `StopAllCoroutines()`.

## C#: Async Methods and Multithreading {#async-methods}

:::warning
It is highly unlikely that you will need to implement async methods with extra threads in your game, but this section is added here to highlight _differences_ between async methods and coroutines.
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

> This can potentially result in memory leak

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

We cannot return anything in a Coroutine, but async functions can the following return types:

- [Task](https://learn.microsoft.com/en-us/dotnet/api/system.threading.tasks.task?view=net-7.0), for an async method that performs an operation but returns no value.
- [Task<TResult\>](https://learn.microsoft.com/en-us/dotnet/api/system.threading.tasks.task-1?view=net-7.0), for an async method that returns a value.
- `void`, for an event handler.

For example, the following async function returns a `Sprite`:

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
        Sprite s = await LoadAsSprite_Task("Sprites/play-button");
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
