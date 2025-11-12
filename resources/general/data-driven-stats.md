---
sidebar_position: 8
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
import CollapsibleAnswer from '@site/src/components/CollapsibleAnswer';
import DeepDive from '@site/src/components/DeepDive';
import ImageCard from '@site/src/components/ImageCard';
import ChatBaseBubble from "@site/src/components/ChatBaseBubble";
import VideoItem from '@site/src/components/VideoItem';

# Data-Driven Player Stats Architecture

The foundation of any action or combat system is the player’s state: `health`, `stamina`, and other resources that govern what the player can do. In many Unity projects, these values are hardcoded directly into scripts or prefabs. While simple, this approach becomes increasingly <span class="red-bold">rigid</span> as a game grows: tweaking balance requires code edits, sharing attributes between characters leads to duplication, and multiplayer contexts introduce bugs when state is unintentionally shared across instances.

A data-driven player stats system solves these problems by cleanly **separating** <span class="orange-bold">static</span> configuration (the data that defines a character) from <span class="orange-bold">runtime</span> state (the data that changes during play).

- Instead of burying numbers inside scripts, the system externalizes all configuration into `ScriptableObjects`, which serve as editable assets in the Unity editor
- Meanwhile, transient gameplay data—current stamina, cooldown timers, temporary buffs—is kept in plain runtime classes instantiated per player

:::info
This architecture combines the readability of data-oriented design with the flexibility needed for complex, evolving systems. It’s a foundational principle in scalable gameplay frameworks and underpins more advanced subsystems like combo managers, stamina-based combat, or RPG-style stat growth.
:::

## Design Philosophy

The key idea is **separation of responsibility**:

| Aspect                    | Description                                                                                       | Storage                          |
| ------------------------- | ------------------------------------------------------------------------------------------------- | -------------------------------- |
| **Static Configuration**  | Defines what the player _is_: max health, stamina, regeneration rate, etc.                        | ScriptableObject (`PlayerStats`) |
| **Runtime State**         | Tracks what the player _is doing now_: current stamina, active timers, temporary effects.         | C# class (`PlayerRuntimeStats`)  |
| **Context and Ownership** | Provides centralized access to player systems, ensuring all components operate on the same state. | MonoBehaviour (`PlayerContext`)  |

This separation has several design goals:

1. **Data Reusability:** Game designers can create multiple `PlayerStats` assets (e.g., `WarriorStats`, `RogueStats`) without modifying any code.
2. **Runtime Safety:** Each player or AI entity gets its own copy of runtime data, <span class="orange-bold">preventing accidental state sharing</span>.
3. **Flexibility:** Programmers can <span class="orange-bold">adjust</span> gameplay logic without touching balance data; designers can rebalance without touching logic. <span class="red-bold">This is super important!</span>
4. **Inspectability:** Runtime state can be logged, visualized, or reset independently of configuration assets.

The result is an architecture that scales smoothly from single-player prototypes to multiplayer or modular combat systems.

## Implementation Walkthrough

### `PlayerStats`: The Static Blueprint

`PlayerStats` is a simple `ScriptableObject` containing all the immutable parameters that define a character’s base abilities.

```csharp
[CreateAssetMenu(menuName = "Player/Stats/Player Stats")]
public class PlayerStats : ScriptableObject
{
    [Header("Core")]
    public float maxStamina = 100f;
    public float staminaRegenRate = 10f;
    public float staminaRegenDelay = 1f;

    [Header("Health")]
    public float maxHealth = 100f;
}
```

This asset can be duplicated and adjusted for _any_ character variant. Because it is read-only at runtime, it is safe to reference from multiple places. For example, by enemies, UI systems, or a stats manager.
<ImageCard path={require("/resources/general/images/data-driven-stats/2025-10-09-09-51-42.png").default} widthPercentage="100%"/>

### `PlayerRuntimeStats`: The Mutable Runtime Copy

To represent the player’s _live_ condition, `PlayerRuntimeStats` <span class="orange-bold">wraps</span> around a `PlayerStats` instance. It copies the static data and manages all _mutable_ state (like current stamina).

:::info
We will later instantiate `PlayerRuntimeStats` per player.
:::

```csharp
[System.Serializable]
public class PlayerRuntimeStats
{
    private PlayerStats baseStats;
    private float currentStamina;
    private float staminaRegenTimer;

    public PlayerRuntimeStats(PlayerStats baseStats)
    {
        this.baseStats = baseStats;
        currentStamina = baseStats.maxStamina;
    }

    public float CurrentStamina => currentStamina;
    public float MaxStamina => baseStats.maxStamina;

    public bool HasEnoughStamina(float cost) => currentStamina >= cost;

    public void UseStamina(float cost)
    {
        currentStamina = Mathf.Max(0, currentStamina - cost);
        staminaRegenTimer = baseStats.staminaRegenDelay;
    }

    public void TickRegen(float dt)
    {
        if (staminaRegenTimer > 0)
        {
            staminaRegenTimer -= dt;
            return;
        }

        currentStamina = Mathf.MoveTowards(
            currentStamina,
            baseStats.maxStamina,
            baseStats.staminaRegenRate * dt
        );
    }

    public void ResetStamina() => currentStamina = baseStats.maxStamina;
}
```

