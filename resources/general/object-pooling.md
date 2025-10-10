---
sidebar_position: 7
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
import CollapsibleAnswer from '@site/src/components/CollapsibleAnswer';
import DeepDive from '@site/src/components/DeepDive';
import ImageCard from '@site/src/components/ImageCard';
import ChatBaseBubble from "@site/src/components/ChatBaseBubble";
import VideoItem from '@site/src/components/VideoItem';

# Object Pooling

:::info
**Object pooling** is a design pattern (specifically: creational pattern) that you can use to optimize your projects by lowering the burden that is placed on the CPU when having to rapidly **instantiate** and **destroy** GameObjects. It is particularly useful for top-down bullethell games, or games that have swarms of monsters that are constantly created and destroyed at runtime.
:::

Without pooling, frequent instantiation and garbage collection can cause frame rate drops and stuttering. By keeping a pool of inactive objects ready to be activated and recycled, games reduce CPU and memory overhead, achieve smoother performance on both high-end and mobile devices, and maintain more predictable behavior during action-heavy moments.

The main idea of Object Pooling is as follows:

- Instantiate `N` objects at `Awake()`, but render them **inactive**. Place all of them in a _pool_.
- Activate each objects at runtime accordingly, instead of instantiating new ones. This action removes _available_ objects from the _pool_.
- After we are done with these objects, <span class="orange-bold">deactivate</span> them. This essentially returns the object back to the _pool_, ready to be reused next time.
- The _pool_ may run out of objects to be activated eventually, and we can optionally _expand_ the pool at runtime. This requires instantiation of new gameObjects obviously, so try to reduce the need to do so and instantiate enough relevant game objects at `Awake()`.

## The Object Pooler

The Object Pooler script is going to be attached to an empty gameobject in the Scene, and it is typically made persistent (a Singleton).

It utilises three classes:

- `ObjectPoolItem`: A class to define the data structure of an Object metadata to be spawned into the pool
- `ExistingPoolItem`: A class to define the data structure of an Object _in_ the pool
- `ObjectType`: A SO class that serves as a concrete representation of a type of an object (as opposed to using enums or strings)

### ObjectType

```cs title="ObjectType.cs"
using UnityEngine;

[CreateAssetMenu(menuName = "Object Pool/Object Type")]
public class ObjectType : ScriptableObject
{
}

```

With this, you can right click in the Project window >> Object Pool >> Object Type to create any type you want as shown below:

<ImageCard path={require("/resources/general/images/object-pooling/2025-10-02-10-51-45.png").default} widthPercentage="100%"/>

### ObjectPoolItem

```cs title="ObjectPoolItem.cs"
[System.Serializable]
public class ObjectPoolItem
{
    public int amount;
    public GameObject prefab;
    public bool expandPool;
    public ObjectType type;   // ScriptableObject reference
}
```

This class will be used later on by the `ObjectPooler` script to define the objects to instantiate in the pool. We can conventiently define in the inspector the characteristics of the objects to be spawned.

### ExistingPoolItem

```cs title="ExistingPoolItem.cs"

public class ExistingPoolItem
{
    public GameObject gameObject;
    public ObjectType type;
    private Vector3 defaultScale;
    private Quaternion defaultRotation;

    public ExistingPoolItem(GameObject gameObject, ObjectType type)
    {
        this.gameObject = gameObject;
        this.type = type;

        defaultScale = gameObject.transform.localScale;
        defaultRotation = gameObject.transform.localRotation;
    }

    public void ResetState()
    {
        // Reset transform
        gameObject.transform.localScale = defaultScale;
        gameObject.transform.localRotation = defaultRotation;

        // Re-enable all behaviours
        foreach (var comp in gameObject.GetComponentsInChildren<Behaviour>(true))
        {
            comp.enabled = true;
        }

        // Reset rigidbodies
        foreach (var rb in gameObject.GetComponentsInChildren<Rigidbody2D>())
        {
            rb.linearVelocity = Vector2.zero;
            rb.angularVelocity = 0f;
        }
        foreach (var rb in gameObject.GetComponentsInChildren<Rigidbody>())
        {
            rb.linearVelocity = Vector3.zero;
            rb.angularVelocity = Vector3.zero;
        }

        // Script hook
        foreach (var poolable in gameObject.GetComponentsInChildren<IPoolable>())
        {
            poolable.OnReused();
        }
    }
}
```

This is the data structure to describe _each_ instantiated object in the pool. The `ObjectPooler` script will go through a list of `ObjectPoolItem` and then instantiate the appropriate GameObject based on the defined prefab and quantity, then instantiate new `ExistingPoolItem` with that detail.

