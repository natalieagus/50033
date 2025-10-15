---
sidebar_position: 10
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
import CollapsibleAnswer from '@site/src/components/CollapsibleAnswer';
import DeepDive from '@site/src/components/DeepDive';
import ImageCard from '@site/src/components/ImageCard';
import ChatBaseBubble from "@site/src/components/ChatBaseBubble";
import VideoItem from '@site/src/components/VideoItem';

# Hybrid Service-Adapter Architecture with ScriptableObjects

Traditional Unity projects often start with singletons or direct references between scripts, just like what we encountered in Lab 1-4 in this course.

They work at small scale but break down when you need cross-scene communication, context-aware input, or data-driven modularity (e.g. switching between gameplay, UI, or dialogue modes).

If you're reading this, you should be familiar with:

1. [Observer Pattern](/docs/03-toddlers/observer-pattern): decoupled communication between sender and receiver (using C# delegates & events or UnityEvent/UnityAction)
   2[. ScriptableObject Game Architecture (SOGA)](/docs/05-teen/scriptobjgamearch): events and variables as reusable assets
2. [Data-Driven Player Stats Architecture](/resources/general/data-driven-stats): separating configuration (static SOs) from runtime state

Now we <span class="orange-bold">unify</span> those into one runtime system that supports:

- Event-based input
- Cross-scene state
- Context switching (gameplay, dialogue, UI)
- Designer-driven wiring: no statics or singletons

_This is the Hybrid Service–Adapter Architecture_.

### The 'Hybrid' in _hybrid_

This is a proposed architecture that deliberately <span class="orange-bold">combines</span>:

- **Role hybrid:** each `ScriptableObject` is **both a Service and an Adapter** (e.g., `InputReader`, `GameStateSO`).
- **Communication hybrid:** events for decoupling (GameEvent/UnityEvent) and <span class="red-bold">direct</span> calls for coordination (`InputContextManager → InputReader`).
- **Lifetime hybrid:** global, scene-independent SO assets + scene-local MonoBehaviour controllers.
- **Context hybrid:** state-driven input switching (gameplay/dialogue/pause) coordinated by a dedicated manager.

:::info Unify your tools
This unifies our prior patterns and focuses on choosing the right tool for the job: events vs direct calls, services vs adapters, globals (SO) vs scene controllers.
:::

## Core Concepts

Before we dive into parts of the architecture and the demo, we need to know two core concepts first: service and adapter.

:::info Service and Adapter
Each `ScriptableObject` acts as **both** a _Service_ (globally accessible logic provider) and an _Adapter_ (translating engine events into game-level events).
:::

### Service Role

A Service provides shared functionality accessible from any scene. The service is a **persistent** asset, visible in the Inspector, not a hidden static.

Instead of:

```cs
AudioManager.Instance.Play("Jump");
```

We use:

```cs
audioJumpEvent.Raise();
```

It’s globally usable but data-driven, not static. You can drag it into any serialized field and subscribe from scene objects.

#### Example: AudioService

```cs
using UnityEngine;

[CreateAssetMenu(menuName = "Game/Audio Service")]
public class AudioService : ScriptableObject
{
    [SerializeField] private AudioClip jumpClip;
    [SerializeField] private AudioClip attackClip;
    private AudioSource source;

    public void Initialize(AudioSource src)
    {
        source = src;
        Debug.Log("[AudioService] Initialized with AudioSource");
    }

    public void PlayJump()
    {
        if (source == null) return;
        source.PlayOneShot(jumpClip);
        Debug.Log("[AudioService] PlayJump");
    }

    public void PlayAttack()
    {
        if (source == null) return;
        source.PlayOneShot(attackClip);
        Debug.Log("[AudioService] PlayAttack");
    }
}

```

It can be used this way:

```cs

public class AudioInitializer : MonoBehaviour
{
    [SerializeField] private AudioService audioService;

    void Start()
    {
        audioService.Initialize(GetComponent<AudioSource>());
    }
}

public class PlayerController : MonoBehaviour
{
    [SerializeField] private AudioService audioService;

    void Jump()
    {
        Debug.Log("[Player] Jump pressed");
        audioService.PlayJump();
    }
}

```

With this approach, there's no static or singleton access (no `AudioManager`) and the asset can be reused across scenes. You can also swap audio sets in Inspector (different theme, same code).

You should see the following console trace when running the above:

```
[AudioService] Initialized with AudioSource
[Player] Jump pressed
[AudioService] PlayJump
```

### Adapter Role

An **Adapter** converts <span class="orange-bold">raw</span> or engine-level data into semantic game events. Basically, It translates one system’s interface into another system’s language.

:::note
In Unity, this usually means converting engine callbacks or raw data into clean, semantic events that gameplay scripts can use.
:::

#### Example: InputAdapter

This InputAdapter turns Unity Input System callbacks into clean `UnityActions` (jumpEvent, attackEvent, etc).

```cs
using UnityEngine;
using UnityEngine.Events;
using UnityEngine.InputSystem;

[CreateAssetMenu(menuName = "Game/Input Adapter")]
public class InputAdapter : ScriptableObject, GameInput.IGameplayActions
{
    public event UnityAction jumpEvent;
    public event UnityAction<Vector2> moveEvent;
    private GameInput input;

    private void OnEnable()
    {
        input = new GameInput();
        input.Gameplay.SetCallbacks(this);
        input.Gameplay.Enable();
        Debug.Log("[InputAdapter] Enabled Gameplay Input");
    }

    private void OnDisable()
    {
        input.Gameplay.Disable();
        Debug.Log("[InputAdapter] Disabled Input");
    }

    public void OnJump(InputAction.CallbackContext ctx)
    {
        if (ctx.performed)
        {
            Debug.Log("[InputAdapter] Jump performed");
            jumpEvent?.Invoke();
        }
    }

    public void OnMove(InputAction.CallbackContext ctx)
    {
        moveEvent?.Invoke(ctx.ReadValue<Vector2>());
    }
}

```

We can use it as such:

```cs
public class PlayerController : MonoBehaviour
{
    [SerializeField] private InputAdapter input;

    private void OnEnable()
    {
        input.jumpEvent += OnJump;
        input.moveEvent += OnMove;
    }

    private void OnDisable()
    {
        input.jumpEvent -= OnJump;
        input.moveEvent -= OnMove;
    }

    private void OnJump() => Debug.Log("[Player] Jump received");
    private void OnMove(Vector2 dir) => Debug.Log($"[Player] Move {dir}");
}

```

With this approach, player <span class="orange-bold">never</span> touches Input System API directly. It translate engine-level input like game-level intent (`Jump`,`Move`). You can replace Input System, change input maps, or add other sources without touching gameplay.

You should see the following console trace when running the code above, provided you set up appropriate input actions:

```
[InputAdapter] Enabled Gameplay Input
[InputAdapter] Jump performed
[Player] Jump received
```

### Combined Philosophy: Service + Adapter

In a game project, we need certain "manager" components that fit into service and adapter roles, as such:

| Role        | Responsibility                                  | Example                                       |
| ----------- | ----------------------------------------------- | --------------------------------------------- |
| **Service** | Shared functionality, global lifetime           | AudioService, SaveService, GameStateSO        |
| **Adapter** | Translate external signals into gameplay events | InputAdapter, NetworkAdapter, DialogueAdapter |

Both can be implemented as `ScriptableObject`, giving us: data driven config, global availability, scene-independent lifetime and inspector visibility for designers to tweak.

:::info
Together they form the backbone of the Hybrid Service–Adapter Architecture, where each ScriptableObject can be both a runtime provider (Service) and translator (Adapter).
:::

## Building the Hybrid System Architecture in Layers

Here's the Hybrid System Overview:

```
ENGINE LAYER (Unity subsystems)
    ↓
SERVICE–ADAPTER LAYER (ScriptableObjects)
    ├── Service → provides shared runtime functions
    └── Adapter → translates engine data into game signals
    ↓
SCENE LAYER (MonoBehaviour observers)

```

The Hybrid Service–Adapter system works because every script has a clear place in a layered structure.
Before we touch code, let’s see what those layers are and what we’ll actually build inside Unity.

| Layer                           | Role                         | Example Components                                             | Description                                                                                |
| :------------------------------ | :--------------------------- | :------------------------------------------------------------- | :----------------------------------------------------------------------------------------- |
| **1. Engine Layer**             | Raw signal providers         | Unity Input System, Physics, Animator                          | Unity subsystems emit raw events.                                                          |
| **2. SO Service–Adapter Layer** | Bridges engine ↔ logic       | `InputReader`, `GameStateSO`, `AudioService`, `GameEvent`      | ScriptableObjects act as **Services** and **Adapters**, translating and broadcasting data. |
| **3. Scene Logic Layer**        | Behaviour responders         | `PlayerController`, `DialogueController`, `GameplayController` | MonoBehaviours subscribe to SO events and run gameplay logic.                              |
| **4. Coordinator Layer**        | Context switchers / managers | `InputContextManager`                                          | Manages which Service–Adapter is active (gameplay ↔ dialogue ↔ pause menu).                |
| **5. Presentation Layer**       | Visual & audio feedback      | UI Canvas, `GameEventListener`, FX logic & spawner             | Reacts to events for UI and VFX feedback.                                                  |

To understand data flow between those layers, lets create a tiny game-loop prototype that has the following system:

| Layer                        | What You’ll Create                                                                                                                                        |
| :--------------------------- | :-------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Engine Layer**             | Use Unity Input System asset `GameInput` (auto-generated).                                                                                                |
| **SO Service–Adapter Layer** | `InputReader` asset and one `GameStateSO` asset.                                                                                                          |
| **Scene Logic Layer**        | `PlayerController` (reacts to gameplay input), `DialogueController` (reacts to dialogue input), `GameplayController` (reacts to pause menu related input) |
| **Coordinator Layer**        | `InputContextManager` to toggle between InputReaders when game state changes.                                                                             |
| **Presentation Layer**       | UI text or audio feedback to visualize state changes.                                                                                                     |

From the debug logs, you will observe runtime flow as follows:

```
Unity Input System
      │
      ▼
[ InputReader ]  ← Adapter & Service
      │   raises events like jumpEvent, attackEvent
      ▼
[ PlayerController ]  ← Observer executes PlayJump(), PlayAttack(), Interact()
[ DialogueController ] ← Observer executes AdvanceDialogue(), CancelDialogue()
[ GameplayController ] ← Observer executes Pause()
      │
      ▼
[ GameStateSO ]  ← Service tracks gameplay ↔ dialogue, methods like SetDialogue, Pause, Resule, etc called by Controllers
      │
      ▼
[ InputContextManager ]  ← Coordinator switches InputReader
[ Other Downstream Subscriber ]
```

:::note the key idea

Connections are mostly event-based, not direct references with very few exceptions (see below).

:::

By the end of this section, your Play Mode console should tell a story like:

```
[InputReader] Enabled Gameplay Input
[PlayerController] Jump animation triggered
[DialogueController] Dialogue started!
[ContextManager] Switched to Dialogue
[DialogueController] Dialogue advanced!
[ContextManager] Switched to Gameplay
```

They prove that the layers are talking correctly.

### InputReader (Service & Adapter)

Create a script `InputReader.cs` that acts as both a service (central access point for Input System) and an Adapter (translating Input System data into UnityEvents):

:::note
This code is adapted from this [Devlog](https://youtu.be/WLDgtRNK2VE).
:::

It is implementing interfaces auto-generated from your input system, for instance: ` GameInput.IGameplayActions, GameInput.IDialogueActions, GameInput.IPauseMenuActions, IInputContext`. You may want to adjust it accordingly or [read this section](#input-system) to create the action maps and actions used for demo in this article.

```cs title="InputReader.cs"
using UnityEngine;
using UnityEngine.Events;
using UnityEngine.InputSystem;

[CreateAssetMenu(menuName = "Game/Input Reader")]
public class InputReader : ScriptableObject,
    GameInput.IGameplayActions,
    GameInput.IDialogueActions, GameInput.IPauseMenuActions, IInputContext
{
    // ==== Gameplay Events ====
    public event UnityAction jumpEvent;
    public event UnityAction jumpCanceledEvent;
    public event UnityAction jumpHoldEvent;
    public event UnityAction attackEvent;
    public event UnityAction interactEvent;
    public event UnityAction extraActionEvent;
    public event UnityAction pauseEvent;
    public event UnityAction resumeEvent;
    public event UnityAction<Vector2> moveEvent;
    public event UnityAction<Vector2, bool> cameraMoveEvent;
    public event UnityAction enableMouseControlCameraEvent;
    public event UnityAction disableMouseControlCameraEvent;

    // ==== Dialogue Events ====
    public event UnityAction advanceDialogueEvent;
    public event UnityAction cancelDialogueEvent;
    public event UnityAction<Vector2> moveSelectionEvent;

    private GameInput gameInput;

    // ---------------------------------------------------------------------
    private void OnEnable()
    {
        if (gameInput == null)
        {
            gameInput = new GameInput();

            // Register callbacks for all maps
            gameInput.Gameplay.SetCallbacks(this);
            gameInput.Dialogue.SetCallbacks(this);
            gameInput.PauseMenu.SetCallbacks(this);
        }

        EnableGameplayInput();
        Debug.Log("[InputReader] Enabled Gameplay Input");
    }

    private void OnDisable()
    {
        DisableAllInput();
        Debug.Log("[InputReader] Disabled All Input");
    }

    // ---------------------------------------------------------------------
    // ==== Gameplay Callbacks ====
    public void OnAttack(InputAction.CallbackContext ctx)
    {
        if (ctx.performed)
        {
            Debug.Log("[InputReader] Attack Triggered");
            attackEvent?.Invoke();
        }
    }

    public void OnExtraAction(InputAction.CallbackContext ctx)
    {
        if (ctx.performed)
        {
            Debug.Log("[InputReader] Extra Action");
            extraActionEvent?.Invoke();
        }
    }

    public void OnInteract(InputAction.CallbackContext ctx)
    {
        if (ctx.performed)
        {
            Debug.Log("[InputReader] Interact");
            interactEvent?.Invoke();
        }
    }

    public void OnJump(InputAction.CallbackContext ctx)
    {
        if (ctx.performed)
        {
            Debug.Log("[InputReader] Jump Performed");
            jumpEvent?.Invoke();
        }
        else if (ctx.canceled)
        {
            Debug.Log("[InputReader] Jump Canceled");
            jumpCanceledEvent?.Invoke();
        }
    }

    public void OnJumphold(InputAction.CallbackContext ctx)
    {
        if (ctx.performed)
        {
            Debug.Log("[InputReader] Jump Hold");
            jumpHoldEvent?.Invoke();
        }
    }

    public void OnMove(InputAction.CallbackContext ctx)
    {
        moveEvent?.Invoke(ctx.ReadValue<Vector2>());
    }

    public void OnPause(InputAction.CallbackContext ctx)
    {
        if (ctx.performed)
        {
            Debug.Log("[InputReader] Pause Pressed");
            pauseEvent?.Invoke();
        }
    }

    public void OnRotateCamera(InputAction.CallbackContext ctx)
    {
        cameraMoveEvent?.Invoke(ctx.ReadValue<Vector2>(), ctx.control.device.name == "Mouse");
    }

    public void OnMouseControlCamera(InputAction.CallbackContext ctx)
    {
        if (ctx.performed)
            enableMouseControlCameraEvent?.Invoke();
        else if (ctx.canceled)
            disableMouseControlCameraEvent?.Invoke();
    }

    // ---------------------------------------------------------------------
    // ==== Dialogue Callbacks ====
    public void OnAdvanceDialogue(InputAction.CallbackContext ctx)
    {
        if (ctx.performed)
        {
            Debug.Log("[InputReader] Advance Dialogue");
            advanceDialogueEvent?.Invoke();
        }
    }

    public void OnMoveSelection(InputAction.CallbackContext ctx)
    {
        if (ctx.performed)
        {
            Debug.Log("[InputReader] Move Selection");
            moveSelectionEvent?.Invoke(ctx.ReadValue<Vector2>());
        }
    }

    public void OnCancelDialogue(InputAction.CallbackContext ctx)
    {
        if (ctx.performed)
        {
            Debug.Log("[InputReader] Cancel Dialogue");
            cancelDialogueEvent?.Invoke();
        }
    }

    // ---------------------------------------------------------------------
    // ==== Pause Menu Callbacks ====
    public void OnUnpause(InputAction.CallbackContext ctx)
    {
        if (ctx.performed)
        {
            resumeEvent?.Invoke();
            Debug.Log("[InputReader] Resume");
        }
    }

    // ---------------------------------------------------------------------
    // ==== Context Enable / Disable ====
    // These are deliberately public service methods.
    public void EnableGameplayInput()
    {
        gameInput.Dialogue.Disable();
        gameInput.PauseMenu.Disable();
        gameInput.Gameplay.Enable();
        Debug.Log("[InputReader] Switched to Gameplay Map");
    }

    public void EnableDialogueInput()
    {
        gameInput.Gameplay.Disable();
        gameInput.PauseMenu.Disable();
        gameInput.Dialogue.Enable();
        Debug.Log("[InputReader] Switched to Dialogue Map");
    }

    public void PauseGame()
    {
        gameInput.Gameplay.Disable();
        gameInput.Dialogue.Disable();
        gameInput.PauseMenu.Enable();
        Debug.Log("[InputReader] All Input Except Pause Menu Disabled");
    }
    public void DisableAllInput()
    {
        gameInput.Gameplay.Disable();
        gameInput.Dialogue.Disable();
        gameInput.PauseMenu.Disable();
        Debug.Log("[InputReader] All Input Disabled");
    }



}

```

Scene objects subscribe to these `UnityActions` (jumpEvent, attackEvent, etc.) at runtime. This makes things context dependent: same asset, multiple subscribers.

Notice that later on, `InputContextManager` would call public methods (services) provided by `InputReader`, so to make the contract explicit, we make it implement `IInputContext` interface:

```cs title="IInputContext.cs"
public interface IInputContext
{
    void EnableGameplayInput();
    void EnableDialogueInput();
    void DisableAllInput();
    void PauseGame();
}
```

### GameEvent and GameEventListener (Observer Hub)

This is what you did in Lab 5: SOGA.

:::info recap
`GameEvent` is a **Service** for global broadcasting that designers can wire in the Inspector. Any system can `Raise()` it; any `GameEventListener` can react with visual or audio feedback without code changes.
:::

<Tabs>
<TabItem value="1" label="GameEvent.cs">

```cs
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.Events;

[CreateAssetMenu(menuName = "Game/Event Channel")]
public class GameEvent : ScriptableObject
{
    private readonly List<GameEventListener> listeners = new();

    public void Raise()
    {
        Debug.Log($"[GameEvent] {name} raised ({listeners.Count} listeners)");
        for (int i = listeners.Count - 1; i >= 0; i--)
            listeners[i].OnEventRaised();
    }

    public void Register(GameEventListener l) => listeners.Add(l);
    public void Unregister(GameEventListener l) => listeners.Remove(l);
}
```

</TabItem>

<TabItem value="2" label="GameEventListener.cs">

```cs
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.Events;

public class GameEventListener : MonoBehaviour
{
    public GameEvent Event;
    public UnityEvent Response;

    private void OnEnable() => Event.Register(this);
    private void OnDisable() => Event.Unregister(this);

    public void OnEventRaised()
    {
        Debug.Log($"[Listener] {Event.name} invoked");
        Response.Invoke();
    }
}
```

</TabItem>
</Tabs>

### GameStateSO (Shared Global State)

This acts as a <span class="orange-bold">Service</span>: a single source of truth for game context. _Anyone_ can listen to its events to react to context changes.

```cs title="GameStateSO.cs"

using UnityEngine;
using UnityEngine.Events;

[CreateAssetMenu(menuName = "Game/Game State")]
public class GameStateSO : ScriptableObject
{
    public bool isPaused;
    public bool inDialogue;
    public UnityEvent onPaused;
    public UnityEvent onResumed;
    public UnityEvent onDialogueStarted;
    public UnityEvent onDialogueEnded;

    public void Pause()
    {
        if (isPaused) return;
        isPaused = true;
        onPaused?.Invoke();
        Debug.Log("[GameStateSO] Paused");
    }

    public void Resume()
    {
        if (!isPaused) return;
        isPaused = false;
        onResumed?.Invoke();
        Debug.Log("[GameStateSO] Resumed");
    }

    public void SetDialogue(bool active)
    {
        inDialogue = active;
        if (active) onDialogueStarted?.Invoke();
        else onDialogueEnded?.Invoke();
        Debug.Log($"[GameStateSO] Dialogue active = {active}");
    }

    public void ResetState()
    {
        inDialogue = false;
        isPaused = false;
    }
}
```

`Pause, Resume` should be called by some sort of `GameplayController` that is in charge of pausing/resuming, likewise with `SetDialogue`, should be called by `DialogueController`.

> These `controllers` (scene logic layer) _controls_ the game state and make it fire the relevant events so any subscribers downstream can react to it.

### InputContextManager (Coordinator Layer)

Attached to a MonoBehavior, and it coordiates _which_ input mode is active. It expects some interface implemented by `InputReader` and calls appropriate public methods **in response** to events chain such as Pause/Resume game or dialogue.

```cs title="InputContextManager.cs"
using UnityEngine;

// orchestrate between state changes and input reader map setting
using UnityEngine;

// orchestrate between state changes and input reader map setting
public class InputContextManager : MonoBehaviour
{
    [SerializeField] private InputReader inputReader; // drag in inspector
    private IInputContext inputContext;

    private void Awake()
    {
        inputContext = inputReader;
    }
    [SerializeField] private GameStateSO gameState;

    private void OnEnable()
    {
        gameState.onDialogueStarted.AddListener(SwitchToDialogue);
        gameState.onDialogueEnded.AddListener(SwitchToGameplay);
        gameState.onPaused.AddListener(PauseGame);
        gameState.onResumed.AddListener(SwitchToGameplay);
    }

    private void OnDisable()
    {
        gameState.onDialogueStarted.RemoveListener(SwitchToDialogue);
        gameState.onDialogueEnded.RemoveListener(SwitchToGameplay);
        gameState.onPaused.RemoveListener(PauseGame);
        gameState.onResumed.RemoveListener(SwitchToGameplay);
    }

    private void SwitchToGameplay()
    {
        inputContext.EnableGameplayInput();
        Debug.Log("[ContextManager] Gameplay Input Active");
    }

    private void SwitchToDialogue()
    {
        inputContext.EnableDialogueInput();
        Debug.Log("[ContextManager] Dialogue Input Active");
    }

    private void PauseGame()
    {
        inputContext.PauseGame();
        Debug.Log("[ContextManager] Input Disabled");
    }
}

```

### Direct call: `InputContextManager` → `InputReader`, via `IInputContext` interface

`InputContextManager` calls public methods in `InputReader` <span class="red-bold">directly</span> without Events in response to global state changes. These methods _are_ defined in the interface:

```cs
private void SwitchToDialogue() => inputReader.EnableDialogueInput();
private void SwitchToGameplay() => inputReader.EnableGameplayInput();
private void DisableAll()       => inputReader.DisableAllInput();
private void PauseGame()       => inputReader.PauseGame();
```

This keeps knowledge of Unity’s input system contained inside one asset (`InputReader`),
and knowledge of game flow (when to switch) inside a different component (`InputContextManager`).

:::note Direct call here is better (instead of using Events)
You _could_ technically make the `InputReader` subscribe to events on `GameStateSO` (e.g. `onDialogueStarted`, `onPaused`, etc.), but <span class="orange-bold">that would create circular coupling</span> and scatter the “who controls input” logic across multiple assets.

So in this case, direct call is better.
:::

### PlayerController (Scene Logic Layer)

This controller uses C# events directly and **not** `GameEvent` assets. It subscribes to [`InputReader`](#inputreader-service--adapter) runtime UnityActions.

This is ideal when we know the receiver (`PlayerController`) at compile time and we don't need Inspector hooks, and we want maximum speed and type safety.

```cs title="PlayerController.cs"
// adjust the class to implement better movement logic, etc
using UnityEngine;


public class PlayerController : MonoBehaviour
{
    [Header("References")]
    [SerializeField] private InputReader inputReader;
    public GameEvent onPlayerJump;
    public GameEvent onPlayerAttack;

    [Header("Movement Settings")]
    [SerializeField] private float moveSpeed = 5f;
    [SerializeField] private float jumpHeight = 1f;  // purely visual for now
    [SerializeField] private float jumpDuration = 0.3f;

    private Vector2 moveInput;
    private bool isJumping;
    private float jumpTimer;
    private Vector3 basePosition;

    private void OnEnable()
    {
        inputReader.jumpEvent += PlayJump;
        inputReader.attackEvent += Attack;
        inputReader.moveEvent += Move;
    }

    private void OnDisable()
    {
        inputReader.jumpEvent -= PlayJump;
        inputReader.attackEvent -= Attack;
        inputReader.moveEvent -= Move;
    }

    private void Update()
    {
        // --- Movement (X/Y plane) ---
        // W/S affect Y, A/D affect X
        Vector3 move = new Vector3(moveInput.x, moveInput.y, 0f);
        Vector3 moveDelta = move * moveSpeed * Time.deltaTime;
        basePosition += moveDelta;

        // --- Jump offset (visual Z hop, optional) ---
        float jumpOffset = 0f;
        if (isJumping)
        {
            jumpTimer += Time.deltaTime;
            float t = jumpTimer / jumpDuration;

            if (t >= 1f)
            {
                isJumping = false;
                jumpTimer = 0f;
            }
            else
            {
                jumpOffset = Mathf.Sin(Mathf.PI * t) * jumpHeight;
            }
        }

        // Apply position (XY move + jump on Z)
        Vector3 targetPos = new Vector3(basePosition.x, basePosition.y + jumpOffset, basePosition.z);
        transform.position = targetPos;
    }

    private void PlayJump()
    {
        Debug.Log("[PlayerController] Jump animation triggered");
        onPlayerJump?.Raise();
        isJumping = true;
        jumpTimer = 0f;
    }

    private void Attack()
    {
        Debug.Log("[PlayerController] Attack!");
        onPlayerAttack?.Raise();
    }

    private void Move(Vector2 dir)
    {
        moveInput = dir;
        Debug.Log($"[PlayerController] Move {dir}");
    }


}

```

It answers the question: "how do I use an instance `PlayJump()` when the event is `jumpEvent`?"

Each instance subscribes to the ScriptableObject’s event programmatically via Enable and Disable callbacks.
When `InputReader` raises `jumpEvent`, **all** subscribed scene objects run their local method immediately.

### DialogueController (Scene Logic Layer)

When `StartDialogue()` is called (presumably by Player interacting with some NPC), `GameStateSO` fires `onDialogueStarted`, then, `InputContextManager` (the coordinator) **switches** to dialogue input, and the attack button now advances text instead of attacking.

```cs title="DialogueController.cs"
using UnityEngine;

public class DialogueController : MonoBehaviour
{
    [Header("References")]
    [SerializeField] private InputReader inputReader;
    [SerializeField] private GameStateSO gameState;
    [SerializeField] private DialogueData currentDialogue;

    private int currentIndex = 0;
    private bool isActive = false;

    private void OnEnable()
    {
        inputReader.advanceDialogueEvent += AdvanceDialogue;
        inputReader.moveSelectionEvent += MoveSelection;
        inputReader.cancelDialogueEvent += CancelDialogue;
    }

    private void OnDisable()
    {
        inputReader.advanceDialogueEvent -= AdvanceDialogue;
        inputReader.moveSelectionEvent -= MoveSelection;
        inputReader.cancelDialogueEvent -= CancelDialogue;
    }

    public void StartDialogue(DialogueData data)
    {
        currentDialogue = data;
        currentIndex = 0;
        isActive = true;
        gameState.SetDialogue(true);
        Debug.Log("[DialogueController] Dialogue started.");
        DisplayLine();
    }

    private void MoveSelection(Vector2 direction)
    {
        if (!isActive) return;

        if (direction.x > 0)
        {
            AdvanceDialogue();
        }
        else if (direction.x < 0)
        {
            GoBack();
        }
        else if (direction.y != 0)
        {
            Debug.Log("[DialogueController] Vertical movement — ignored for now.");
        }
    }

    private void AdvanceDialogue()
    {
        if (!isActive || currentDialogue == null) return;

        currentIndex++;

        if (currentIndex >= currentDialogue.lines.Length)
        {
            EndDialogue();
        }
        else
        {
            DisplayLine();
        }
    }

    private void GoBack()
    {
        if (!isActive || currentDialogue == null) return;

        currentIndex = Mathf.Max(0, currentIndex - 1);
        DisplayLine();
    }

    private void DisplayLine()
    {
        Debug.Log($"[DialogueController] Line {currentIndex + 1}/{currentDialogue.lines.Length}: {currentDialogue.lines[currentIndex]}");
    }

    public void CancelDialogue()
    {
        if (!isActive) return;
        EndDialogue();
        Debug.Log("[DialogueController] Dialogue cancelled.");
    }

    public void EndDialogue()
    {
        if (!isActive) return;
        isActive = false;
        gameState.SetDialogue(false);
        Debug.Log("[DialogueController] Dialogue ended.");
    }
}
```

### Direct call: `DialogueController` → `GameStateSO` public methods

We <span class="red-bold">directly</span> call the public methods in `GameStateSO`. This is <span class="orange-bold">intended</span>, and we are not using Events here.

GameStateSO isn’t just “data”; it’s a service object, a globally shared runtime state hub that stores booleans (isDialogue, isPaused, etc.). It emits UnityEvents (onDialogueStarted, onPaused, etc.) when those states change.

So when something calls:

```
gameState.SetDialogue(true);
```

We're effectively saying:
“Tell the game we’re in Dialogue Mode now, notify everyone who cares.”

_That’s what it’s designed to do._

#### Do we need an interface for GameStateSO to implement these public methods?

:::info Simple is best
**Keep `GameStateSO` simple** and it does **not need an interface** _unless_ you have multiple interchangeable implementations or you’re writing tests that need to mock it.
:::

The `GameStateSO` is a **singleton-style runtime data service**, <span class="orange-bold">not</span> a polymorphic behavior.
It’s one global “truth” object that:

- Holds flags (`isDialogue`, `isPaused`, …)
- Raises UnityEvents when those flags change

That means we will <span class="orange-bold">never</span> have multiple implementations of this — you’ll always have _one concrete version shared across systems_.

So defining an interface like this:

```csharp
public interface IGameState
{
    bool IsDialogue { get; }
    bool IsPaused { get; }
    void SetDialogue(bool active);
    void SetPaused(bool active);
}
```

would only be useful if we planned to:

- Swap out `GameStateSO` for a _different kind of state provider_ (e.g., in tests, simulations, networked versions), or
- Use dependency injection / service locators that expect an interface type.

Otherwise it will just be boilerplate. The current `GameStateSO` design is reasonable enough for Unity’s **“Service ScriptableObject”** pattern because it is:

- **Serializable** in the Unity editor
- **Inspectable** at runtime (you can see flags flip in the Inspector)
- **Easy to drag-and-drop** into any system (`InputContextManager`, `DialogueController`, etc.)

#### When an Interface Might Make Sense (Later)

Add one **only if** you want:

1. **Mocking / testing** without Unity (e.g., PlayMode tests or CI pipeline):

   ```csharp
   public class MockGameState : IGameState { ... }
   ```

2. **Multiple state containers** (e.g., per-level vs global, or network-synced vs local)
3. **Abstract dependency injection**, e.g. you pass `IGameState` to constructors in a pure C# core layer

If you ever reach that point, you can refactor later without breaking scenes by making `GameStateSO : ScriptableObject, IGameState`.

### Direct call: `NPC` → `DialogueController.StartDialogue`

This method is intended to be called directly by some NPC script when there's interaction with player, and the data is passed via the NPC instance. This design is also intended. See [this section](#npc-interaction) for details.

### DialogueData (Data)

This is just an SO to hold current dialogue data. It is expected by `DialogueController`.

```cs title="DialogueData.cs"
using UnityEngine;

[CreateAssetMenu(menuName = "Game/Dialogue Data")]
public class DialogueData : ScriptableObject
{
    [TextArea(2, 5)]
    public string[] lines;

    [Tooltip("Automatically end dialogue after last line if true.")]
    public bool autoEnd = true;
}

```

### (Extras) CameraController (Scene Logic Layer)

:::note
This is just another scene logic layer for demonstration purposes which you can attack on the Main camera. It wires the same way as Player and Dialogue Controller.
:::

Likewise, this script rotates the camera based on `InputReader` events.

It supports mouse-held rotation (Right Mouse Button), joystick rotation, sensitivity tuning, and smooth damping, all while staying data-driven through your `InputReader`. It automatically subscribe to `InputReader` events via Enable/Disable callbacks.

```cs title="CameraController.cs"
using UnityEngine;

/// <summary>
/// Rotates the camera based on InputReader events.
/// Works with both mouse and gamepad input.
/// Requires: InputReader reference (ScriptableObject).
/// </summary>
public class CameraController : MonoBehaviour
{
    [Header("References")]
    [Tooltip("Reference to the shared InputReader ScriptableObject.")]
    [SerializeField] private InputReader inputReader;

    [Header("Sensitivity Settings")]
    [Tooltip("Mouse rotation speed multiplier.")]
    [SerializeField] private float mouseSensitivity = 0.1f;
    [Tooltip("Controller stick rotation speed multiplier.")]
    [SerializeField] private float stickSensitivity = 2.5f;

    [Header("Clamp Settings")]
    [Tooltip("Minimum pitch angle (down).")]
    [SerializeField] private float minPitch = -60f;
    [Tooltip("Maximum pitch angle (up).")]
    [SerializeField] private float maxPitch = 80f;

    [Header("Smooth Damping")]
    [Tooltip("Smoothing factor for camera rotation.")]
    [SerializeField, Range(0f, 1f)] private float smoothTime = 0.05f;

    private float yaw;
    private float pitch;
    private float yawVelocity;
    private float pitchVelocity;
    private bool isMouseControlActive;

    private Transform playerRoot; // Optional – if you want the camera to orbit around player

    private void OnEnable()
    {
        // Subscribe to InputReader events
        inputReader.cameraMoveEvent += OnCameraMove;
        inputReader.enableMouseControlCameraEvent += EnableMouseControl;
        inputReader.disableMouseControlCameraEvent += DisableMouseControl;
    }

    private void OnDisable()
    {
        // Unsubscribe from InputReader events
        inputReader.cameraMoveEvent -= OnCameraMove;
        inputReader.enableMouseControlCameraEvent -= EnableMouseControl;
        inputReader.disableMouseControlCameraEvent -= DisableMouseControl;
    }

    private void Start()
    {
        // Initialize rotation
        Vector3 angles = transform.eulerAngles;
        yaw = angles.y;
        pitch = angles.x;

        // Hide and lock cursor when camera control starts
        Cursor.lockState = CursorLockMode.None;
        Cursor.visible = true;
    }

    private void EnableMouseControl()
    {
        isMouseControlActive = true;
        Cursor.lockState = CursorLockMode.Locked;
        Cursor.visible = false;
        Debug.Log("[CameraController] Mouse control enabled");
    }

    private void DisableMouseControl()
    {
        isMouseControlActive = false;
        Cursor.lockState = CursorLockMode.None;
        Cursor.visible = true;
        Debug.Log("[CameraController] Mouse control disabled");
    }

    private void OnCameraMove(Vector2 input, bool fromMouse)
    {
        // Ignore input if mouse control inactive and fromMouse
        if (fromMouse && !isMouseControlActive)
            return;

        float sensitivity = fromMouse ? mouseSensitivity : stickSensitivity;
        yaw += input.x * sensitivity;
        pitch -= input.y * sensitivity;
        pitch = Mathf.Clamp(pitch, minPitch, maxPitch);
    }

    private void LateUpdate()
    {
        // Smoothly interpolate rotation
        float smoothYaw = Mathf.SmoothDampAngle(transform.eulerAngles.y, yaw, ref yawVelocity, smoothTime);
        float smoothPitch = Mathf.SmoothDampAngle(transform.eulerAngles.x, pitch, ref pitchVelocity, smoothTime);

        transform.rotation = Quaternion.Euler(smoothPitch, smoothYaw, 0f);
    }
}


```

## Using GameEvent Channels in the Hybrid Architecture

:::note
In the Hybrid Service–Adapter model, `GameEvents` are optional.

We use them when your signal should reach systems that don’t know each other at compile-time.
:::

If we use C# delegate, we have <span class="orange-bold">tight coupling</span>, meaning that we have known receiver like the `PlayerController` to the `jumpEvent` in `InputReader`.

If you also want the jump action to notify unrelated systems (UI, audio, VFX), we can raise a `GameEvent` in addition to local logic.

```cs
using UnityEngine;

public class PlayerControllerWithEvent : MonoBehaviour
{
    [SerializeField] private InputReader inputReader;
    [Header("Optional Global Event")]
    [SerializeField] private GameEvent onPlayerJump;

    private void OnEnable() => inputReader.jumpEvent += PlayJump;
    private void OnDisable() => inputReader.jumpEvent -= PlayJump;

    private void PlayJump()
    {
        Debug.Log("[PlayerController] Jump animation triggered");
        onPlayerJump?.Raise();   // notify other systems
    }
}

```

As per Lab 5, in our Project we:

1. Create Gamevent Asset called `OnPlayerJump`
2. Attach a `GameEventListener` to any object like `AudioManager` or `UIFlash`
3. Assign that asset and link its `Response` toplay sound or show text

### Scenario: Audio attack feedback

Suppose we want to play sound + flash UI whenever player attacks, but without referencing `AudioManager` or `UIManager` directly.

```cs
// PlayerController.cs
public GameEvent onPlayerAttack;

private void Attack()
{
    Debug.Log("[PlayerController] Attack!");
    onPlayerAttack?.Raise();
}

```

Then we have the scene setup:

| Object                | Component                          | Response                           |
| --------------------- | ---------------------------------- | ---------------------------------- |
| `AttackSoundListener` | GameEventListener → onPlayerAttack | AudioSource.PlayOneShot(slashClip) |
| `AttackUIListener`    | GameEventListener → onPlayerAttack | Animator.SetTrigger("Flash")       |

### Example: Milestones recorder

Another example: Record milestones or achievements without modifying gameplay scripts.

```cs
// SceneController.cs
public GameEvent onLevelCompleted;

public void CompleteLevel()
{
    onLevelCompleted?.Raise();
    Debug.Log("[GameStateSO] Level Completed!");
}

```

Various possible **scene listeners**:

- SaveSystemListener → onLevelCompleted → call SaveManager.SaveProgress()
- AnalyticsListener → onLevelCompleted → call Analytics.LogEvent("LevelCleared)

### Example: Driving transitions from data assets only

We can also drive transitions purely through data assets:

```cs
// DialogueController.cs
public GameEvent onDialogueEnded;

public void EndDialogue()
{
    onDialogueEnded?.Raise();
    Debug.Log("[DialogueController] Dialogue Ended → Next Scene");
}
```

And we have the following scene listeners:
| Listener | Response |
| --------------------- | ------------------------------------------- |
| `SceneLoaderListener` | `SceneLoader.LoadSceneAsync("BattleArena")` |
| `CinematicListener` | `CinematicPlayer.Play("BattleIntro")` |

### Example: Centralised camera FX management

It is also common to have centralised screen shake or camera FX manager:

```cs
// Attack, Explosion, or Damage scripts
public GameEvent onScreenShake;

private void Explode() => onScreenShake?.Raise();
```

The callback can be something as follows:

```cs
using UnityEngine;
using System.Collections;
using Game.DebugTools;
public class CameraShake : MonoBehaviour
{
    [Header("Default Settings")]
    public float duration = 0.3f;
    public float strength = 0.2f;

    // some more settings

    private Vector3 originalPos;
    void Awake()
    {
        originalPos = transform.localPosition;
    }

    [InspectorButton]
    public void Shake()
    {

        StopAllCoroutines();
        StartCoroutine(DoShake(
             duration,
             strength
        ));
    }

    private IEnumerator DoShake(float duration, float strength)
    {
        // logic to perform camera shake
        yield return null;
    }
}

```

Then attach `GameListener` component on this object, and link up `Shake` method from the above script.

### Chained Event Cascades

Finally, `GameEvent` can form pipelines for complex flows:

```
onPlayerDied → onFadeOut → onReloadScene → onShowGameOver
```

Each event drives the <span class="red-bold">next</span> listener.

```cs
// DeathSystem.cs
[SerializeField] private GameEvent onPlayerDied;
private void Die() => onPlayerDied?.Raise();

// FadeManagerListener.cs
[SerializeField] private GameEvent onPlayerDied;
[SerializeField] private GameEvent onFadeOut;
public void OnPlayerDied() => onFadeOut?.Raise();
```

:::success Design with ease
We can easily re-order or extend chains without altering gameplay scripts.
:::

## Presentation Layer (Visual Feedback)

This layer listens to our system-level events (`GameEvent`, `GameStateSO UnityEvents`) and turns them into visual and audio responses, all <span class="red-bold">without</span> writing new code. It ties all system together. This is the <span class="orange-bold">downstream</span> layer, those who subscribe to events defined in `GameStateSO`.

### Recap

The following diagram summarizes the input flow in this architecture and the chain of events

```
                ┌────────────────────────────────┐
                │        [ InputReader ]         │
                │------------------------------- │
                │ - handles InputAction callbacks│
                │ - raises UnityAction events:   │
                │   jump, attack, move, interact │
                │   pause, advanceDialogue, etc. │
                └──────────────┬─────────────────┘
                               │
                               │ (UnityAction events)
                               │
     ┌─────────────────────────┼─────────────────────────┐
     │                         │                         │
     ▼                         ▼                         ▼
┌────────────────┐       ┌─────────────────┐       ┌───────────────────────────────┐
│PlayerController│       │PlayerInteractor │       │GameplayController             │
│----------------│       │-----------------│       │-------------------------------│
│ move/jump/atk  │       │ listens Interact│       │ listens Pause/Resume          │
│ logic          │       │ → find NPC      │       │ → gameState.Pause()/Resume()  │
└────────────────┘       └──────┬──────────┘       └──────┬────────────────────────┘
                                │                         │
                                │ (NPC.Interact())        │
                                ▼                         │
                        ┌─────────────────┐               │
                        │  NPCInteraction │               │
                        │---------------- │               │
                        │ dialogueCtrl.   │               │
                        │   StartDialogue │               │
                        └────────┬────────┘           to GameStateSO
                                 │
                                 ▼
                        ┌────────────────────────────────────┐
                        │ DialogueController                 │
                        │------------------------------------│
                        │ gameState.SetDialogue(true/false)  │
                        │ uses DialogueData lines            │
                        └──────────┬─────────────────────────┘
                                   │
                                   │ (fires UnityEvents)
                                   ▼
                        ┌────────────────────────────────────────────┐
                        │                GameStateSO                 │
                        │--------------------------------------------│
                        │ isDialogue, isPaused                       │
                        │ onDialogueStarted / onDialogueEnded        │
                        │ onPaused / onResumed                       │
                        └──────────┬───────────────────┬─────────────┘
                                   │                   │
                                   │ (subscribed)       │ (subscribed)
                                   ▼                   ▼
                ┌─────────────────────────────┐   ┌─────────────────────────┐
                │ InputContextManager         │   │        UI / Menu        │
                │-----------------------------│   │-------------------------│
                │ listens to GameState        │   │ listens onPaused/Resumed│
                │ switches input maps via     │   │ shows pause UI, resume  │
                │ IInputContextManager →      │   │ calls GameState.Resume()│
                │ InputReader methods         │   └─────────────────────────┘
                └─────────────────────────────┘

```

### Demo & Scene Setup

To test the hybrid architecture quickly, your project folder structure should roughly follow this construct. You should add more files as necessary to control dialogues, pause menu, etc (see [other helper code ](#other-helper-scripts)below).

```
Assets/
 ├─ Scripts/
 │   ├─ ───────────────────────────── Controllers ─────────────────────────────
 │   │   ├─ PlayerController.cs              // movement, attack logic
 │   │   ├─ PlayerInteractor.cs              // detects NPCs and triggers interact
 │   │   ├─ DialogueController.cs            // manages dialogue flow & calls GameState
 │   │   ├─ CameraController.cs              // follows player / cinematic logic
 │   │   └─ GameStateResetter.cs             // resets ScriptableObjects on load
 │   │
 │   ├─ ───────────────────────────── Coordinator ─────────────────────────────
 │   │   ├─ InputContextManager.cs           // switches input maps via interface
 │   │   └─ IInputContext.cs                 // defines input switching contract
 │   │
 │   ├─ ───────────────────────────── Services / Adapters ─────────────────────
 │   │   ├─ InputReader.cs                   // adapter for Input System → UnityEvents
 │   │   ├─ GameStateSO.cs                   // global game mode & pause/dialogue flags
 │   │   ├─ GameEvent.cs                     // ScriptableObject event channel
 │   │   ├─ GameEventListener.cs             // listener component for GameEvent
 │   │   └─ NPCInteraction.cs                // holds dialogue ref & calls DialogueController interface
 │   │
 │   ├─ ───────────────────────────── Data Assets ─────────────────────────────
 │   │   └─ DialogueData.cs                  // holds dialogue lines & metadata
 │   │
 │   ├─ ───────────────────────────── Downstream / Reactive ───────────────────
 │   │   ├─ ParticleEffectsResponse.cs       // plays VFX when events fire
 │   │   └─ CameraShake.cs                   // reacts to hits / jumps
 │   │   └─ GameStateDisplay.cs              // reacts to state change (pause/gameplay/dialogue)
 │
 ├─ ScriptableObjects/
 │   ├─ InputReader.asset
 │   ├─ GameState.asset
 │   ├─ OnPlayerJump.asset
 │   ├─ OnPlayerAttack.asset
 │   └─ OnDialogueStart.asset
 │
 └─ Prefabs/
     ├─ Player.prefab
     ├─ DialogueUI.prefab
     └─ FX_JumpDust.prefab

```

:::note
You can find more code below that are just created for demo purposes, such as NPCInteraction, `GameStateDisplay`, etc.
:::

#### Scriptable Objects

Create GameState, InputReader service SO, and two GameEvent SOs: OnPlayerAttack and OnPlayerJump (this is for the player FX). Create also DialogueData SO and fill up the lines.

<ImageCard path={require("/resources/general/images/hybrid-arch/2025-10-14-19-06-32.png").default} widthPercentage="100%"/>

#### Input System

Create 3 action maps, `Gameplay`:

<ImageCard path={require("/resources/general/images/hybrid-arch/2025-10-15-08-04-08.png").default} widthPercentage="100%"/>

`Dialogue`:
<ImageCard path={require("/resources/general/images/hybrid-arch/2025-10-15-08-03-58.png").default} widthPercentage="100%"/>

`PauseMenu`:
<ImageCard path={require("/resources/general/images/hybrid-arch/2025-10-15-08-04-23.png").default} widthPercentage="100%"/>

Then **Generate C# Class**: over in your Project hierarchy window, select the Input System asset, and over at the inspector, key in the details for the C# class you want to generate and click Apply. This will generate the interfaces `GameInput.IGameplayActions, GameInput.IDialogueActions, GameInput.IPauseMenuActions, IInputContext` we used in our `InputReader` asset.

#### Scene Hierarchy

The scene hierarchy should follow something like this:

```
[Root]
 ├─ Controllers
 |  ├─ DialogueController
 |  ├─ GameplayController
 ├─ InputContextManager
 ├─ GameStateDisplay (UI)
 ├─ Player (PlayerControllerWithEvent)
 |  ├─ FX_JumpListener
 |  ├─ FX_AttackListener
 ├─ GameStateDisplayUI
 ├─ NPC
 └─ MainCamera (CameraShakeListener)


```

And we shall have the following inspector assignments:

#### Main Camera

<ImageCard path={require("/resources/general/images/hybrid-arch/2025-10-14-19-02-56.png").default} widthPercentage="100%"/>

#### Dialogue and Gameplay Controller

<ImageCard path={require("/resources/general/images/hybrid-arch/2025-10-14-19-03-27.png").default} widthPercentage="100%"/>

<ImageCard path={require("/resources/general/images/hybrid-arch/2025-10-14-19-03-37.png").default} widthPercentage="100%"/>

#### Input Context Manager

<ImageCard path={require("/resources/general/images/hybrid-arch/2025-10-14-19-03-57.png").default} widthPercentage="100%"/>

#### Simple Player and FX system

<ImageCard path={require("/resources/general/images/hybrid-arch/2025-10-14-19-04-21.png").default} widthPercentage="100%"/>

<ImageCard path={require("/resources/general/images/hybrid-arch/2025-10-15-07-45-00.png").default} widthPercentage="100%"/>

<ImageCard path={require("/resources/general/images/hybrid-arch/2025-10-15-07-45-13.png").default} widthPercentage="100%"/>

#### Game State UI

<ImageCard path={require("/resources/general/images/hybrid-arch/2025-10-15-08-02-09.png").default} widthPercentage="100%"/>

#### NPC

<ImageCard path={require("/resources/general/images/hybrid-arch/2025-10-14-19-05-08.png").default} widthPercentage="100%"/>

### Runtime Flow Explanation

1. **Gameplay Phase**

   - Press WASD → `InputReader_Gameplay` raises `moveEvent`→ `PlayerController.Move()`.
   - Press Space → `jumpEvent` → `PlayerController.PlayJump()` → `OnPlayerJump.Raise()`.
   - `FX_JumpListener` plays particle + sound.

2. **Attack**

   - Press Left Click → `InputReader_Gameplay` raises `attackEvent` → `PlayerController.Attack()` → `OnPlayerAttack.Raise()`.
   - `FX_AttackListener` flashes UI / plays slash sound.
   - `MainCamera` receives event → shakes camera `CameraShake.Shake()`

3. **Dialogue Transition**

   - Press E → `InputReader_Gameplay` raises `interactEvent` → PlayerInteractor.TryInteract() → (if Player overaps with NPC) NPCInteraction.Interact() → `DialogueController.StartDialogue()` → `GameStateSO.SetDialogue(true)`
   - `GameStateSO` fires `onDialogueStarted` → `InputContextManager.SwitchToDialogue()`
   - Gameplay input disabled → Dialogue input active.
   - UI animates.
   - Debug dialogue line 1 prints

4. **Advance Dialogue**

   - Press Space (while in dialogue) → `InputReader_Gameplay` raises `advanceDialogueEvent` → `dialogueController.AdvanceDialogue()`.
   - Debug dialogue text advances.

5. **Cancel Dialogue**

   - Press E → `InputReader_Gameplay` raises `cancelDialogueEvent` → `DialogueController.EndDialogue()` → `GameStateSO.SetDialogue(true)` → GameStateSO fires `onDialogueEnded` → `InputContextManager.SwitchToGameplay()` → UI animates.

:::note
Similar logic follows for game Pause/Resume, just that the event flows through `GameplayController` instead.
:::

### Other demo scripts

#### `PlayerInteractor` Controller

Attach this to the Player GameObject to detect nearby NPC.

```cs
using UnityEngine;

public class PlayerInteractor : MonoBehaviour
{
    [Header("References")]
    [SerializeField] private InputReader inputReader;

    [Header("Settings")]
    [Tooltip("If true, only interact when player is inside an NPC trigger.")]
    [SerializeField] private bool requireTouch = true;
    [SerializeField] private float detectionRadius = 1f;
    [SerializeField] private LayerMask npcLayer; // assign your NPC layer here

    private NPCInteraction nearbyNPC;

    private void OnEnable()
    {
        inputReader.interactEvent += TryInteract;
    }

    private void OnDisable()
    {
        inputReader.interactEvent -= TryInteract;
    }

    private void Update()
    {
        Collider2D hit = Physics2D.OverlapCircle(transform.position, detectionRadius, npcLayer);

        if (hit && hit.TryGetComponent<NPCInteraction>(out var npc))
        {
            if (npc != nearbyNPC)
            {
                nearbyNPC = npc;
                Debug.Log($"[PlayerInteractor2D] In range of {npc.name}");
            }
        }
        else if (nearbyNPC != null)
        {
            Debug.Log($"[PlayerInteractor2D] Left range of {nearbyNPC.name}");
            nearbyNPC = null;
        }
    }

    private void TryInteract()
    {
        if (requireTouch && nearbyNPC == null)
        {
            Debug.Log("[PlayerInteractor2D] No NPC in range to interact.");
            return;
        }

        if (nearbyNPC != null)
        {
            nearbyNPC.Interact();
            Debug.Log($"[PlayerInteractor2D] Interacted with {nearbyNPC.name}");
        }
    }

#if UNITY_EDITOR
    private void OnDrawGizmosSelected()
    {
        Gizmos.color = nearbyNPC ? Color.green : Color.red;
        Gizmos.DrawWireSphere(transform.position, detectionRadius);
    }
#endif
}


```

#### NPC Interaction

Attach this to the NPC gameobject with a `Collider2D` so that the player can detect it. <span class="orange-bold">Assign Layer NPC</span> to the NPC too.

```cs
using UnityEngine;

[RequireComponent(typeof(Collider2D))]
public class NPCInteraction : MonoBehaviour
{
    [SerializeField] private DialogueController dialogueController;
    [SerializeField] private DialogueData dialogueData;

    private void Awake()
    {
        var col = GetComponent<Collider2D>();
        col.isTrigger = true;
    }

    public void Interact()
    {
        if (dialogueController == null)
        {
            Debug.LogWarning($"[NPCInteraction] No DialogueController assigned on {name}");
            return;
        }

        dialogueController.StartDialogue(dialogueData);
        Debug.Log($"[NPCInteraction] Started dialogue with {name}");
    }
}


```

:::info
It's **completely fine** for `NPCInteraction` (attached to an NPC) to call `DialogueController` directly
:::

_There's no need to over-abstract it._

```csharp
// NPCInteraction.cs
public class NPCInteraction : MonoBehaviour
{
    [SerializeField] private DialogueController dialogueController;
    [SerializeField] private DialogueData dialogueData;

    public void Interact()
    {
        dialogueController.StartDialogue(dialogueData);
    }
}
```

This is fine because:

- The NPC only needs to trigger dialogue: not manage global state itself.
- `DialogueController` is the _authoritative controller_ for dialogue logic.
- Both are scene objects, so you’re not leaking dependencies across systems.

It keeps the flow clean and traceable:

```
PlayerInteractor → NPCInteraction.Interact() → DialogueController.StartDialogue()
```

:::caution When Direct call is not ideal

If `DialogueController` lived in a **different scene** or was a **global service (ScriptableObject)**, then a direct reference would create tight coupling.
In those cases, we'd use:

- a `GameEvent` channel (`OnDialogueStart.Raise()`), or
- an interface (`IDialogueTrigger`) implemented by `DialogueController`.

That makes it decoupled and scene-independent.
:::

This pattern already separates responsibilities well:

- `NPCInteraction` = simple data + call site.
- `DialogueController` = orchestrator that updates `GameStateSO`.
- `GameStateSO` = global notifier (Pause, DialogueStarted, etc.).

So direct call in this case is just _triggering_ something in the same scene scope.
It’s analogous to a Unity “controller talking to another controller,” not a cross-layer dependency.

#### `GameStateDisplay` Controller

Here's a simple script that display the game state (dialogue or gameplay) for debug purposes:

```cs title="GameStateDisplay.cs"
using UnityEngine;
using UnityEngine.UI;
using TMPro;
using System.Collections;

public class GameStateDisplay : MonoBehaviour
{
    [Header("References")]
    [SerializeField] private GameStateSO gameState;
    [SerializeField] private TextMeshProUGUI tmpText;     // For TMP users

    [Header("Fade Settings")]
    [SerializeField] private float fadeDuration = 2.0f;
    [SerializeField] private string dialogueMessage = "Dialogue Mode";
    [SerializeField] private string gameplayMessage = "Gameplay Mode";
    [SerializeField] private string pauseMessage = "Game Paused Mode";

    private Coroutine fadeRoutine;

    private void OnEnable()
    {
        if (gameState == null)
        {
            Debug.LogWarning("[GameStateDisplay] No GameStateSO assigned!");
            return;
        }

        gameState.onDialogueStarted.AddListener(HandleDialogueStart);
        gameState.onDialogueEnded.AddListener(HandleDialogueEnd);
        gameState.onPaused.AddListener(HandlePause);
        gameState.onResumed.AddListener(HandleResume);
    }

    private void OnDisable()
    {
        if (gameState == null) return;

        gameState.onDialogueStarted.RemoveListener(HandleDialogueStart);
        gameState.onDialogueEnded.RemoveListener(HandleDialogueEnd);
        gameState.onPaused.RemoveListener(HandlePause);
        gameState.onResumed.RemoveListener(HandleResume);
    }

    private void HandleDialogueStart()
    {
        Debug.Log("[GameStateDisplay] Handle Dialogue Start: Updating UI");
        UpdateDisplay(dialogueMessage);
    }

    private void HandleDialogueEnd()
    {
        Debug.Log("[GameStateDisplay] Handle Dialogue End: Updating UI");
        UpdateDisplay(gameplayMessage);
    }
    private void HandlePause()
    {
        Debug.Log("[GameStateDisplay] Handle Pause: Updating UI");
        UpdateDisplay(pauseMessage);
    }

    private void HandleResume()
    {
        Debug.Log("[GameStateDisplay] Handle Resume: Updating UI");
        UpdateDisplay(gameplayMessage);
    }

    private void UpdateDisplay(string message)
    {
        tmpText.text = message;
    }


}

```

#### ParticleEffectResponse

Attach this to your FX GameObject to stop/start its particle system on Jump/Attack for demo purposes:

```cs
using UnityEngine;
using System.Collections;

public class ParticleEffectResponse : MonoBehaviour
{


    [Header("Effect Settings")]
    [SerializeField] private ParticleSystem targetEffect;
    [SerializeField] private float stopAfterSeconds = 1.5f;   // 0 = play until naturally ends
    [SerializeField] private bool deactivateAfterStop = true; // optional disable GameObject



    public void PlayEffect()
    {
        if (targetEffect == null)
        {
            Debug.LogWarning("[ParticleEffectListener] No ParticleSystem assigned.");
            return;
        }

        // ensure it's active
        if (!targetEffect.gameObject.activeSelf)
            targetEffect.gameObject.SetActive(true);

        targetEffect.Stop(true, ParticleSystemStopBehavior.StopEmittingAndClear);
        targetEffect.Play();

        if (stopAfterSeconds > 0)
            StartCoroutine(StopAfterDelay());
    }

    private IEnumerator StopAfterDelay()
    {
        yield return new WaitForSeconds(stopAfterSeconds);

        if (targetEffect == null)
            yield break;

        targetEffect.Stop(true, ParticleSystemStopBehavior.StopEmitting);

        if (deactivateAfterStop)
            targetEffect.gameObject.SetActive(false);
    }
}

```

Then attach a `GameEventListener` to this gameObject and hook up the callback `PlayEffect` accordingly when player jump/attack.

### Debug Trace

When running the project, you can clearly trace how input, adapter, controller, event, and presentation all connect seamlessly. Here's one sample debug log and recording:

```
[InputReader] Enabled Gameplay Input
[PlayerController] Jump animation triggered
[GameEvent] OnPlayerJump raised (1 listener)
[Listener] OnPlayerJump invoked
[FX_JumpListener] Particle + Sound played
[PlayerController] Attack!
[GameEvent] OnPlayerAttack raised (2 listeners)
[CameraShake] Shake triggered!
[FX_AttackListener] UI Flash triggered
[DialogueController] Dialogue started!
[GameStateSO] Dialogue active = True
[ContextManager] Dialogue Input Active
[DialogueController] Dialogue advanced!
[DialogueController] Dialogue ended!
[GameStateSO] Dialogue active = False
[ContextManager] Gameplay Input Active
```

<VideoItem path={"https://50033.s3.ap-southeast-1.amazonaws.com/tutorials/demo-hybrid-arch.mov"} widthPercentage="100%"/>

## Summary

This single demo embodies the full 5-layer architecture:

| Layer                  | Active Component                                               | Responsibility               |
| :--------------------- | :------------------------------------------------------------- | :--------------------------- |
| **Engine**             | Unity Input System                                             | Low-level input              |
| **SO Service–Adapter** | `InputReader`, `GameStateSO`, `GameEvent`,`GameEventListener`  | Data-driven runtime services |
| **Scene Logic**        | `PlayerController`, `DialogueController`, `GameplayController` | Core gameplay reactions      |
| **Coordinator**        | `InputContextManager`                                          | Context switching            |
| **Presentation**       | `GameStateDisplay`, UI, `CameraShake`                          | Visual & audio feedback      |

The key properties are that it is entirely event-driven with very minimal hard references or statics, it is scene-independent (SO persists across scenes), designer-friendly (hooks are editable in inspectors).