Key design notes:

- **Isolation:** No ScriptableObject data is modified directly. Every player instance gets its own runtime stats object.
- **Responsibility:** This class only manages **numerical** values; it doesn’t know about input, animation, or physics.
- **Regeneration Timing:** The stamina regeneration delay ensures the player can’t immediately recover stamina after attacking.

### `PlayerContext`: The Runtime Anchor

`PlayerContext` is a `MonoBehaviour` that ties the data and runtime systems together. It lives on the player’s <span class="orange-bold">root</span> GameObject and provides a central reference point for other components like the `ComboManager`, `HealthSystem`, or `UIManager`.

```csharp
[DisallowMultipleComponent]
public class PlayerContext : MonoBehaviour
{
    [Header("Static Config Data")]
    public PlayerStats baseStats;
    public CombatConfig combatConfig;

    [Header("Runtime State")]
    public PlayerRuntimeStats runtimeStats { get; private set; }

    [Tooltip("Flag for identifying which player is controlled locally (if applicable).")]
    public bool isLocalPlayer = false;

    private float lastHitTime;

    void Awake()
    {
        runtimeStats = new PlayerRuntimeStats(baseStats);
        GameManager.Instance?.RegisterPlayer(this);
    }

    void OnDestroy()
    {
        GameManager.Instance?.UnregisterPlayer(this);
    }

    public void RegisterHit()
    {
        lastHitTime = Time.time;
    }

    public bool HasRecentlyHitEnemy(float within = 0.5f)
    {
        return (Time.time - lastHitTime) <= within;
    }
}
```

This class ensures every subsystem operates with **consistent** data:

- The `ComboManager` can access stamina through `context.runtimeStats`.
- The `GameManager` can **register** and **track** all <span class="orange-bold">active</span> players through the context reference.
- Future systems (like health or equipment) can extend `PlayerContext` without modifying the existing code.

:::note
The pattern mirrors an **Entity-Component-System (ECS)** mindset: to centralize state ownership, distribute functionality through components.
:::

:::caution Script Order of Instantiation
Ensure that `GameManager` or whatever instance `Context` rely on at runtime is already instantiated before it. It would be best to explicitly state the order in Unity (Script Order Reference).
:::

## Use Cases and Benefits

This design is deceptively simple but foundational for building **scalable** and **maintainable** gameplay architecture. The separation between static data (`PlayerStats`) and runtime state (`PlayerRuntimeStats`) unlocks a level of flexibility that benefits both designers and programmers. Below are several reflections on how these advantages manifest in practice.

### Balancing Without Code Changes

Because all player attributes live inside a `ScriptableObject`, designers can rebalance gameplay directly from the Unity Inspector without modifying or recompiling code.
For instance, adjusting stamina recovery for different characters is as simple as creating new assets:

```csharp
// WarriorStats.asset
maxStamina = 120f
staminaRegenRate = 6f

// RogueStats.asset
maxStamina = 80f
staminaRegenRate = 14f
```

The same `PlayerContext` and `ComboManager` logic <span class="orange-bold">automatically</span> adapt to these differences. Designers can test changes live, duplicate configurations, and compare results—without touching a single script.

### Multiplayer Safety: No Shared Mutable Data

By instantiating a fresh `PlayerRuntimeStats` object for _every_ player, no two entities ever share the same stamina or cooldown state. This prevents the classic Unity pitfall of **shared ScriptableObject state**.

```csharp
void Awake()
{
    // Each player context gets its own runtime copy
    runtimeStats = new PlayerRuntimeStats(baseStats);
}
```

Even if multiple players reference the same `PlayerStats` asset, their stamina values evolve independently. This isolation makes the system inherently multiplayer-safe:

```csharp
// Player A
contextA.runtimeStats.UseStamina(20f);

// Player B unaffected
Debug.Log(contextB.runtimeStats.CurrentStamina); // still full
```

### Testing and Debugging: Runtime Control Without Side Effects

Since runtime and static data are separate, developers can safely manipulate _live_ values without risking persistent corruption.

```csharp
// Developer console or debug script
if (Input.GetKeyDown(KeyCode.R))
{
    playerContext.runtimeStats.ResetStamina();
    Debug.Log("Stamina refilled for testing");
}
```

