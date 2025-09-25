---
sidebar_position: 5
---

import CollapsibleAnswer from '@site/src/components/CollapsibleAnswer';
import DeepDive from '@site/src/components/DeepDive';
import ImageCard from '@site/src/components/ImageCard';
import ChatBaseBubble from "@site/src/components/ChatBaseBubble";

# God Mode for Development

When you’re making fun or experimental projects, you often hit the same playtesting **pain points** like dying constantly during testing, running out of resources, want to skip level geometry, and want consistency across sessions.

Most games should have some kind of God Mode enabled (infinite resource, skip levels, teleport anywhere, etc). There are **many** ways to implement this but what you want is something so simple and portable that you can use across projects and easy to extend and modify should you need more God Features, has a clear **UI** to know which cheat is enabled while being _backward compatible_.

:::info
Any design that requires zero setup and maintenance is a good design.
:::

## Example Approach: Static Class

You can create a static class that contains flags on whether God Mode is enabled in your game. You will then access them from other scripts to determine the logic:

```cs
// GodModeManager.cs — drop anywhere in Assets/
// Two usage methods in gameplay code:
// [POLLING] if (GodModeManager.God) { /* ignore damage */ }
// [EVENT-BASED] GodModeManager.OnAnyChange += HandleCheatChange;  // react when toggled

using System;
using System.Collections.Generic;
using UnityEngine;

public static partial class GodModeManager
{
    // sample public flags (stable API)
    public static bool God { get; private set; } // invulnerable
    public static bool Infinite { get; private set; } // infinite resources
    public static bool Noclip { get; private set; } // ignore collisions


    // subscribe to this to react once whenever ANY cheat flips
    public static event Action OnAnyChange;

    // internal registry for scalable toggles/hotkeys/persistence
    private struct CheatDef
    {
        public string Name;
        public string PrefKey;
        public Func<bool> Getter;
        public Action<bool> Setter;   // MUST invoke OnAnyChange
        public KeyCode? Hotkey;
    }

    private static readonly List<CheatDef> _defs = new();
    private static bool _bootstrapped;



    // extension hook: compile-time only (implemented in your own partial file)
    static partial void RegisterExtraCheats();
    private static void AddCheat(
        string name,
        string playerPrefsKey,
        Func<bool> getter,
        Action<bool> assignCoreField,
        KeyCode? hotkey = null)
    {
        // load saved value for dev builds; default false otherwise
        bool saved = Debug.isDebugBuild && PlayerPrefs.GetInt(playerPrefsKey, 0) == 1;

        // core setter: persist (dev only), assign field, and notify subscribers
        void CoreSetter(bool v)
        {
            if (Debug.isDebugBuild)
            {
                PlayerPrefs.SetInt(playerPrefsKey, v ? 1 : 0);
                PlayerPrefs.Save();
            }
            assignCoreField(v);       // update the backing field (e.g., God = v)
            OnAnyChange?.Invoke();    // notify once per toggle
        }

        // initialize to saved value without double notify
        assignCoreField(saved);

        _defs.Add(new CheatDef
        {
            Name = name,
            PrefKey = playerPrefsKey,
            Getter = getter,
            Setter = CoreSetter,
            Hotkey = hotkey
        });
    }

    // bootstrap: only active in Editor/Development builds
    [RuntimeInitializeOnLoadMethod(RuntimeInitializeLoadType.AfterSceneLoad)]
    private static void Bootstrap()
    {
        if (_bootstrapped) return;
        _bootstrapped = true;
        if (!Debug.isDebugBuild) return;

        // register legacy cheats (preserves existing API and PlayerPrefs keys)
        AddCheat("God", "GodModeManager.God", () => God, v => God = v, KeyCode.F1);
        AddCheat("Infinite", "GodModeManager.Infinite", () => Infinite, v => Infinite = v, KeyCode.F2);
        AddCheat("Noclip", "GodModeManager.Noclip", () => Noclip, v => Noclip = v, KeyCode.F3);
        // call your compile-time extensions (if any)
        RegisterExtraCheats();
        // spawn overlay holder
        var go = new GameObject("GodModeManagerOverlay");
        go.hideFlags = HideFlags.DontSave;
        UnityEngine.Object.DontDestroyOnLoad(go);
        go.AddComponent<GodModeOverlay>();
    }

    // tiny overlay + hotkeys (auto-built from registry)
    private class GodModeOverlay : MonoBehaviour
    {
        bool show = true;
        Rect area = new Rect(10, 10, 240, 140);

        void Update()
        {
            if (Input.GetKeyDown(KeyCode.BackQuote)) show = !show;

            foreach (var d in _defs)
            {
                if (d.Hotkey.HasValue && Input.GetKeyDown(d.Hotkey.Value))
                {
                    // toggle via registered setter (fires OnAnyChange once)
                    d.Setter(!d.Getter());
                }
            }
        }

        void OnGUI()
        {
            if (!show) return;

            area.height = 20 + 26 * (_defs.Count + 2);

            GUILayout.BeginArea(area, GUI.skin.box);
            GUILayout.Label("<b>God Mode Manager</b>", new GUIStyle(GUI.skin.label) { richText = true });

            foreach (var d in _defs)
            {
                bool v = d.Getter();
                bool nv = GUILayout.Toggle(v, $" {d.Name}" + (d.Hotkey.HasValue ? $"  ({d.Hotkey.Value})" : ""));
                if (nv != v)
                {
                    d.Setter(nv);                    // notifies once
                }
            }

            GUILayout.Space(4);
            GUILayout.Label("` show/hide");
            GUILayout.EndArea();
        }
    }
}
```

## Explanation

This section explains the purpose of each part of the code above.

### Public API

```cs
public static bool God      { get; private set; }
public static bool Infinite { get; private set; }
public static bool Noclip   { get; private set; }

