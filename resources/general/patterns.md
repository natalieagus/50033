---
sidebar_position: 5
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
import CollapsibleAnswer from '@site/src/components/CollapsibleAnswer';
import DeepDive from '@site/src/components/DeepDive';
import ImageCard from '@site/src/components/ImageCard';
import ChatBaseBubble from "@site/src/components/ChatBaseBubble";
import VideoItem from '@site/src/components/VideoItem';

# Diving into Unity Architecture Patterns

The game project in this course demand more than “_just getting things working._” You must understand how Unity manages object lifetimes, serialization, and global state, otherwise, seemingly harmless decisions (like “just use a static variable”) will silently create bugs that only surface at scale.

When designing systems that must be accessed by many parts of a Unity project: such as input handling, audio playback, save systems, or dialogue managers, it is important to understand the architectural patterns available for sharing data and logic.

There are common approaches that we touched in this course:

- Singletons, which guarantee one runtime instance of a class.
- Static classes, which expose global logic and functions without creating objects.
- ScriptableObjects, which store shared data or event channels as assets, independent of scenes.

Each method shapes how your systems communicate, how flexible they are to changes, and how much they rely on scene-based initialization. This resource is written to compare and contrast between the three.

:::note
Each of these approaches: Singletons, Static Classes, and ScriptableObjects solves a _different_ kind of problem.

They are not _strictly_ mutually exclusive. You can definitely mix and match certain components. Once you understand their trade-offs, you can also combine them into Hybrid Architectures that balance data-driven flexibility with runtime control.