In `play` mode, this change affects only the current session; the underlying `PlayerStats` asset remains <span class="red-bold">pristine</span>. This makes it easy to test stamina usage, regeneration, or combo flow without ever editing design data.

### Extensibility: Adding New Stats Effortlessly

Extending the system with a new resource type doesn’t require rewriting existing logic. Suppose we want to introduce an `Adrenaline` meter that builds up on successful hits:

```csharp
public class PlayerRuntimeStats
{
    public float adrenaline; // new stat

    public void GainAdrenaline(float amount)
    {
        adrenaline = Mathf.Clamp(adrenaline + amount, 0, 100);
    }
}
```

The rest of the architecture—`PlayerContext`, `ComboManager`, and stamina logic—remains untouched. Any new systems (like an “Adrenaline Finisher”) can now query or consume this new stat seamlessly through the same context reference.

### Compatibility: A Unified Data Layer for Other Systems

Because `PlayerContext` **exposes a consistent runtime interface**, any other gameplay subsystem can plug into it without duplication. For example, a UI script can easily display stamina in real time:

```csharp
void Update()
{
    staminaBar.fillAmount =
        playerContext.runtimeStats.CurrentStamina /
        playerContext.runtimeStats.MaxStamina;
}
```

Similarly, an AI or difficulty manager could read these values for adaptive behavior:

```csharp
if (enemyPlayer.runtimeStats.CurrentStamina < 20f)
    aiController.SwitchToAggressiveMode();
```

This unified access layer eliminates the need for fragile cross-component references or ad-hoc variable sharing. Everything about the player’s active state is reachable through `PlayerContext`.

We utilise `PlayerContext` in our [Combo System tutorial](/resources/general/combo).

## Caveat

Since `PlayerRuntimeStats` is an instance, it will <span class="orange-bold">not</span> persist between scenes. If you need the runtime values to persist between scenes then you need to have some kind of Service that does this, or put each `PlayerRunTimeStats` in `DontDestroyOnLoad` (make it a Singleton).

:::note-title

> The Idea
>
> A small runtime service holds `PlayerRuntimeStats`. New `PlayerContext` instances bind to it on `Awake` instead of creating fresh stats.

```cs
// 1) Runtime store (created once, lives in memory only)
public class PlayerStateStore
{
    private PlayerRuntimeStats _stats;
    public PlayerRuntimeStats GetOrCreate(PlayerStats baseStats)
        => _stats ??= new PlayerRuntimeStats(baseStats);

    public void ResetRuntime() => _stats = null;
}

// 2) Bootstrap creates and registers the store (no ScriptableObject on disk needed)
public class GameStateHost : MonoBehaviour
{
    public static PlayerStateStore Store { get; private set; }

    void Awake()
    {
        DontDestroyOnLoad(gameObject);
        Store ??= new PlayerStateStore();
    }
}

// 3) PlayerContext binds to the shared runtime stats
public class PlayerContext : MonoBehaviour
{
    public PlayerStats baseStats;
    public PlayerRuntimeStats runtimeStats { get; private set; }

    void Awake()
    {
        runtimeStats = GameStateHost.Store.GetOrCreate(baseStats);
    }
}
```

Explanation:

- Add `GameStateHost` (persistent, `DontDestroyOnLoad`) that constructs a `PlayerStateStore` once
- In `PlayerContext.Awake()`, `GetOrCreate` runtime stats from the store (no new each time)
  - This does not write to disk assets, we keep store <span class="orange-bold">in memory</span> only.
- Expose `ResetRuntime()` on the store for level restarts/tests.

If co-op needed, key **multiple** stats (`Dictionary<string, PlayerRuntimeStats>` with stable `playerId`).

:::important
Ensure systems read/write via `context.runtimeStats` only (**single source of trut**h).
:::

## Summary

In short, the **data-driven player stats system** defines a clean architecture where:

- **`PlayerStats`** describes _who the player is_ (static data),
- **`PlayerRuntimeStats`** tracks _what the player is doing_ (runtime data),
- **`PlayerContext`** anchors _how all systems interact with the player_.

:::note Data Driven Elegance
Each system remains modular, predictable, and extensible. Designers gain direct control over balance through data assets; programmers gain reliable state isolation and clarity; and the overall gameplay codebase becomes cleaner and easier to evolve as new mechanics are introduced.
:::

By drawing a clear line between configuration and state, this approach prevents a host of common Unity pitfalls: shared data corruption, duplicated logic, and tangled dependencies—and lays the groundwork for more advanced gameplay systems like stamina-driven combat, hit confirmation, or combo chaining. It’s an elegant, extensible foundation for any game architecture that values modularity, designer control, and clean state management.