public static void SetGod(bool v)      => SetFlag("God", v);
public static void SetInfinite(bool v) => SetFlag("Infinite", v);
public static void SetNoclip(bool v)   => SetFlag("Noclip", v);

```

These are the flags you use in gameplay code if you choose to poll and check. For instance,

```cs
if (GodModeManager.God) { /* ignore damage */ }
```

The `SetX()` wrappers call into the internal system (`SetFlag`) so that **toggling** a cheat updates persistence, events, and UI consistently.

### Change notifications

```cs
public static event Action OnAnyChange;
```

This lets other systems subscribe and react **immediately** when any cheat flips and avoid per-frame polling. See [this](#usage-with-event) section for usage.

### Internal Cheat Registry

```cs
private struct CheatDef
{
    public string Name;
    public string PrefKey;
    public Func<bool> Getter;
    public Action<bool> Setter;
    public KeyCode? Hotkey;
}

private static readonly List<CheatDef> _defs = new();

```

Each cheat is represented by a `CheatDef`. It holds everything the manager needs to display it in the cheat overlay. `_defs` is the **master** list that holds all registered cheats, along with how to get/set their values and which hotkeys toggle them. The overlay simply loops through this list to build the UI.

### Extension Hook and Adding Cheat (private)

The extension hook `RegisterExtraCheats` is an empty partial method in the core file, and we can add extra cheats by writing a second file, see this [section](#extending-cheats).

The method `AddCheat` is only called during bootstrap or by extension partial classes. It register new cheats in `_defs`, loads previous saved value (if dev build) and sets the backing field. Setter automatically updates persistence + field + fires `OnAnyChange`.

### Bootstrap

Runs automatically after the first scene loads (thanks to `RuntimeInitializeOnLoadMethod`). It guards `_bootstrapped` (run only once) and `Debug.isDebugBuild` (only runs in Editor or Dev builds, skips in Release).

Then it does:

- Registers the built-in cheats (God, Infinite, Noclip)
- Calls `RegisterExtraCheats` (so our partial extensions can add theirs)
- Creates a persistent hidden GameObject with the overlay UI so we know what cheats are ON

### Overlay

This class provides a simple IMGUI panel with toggles for each cheat. It toggles with backtick (\`) to show/hide. Hotkeys (F1, F2, F3, …) flip cheats instantly. Because it reads `_defs` every frame, all cheats (core + extensions) appear automatically.

<ImageCard path={require("/resources/images/cheats/2025-09-25-10-48-50.png").default} widthPercentage="100%"/>

### `Debug.isDebugBuild`

This is a property Unity fills in for us at runtime.

- In the Editor Play mode: always true.
- In a Development Build: true.
- In a Release/normal Build: false.

You can set in Build Settings whether you want your game to be made as Development Build (tick the box).

<ImageCard path={require("/resources/images/cheats/2025-09-25-10-37-37.png").default} widthPercentage="100%"/>

## Usage with Polling

Use the flags right away where they matter

```cs
public void ApplyDamage(int dmg)
{
    if (GodModeManager.God) return; // invulnerable
    hp = Mathf.Max(0, hp - dmg);
}

void ConsumeAmmo(int amount)
{
    if (GodModeManager.Infinite) return; // never decrease
    ammo = Mathf.Max(0, ammo - amount);
}

