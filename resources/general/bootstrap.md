---
sidebar_position: 11
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
import CollapsibleAnswer from '@site/src/components/CollapsibleAnswer';
import DeepDive from '@site/src/components/DeepDive';
import ImageCard from '@site/src/components/ImageCard';
import ChatBaseBubble from "@site/src/components/ChatBaseBubble";
import VideoItem from '@site/src/components/VideoItem';

# Bootstrapping

:::info
This module is a <span class="orange-bold">natural</span> extension of the [Hybrid Service–Adapter pattern](https://natalieagus.github.io/50033/resources/general/hybrid-arch): it keeps SOs as Services/Adapters and <span class="orange-bold">adds a clean boot sequence</span> (one Bootstrapper + Config) so Save, Audio, and Scene systems are initialized, subscribed, and traceable from frame zero.
:::

```
Scene/UI (buttons, controllers)
        │     (raise events)
        ▼
[ Event Channels (SO) ]  — decoupled broadcast
        │     (subscribe at enable)
        ▼
[ Bridges (SO) = Services/Adapters ]
        │     (do work: save, audio, scene)
        ▲
        │  (explicit init)
[ Bootstrapper Mono ] → [ BootstrapConfigSO ]

```

With a bootstrapper, we get deterministic startup (no “some SO didn’t enable yet” flakiness), uniform protocol reusable for new systems (Input, Localization, Analytics) and traceable logs from boot → event → bridge action.

### Basic Idea

One `Bootstrapper` runs at startup, reads a single `BootstrapConfigSO`, and brings <span class="orange-bold">every</span> global system online using the same protocol:

```
Channel (broadcast requests) → Bridge (listen and do work) → Config (wires them all up)
```

Instead of scattered “managers” or hidden statics, each subsystem (Save, Audio, Scene) exposes an event channel and a ScriptableObject bridge that subscribes on enable and performs the action, with clear debug logs the whole way.

By the end, you’ll have a one-click boot sequence you can copy to new projects: add a channel, add a bridge, reference both in the config, and the system is live from frame zero.

### Relationship with SOGA (Lab 5)

The Bootstrap pattern slashes repetitive wiring <span class="orange-bold">for cross-cutting</span> systems (Save, Audio, Sceneloading, etc): instead of sprinkling hundreds of `GameEventListeners`, you raise a channel and a single Bridge SO does the work (Save/Audio/Scene, etc.), giving you <span class="orange-bold">deterministic</span> startup and decoupled comms without per-scene listeners.

For the rest, we keep it lean: use code-first subscriptions in controllers for core gameplay (subscribe/unsubscribe in OnEnable/OnDisable), and handle wide fan-out visuals with 1–3 routers (scene or prefab-level) that listen to a few topic events (e.g., OnPlayerJump, OnAttack) and fan out to multiple effects.

- Prefabize wiring where it’s designer-tuned,
- Keep typed C# for logic, and
- Reserve inspector hooks for presentation

:::note Rule of thumb
Global services → Channel/Bridge, core gameplay → code subscriptions, broad VFX/UI → small routers, not a thousand listeners.
:::

### Architecture Overview

```
[GameBootstrap (MonoBehaviour)]
        │
        ▼
[BootstrapConfigSO (ScriptableObject asset)]
        │ initializes (forces deserialize + OnEnable)
        ├─────────────────────────────────────────────────────────────────┐
        │                                                                 │
        ▼                                                                 ▼
 [SaveBridgeSO]  listens to  [SaveEventChannelSO]         [AudioBridgeSO] listens to [AudioEventChannelSO]
        │                     ▲                                   │                       ▲
        │ calls               └────────────── UI/Game code raises ┘                       └── UI/Game code raises
        ▼
  SaveRegistry (static)
        ▲
   ISaveable implementers

        ▼
 [SceneBridgeSO] listens to [SceneEventChannelSO] ──► uses SceneManager (LoadSceneAsync/UnloadSceneAsync)

Debug logs trace: Bootstrap → Channel subscriptions → Button raises → Bridge actions.

```

## The Bootstrap Protocol

**Event Channel ScriptableObject (per subsystem)**: public, typed API that broadcasts requests. UI or gameplay code calls channel methods; _nothing_ talks directly to the bridges.

**Bridge/Manager ScriptableObject (per subsystem)**: subscribes to its channel in `OnEnable`, performs actions when events fire, and unsubscribes in `OnDisable`. This keeps runtime logic centralized and scene-agnostic.

**Bootstrap class**: provides a single, global registry that remembers every important ScriptableObject at runtime.

**Bootstrap Config SO**: registers references to all Bridges and Channels into `Bootstrap`. `InitializeAll()` touches _each_ reference to force Unity to deserialize the assets and trigger their `OnEnable` so subscriptions are active before play.

**GameBootstrap MonoBehaviour**: a <span class="orange-bold">single</span> scene entry point that invokes the config’s `InitializeAll()` in `Awake()`.

:::note
This protocol is the point of “bootstrapping”: one place to _initialize everything_; no direct cross-references from UI/gameplay to bridges; all calls go through <span class="orange-bold">channels</span>.
:::

### Demo Subsystems

To see the protocol in action, we include **three** global subsystems:

- **Save**: Demonstrates global state capture/restore with a static `SaveRegistry` and `ISaveable`. Buttons raise save/load on the `SaveEventChannel`, `SaveBridge` invokes `SaveRegistry`.
- **Audio**: Demonstrates a persistent audio root with two `AudioSources` (SFX/BGM). Buttons raise SFX/BGM/Stop on `AudioEventChannel`, `AudioBridge` plays/stops clips. `DontDestroyOnLoad` ensures continuity across scenes.
- **Scene**: Demonstrates scene transitions. Buttons raise `load`/`unload` on `SceneEventChannel`, `SceneBridge` calls `SceneManager.*`

### Folder Setup

Here's a minimal folder setup for this demo to work:

```
Assets/
 ├── Scripts/
 │   ├── Bootstrap/
 │   │   ├── GameBootstrap.cs
 │   │   ├── Bootstrap.cs
 │   │   └── BootstrapConfigSO.cs
 │   ├── Systems/
 │   │   ├── Save/
 │   │   │   ├── SaveEventChannelSO.cs
 │   │   │   ├── SaveBridgeSO.cs
 │   │   │   └── SaveRegistry.cs
 │   │   ├── Audio/
 │   │   │   ├── AudioEventChannelSO.cs
 │   │   │   └── AudioBridgeSO.cs
 │   │   └── Scene/
 │   │       ├── SceneEventChannelSO.cs
 │   │       └── SceneBridgeSO.cs
 ├── Game/
 │   └── BootstrapConfig.asset
 ├── Events/
 │   ├── SaveEventChannel.asset
 │   ├── AudioEventChannel.asset
 │   └── SceneEventChannel.asset
 ├── Scenes/
 │   ├── Scene_Main.unity
 │   └── Scene_Level1.unity
 └── UI/
     ├── SaveButtonUI.cs
     ├── AudioButtonUI.cs
     └── SceneButtonUI.cs
```

### Bootstrapper (Config SO + Runner MonoBehavior + Static Registry)

This is a system that resets, initializes, and holds references to all Bridges and Event Channels. Unity only keeps ScriptableObjects in memory if something in a scene or prefab references them. Otherwise, they remain serialized data on disk, essentially text describing field values.

When the game starts, Unity “deserializes” referenced assets: _it reads that serialized data and recreates the ScriptableObject in memory_. Anything not referenced <span class="orange-bold">stays unloaded</span>.

In small projects this is fine, but in larger systems we often need global ScriptableObjects: such as `GameStateSO`, `InputReader`, or event channels to exist _even when no scene directly references them_. Without a mechanism to keep track of these, developers end up manually dragging the same assets into every prefab, which quickly becomes tedious and fragile.

#### The Bootstrap Class

```cs title="Bootstrap.cs"
using System;
using System.Collections.Generic;
using UnityEngine;

public static class Bootstrap
{
    private static readonly Dictionary<Type, ScriptableObject> registry = new();

    public static void Register(ScriptableObject instance)
    {
        if (instance == null) return;
        var type = instance.GetType();
        registry[type] = instance;
        Debug.Log($"[Bootstrap] Registered {type.Name}");
    }

    // a simple runtime lookup that returns the globally registered instance of a ScriptableObject type T.
    public static T Resolve<T>() where T : ScriptableObject
    {
        if (registry.TryGetValue(typeof(T), out var so))
            return so as T;

        Debug.LogWarning($"[Bootstrap] {typeof(T).Name} not registered");
        return null;
    }
}
```

`Bootstrap.cs` solves this by providing a single, global registry that remembers every important ScriptableObject at runtime.

- It contains a static dictionary mapping a **type** to a **ScriptableObject instance**.
- When the game starts, a separate setup script (`BootstrapConfigSO`) loads and registers all systems by calling `Bootstrap.Register(instance)`.
- Any other script can later call `Bootstrap.Resolve<T>()` to <span class="orange-bold">retrieve</span> that instance without an inspector reference.

:::note Register and Resolve
`Register()` simply stores the object in the dictionary and logs its name.

`Resolve<T>()` looks up the type key and returns the corresponding instance; if none was registered, it prints a warning.

Together they form a lightweight <span class="orange-bold">service locator</span> for global `ScriptableObjects`.
:::

This also <span class="red-bold">removes the need for repeated drag-and-drop linking</span>, ensures all shared systems refer to the same instance, and makes dependencies explicit in code rather than hidden in the editor. The registry lives across scene loads, so every system registered once at startup can be accessed anywhere during the game.

_It acts as the one source of truth for global subsystems._

#### The Bridge abstract class

The base class BridgeSO provides a common foundation for all bridges.

<Tabs>

<TabItem value="1" label="BridgeSO.cs">

```cs title="BridgeSO.cs"
using UnityEngine;

// Bridges are the active connectors that:
// listen to Event Channels,
// perform actions,
// or coordinate between systems (e.g., save, audio, scene, UI).
// They always implement IRuntimeInitializable, because they must subscribe to events or systems at startup.
public abstract class BridgeSO : ScriptableObject, IRuntimeInitializable
{
    // Optional to override
    public virtual void RuntimeInit()
    {
        // Default no-op
        Debug.Log($"[BridgeSO] {name} has no RuntimeInit override (skipped).");
    }
}
```

</TabItem>
<TabItem value="2" label="IRuntimeInitializable.cs">

```cs
public interface IRuntimeInitializable
{
    // Set up live connections or subscriptions: prepare it to interact with other systems.
    // Example: connect to other systems or events
    //     public void RuntimeInit()
    // {
    //     var input = Bootstrap.Resolve<InputReader>();
    //     input.pauseEvent += OnPause;
    //     Debug.Log("[GameStateSO] Initialized and listening for pause events");
    // }
    void RuntimeInit();
}

```

</TabItem>
</Tabs>

#### BootstrapConfigSO

:::info
BootstrapConfigSO is the manifest and initializer for the game’s core systems. It controls deserialization, registration, and startup order, ensuring consistent behavior across all scenes without manual drag-and-drop references.
:::

When the game first launches, Unity hasn’t yet deserialized or initialized most of the global ScriptableObjects, only the ones referenced directly by a scene are alive. `BootstrapConfigSO` fixes that by _keeping a serialized list of bridges_ (and optionally shared states or event channels) that must always be <span class="orange-bold">active</span>.

<Tabs>
<TabItem value="1" label="BootstrapConfigSO.cs">

```cs
using UnityEngine;
using System.Collections.Generic;
using System.Reflection;

[CreateAssetMenu(menuName = "Game/Bootstrap Config")]
public class BootstrapConfigSO : ScriptableObject
{
    [Header("Active Systems (Bridges)")]

    // only serialize bridges
    // channels have no side effects when loaded, no onEnable and no runtime code unless someone calls the methods like RaiseEventX()
    [SerializeField] private List<BridgeSO> bridges = new();

    [Header("Shared States (Data)")]
    [SerializeField] private List<ScriptableObject> sharedStates = new();

    /// <summary>
    /// Initializes all runtime systems that implement IRuntimeInitializable.
    /// </summary>
    public void InitializeAll()
    {
        // this forces unity to deserialize
        // meaning: “make Unity actually load this ScriptableObject’s data into memory right now,” not just have a file reference to it.
        foreach (var bridge in bridges)
        {
            if (bridge == null) continue;

            Bootstrap.Register(bridge);

            AutoRegisterSOFields(bridge);

            if (bridge is IRuntimeResettable reset)
            {
                reset.RuntimeReset();
                Debug.Log($"[BootstrapConfigSO] Reset {bridge.name}");
            }

            if (bridge is IRuntimeInitializable init)
            {
                init.RuntimeInit();
                Debug.Log($"[BootstrapConfigSO] Initialized {bridge.name}");
            }
        }
        Debug.Log($"[BootstrapConfigSO] Bootstrap complete for {bridges.Count} bridge systems");

        // this registers state objects and reset them before start
        foreach (var so in sharedStates)
        {
            Bootstrap.Register(so);
            if (so is IRuntimeResettable reset)
            {
                reset.RuntimeReset();
                Debug.Log($"[BootstrapConfigSO] Reset {so.name}");
            }
        }
        Debug.Log($"[BootstrapConfigSO] Bootstrap complete for {sharedStates.Count} state systems");

    }

    private void AutoRegisterSOFields(ScriptableObject parent)
    {
        var fields = parent.GetType().GetFields(BindingFlags.Instance | BindingFlags.NonPublic | BindingFlags.Public);

        foreach (var f in fields)
        {
            if (typeof(ScriptableObject).IsAssignableFrom(f.FieldType))
            {
                var value = f.GetValue(parent) as ScriptableObject;
                if (value != null)
                {
                    Bootstrap.Register(value);
                    Debug.Log($"[BootstrapConfigSO] Auto-registered {value.name} (from {parent.name})");
                }
            }
        }
    }
}

```

</TabItem>

<TabItem value="3" label="IRuntimeResettable.cs">

```cs
public interface IRuntimeResettable
{
    // Clear any leftover data: bring the ScriptableObject back to a neutral “blank slate.”
    // Example: clear transient values from the last play session or scene
    //     public void RuntimeReset()
    // {
    //     isDialogueActive = false;
    //     isPaused = false;
    // }

    void RuntimeReset();
}

```

</TabItem>
</Tabs>

:::note
The interfaces should be used whenever applicable. For example, `AudioBridgeSO` implements `IRuntimeInitializable` (spawns its `[AudioBridge] GO`).
`SaveBridgeSO` and `SceneBridgeSO` don’t implement it (no runtime objects needed).
:::

When its `InitializeAll() `method runs, it iterates through those listed systems and does three things in order:

1. Register each `ScriptableObject` with the <span class="orange-bold">global</span> registry (`Bootstrap.Register(so)`), so other scripts can later retrieve it using `Bootstrap.Resolve<T>()`.
2. Reset any system that implements `IRuntimeResettable`, clearing leftover or “ghost” values from previous runs.
3. Initialize any system that implements IRuntimeInitializable, allowing bridges to subscribe to event channels or set up internal references.

### GameBootstrap (Monobehavior Script)

The scene-level `GameBootstrap` (MonoBehaviour) calls `bootstrapConfig.InitializeAll()` in `Awake()` to:

1. Force asset deserialization (so Bridges/Channels are “alive” and `OnEnable()` subscriptions attach),
   - Assigning SOs in the Inspector only stores references. It doesn’t guarantee when they’re “live” for this play session, nor that any runtime-only setup has happened in the right order.
   - This `BootstrapConfigSO.InitializeAll()` call gives us a deterministic, one-shot kickoff at runtime.
2. Invoke any runtime-only initialization for systems that need it (e.g., Audio creating an `AudioSource` GameObject).

Place a `GameBootstrap` in `Scene_Bootstrap` and assign `BootstrapConfig.asset` to an empty gameobject. The purpose of this script is simply to initialize the bridges and channels in the project, <span class="orange-bold">before we load</span> the first scene in our project. This is to ensure everything is ready before any scripts tried to access any SOs, etc.

```cs title="GameBootstrap.cs"
using UnityEngine;
using UnityEngine.SceneManagement;

public class GameBootstrap : MonoBehaviour
{
    [SerializeField] private BootstrapConfigSO bootstrapConfig;
    [SerializeField] private string nextSceneName = "BootstrapDemo_Main";

    private void Awake()
    {
        Debug.Log("[GameBootstrap] Starting initialization");
        bootstrapConfig.InitializeAll();
        Debug.Log("[GameBootstrap] Bootstrap complete");

        SceneManager.LoadSceneAsync(nextSceneName);
    }
}

```

### Save system (Channel + Bridge + Registry + ISaveable)

This system is a <span class="orange-bold">centralized</span> capture/restore surface area for all saveable objects. Objects opt in by implementing `ISaveable` and calling `SaveRegistry.Register/Unregister`.

The _Bridge_ wires the channel to registry calls.

<Tabs>

<TabItem value="2" label="SaveBridgeSO.cs">

```cs
// SaveBridgeSO.cs
using UnityEngine;

[CreateAssetMenu(menuName = "Game/Save Bridge")]
public class SaveBridgeSO : BridgeSO
{
    [SerializeField] private SaveEventChannelSO saveChannel;

    private void OnEnable()
    {
        saveChannel.OnSaveRequested += OnSaveRequested;  // instance methods
        saveChannel.OnLoadRequested += OnLoadRequested;
        Debug.Log("[SaveBridgeSO] Subscribed to save/load events");
    }

    private void OnDisable()
    {
        saveChannel.OnSaveRequested -= OnSaveRequested;
        saveChannel.OnLoadRequested -= OnLoadRequested;
        Debug.Log("[SaveBridgeSO] Unsubscribed");
    }

    // we subscribe with instance methods (from this SO) and not static method from SaveRegistry directly
    private void OnSaveRequested() => SaveRegistry.SaveAll();
    private void OnLoadRequested() => SaveRegistry.LoadAll();
}

```

</TabItem>
<TabItem value="1" label="SaveEventChannelSO.cs">

```cs
using UnityEngine;
using System;

[CreateAssetMenu(menuName = "Events/Save Event Channel")]
public class SaveEventChannelSO : ScriptableObject
{
public event Action OnSaveRequested;
public event Action OnLoadRequested;

    public void RaiseSave()
    {
        Debug.Log("[SaveEventChannelSO] Save requested");
        OnSaveRequested?.Invoke();
    }

    public void RaiseLoad()
    {
        Debug.Log("[SaveEventChannelSO] Load requested");
        OnLoadRequested?.Invoke();
    }

}

```

</TabItem>
<TabItem value="3" label="SaveRegistry.cs">

```cs
using UnityEngine;
using System.Collections.Generic;
using System.IO;

public static class SaveRegistry
{
    private static readonly HashSet<ISaveable> saveables = new();
    private static string PathName => Path.Combine(Application.persistentDataPath, "save.json");

    public static void Register(ISaveable s)
    {
        saveables.Add(s);
        Debug.Log($"[SaveRegistry] Registered {s.GetUniqueID()}");
    }

    public static void Unregister(ISaveable s)
    {
        saveables.Remove(s);
        Debug.Log($"[SaveRegistry] Unregistered {s.GetUniqueID()}");
    }

    public static void SaveAll()
    {
        var state = new Dictionary<string, object>();
        foreach (var s in saveables)
        {
            state[s.GetUniqueID()] = s.CaptureState();
            Debug.Log($"[SaveRegistry] Captured {s.GetUniqueID()}");
        }
        File.WriteAllText(PathName, JsonUtility.ToJson(new Wrapper(state)));
        Debug.Log($"[SaveRegistry] Wrote file to {PathName}");
    }

    public static void LoadAll()
    {
        if (!File.Exists(PathName))
        {
            Debug.Log("[SaveRegistry] No save file found");
            return;
        }
        var wrapper = JsonUtility.FromJson<Wrapper>(File.ReadAllText(PathName));
        foreach (var s in saveables)
        {
            if (wrapper.data.TryGetValue(s.GetUniqueID(), out var d))
            {
                s.RestoreState(d);
                Debug.Log($"[SaveRegistry] Restored {s.GetUniqueID()}");
            }
        }
    }

    [System.Serializable]
    private class Wrapper { public Dictionary<string, object> data; public Wrapper(Dictionary<string, object> d){data=d;} }
}
```

</TabItem>

<TabItem value="4" label="ISaveable.cs">

```cs title="ISaveable.cs"
public interface ISaveable
{
    string GetUniqueID();
    object CaptureState();
    void RestoreState(object state);
}
```

</TabItem>
</Tabs>

<br/>

<DeepDive title="Deep Dive: Instance vs Static Subscription to SO Events (What to Use, and Why)">

With ScriptableObject (SO) event channels, prefer instance-method subscriptions from your Bridges/Managers, <span class="red-bold">not</span> static method groups.

An <span class="orange-bold">instance subscription</span> gives the event delegate a real target object, which keeps the Bridge asset “alive” across scene changes. Static subscriptions have no target; if nothing else holds a strong reference to the SO, _Unity may unload it when you load a new scene_, and your callbacks <span class="orange-bold">quietly stop firing</span>.

**In practice**: subscribe inside the SO’s OnEnable() with instance methods, and unsubscribe in OnDisable(). Keep any heavy, scene-object work in a separate RuntimeInit() that runs only during play.

```cs title="Bad example"
// Inside a Bridge SO's OnEnable()
channel.OnSomething += SomeStaticService.DoIt;   // static => no target = fragile lifetime
```

```cs title="Good example"
using UnityEngine;

[CreateAssetMenu(menuName = "Game/Bridge")]
public class BridgeSO : ScriptableObject
{
    [SerializeField] private EventChannelSO channel;

    private void OnEnable()
    {
        channel.OnSomething += OnSomething;   // instance method
        Debug.Log("[BridgeSO] Subscribed");
    }

    private void OnDisable()
    {
        channel.OnSomething -= OnSomething;
        Debug.Log("[BridgeSO] Unsubscribed");
    }

    private void OnSomething() => SomeService.DoIt(); // forward to your service/registry
}
```

If you _truly_ need static subscriptions (e.g., calling a static registry directly), then also keep a <span class="orange-bold">strong</span> reference to the Bridge/Channel assets for the whole run, otherwise Unity can unload them on scene transitions. One tidy way is a tiny persistent holder created at bootstrap:

```cs title="CoreRefsHolder.cs"
// CoreRefsHolder.cs
using UnityEngine;

public class CoreRefsHolder : MonoBehaviour
{
    public ScriptableObject[] keepAlive; // assign bridges/channels at runtime
}
```

Then in the `BootstrapConfigSO.InitializeAll()`:

```cs title="BootstrapConfigSO.InitializeAll"

if (Application.isPlaying)
{
    var core = GameObject.Find("[CoreRoot]") ?? new GameObject("[CoreRoot]");
    Object.DontDestroyOnLoad(core);
    var holder = core.GetComponent<CoreRefsHolder>() ?? core.AddComponent<CoreRefsHolder>();
    holder.keepAlive = new ScriptableObject[] { bridgeA, bridgeB, channelA, channelB }; // etc.
}
```

**The rule of thumb:** subscribe with instance methods for predictable lifetime. Use static only when you also ensure those assets are strongly referenced (e.g., via a persistent holder). This keeps your SO event system stable across scene loads while preserving clean separation between UI (raises events), channels (broadcast), and bridges (handle).

</DeepDive>

### Audio system (Channel + Bridge)

This audio system is a persistent, scene-independent audio management. We always have SFX/BGM ready, no matter _which_ scene is active.

:::note
`AudioBridgeSO` **must** own AudioSources, which exist on GameObjects and needs a small runtime root. So we should generalise this with an interface: `IRuntimeInitializable`.
:::

<Tabs>

<TabItem value="2" label="AudioBridgeSO.cs">

```cs
// Assets/Scripts/Systems/Audio/AudioBridgeSO.cs
using UnityEngine;

[CreateAssetMenu(menuName = "Game/Audio Bridge")]
public class AudioBridgeSO : BridgeSO
{
    [SerializeField] private AudioEventChannelSO audioChannel;

    // runtime-only fields
    private GameObject audioRoot;
    private AudioSource sfxSource;
    private AudioSource bgmSource;

    private void OnEnable()
    {
        // Safe in edit mode: subscribing to SO events doesn’t touch the scene
        audioChannel.OnSFXRequested += PlaySFX;
        audioChannel.OnBGMRequested += PlayBGM;
        audioChannel.OnStopBGMRequested += StopBGM;
        Debug.Log("[AudioBridgeSO] Subscribed to audio events");
    }

    private void OnDisable()
    {
        audioChannel.OnSFXRequested -= PlaySFX;
        audioChannel.OnBGMRequested -= PlayBGM;
        audioChannel.OnStopBGMRequested -= StopBGM;
        Debug.Log("[AudioBridgeSO] Unsubscribed");
    }

    // Call this from the bootstrapper during play
    public void RuntimeInit()
    {
        if (!Application.isPlaying) return;        // guard edit mode
        if (audioRoot != null) return;             // already created

        audioRoot = new GameObject("[AudioBridge]");
        Object.DontDestroyOnLoad(audioRoot);
        sfxSource = audioRoot.AddComponent<AudioSource>();
        bgmSource = audioRoot.AddComponent<AudioSource>();
        bgmSource.loop = true;

        Debug.Log("[AudioBridgeSO] Runtime audio root created");
    }

    private void PlaySFX(AudioClip clip)
    {
        if (clip == null || sfxSource == null) return;
        sfxSource.PlayOneShot(clip);
        Debug.Log($"[AudioBridgeSO] Playing SFX: {clip.name}");
    }

    private void PlayBGM(AudioClip clip)
    {
        if (clip == null || bgmSource == null) return;
        bgmSource.clip = clip;
        bgmSource.Play();
        Debug.Log($"[AudioBridgeSO] Playing BGM: {clip.name}");
    }

    private void StopBGM()
    {
        if (bgmSource == null) return;
        bgmSource.Stop();
        Debug.Log("[AudioBridgeSO] Stopped BGM");
    }
}

```

</TabItem>

<TabItem value="1" label="AudioEventChannelSO.cs">

```cs
using UnityEngine;
using System;

[CreateAssetMenu(menuName = "Events/Audio Event Channel")]
public class AudioEventChannelSO : ScriptableObject, IRuntimeInitializable
{
    public event Action<AudioClip> OnSFXRequested;
    public event Action<AudioClip> OnBGMRequested;
    public event Action OnStopBGMRequested;

    public void RaiseSFX(AudioClip clip)
    {
        Debug.Log($"[AudioEventChannelSO] Play SFX: {clip?.name}");
        OnSFXRequested?.Invoke(clip);
    }

    public void RaiseBGM(AudioClip clip)
    {
        Debug.Log($"[AudioEventChannelSO] Play BGM: {clip?.name}");
        OnBGMRequested?.Invoke(clip);
    }

    public void RaiseStopBGM()
    {
        Debug.Log("[AudioEventChannelSO] Stop BGM");
        OnStopBGMRequested?.Invoke();
    }
}
```

</TabItem>
</Tabs>

### Scene System (Channel + Bridge)

This scene system is a centralized scene transitions so gameplay/UI simply request `loads`/`unloads` _without_ knowing how scenes are managed.

<Tabs>

<TabItem value="2" label="SceneBridgeSO.cs">

```cs
using UnityEngine;
using UnityEngine.SceneManagement;

[CreateAssetMenu(menuName = "Game/Scene Bridge")]
public class SceneBridgeSO : BridgeSO
{
    [SerializeField] private SceneEventChannelSO sceneChannel;

    private void OnEnable()
    {
        sceneChannel.OnSceneLoadRequested += LoadScene;
        sceneChannel.OnSceneUnloadRequested += UnloadScene;
        Debug.Log("[SceneBridgeSO] Subscribed to scene events");
    }

    private void OnDisable()
    {
        sceneChannel.OnSceneLoadRequested -= LoadScene;
        sceneChannel.OnSceneUnloadRequested -= UnloadScene;
        Debug.Log("[SceneBridgeSO] Unsubscribed");
    }

    private void LoadScene(string sceneName)
    {
        Debug.Log($"[SceneBridgeSO] Begin loading scene '{sceneName}'");
        SceneManager.LoadSceneAsync(sceneName, LoadSceneMode.Single); // edit this accordingly if you are doing Additive
    }

    private void UnloadScene(string sceneName)
    {
        Debug.Log($"[SceneBridgeSO] Begin unloading scene '{sceneName}'");
        SceneManager.UnloadSceneAsync(sceneName);
    }
}


```

</TabItem>
<TabItem value="1" label="SceneEventChannelSO.cs">

```cs
using UnityEngine;
using System;

[CreateAssetMenu(menuName = "Events/Scene Event Channel")]
public class SceneEventChannelSO : ScriptableObject
{
    public event Action<string> OnSceneLoadRequested;
    public event Action<string> OnSceneUnloadRequested;

    public void RaiseLoad(string sceneName)
    {
        Debug.Log($"[SceneEventChannelSO] Load requested: {sceneName}");
        OnSceneLoadRequested?.Invoke(sceneName);
    }

    public void RaiseUnload(string sceneName)
    {
        Debug.Log($"[SceneEventChannelSO] Unload requested: {sceneName}");
        OnSceneUnloadRequested?.Invoke(sceneName);
    }
}

```

</TabItem>
</Tabs>

### Minimal UI Triggers (for demo)

These are lightweight `MonoBehaviours` to wire to Unity UI Buttons and call the channels only. There are two ways to do this:

1. Via `Bootstrap` registry, or
2. Reference the channel SO on inspector. Either way works.

<Tabs>
<TabItem value="1" label="SaveButtonUI.cs">

```cs
using UnityEngine;

public class SaveButtonUI : MonoBehaviour
{
    private SaveEventChannelSO saveChannel;

    private void Awake()
    {
        // Automatically gets the globally registered SaveEventChannelSO bridge or channel
        saveChannel = Bootstrap.Resolve<SaveEventChannelSO>();
    }

    public void DoSave() => saveChannel.RaiseSave();
    public void DoLoad() => saveChannel.RaiseLoad();
}


```

</TabItem>
<TabItem value="2" label="AudioButtonUI.cs">

```cs
using UnityEngine;

public class AudioButtonUI : MonoBehaviour
{
    // serialize in inspector
    [SerializeField] private AudioEventChannelSO audioChannel;
    [SerializeField] private AudioClip sfxClip;
    [SerializeField] private AudioClip bgmClip;

    public void PlaySFX() => audioChannel.RaiseSFX(sfxClip);
    public void PlayBGM() => audioChannel.RaiseBGM(bgmClip);
    public void StopBGM() => audioChannel.RaiseStopBGM();
}

```

</TabItem>

<TabItem value="empty" label="SceneButtonUI.cs">

```cs
using UnityEngine;

public class SceneButtonUI : MonoBehaviour
{
    // serialize in inspector
    [SerializeField] private SceneEventChannelSO sceneChannel;
    [SerializeField] private string sceneToLoad = "Scene_Level1";
    [SerializeField] private string sceneToUnload = "Scene_Level1";

    public void LoadLevel() => sceneChannel.RaiseLoad(sceneToLoad);
    public void UnloadLevel() => sceneChannel.RaiseUnload(sceneToUnload);
}
```

</TabItem>

</Tabs>

### Minimal `ISaveable` demo component

The purpose of this component is to show a concrete object participating in the global Save subsystem. It self-registers so `SaveRegistry.SaveAll/LoadAll` actually captures and restores something visible.

```cs title="PlayerHealthSaveable.cs"
// Assets/Scripts/Systems/Save/Demo/PlayerHealthSaveable.cs
using UnityEngine;

public class PlayerHealthSaveable : MonoBehaviour, ISaveable
{
    [SerializeField] private string uniqueId = "Player01"; // ensure uniqueness if you have multiple
    [SerializeField] private int maxHealth = 100;
    [SerializeField] private int currentHealth = 100;

    private void OnEnable()
    {
        SaveRegistry.Register(this);
        Debug.Log($"[PlayerHealthSaveable] Registered {uniqueId} ({currentHealth}/{maxHealth})");
    }

    private void OnDisable()
    {
        SaveRegistry.Unregister(this);
        Debug.Log($"[PlayerHealthSaveable] Unregistered {uniqueId}");
    }

    public string GetUniqueID() => uniqueId;

    public object CaptureState()
    {
        var state = new State { max = maxHealth, cur = currentHealth, x = transform.position.x, y = transform.position.y, z = transform.position.z };
        Debug.Log($"[PlayerHealthSaveable] Capture {uniqueId}: {currentHealth}/{maxHealth} @ {transform.position}");
        return state;
    }

    public void RestoreState(object state)
    {
        if (state is State s)
        {
            maxHealth = s.max;
            currentHealth = s.cur;
            transform.position = new Vector3(s.x, s.y, s.z);
            Debug.Log($"[PlayerHealthSaveable] Restore {uniqueId}: {currentHealth}/{maxHealth} @ {transform.position}");
        }
        else
        {
            Debug.LogWarning($"[PlayerHealthSaveable] Bad state for {uniqueId}");
        }
    }

    [System.Serializable]
    private struct State { public int max; public int cur; public float x, y, z; }

    // quick demo helpers so you can change state in play mode:
    [ContextMenu("Damage 10")] private void Damage10() { currentHealth = Mathf.Max(0, currentHealth - 10); Debug.Log($"[PlayerHealthSaveable] {uniqueId} took 10 → {currentHealth}"); }
    [ContextMenu("Heal 10")]   private void Heal10()   { currentHealth = Mathf.Min(maxHealth, currentHealth + 10); Debug.Log($"[PlayerHealthSaveable] {uniqueId} healed 10 → {currentHealth}"); }
    [ContextMenu("Nudge +1x")] private void Nudge()    { transform.position += Vector3.right; Debug.Log($"[PlayerHealthSaveable] {uniqueId} moved → {transform.position}"); }
}

```

**Usage**:

- Add this component to a GameObject in `Scene_Main` and/or `Scene_Level1`.
- Use the component’s _context menu items_ during Play (or expose real gameplay changes).
- Click your Save/Load UI buttons to see capture/restore logs and effects.

### Auto Register `ISaveable` Helper demo component

If you prefer to keep your domain components clean and centralize registration, use a tiny helper that auto-registers any `ISaveable` on the same GameObject as such:

```cs title="SaveableAutoRegister.cs"

using UnityEngine;

public class SaveableAutoRegister : MonoBehaviour, ISaveable
{
    [SerializeField] private MonoBehaviour targetComponent; // must implement ISaveable
    private ISaveable target;

    private void Awake()
    {
        if (targetComponent is ISaveable s) target = s;
        else
        {
            // fall back to first ISaveable on this GameObject (optional convenience)
            target = GetComponent<ISaveable>();
            if (target == (ISaveable) this) target = null; // avoid self if only this component exists
        }

        if (target == null)
            Debug.LogError("[SaveableAutoRegister] No valid ISaveable target found on this GameObject.");
    }

    private void OnEnable()
    {
        if (target != null) SaveRegistry.Register(this);
    }

    private void OnDisable()
    {
        if (target != null) SaveRegistry.Unregister(this);
    }

    public string GetUniqueID() => target?.GetUniqueID() ?? "[null]";
    public object CaptureState() => target?.CaptureState();
    public void RestoreState(object state) => target?.RestoreState(state);
}


```

Usage:

- Put your domain logic in a plain component that implements `ISaveable` (e.g., `ChestSaveable`, `QuestFlagSaveable`, `PlayerHeathSaveable`).
- Add `SaveableAutoRegister` to the same GameObject and **assign** targetComponent to that domain component.
- This **standardizes** registration/unregistration without repeating boilerplate in every saveable script.

For instance, we have this code with no registration inside:

```cs title="ChestSaveable.cs"
// Assets/Scripts/Systems/Save/Demo/ChestSaveable.cs
using UnityEngine;

public class ChestSaveable : MonoBehaviour, ISaveable
{
    [SerializeField] private string uniqueId = "Chest_A";
    [SerializeField] private bool isOpen;
    [SerializeField] private Vector3 closedOffset = Vector3.zero;
    [SerializeField] private Vector3 openOffset = new Vector3(0, 0.5f, 0);

    public string GetUniqueID() => uniqueId;

    public object CaptureState()
    {
        return new State { open = isOpen, x = transform.position.x, y = transform.position.y, z = transform.position.z };
    }

    public void RestoreState(object state)
    {
        if (state is State s)
        {
            isOpen = s.open;
            transform.position = new Vector3(s.x, s.y, s.z);
            // add more logic to restore closed/open offset etc
        }
    }

    [ContextMenu("Toggle Open/Close")]
    private void Toggle()
    {
        isOpen = !isOpen;
        transform.position += isOpen ? openOffset : -openOffset;
    }

     // edit state as needed to store more things
    [System.Serializable]
    private struct State { public bool open; public float x, y, z; }
}

```

In `SaveableAutoRegister`, set `targetComponent` to be that `ChestSaveable` instance (or leave blank to auto-pick the first ISaveable on the GameObject).

## The Demo

### Create SO Bridges, Channels, and BootstrapConfig

Create three Event Channel assets in Assets/Events:

- `SaveEventChannel.asset`
- `AudioEventChannel.asset`
- `SceneEventChannel.asset`

Create three Bridge assets:

- `SaveBridge.asset` and assign `SaveEventChannel`
- `AudioBridge.asset` and assign `AudioEventChannel`
- `SceneBridge.asset` and assign `SceneEventChannel`

Create `Assets/Game/BootstrapConfig.asset` and assign:

- **Bridges**: SaveBridge, AudioBridge, SceneBridge
- **Channels**: SaveEventChannel, AudioEventChannel, SceneEventChannel

<ImageCard path={require("/resources/general/images/bootstrap/2025-10-17-15-17-39.png").default} widthPercentage="100%"/>

### Create Scenes

Create at least three scenes, e.g: Bootstrap, Main and Level 1. Here's one ugly but functional setup:

<ImageCard path={require("/resources/general/images/bootstrap/2025-10-17-15-18-18.png").default} widthPercentage="100%"/>

<ImageCard path={require("/resources/general/images/bootstrap/2025-10-17-15-18-48.png").default} widthPercentage="100%"/>

<ImageCard path={require("/resources/general/images/bootstrap/2025-10-16-11-01-34.png").default} widthPercentage="100%"/>

#### The Bootstrap Scene

Attach the `GameBoostrap` script an empty gameobject in the Bootstrap scene. This will initialize the config upon run, and immediately load the Main scene.

#### UI

We made the button groups a prefab (this is like a HUD in the game), and both scenes have the same Player and Chest prefab.

Then for each UI group, attach the corresponding Button UI script:

<ImageCard path={require("/resources/general/images/bootstrap/2025-10-17-15-20-41.png").default} widthPercentage="100%"/>

And set the callbacks accordingly:

<ImageCard path={require("/resources/general/images/bootstrap/2025-10-17-15-20-53.png").default} widthPercentage="100%"/>

Do the same for scene load button, audio-related buttons, as well as load.

For the Player, attach the PlayerHealtSaveable component:
<ImageCard path={require("/resources/general/images/bootstrap/2025-10-17-15-21-08.png").default} widthPercentage="100%"/>

Whereas for the "chest", try using the AutoRegister component:

<ImageCard path={require("/resources/general/images/bootstrap/2025-10-17-15-21-22.png").default} widthPercentage="100%"/>

Finally, dont forget to add all scenes until the Build Profiles, otherwise scene transition wont work:
<ImageCard path={require("/resources/general/images/bootstrap/2025-10-17-15-21-53.png").default} widthPercentage="100%"/>

### Running the Demo

Upon `Play`, you should see the bootstrap system works: all bridges subscribe to the events, player and chest registered to SaveRegistry, AudioBridge is initialized and runtime AudioRoot is created.

<ImageCard path={require("/resources/general/images/bootstrap/2025-10-17-15-23-45.png").default} widthPercentage="100%"/>

When you load the another level, the save registry is updated based on which object is present at this level:

<ImageCard path={require("/resources/general/images/bootstrap/2025-10-17-15-24-15.png").default} widthPercentage="100%"/>

:::note test
You can try adding other chests like Chest_B, etc and see how the save system handles this
:::

All systems are live in the second scene. There's no need to set them up. There's only one Bootstrapper needed, which is in the main scene.

- Apart from AudioSystem (which requires AudioSource), none of the system requires persistent object under `DontDestroyOnLoad`
- Each is handled dynamically via the BridgeSOs
- The SO will be disabled _if there's no more reference to it_ anymore in the following scene.

Here's a full demo recording of the Bootstrap system in action:

<VideoItem path={"https://50033.s3.ap-southeast-1.amazonaws.com/tutorials/bootstrap-demo.mov"} widthPercentage="100%"/>

## Using Bootstrap in the Hybrid Architecture

:::note
This section explains how we can implement the Bootstrap system into the Hybrid architecture explained [here](https://natalieagus.github.io/50033/resources/general/hybrid-arch), and greatly reduce inspector-linking.
:::

We can now register `GameStateSO` inside `BootstrapConfigSO` `sharedStates` list, so that it enters the `Bootstrap` registry.

To make things easier, it should also implement the `IRuntimeResettable` and remove any reset gameObject, and remove the use of `GameStateResetter.cs`.

```cs
using UnityEngine;
using System;

[CreateAssetMenu(menuName = "Game/Game State")]
public class GameStateSO : ScriptableObject, IRuntimeResettable
{
    public bool InDialogue { get; private set; }
    public event Action<bool> OnDialogueChanged;

    public void SetDialogue(bool active)
    {
        if (InDialogue == active) return;
        InDialogue = active;
        OnDialogueChanged?.Invoke(active);
        Debug.Log($"[GameStateSO] Dialogue {(active ? "started" : "ended")}");
    }

    public void RuntimeReset()
    {
        InDialogue = false;
        OnDialogueChanged = null;
        Debug.Log("[GameStateSO] Reset");
    }
}
```

Then `DialogueController` can utilise the Registry:

```cs
using UnityEngine;

public class DialogueController : MonoBehaviour
{
    [Header("Data (Optional, can be passed at runtime)")]
    [SerializeField] private DialogueData currentDialogue;

    private InputReader inputReader;
    private GameStateSO gameState;

    private int currentIndex = 0;
    private bool isActive = false;

    private void Awake()
    {
        // Resolve global systems & state
        inputReader = Bootstrap.Resolve<InputReader>();
        gameState   = Bootstrap.Resolve<GameStateSO>();

        if (inputReader == null)
            Debug.LogError("[DialogueController] Missing InputReader in registry!");
        if (gameState == null)
            Debug.LogError("[DialogueController] Missing GameStateSO in registry!");
    }

     // other methods as usual

}

```

### Unifying the Systems

When the game launches, the **BootstrapConfigSO** asset executes its initialization sequence. It registers all bridges such as `AudioBridgeSO`, `SaveBridgeSO`, and `SceneBridgeSO`, and through reflection it automatically registers every referenced ScriptableObject found inside them—this includes event channels and shared states like `GameStateSO`. Each system that implements `IRuntimeResettable` is reset first, ensuring a clean startup, and then any class that implements `IRuntimeInitializable` is initialized. By the time the scene loads, every subsystem exists in a unified runtime registry called `Bootstrap`.

Because of this, there is <span class="orange-bold">no need</span> to drag ScriptableObjects into individual prefabs or scene objects. Every component can access shared data or channels directly through the same global registry. For instance, a gameplay script such as a `DialogueController`, `PlayerHealth`, or `SaveButtonUI` can simply resolve what it needs during `Awake()`:

```csharp
private GameStateSO gameState;
private AudioEventChannelSO audioChannel;

private void Awake()
{
    gameState = Bootstrap.Resolve<GameStateSO>();
    audioChannel = Bootstrap.Resolve<AudioEventChannelSO>();
}
```

Once resolved, these references behave exactly like serialized ones. You can call any event or update state as usual:

```csharp
gameState.SetDialogue(true);
audioChannel.RaiseSFX(hitClip);
```

All systems remain decoupled, yet share the same single source of truth.
The benefit of this design is that **BootstrapConfigSO** controls initialization order and lifetime deterministically while every other script relies on the same lightweight API:

```csharp
var audio = Bootstrap.Resolve<AudioEventChannelSO>();
audio.RaiseBGM(musicClip);
```

:::note
In practice, this means no dragging, no duplicate references across prefabs, and no confusion about which instance of `GameStateSO` or `AudioEventChannelSO` is active. One bootstrap initializes everything once; every other script simply resolves and uses it.
:::

## Epilogue

In this demo, we never really see `OnDisable` being called on the bridges.

`OnDisable()` on a ScriptableObject runs whenever Unity _unloads_ that SO instance: exiting Play Mode (domain reload on), assembly reload/recompile, asset unload (because no strong references), addressable/references released, or an explicit unload call. In our current setup, we keep Bridges referenced for the <span class="orange-bold">whole</span> session (instance-event subscriptions + optional keep-alive holder), so they rarely unload mid-game, hence you don’t see `OnDisable()`.

Below are two small, controlled demos we can add to **force** an SO to unload and watch `OnDisable()` fire.

#### Demo 1: Explicitly drop refs and unload

This creates a tiny dev tool that clears the persistent references and calls `Resources.UnloadUnusedAssets()`. With no strong refs left, Unity unloads the Bridge and you’ll see its `OnDisable()` log.

```csharp
// Assets/Scripts/Dev/DemoUnloadSO.cs
using UnityEngine;
using System.Collections;

public class DemoUnloadSO : MonoBehaviour
{
    [SerializeField] private ScriptableObject[] refs; // assign the Bridges/Channels you want to unload
    [SerializeField] private CoreRefsHolder holder;   // the keep-alive component you created at bootstrap (optional)

    [ContextMenu("Drop Refs And Unload")]
    private void DropRefsAndUnload()
    {
        // 1) sever your own references
        refs = null;

        // 2) sever the keep-alive references, if you use CoreRefsHolder
        if (holder != null) holder.keepAlive = null;

        // 3) kick the GC and unload unused assets (SO OnDisable() should fire now)
        StartCoroutine(UnloadSoon());
    }

    private IEnumerator UnloadSoon()
    {
        System.GC.Collect();
        yield return null; // let a frame pass so references truly go dead
        var op = Resources.UnloadUnusedAssets();
        yield return op;
        Debug.Log("[DemoUnloadSO] UnloadUnusedAssets completed");
    }
}
```

Put this on an empty GameObject in your scene. Assign the `SaveBridgeSO` (and/or others) into `refs`, and assign your `[CoreRoot]`’s `CoreRefsHolder` if you’re using it. Enter Play, run **Drop Refs And Unload** from the component’s context menu, and watch the Console: the Bridge’s `OnDisable()` should print.

#### Demo 2: Reproduce the “unsubscribed on scene change” case

This shows the difference between static vs instance subscriptions. Flip the SaveBridge back to **static method group** subscriptions, remove the keep-alive holder, start in `Scene_Main`, then load another scene. Because nothing anchors the Bridge, Unity unloads it during the scene swap and you’ll see `OnDisable()`.

```csharp
// SaveBridgeSO.cs (temporary for demo only)
private void OnEnable()
{
    saveChannel.OnSaveRequested += SaveRegistry.SaveAll;   // static (no target)
    saveChannel.OnLoadRequested += SaveRegistry.LoadAll;   // static
    Debug.Log("[SaveBridgeSO] Subscribed (STATIC demo)");
}

private void OnDisable()
{
    saveChannel.OnSaveRequested -= SaveRegistry.SaveAll;
    saveChannel.OnLoadRequested -= SaveRegistry.LoadAll;
    Debug.Log("[SaveBridgeSO] Unsubscribed (STATIC demo)");
}
```

Load `Scene_Level1` with `LoadSceneMode.Single` and observe `[SaveBridgeSO] Unsubscribed (STATIC demo)`. Then restore the **instance** handler version to keep it alive.

### So when do Bridge SOs actually `OnDisable()` naturally?

Bridges are `ScriptableObjects`. They disable when Unity _unloads_ them. In many game architecture they often persist “forever” because we keep strong references (`BootstrapConfig`, instance-event subscriptions, or optional keep-alive holder).

_Not every Bridge needs to live for the whole app._

**Think in scopes:**

- **Global bridges** are the ones your game always needs (Audio, Save, global Scene control). They <span class="orange-bold">should</span> stay alive from startup to quit. Keep them referenced (`BootstrapConfig`, optional keep-alive holder) and subscribe with **instance** methods so they persist across scene loads.

- **Scoped/temporary bridges** are tied to a particular feature, level pack, or debug tool. These are good candidates to unload when that scope ends. Examples:

  - A level-specific `SpawnSystem` that only exists in “DungeonPack”.
  - A minigame’s Input remapper that shouldn’t affect the main game.
  - A tutorial tips dispatcher used only in the first two scenes.
  - A seasonal/limited-time event system loaded from an `Addressable` bundle.
  - A profiling/QA bridge you load in dev builds but unload in retail.

A Bridge subscribed with instance methods won’t disable **as long as the channel and the bridge both remain referenced**. If you unload the **channel** or you drop all strong references (including a keep-alive holder), Unity can unload the Bridge and its `OnDisable()` will run. Instance subscriptions do not make objects immortal; they just keep the subscriber alive **through the event** as long as the publisher (channel) is alive.

### Example: A simple “scene-scoped bridge” pattern

This keeps a Bridge alive only while a specific additive scene (or feature) is loaded.

:::info
You might want to read up about Addressables first.

Addressables is Unity’s built-in system for loading content on demand by a string “address,” instead of bundling everything into every scene. You mark assets (prefabs, textures, ScriptableObjects, scenes, audio, etc.) as “Addressable,” give them an address or label, and then load/unload them at runtime asynchronously. Under the hood it manages AssetBundles for you, but you mostly work with a simple API: Addressables.Load... and Addressables.Release(...). This allows faster startup scenes and lower memory usage. It is a little bit overkill for 50.033 project though.
:::

```csharp
// SceneScopedBootstrap.cs, lives in your additive scene (e.g., DungeonPack)
// Loads the bridge via Addressables and releases it when the scene unloads.
using UnityEngine;
using UnityEngine.AddressableAssets;
using UnityEngine.ResourceManagement.AsyncOperations;

public class SceneScopedBootstrap : MonoBehaviour
{
    [SerializeField] private string bridgeAddress = "DungeonSpawnBridge"; // Addressables address
    private AsyncOperationHandle<DungeonSpawnBridgeSO> handle;
    private DungeonSpawnBridgeSO bridge;

    private void OnEnable()
    {
        handle = Addressables.LoadAssetAsync<DungeonSpawnBridgeSO>(bridgeAddress);
        handle.Completed += op =>
        {
            if (op.Status != AsyncOperationStatus.Succeeded) { Debug.LogError("Load failed"); return; }
            bridge = op.Result;
            // Touch to ensure OnEnable subscriptions are active this session.
            bridge.RuntimeInit(); // optional if it needs a runner GO
            Debug.Log("[SceneScopedBootstrap] Bridge ready");
        };
    }

    private void OnDisable()
    {
        if (handle.IsValid()) Addressables.Release(handle);
        bridge = null; // After release and no other refs, OnDisable() on the SO will fire.
        Debug.Log("[SceneScopedBootstrap] Bridge released");
    }
}
```

```csharp
// DungeonSpawnBridgeSO.cs, the feature-specific bridge.
// Subscribes with instance methods; unsubscribes on disable.
using UnityEngine;

[CreateAssetMenu(menuName = "Game/Dungeon/Spawn Bridge")]
public class DungeonSpawnBridgeSO : ScriptableObject
{
    [SerializeField] private DungeonEventChannelSO channel; // this channel also lives in the pack

    private void OnEnable()
    {
        if (channel == null) return;
        channel.OnWaveRequested += OnWaveRequested;   // instance methods
        channel.OnClearRequested += OnClearRequested;
        Debug.Log("[DungeonSpawnBridgeSO] Subscribed");
    }

    private void OnDisable()
    {
        if (channel == null) return;
        channel.OnWaveRequested -= OnWaveRequested;
        channel.OnClearRequested -= OnClearRequested;
        Debug.Log("[DungeonSpawnBridgeSO] Unsubscribed");
    }

    public void RuntimeInit() { /* optional: spawn runners, pools, etc. */ }

    private void OnWaveRequested(int wave) { /* spawn logic */ }
    private void OnClearRequested() { /* cleanup logic */ }
}
```

When you unload the additive scene or call `Addressables.Release`, there are no more strong references to the Bridge or its Channel; Unity unloads them and `OnDisable()` runs. That’s exactly when you _want_ a temporary subsystem to tear down.

#### When should bridges be persistent?

Keep them global if they represent core, reusable services that any scene may need at any time, and they don’t waste memory sitting around. Audio, Save, global Scene control, Localization, Analytics dispatchers are typical “always on” bridges.

#### When should bridges be unloadable?

Make them scoped if they bind to content that isn’t always loaded, if they carry notable memory/runtime cost (pools, large data tables), or if keeping them around risks interfering with other modes of play. In those cases, load them alongside their content (Addressables or additive scene), and release them when the content goes away.

:::note final note
Instance subscriptions make lifetime **predictable** while the publisher (channel) and a strong reference exist; they don’t make the object permanent. If you want a Bridge to disappear naturally, drop the strong references (e.g., release Addressables handle, clear keep-alive holder, unload the additive scene and its channel). If you want it to stay, keep a reference in your Bootstrap (and optionally a keep-alive holder) and you’ll get a stable, global subsystem.
:::