### ObjectPooler

<Tabs>
<TabItem value="1" label="ObjectPooler.cs">

```cs
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.SceneManagement;


public class ObjectPooler : Singleton<ObjectPooler>
{
    public List<ObjectPoolItem> itemsToPool;      // types of different objects to pool
    public List<ExistingPoolItem> pooledObjects;  // list of all pooled objects
    private Transform sceneContainer;
    override public void Awake()
    {
        base.Awake();
        SceneManager.sceneLoaded += OnSceneLoaded; // SceneManager.sceneLoaded always fires when a scene is loaded, including the very first scene of the game
    }

    private void OnSceneLoaded(Scene scene, LoadSceneMode mode)
    {
        InitializePools(); // re-run init logic for the new scene
    }

    private void InitializePool()
    {
        Debug.Log("[Pooler] Initializing pool");
        CreateSceneContainer();
        pooledObjects = new List<ExistingPoolItem>();
        foreach (ObjectPoolItem item in itemsToPool)
        {
            for (int i = 0; i < item.amount; i++)
            {
                GameObject pickup = Instantiate(item.prefab, sceneContainer);
                pickup.SetActive(false);

                var e = new ExistingPoolItem(pickup, item.type);
                pooledObjects.Add(e);

                Debug.Log($"[Pooler] Added {pickup.name} of type {item.type.name}");
            }
        }
    }



    private void CreateSceneContainer()
    {
        GameObject container = new GameObject("PoolContainer");
        sceneContainer = container.transform;
    }

    private GameObject GetPooledObject(ObjectType type)
    {
        // 1. Try to find an inactive object to reuse
        for (int i = 0; i < pooledObjects.Count; i++)
        {
            var pooled = pooledObjects[i];
            if (!pooled.gameObject.activeInHierarchy && pooled.type == type)
            {
                Debug.Log($"[Pooler] Reusing pooled object of type {type.name}");
                pooled.ResetState(); //  reset when reused
                return pooled.gameObject;
            }
        }

        // 2. If none available, expand pool if allowed
        foreach (ObjectPoolItem item in itemsToPool)
        {
            if (item.type == type && item.expandPool)
            {
                GameObject pickup = Instantiate(item.prefab);
                pickup.SetActive(false);
                pickup.transform.parent = this.transform;

                var newItem = new ExistingPoolItem(pickup, item.type);
                pooledObjects.Add(newItem);

                Debug.Log($"[Pooler] Expanded pool for type {type.name}");
                newItem.ResetState(); //  also reset when newly created
                return pickup;
            }
        }

        // 3. Nothing found or expandable
        Debug.LogWarning($"[Pooler] No pooled object available for type {type.name}");
        return null;
    }


    public void SpawnFromPooler(ObjectType type, Vector3 position)
    {
        GameObject item = GetPooledObject(type);
        if (item != null)
        {
            // example random spawn
            item.transform.position = position;
            item.SetActive(true);

            Debug.Log($"[Pooler] Spawned object of type {type.name} at {item.transform.position}");
        }
        else
        {
            Debug.LogWarning($"[Pooler] Not enough items in the pool for type {type.name}");
        }
    }
}


```

</TabItem>

<TabItem value="2" label="Singleton.cs">

```cs
using UnityEngine;

public class Singleton<T> : MonoBehaviour where T : MonoBehaviour
{
    private static T _instance;
    public static T instance
    {
        get
        {
            return _instance;
        }
    }

    public virtual void Awake()
    {

        if (_instance == null)
        {
            _instance = this as T;
            DontDestroyOnLoad(this.gameObject);
        }
        else
        {
            Destroy(gameObject);
        }
    }
}
```

</TabItem>
</Tabs>

The `ObjectPooler` inherits the `Singleton` class, so that only one instance is created once the scene loads for as long as the Application is running.

:::note
Common practice in most games:

- Keep a persistent global singleton pooler
- Subscribe to `SceneManager.sceneLoaded` and rebuild/extend pools if scene-specific prefabs are needed
- Pooled objects themselves don’t need to know about scenes (not made singleton)

:::

#### ItemsToPool

This list will be exposed to the inspector and we can define what objects we want the pooler the spawn, the prefabs, and the quantity, as well as its type.
<ImageCard path={require("/resources/general/images/object-pooling/2025-10-03-09-19-20.png").default} widthPercentage="40%"/>

#### Awake & Initialize Pool

In `Awake`. we immediately subscribed to `OnSceneLoaded` method which call `InitializePool`. This ensures that the pool is re-created when new scene is loaded, given that this instance is a Singleton.