void Update()
{
    if (GodModeManager.Noclip)
    {
        controller.detectCollisions = false;
        FreeFly();
    }
    else
    {
        controller.detectCollisions = true;
        NormalMove();
    }
}
```

## Usage with Event

Subscribe to OnAnyChange to flip systems on/off only when a cheat changes:

```cs title="NoclipBinder.cs"
public class NoclipBinder : MonoBehaviour
{
    void OnEnable()  => GodModeManager.OnAnyChange += Apply;
    void OnDisable() => GodModeManager.OnAnyChange -= Apply;

    void Start() => Apply(); // apply current state immediately

    void Apply()
    {
        if (GodModeManager.Noclip) EnableNoclip();
        else                       DisableNoclip();
    }

    void EnableNoclip()
    {
        foreach (var c in GetComponentsInChildren<Collider>()) c.enabled = false;
        var rb = GetComponent<Rigidbody>(); if (rb) rb.isKinematic = true;
    }

   void DisableNoclip()
    {
        foreach (var c in GetComponentsInChildren<Collider>()) c.enabled = true;
        var rb = GetComponent<Rigidbody>(); if (rb) rb.isKinematic = false;
    }
}
```

## Extending Cheats

This only works at compile time. It is not a good idea to extend cheats during runtime.
Simply create a new file in `Assets/Scripts` (say `GodModeManager.OneHitKill.cs`), that extend the partial class `GodModeManager` and implement 2 things:

1. The public flag of the cheat that can be read in gameplay code (`publid static bool XX`)
2. Register the extra cheat

```cs title="GodModeManager.OneHitKill.cs"
// adds "OneHitKill" at compile time (no runtime registration allowed).

using UnityEngine;

public static partial class GodModeManager
{
    // 1. public flag you can read in gameplay code
    public static bool OneHitKill { get; private set; }

    // 2. register this cheat during bootstrap
    static partial void RegisterExtraCheats()
    {
        AddCheat(
            "OneHitKill",                     // name shown in overlay
            "GodModeManager.OneHitKill",      // PlayerPrefs key
            () => OneHitKill,                 // how to read the field
            v => OneHitKill = v,              // how to write the field
            KeyCode.F4                        // optional hotkey
        );
    }
}
```

## Usage with New API (Extended Cheats)

```cs title="Player.cs"

// damage handling
public void ApplyDamage(int dmg)
{
    if (GodModeManager.God) return;                // invulnerable
    if (GodModeManager.OneHitKill) dmg = 999999;   // example usage of new API
    hp = Mathf.Max(0, hp - dmg);
}

// react once when toggled
void OnEnable()  => GodModeManager.OnAnyChange += ApplyCheats;
void OnDisable() => GodModeManager.OnAnyChange -= ApplyCheats;
void Start()     => ApplyCheats();

void ApplyCheats()
{
    if (GodModeManager.Noclip) EnableNoclip(); else DisableNoclip();
}

// implement Enable/DisableNoClip methods afterwards
```

## Testing

Attach this script on any empty GameObject in your Scene to test whether the cheat system is working.

```cs title="GodModeTester.cs"
using UnityEngine;

public class GodModeTester : MonoBehaviour
{
    void OnEnable()
    {
        // Event-based: subscribe once, react whenever ANY cheat changes
        GodModeManager.OnAnyChange += PrintCheats;
    }

    void OnDisable()
    {
        GodModeManager.OnAnyChange -= PrintCheats;
    }

    void Update()
    {
        // Polling: check flags each frame
        if (GodModeManager.God)
            Debug.Log("[GODMODETESTER] Polling: God mode is ON (invulnerable)");
        if (GodModeManager.Infinite)
            Debug.Log("[GODMODETESTER]Polling: Infinite resources are ON");
        if (GodModeManager.Noclip)
            Debug.Log("[GODMODETESTER]Polling: Noclip is ON (collisions disabled)");
        if (GodModeManager.OneHitKill)
            Debug.Log("[GODMODETESTER]Polling: OneHitKill is ON (killing enabled)");

    }

    // Event-based: called automatically when any cheat flips
    void PrintCheats()
    {
        Debug.Log($"[GODMODETESTER][OnAnyChange] Cheats now: " +
                  $"God={GodModeManager.God}, " +
                  $"Infinite={GodModeManager.Infinite}, " +
                  $"Noclip={GodModeManager.Noclip} " +
                  $"OneHitKill={GodModeManager.OneHitKill}");
    }
}
```