See [hybrid model](#hybrid-model) section for this.
:::

This resource dissects these three foundational patterns and then explores hybrid combination. Each section contains working examples, misuse cases, and architectural reasoning.

## Singleton Pattern

:::note Central Runtime Controllers
A Singleton is a `MonoBehaviour` that ensures only one instance of itself exists during play. It provides a global point of access via a static property such as `Instance`.
:::

This pattern is the backbone of small-to-mid scale Unity projects because it’s simple to understand and guarantees persistence.

```cs
public class AudioManager : MonoBehaviour
{
    public static AudioManager Instance { get; private set; }

    private AudioSource source;

    private void Awake()
    {
        if (Instance != null)
        {
            Destroy(gameObject);
            return;
        }

        Instance = this;
        DontDestroyOnLoad(gameObject);
        source = GetComponent<AudioSource>();
    }

    public void PlaySFX(AudioClip clip)
    {
        source.PlayOneShot(clip);
    }
}
```

Anywhere in your game, you can call:

```cs
AudioManager.Instance.PlaySFX(hitSound);
```

This ensures a single, always-available audio system.

### Direct Benefits: Easy to Implement

Singletons <span class="orange-bold">maintain runtime state</span>: data that should reset only when the game quits, not every time a scene loads. For example, the current level, score, player references, or sound volume might all live here.

Basically, it's good and quick to implement as for runtime managers that:

- Need exactly one instance (Audio, SceneLoader, GameManager)
- Must persist across scene loads (DontDestroyOnLoad)
- Manage transient runtime state (current level, input state, etc.)

:::info central orchestrator
They act as central orchestrators for systems that <span class="red-bold">don’t</span> need data serialization but do <span class="orange-bold">need</span> lifecycle control.
:::

### Drawbacks: Hard Dependency

Because everything depends on `Instance`, a Singleton becomes a **hard dependency**. You can’t easily swap it or run tests without loading the whole scene. In complex games, Singleton managers can start referencing each other, creating tangled startup order issues.

> You might end up with gigantic `DoNotDestroyOnLoad` object list.

#### Wrong Usage: Too Much Logic

Even when implemented technically correctly, a Singleton can easily become a hidden dependency hub when you implement too much logic in it.

```cs
public class GameManager : MonoBehaviour
{
    public static GameManager Instance { get; private set; }

    [SerializeField] private PlayerController player;
    [SerializeField] private UIManager ui;
    [SerializeField] private AudioManager audio;

    private void Awake()
    {
        if (Instance != null) { Destroy(gameObject); return; }
        Instance = this;
        DontDestroyOnLoad(gameObject);
    }

    public void StartGame()
    {
        player.Spawn();
        audio.PlayMusic("Theme");
        ui.ShowHUD();
    }

    public void OnEnemyKilled()
    {
        player.GainXP(25);
        ui.UpdateXP(player.Experience);
        audio.PlaySFX("EnemyDeath");
    }

    public void Pause()
    {
        Time.timeScale = 0;
        ui.ShowPauseMenu();
        audio.PlaySFX("Pause");
    }
}

```

Although it works, the moment a Singleton starts orchestrating multiple systems, it quietly becomes a _God Object_.

All decision-making ends up centralized: every system (player, UI, audio, quests, spawners) reports upward instead of communicating laterally. This turns the Singleton into a coupling hub: any new feature or change in one subsystem now requires editing the same manager and adding more branch. _Testing_ and _collaboration_ becomes more difficult.

### Let Singletons Orchestrate

:::note

Use Singletons sparingly, only when:

- You truly need one runtime controller.
- You understand its lifecycle.
- You combine it with event-based decoupling.
  Example: GameManager manages global flow and orchestrate, but subsystems listen to its events rather than fetching it directly.
  :::

Following the example above (`GameManager`), we shall keep the Singleton but let it orchestrate instead via some decoupling techniques (using events):

```cs
public class GameManager : MonoBehaviour
{
    public static GameManager Instance { get; private set; }
    [SerializeField] private GameStateSO gameState;

    private void Awake()
    {
        if (Instance != null) { Destroy(gameObject); return; }
        Instance = this;
        DontDestroyOnLoad(gameObject);
    }

    private void OnEnable() => gameState.OnGameOver.AddListener(HandleGameOver);
    private void OnDisable() => gameState.OnGameOver.RemoveListener(HandleGameOver);

    private void HandleGameOver()
    {
        Debug.Log("Game over event received");
        SceneManager.LoadScene("MainMenu");
    }
}
```

The Singleton still anchors the runtime lifecycle (persistence, initialization), but the gameplay logic lives elsewhere such as in events, data-driven systems, or modular controllers.

## Static Classes

:::note Pure global code, no lifecycle
A static class is a global namespace-level construct. It has no instance at all. You cannot attach it to objects, [serialize](#unity-serialization) it, or store any state. It exists purely as a set of global functions and constants.
::::

```cs

public static class SaveUtils
{
    public static void Save<T>(T data, string fileName)
    {
        string json = JsonUtility.ToJson(data, true);
        File.WriteAllText(Application.persistentDataPath + "/" + fileName, json);
    }

    public static T Load<T>(string fileName)
    {
        string path = Application.persistentDataPath + "/" + fileName;
        if (!File.Exists(path)) return default;
        string json = File.ReadAllText(path);
        return JsonUtility.FromJson<T>(json);
    }
}

```

You can call this from anywhere:

```cs
SaveUtils.Save(data, "PlayerStats");
```

Another example: we use static classes to store short-lived global flags, read-only constants, or derived caches:

```cs

public static class GameConstants
{
    public const int MaxLevel = 50;
    public const float Gravity = -9.81f;
}

public static class DebugFlags
{
    public static bool ShowHitboxes;
}



```

These are intentionally **global** and <span class="red-bold">ephemeral</span>, with no expectation of persistence or serialization.

:::note In Architectural Context
Statics belong at the bottom of the dependency chain: tools that other systems call, but that call nothing themselves.

They are safe for pure logic but dangerous for game state.
If you find yourself writing `public static int PlayerHealth`, you probably need a `Singleton` or a `ScriptableObject` instead.
:::

### Direct Benefits: Perfect Logic and Ephemeral Flags Storage

Static classes are perfect for logic that will never change at runtime such as mathematical formulas, color conversions, or file I/O utilities.
This design is stateless as there is no instance, no serialization, no event callbacks.

- The data truly is global and short-lived (e.g. cached constants, performance counters).
- The system is purely code-level (like a math library or debug logger).
- You don’t need Unity _serialization_ or runtime lifecycle.

### Drawbacks: It's....static

However, because they <span class="orange-bold">cannot</span> serialize or hold data (they don’t hold per-instance data or serialized data), they are unsuitable for gameplay state or systems that interact with assets. A static function cannot respond to scene lifecycle events (`Awake`, `OnEnable`, etc.), nor can designers modify its behavior without changing code.

### Wrong Usage

```cs
public static class PlayerData
{
    public static int health = 100;
    public static int gold = 0;
}
```

At first glance, this seems convenient any script can modify `PlayerData.gold`. But this introduces subtle issues:

1. No Lifecycle Control: the data persists between scene loads and restarting a scene won't reset anything.
2. No Serialization: Unity cannot save or restore these values from the editor or Prefabs.
3. Unclear Ownership: It’s not obvious who should reset or save these values. Code everywhere now depends directly on `PlayerData`

This type of static state is **invisible** and **persistent** in memory, leading to “ghost state” bugs where old values survive scene reloads or even unit tests.

#### Some Subtle Behavior

Suppose you set `PlayerData.heatlh = 0`, and then do:

```cs
SceneManager.LoadScene("Main");
Debug.Log(PlayerData.health); // prints 0
```

It stays 0. That’s because the static variable isn’t stored in the scene; it’s in global managed memory.

If you press stop and play again, causing a **domain reload**, then `PlayerData.health` will be back 100. This is because static memory isn’t tied to the scene. That might seem convenient, but it breaks expectations as designers won’t know where the value comes from, and you can’t reset it in a clean way.

In contrast:

- A Singleton resets when its GameObject is destroyed.
- A ScriptableObject retains values from its asset and is visible in the Inspector.

Statics are powerful for utility logic or process-wide flags, but dangerous when used for gameplay state, because you lose visibility and lifecycle control.

## Scriptable Objects

:::note Asset-Backed Data and Event Hubs
A ScriptableObject (SO) is an asset file that stores data and lightweight logic.

Unlike MonoBehaviour, it’s not tied to a scene it persists independently in your project <span class="red-bold">until</span> your Application quits.
:::

SOs are perfect for data-driven systems, where behavior depends on data, not code. Designers can create new attacks by duplicating and editing the _asset_.

```cs
[CreateAssetMenu(menuName = "Combat/Attack Data")]
public class AttackData : ScriptableObject
{
    public float staminaCost;
    public float cooldown;
    public AnimationClip animation;
}


public class CombatManager : MonoBehaviour
{
    [SerializeField] private AttackData attack; // refer to the SO .asset
    private Animator anim;
    private float stamina = 100;

    void Start() => anim = GetComponent<Animator>();

    public void Attack()
    {
        if (stamina >= attack.staminaCost)
        {
            stamina -= attack.staminaCost;
            anim.Play(attack.animation.name);
        }
    }
}
```

:::note
ScriptableObjects shine as definition assets, configuration hubs, and event routers, <span class="red-bold">NOT</span> as dynamic storage.
:::

### Direct Benefits

:::note
ScriptableObjects occupy a unique space between code and content because they are UnityAssets: can be saved, versioned, inspected, and reused just like Textures and Prefabs, but also can hold fields and logic like a class
:::

With this, SOs are perfect for:

- Configuration data (CombatConfig, PlayerStats, GameSettings)
- Event broadcasting (GameEvent channels)
- Data-driven gameplay (AttackData, AbilitySet)
- Shared runtime state decoupled from scene objects

They are the key to make gameplay [Data-Driven](/resources/general/data-driven-stats).

### Drawbacks and Wrong Usage

:::caution
The <span class="red-bold">biggest</span> misconception is treating them as a save location for runtime data.
:::

You can't use SOs as scene assets and persistent storage. For example: if multiple scenes share this same asset, the health field is shared across them too because the `ScriptableObject` instance lives **globally** in memory.

If you _die_ in Scene A, and load Scene B, health remains `0`. You need to explicitly reinstantiate per-player state in this case using per-scene copies in the code: `_playerState = Instantiate(basePlayerState);`.

> That’s not a bug in Unity: it’s how asset memory works.

Another example, you cant store highscore (or any other persistent-between-play data like player exp and inventory in RPGs) in SO, build the project, start the App and play, then quit, and then expect the highscore to persist when you open the App again.

> Using an SO as a “save file” is therefore unsafe. A proper save system should write data to `PlayerPrefs`, `JSON`, or a dedicated file.

## Hybrid Models

Here we try to combine patterns intelligently. Most real systems do. We use `SO` for data and events and `MonoBehaviors` for runtime control.

### Example: `InputReader` and `PlayerInputHandler`

The .asset, shared globally across scenes:

```cs
[CreateAssetMenu(menuName = "Input/Input Reader")]
public class InputReader : ScriptableObject, GameInput.IGameplayActions
{
    public event UnityAction JumpEvent;
    private GameInput input;

    private void OnEnable()
    {
        if (input == null)
        {
            input = new GameInput();
            input.Gameplay.SetCallbacks(this);
        }
        input.Gameplay.Enable();
    }

    public void OnJump(InputAction.CallbackContext ctx)
    {
        if (ctx.phase == InputActionPhase.Performed)
            JumpEvent?.Invoke();
    }
}

```

The `Monobehavior` referencing the SO asset to handle per-player response and lifecycle:

```cs
public class PlayerInputHandler : MonoBehaviour
{
    [SerializeField] private InputReader inputReader;

    private void OnEnable() => inputReader.JumpEvent += Jump;
    private void OnDisable() => inputReader.JumpEvent -= Jump;

    private void Jump()
    {
        Debug.Log("Player jumped");
    }
}

```

### Example: `DialogueManager` Hybrid

We can have `DialogueManagerSO` that stores the dialogue flow, and `DialogueController` manages UI and player input. If you reload the scene, the controller resets while the data can persist or reset depending on configuration.

We can have the dialogue data asset. Each `DialogueData` asset represents one conversation or scene. Multiple assets can be created for different NPCs or events.

```cs
using System.Collections.Generic;
using UnityEngine;

[CreateAssetMenu(menuName = "Dialogue/Dialogue Data")]
public class DialogueData : ScriptableObject
{
    [TextArea(2, 5)]
    public List<string> lines = new List<string>();
}

```

Then we have the `DialogueManagerSO`: the SO that stores the **current** dialogue flow and raises `UnityEvents`. This persists between scenes if desired, or simply reinstantiate OnSceneLoad.

```cs
using UnityEngine;
using UnityEngine.Events;

[CreateAssetMenu(menuName = "Dialogue/Dialogue Manager SO")]
public class DialogueManagerSO : ScriptableObject
{
    [System.Serializable] public class StringEvent : UnityEvent<string> { }

    public StringEvent onLineDisplayed;
    public UnityEvent onDialogueEnded;

    private DialogueData currentDialogue;
    private int currentIndex = -1;

    public void StartDialogue(DialogueData data)
    {
        currentDialogue = data;
        currentIndex = 0;
        DisplayLine();
    }

    public void Advance()
    {
        if (currentDialogue == null) return;

        currentIndex++;

        if (currentIndex >= currentDialogue.lines.Count)
        {
            onDialogueEnded?.Invoke();
            currentDialogue = null;
            currentIndex = -1;
        }
        else
        {
            DisplayLine();
        }
    }

    private void DisplayLine()
    {
        if (currentDialogue == null || currentIndex < 0) return;
        string line = currentDialogue.lines[currentIndex];
        onLineDisplayed?.Invoke(line);
    }

    public void ResetState()
    {
        currentDialogue = null;
        currentIndex = -1;
    }
}
```

Then we have the UI to show the current Dialogue state.

```cs
using UnityEngine;
using TMPro;

public class DialogueUI : MonoBehaviour
{
    [SerializeField] private TMP_Text dialogueText;
    [SerializeField] private GameObject dialoguePanel;

    private void Awake()
    {
        if (dialoguePanel != null)
            dialoguePanel.SetActive(false);
    }

    public void ShowLine(string line)
    {
        if (dialoguePanel != null)
            dialoguePanel.SetActive(true);

        if (dialogueText != null)
            dialogueText.text = line;
    }

    public void Hide()
    {
        if (dialoguePanel != null)
            dialoguePanel.SetActive(false);
    }
}

```

Finally, a Controller that <span class="orange-bold">bridge</span> input and UI to the SO:

```cs
using UnityEngine;

public class DialogueController : MonoBehaviour
{
    [SerializeField] private DialogueManagerSO dialogueManager;
    [SerializeField] private DialogueUI dialogueUI;
    [SerializeField] private DialogueData startDialogue;

    private void OnEnable()
    {
        dialogueManager.onLineDisplayed.AddListener(dialogueUI.ShowLine);
        dialogueManager.onDialogueEnded.AddListener(dialogueUI.Hide);
    }

    private void OnDisable()
    {
        dialogueManager.onLineDisplayed.RemoveListener(dialogueUI.ShowLine);
        dialogueManager.onDialogueEnded.RemoveListener(dialogueUI.Hide);
    }

    private void Start()
    {
        // optional: automatically start the test dialogue
        if (startDialogue != null)
            dialogueManager.StartDialogue(startDialogue);
    }

    private void Update()
    {
        if (Input.GetKeyDown(KeyCode.Space))
        {
            dialogueManager.Advance();
        }
    }
}
```

In this super simple example (without `UnityInputSystem`), we can press **Space** to advance through lines, then the `DialogueManagerSO` handles state. This _bridge_ controller only listens and triggers UI.

:::info
For more and better examples, search for **Unity Devlogs** out there. They are short, self-contained videos with directly testable code snippets.
:::

## Unity Serialization

This section is written as a quick reference guide if you do not understand what "serialization" truly means after reading this page.

:::info
Serialization is the process by which Unity saves and restores object data: to scenes, prefabs, and ScriptableObject assets.
:::

**Unity serializes**:

- Public fields of MonoBehaviour and ScriptableObject
- [SerializeField] private fields
- Built-in serializable types (int, float, Vector3, etc.)
  \*\*\* Serializable user-defined structs/classes marked [System.Serializable]

What Unity Does Not Serialize\*\*:

- Static fields (no per-instance storage)
- References to scene objects inside assets
- Complex types like Dictionaries or generic interfaces (without wrappers)
- Non-Unity native managed objects

This explains why statics _lose_ data visibility (we cant see anything in the inspector), while SOs retain theirs in the editor (shows up in inspector, saved inside `.asset` file, comes back when you resume editor).

### Serialization and Pattern Interactions

| Pattern              | Serialized?           | Lifecycle           | Persistent?                                       |
| -------------------- | --------------------- | ------------------- | ------------------------------------------------- |
| **Static Class**     | ❌ No                 | App domain lifetime | Cleared only on domain reload                     |
| **Singleton (Mono)** | ✅ Yes (scene/prefab) | Scene lifecycle     | Resets on scene reload unless `DontDestroyOnLoad` |
| **ScriptableObject** | ✅ Yes (asset file)   | Asset lifecycle     | Persists between play sessions                    |

### Examples

```cs
public class Example : MonoBehaviour
{
    public static int staticCounter;
    [SerializeField] private int instanceCounter;
}
```

If you change these values in play mode:

- `instanceCounter` **resets** when you exit play mode (because it’s tied to the scene instance).
- `staticCounter` <span class="orange-bold">persists</span> until domain reload which may not happen if “Enter Play Mode Options” _disables_ reloads.

### `SerializeField` attribute

`[SerializeField]` is an attribute that tells Unity’s serialization system:

> “_Even though this field is private, include it in Unity’s serialized data and show it in the Inspector._”

```cs
public class PlayerStats : MonoBehaviour
{
    [SerializeField] private int health = 100;
    private int hiddenHealth = 100;
}

```

`health` will appear in the Inspector, can be edited, and Unity will save its value in the scene or prefab. `hiddenHealth` will be invisible to the Inspector and reset to its default value whenever the object reloads.

When you serialize the private fields, you can let designers tune it in the inspector but other scripts cannot see it.

### The Ruleset

Unity will serialize a field if it meets these conditions:

1. It’s public, or marked `[SerializeField]`.
2. Its type is serializable (_primitive_, `Vector3`, `Color`, or a `[System.Serializable]` `class`/`struct`).
3. It’s <span class="orange-bold">not</span> static, not a property, and not marked `[NonSerialized]`.
4. It belongs to a `MonoBehaviour` or `ScriptableObject` (or something Unity knows how to store).

Unity ignores everything else when writing the scene or prefab to disk. For example:

```cs
using UnityEngine;

public class Example : MonoBehaviour
{
    public int visibleInt = 5;              // serialized
    [SerializeField] private float speed = 2f; // serialized
    private string hiddenName = "Player";   // ignored
    [System.NonSerialized] public bool isDead; // ignored
    public static int globalCount = 10;     // ignored
    public Vector3[] points;                // serialized
    public Dictionary<string, int> scores;  // ignored (Dictionary not supported)
}

```

When Unity writes this component to the scene file:

- It will **store** visibleInt, speed, and points.
- It will **not** store hiddenName, isDead, globalCount, or scores.

> The fields that are ignored: they live only in <span class="orange-bold">C# memory</span> while the game is running.

:::note
Unity’s serialization is **engine-level**, not general-purpose like `BinaryFormatter` or `Json.NET`.

It’s **optimized** for saving assets and scenes efficiently: meaning it only handles specific, predictable field types and structures that it knows how to re-create.

Unsupported data is **skipped** instead of throwing an error. That’s why you can put a `Dictionary` or a static in your class. Unity just silently ignores it.
:::

## Putting it All Together

When you design a Unity project that spans multiple systems: input, audio, UI, saving, dialogue, combat. tThe challenge is never just “getting things to work.” It’s about managing _where_ data lives, _who_ owns it, and _how_ it survives across scenes and sessions.

Most working game projects evolve toward a familiar ecosystem of “managers.” Each one controls a key aspect of gameplay or presentation, and each maps naturally to one or more of the architectural patterns discussed earlier.
What separates a well-structured project from a messy one isn’t what managers exist: it’s _how_ their responsibilities are divided between data, logic, and lifecycle. Here's a compact list for your reference:

| System / Manager                    | Typical Pattern                                    | What It Owns                                                                   | Scale Notes                                                         |
| ----------------------------------- | -------------------------------------------------- | ------------------------------------------------------------------------------ | ------------------------------------------------------------------- |
| **GameManager**                     | Singleton (+ SO events)                            | Core runtime flow: scene loading, pause, win/lose, bootstrapping other systems | Central orchestrator; should delegate rather than contain logic     |
| **AudioManager**                    | Singleton or Hybrid (AudioChannel SO + controller) | Sound effect playback, music transitions, volume settings                      | Small–medium games often make this global                           |
| **Input System**                    | Hybrid (InputReader SO + PlayerInputHandler)       | Player input mapping and context switching                                     | Scales cleanly; supports multiple contexts (UI, dialogue, gameplay) |
| **UIManager**                       | MonoBehaviour + SO events                          | HUD, menus, popup routing                                                      | Usually scene-specific; can subscribe to GameEvents                 |
| **DialogueManager**                 | Hybrid (DialogueManagerSO + Controller)            | Dialogue progression, branching data, UI integration                           | Works across scenes; data defined in assets                         |
| **SaveSystem**                      | Static + Singleton wrapper                         | JSON / binary file IO, PlayerPrefs                                             | Core utility (static) with orchestrator (singleton) for flow        |
| **QuestManager**                    | SO data + Singleton runtime                        | Quest definitions, objective tracking                                          | Highly data-driven; SO assets define quest trees                    |
| **CombatManager**                   | Hybrid (CombatConfig SO + Mono executor)           | Attack combos, cooldowns, stamina cost                                         | Scales with modular AttackData assets                               |
| **InventorySystem**                 | Hybrid (SO database + Mono UI controller)          | Item definitions, stack counts, equipment slots                                | Asset-driven item DB; runtime instance per player                   |
| **GameStateManager**                | Singleton (+ GameStateSO event hub)                | Pause/resume, scene transitions                                                | Often linked to GameManager or boot scene                           |
| **CameraManager**                   | Singleton (+ Cinemachine or events)                | Camera follow, shake, transitions                                              | Pure runtime control, scene-persistent                              |
| **LocalizationManager**             | Static or Singleton                                | String tables, language switching                                              | Data loaded from external source; rarely hybrid                     |
| **Achievement / Analytics Manager** | Static utility                                     | Event logging, telemetry                                                       | Global service layer; no scene dependencies                         |

:::info Final Rule of Thumb
When you’re unsure which pattern to start with, think in terms of responsibility:

- If it **defines** something: use a ScriptableObject.
- If it controls **runtime** state: use a Singleton or scene controller.
- If it calculates or converts data: use a Static utility.
- If it does **both** definition + control : build a Hybrid.

:::