In the `InitializePool` method, we create a SceneContainer, which is a new GameObject in the scene which will be the parent object of all spawned objects in the pool as dictated by `itemsToPool`. We cannot make it the child of `this` instance as it will make all the child objects persists under `DontDestroyOnLoad`.

- Pooler singleton is marked `DontDestroyOnLoad`, so the manager survives across scenes
- The pooled object will be assigned as the children of `SceneContainer` so it doesn't survive across scenes because typically we have different things to spawn then (we can change `itemsToPool` in the ObjectPooler while prepping for scene change so it will initialize different things then)

#### GetPooledObject

This private method tries to find an inactive object to reuse. If one exists, then it will call `ResetState` method:

- Defined in `ExistingPoolItem`
- Does standard hardcoded behavior: reset transform scale and rotation, re-enable all components, reset rigidbodies
- Calls `OnReused()` method implemented by [`IPoolable`](#IPoolable)

:::caution
It is important to reset the states of a pooled object before spawning them, except its transform location.
:::

If we run out of pool object and if `expandPool` flag for that type is ticked, then the ObjectPooler will create new instances of that object during runtime.

### SpawnFromPooler

This is a public method that can be directly called by other script to spawn (activate) available object from the pooler. It requires the type of object (SO reference created earlier) and the location of spawning.

### IPoolable

Sometimes we have custom setting that we need to do to the object in the pool before we spawn them. We can do this in any script <span class="orange-bold">attached to the pooled object prefab</span>, as long as it implements IPoolable:

```cs title="IPoolable.cs"

public interface IPoolable
{
    void OnReused() { }         // optional: called when pulled from pool
}

```

`ExistingPoolItem` always calls `OnReused` in its `ResetState` to apply these additional logic.

### Returning Object to the pool

There's <span class="orange-bold">no</span> method to "return" the object to the pool. We simply _deactivate_ the object using the following to effectively tell the `ObjectPooler` that this item is available to be reused:

```cs
    gameObject.SetActive(false);
```

## Demo

Attach the ObjectPooler script to a gameobject, and set up the initial values like so:

<ImageCard path={require("/resources/general/images/object-pooling/2025-10-03-15-21-12.png").default} widthPercentage="100%"/>

To test, we can create an object spawner script as such:

:::note
It relies on custom InspectorButton attribute so that we can conveniently call the function via a button on the inspector. Read this [guide](/resources/general/helper-buttons#generic-debut-button-generator-editor-script) to find out more.
:::

```cs title="ObjectSpawner.cs"
using System.Collections.Generic;
using UnityEngine;
using Game.DebugTools;

// Spawner: decides what to spawn and where. It should never care about internal prefab state.
public class ObjectSpawner : MonoBehaviour
{
    public Camera cam;                  // assign main camera in Inspector (or get in Awake)
    [Header("Put all kinds of types to spawn automatically when Space key is pressed")]
    public List<ObjectType> spawnTypes; // drag Enemy.asset, Bullet.asset, etc. here
    [Header("Pick the type you want to spawn in the Inspector")]
    public ObjectType typeToSpawn;  // drag Enemy.asset, Bullet.asset, etc.
    void Awake()
    {
        if (cam == null) cam = Camera.main;
    }

    void Update()
    {
        if (Input.GetKeyDown(KeyCode.Space))
        {
            // 1. Pick a random type
            ObjectType randomType = spawnTypes[Random.Range(0, spawnTypes.Count)];

            // 2. Pick a random position inside camera bounds
            Vector3 pos = GetRandomScreenPosition();

            // 3. Spawn using ObjectPooler
            ObjectPooler.instance.SpawnFromPooler(randomType, pos);
        }
    }

    private Vector3 GetRandomScreenPosition()
    {
        float height = cam.orthographicSize * 2f;
        float width = height * cam.aspect;

        float x = Random.Range(-width / 2f, width / 2f);
        float y = Random.Range(-height / 2f, height / 2f);

        return new Vector3(x, y, 0f);
    }

    [InspectorButton]
    public void SpawnFromInspectorType()
    {
        Vector3 pos = GetRandomScreenPosition();
        ObjectPooler.instance.SpawnFromPooler(typeToSpawn, pos);
    }
}

```

Then simply attach it to any gameobject:

<ImageCard path={require("/resources/general/images/object-pooling/2025-10-03-15-28-16.png").default} widthPercentage="100%"/>

We wrote a simple floating behavior of the objects in the pool when spawned, where it implements the `IPoolable` interface. This way we can write our object-specific logic before it's reactivated from the pool:

```cs title="FloatingEffect.cs"
using UnityEngine;

public class FloatingEffect : MonoBehaviour, IPoolable
{
    [Header("Floating Settings")]
    public float floatAmplitude = 0.5f;   // vertical float height
    public float floatFrequency = 1f;     // vertical float speed

    [Header("Drift Settings")]
    public float driftRadius = 0.5f;      // horizontal drift distance
    public float driftSpeed = 0.5f;       // drift speed

    [Header("Lifetime Settings")]
    public float lifetime = 5f;           // total lifetime before disabling
    public float shrinkDuration = 0.5f;   // time spent shrinking before disable

    private Vector3 startPos;
    private float randomOffset;
    private Camera mainCam;
    private float disableTime;

    private bool isShrinking = false;
    private Vector3 originalScale;

    void OnEnable()
    {
        mainCam = Camera.main;
        startPos = transform.position;
        randomOffset = Random.Range(0f, 100f);

        originalScale = transform.localScale;
        transform.localScale = originalScale; // reset size

        disableTime = Time.time + lifetime;
        isShrinking = false;
    }

    void Update()
    {
        if (mainCam == null) return;

        // Floating up/down
        float yOffset = Mathf.Sin((Time.time + randomOffset) * floatFrequency) * floatAmplitude;

        // Smooth drift in XY
        float xOffset = (Mathf.PerlinNoise((Time.time + randomOffset) * driftSpeed, 0f) - 0.5f) * 2f * driftRadius;
        float yDrift = (Mathf.PerlinNoise(0f, (Time.time + randomOffset) * driftSpeed) - 0.5f) * 2f * driftRadius;

        Vector3 newPos = startPos + new Vector3(xOffset, yOffset + yDrift, 0f);

        // Clamp inside viewport
        Vector3 viewportPos = mainCam.WorldToViewportPoint(newPos);
        viewportPos.x = Mathf.Clamp01(viewportPos.x);
        viewportPos.y = Mathf.Clamp01(viewportPos.y);
        newPos = mainCam.ViewportToWorldPoint(viewportPos);

        transform.position = newPos;

        // Shrink before disabling
        if (!isShrinking && Time.time >= disableTime - shrinkDuration)
        {
            isShrinking = true;
            StartCoroutine(ShrinkAndDisable());
        }
    }

    private System.Collections.IEnumerator ShrinkAndDisable()
    {
        Vector3 startScale = transform.localScale;
        float t = 0f;

        while (t < shrinkDuration)
        {
            t += Time.deltaTime;
            float lerp = Mathf.Clamp01(t / shrinkDuration);
            transform.localScale = Vector3.Lerp(startScale, Vector3.zero, lerp);
            yield return null;
        }

        gameObject.SetActive(false);


    }

    // Called by pool when reused
    public void OnReused()
    {
        transform.localScale = originalScale;
        isShrinking = false;
    }
}

```

The result of the whole object pooler setup is as follows:

<VideoItem path={"https://50033.s3.ap-southeast-1.amazonaws.com/tutorials/object-pooler.mp4"} widthPercentage="100%"/>

Observation:

- Objects are spawned at runtime and never destroyed, only deactivated
- Inactive objects are seen as "ready" items in the pool, there's <span class="orange-bold">no need</span> to explicitly write a method to "return" object into the pool
- The ObjectPooler is a Singleton, but the objects in the pools are not (they're children of the `Container`)
- You can implement the reuse logic on the object itself as long as you attach a MonoBehaviour script that implements `IPoolable`

## Caveats

### Performance Tradeoffs

The purpose of object pooling is to improve performance, but if we preload a very large number of objects (thousands) at `Awake()`, the startup time and memory footprint can spike. For example, hundreds of bullets, particles, or enemies all created up front may cause a noticeable hitch on low-end devices.

### State Leakage

Resetting pooled objects is tricky. We've handled scale, rotation, rigidbodies, and custom `IPoolable.OnReused`, but pooled objects may still carry **hidden** state (e.g., animations mid-clip, timers, NavMeshAgent state, static variables). If reset logic misses something, you get inconsistent behavior that only appears after reuse.

### Scene Reloading Edge Cases

We're subscribing to `SceneManager.sceneLoaded` to re-initialize pools. However, if `itemsToPool` is not updated before scene load, the pool may rebuild with the wrong prefab set or wipe existing objects unexpectedly.

Also, pooled objects under the `SceneContainer` won’t persist because that’s what we wanted. This is <span class="red-bold">not suitable</span> for persistent projectiles or effects across scenes.
