---
sidebar_position: 5
---

import CollapsibleAnswer from '@site/src/components/CollapsibleAnswer';
import DeepDive from '@site/src/components/DeepDive';
import ImageCard from '@site/src/components/ImageCard';
import ChatBaseBubble from '@site/src/components/ChatBaseBubble';
import VideoItem from '@site/src/components/VideoItem';
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Building Your Game

It is always a great idea to **incrementally** build your game. In fact, make it at least a _weekly_ habit for your project. It is also an opportunity to test your game. This is because it would be very hard to debug _what's wrong_ with your game if some features are available on Editor but not on Build.

## Build Setting / Profile

Unity provides a very simple UI to build your game. Simply go to File >> Build Profile/Build Setting (depending on OS):

<ImageCard path={require("/docs/04-children/images/building/2025-09-26-16-03-23.png").default} widthPercentage="100%"/>

### Add or Edit Scenes

Click `Open Scene List` to add more scenes. Then simply **drag** the scenes from your `Project` window as follows:

<ImageCard path={require("/docs/04-children/images/building/Screenshot 2025-09-26 at 4.01.45 PM.png").default} widthPercentage="100%"/>

### Reorder Scene

You can highlight and drag each Scene around to ensure that the order makes sense:

<ImageCard path={require("/docs/04-children/images/building/2025-09-26-16-03-06.png").default} widthPercentage="100%"/>

### Build

Finally, choose the platform that you want and click `Build`:

<ImageCard path={require("/docs/04-children/images/building/2025-09-26-16-05-12.png").default} widthPercentage="100%"/>

## Test for Bugs

Ensure that you have a list of **features** that you want to playtest with the actual build. Sometimes, things might work in the Editor but not during build. This is likely due to user error (misunderstanding).

Here are the following common issues that we have found so far. This list is not exhaustive. You are free to make a PR if you found new ones.

### Assets & Build Content

<span class="orange-bold">Scene not in build settings</span>: Works when you hit Play, but `SceneManager.LoadScene("X")` fails in build. <br/>**Fix:** Add scenes to **File >> Build Settings…** or load by the included build index.

<span class="orange-bold">Using `unityeditor` APIs at runtime</span>: Any `UnityEditor.*` or `AssetDatabase` call compiles in Editor but is missing in builds. <br/>**Fix:** Gate with `#if UNITY_EDITOR` or replace with Resources, Addressables, or serialized references.

<span class="orange-bold">`#if unity_editor` hides real load paths</span>: Editor-only code runs correctly while the player path is broken. <br/>**Fix:** Test the non editor path inside the Editor with a toggle or consolidate to one runtime safe path.

<span class="orange-bold">Resources or Addressables not included or not built</span>: `Resources.Load` returns null or Addressables fail. <br/>**Fix:** Place assets under `Resources`, mark Addressable, build Addressables, and verify catalog or profile URLs.

<span class="orange-bold">Implicit references stripped</span>: Assets only referenced via strings or reflection are not bundled. <br/>**Fix:** Keep strong references in a linker ScriptableObject or MonoBehaviour or use Addressables labels.

<span class="orange-bold">Tag or layer mismatches</span>: Code checks a tag or layer that is not present in the shipped project. <br/>**Fix:** Audit **Project Settings >> Tags and Layers** for parity.

### Code & Compilation

<span class="orange-bold">Managed code stripping breaks reflection</span>: The linker removes types used via reflection, JSON, or the new Input System. <br/>**Fix:** Add a `link.xml`, use `[Preserve]`, or relax stripping temporarily to confirm.

<span class="orange-bold">Aot generics on il2cpp</span>: Generic methods only invoked via reflection fail on iOS or consoles. <br/>**Fix:** Instantiate representative generic types at compile time or keep them via `link.xml`.

<span class="orange-bold">Editor or runtime assembly leaks</span>: A runtime asmdef references an Editor only asmdef. <br/>**Fix:** Split Editor and Runtime assemblies and set Include Platforms correctly.

<span class="orange-bold">Editor only initialization attributes</span>: `[InitializeOnLoad]` or `ExecuteInEditMode` logic does not run in player. <br/>**Fix:** Use `[RuntimeInitializeOnLoadMethod]` or a bootstrap scene.

<span class="orange-bold">Script execution order assumptions</span>: Editor timing masks races that appear in build. <br/>**Fix:** Remove order coupling and explicitly initialize dependencies.

<span class="orange-bold">Domain reload differences</span>: Static state persists between Editor plays while builds start clean. <br/>**Fix:** Initialize all static fields on load and do not rely on Editor reload behavior.

### File I/O & Paths

<span class="orange-bold">Writing into `application.datapath`</span>: This works on disk in Editor but is read only in builds. <br/>**Fix:** Write to `Application.persistentDataPath` and ship read only files via `StreamingAssets`.

<span class="orange-bold">Loading `streamingassets` on android or ios</span>: Direct `File` access fails because the data is inside the package. <br/>**Fix:** Use `UnityWebRequest` or a platform correct loader for `StreamingAssets`.

<span class="orange-bold">Case sensitivity</span>: Paths work on Windows or macOS but fail on Android or Linux. <br/>**Fix:** Match filename case exactly in code and data.

<span class="orange-bold">Playerprefs not saved</span>: Data appears to vanish after quit or crash. <br/>**Fix:** Call `PlayerPrefs.Save()` at safe points.

### Platform & Permissions

<span class="orange-bold">Missing runtime permissions</span>: Camera, microphone, gallery, location, or Bluetooth work in Editor but not on device. <br/>**Fix:** Add iOS Info.plist usage strings and Android permissions and request them at runtime.

<span class="orange-bold">Http blocked by transport security</span>: Http calls work locally while the device or OS blocks cleartext. <br/>**Fix:** Use https or configure ATS on iOS or Network Security Config on Android when unavoidable.

<span class="orange-bold">Input system mismatch</span>: New Input APIs are used while Player is set to the old input. <br/>**Fix:** Set Active Input Handling to Both or New and regenerate actions per target.

### Serialization & Data

<span class="orange-bold">Non serialized fields lost</span>: References assigned in Editor are not serialized for player. <br/>**Fix:** Mark fields with `[SerializeField]` and validate with pre build checks.

<span class="orange-bold">Reflection heavy json or binaryformatter</span>: This breaks under IL2CPP or AOT or gets stripped. <br/>**Fix:** Use Newtonsoft with `link.xml` and `[Preserve]` or Unity `JsonUtility` with simple POCOs.

<span class="orange-bold">Prefab or variant drift</span>: Built content uses a different prefab or variant than the one you tested. <br/>**Fix:** Verify which asset loads at runtime and reduce hidden overrides.

### Timing, Threads & Lifecycle

<span class="orange-bold">Using Unity API from background threads</span>: This sometimes works in Editor but crashes or no ops in player. <br/>**Fix:** Marshal calls to the main thread using a `SynchronizationContext`.

<span class="orange-bold">Coroutine races</span>: A faster player frame rate exposes ordering bugs. <br/>**Fix:** Await explicit readiness and avoid relying on frame delays.

<span class="orange-bold">`dontdestroyonload` duplicates</span>: Multiple singletons survive across scene loads. <br/>**Fix:** Add robust singleton guards and instance handoff.

### Graphics & Shaders

<span class="orange-bold">Shader variant stripping</span>: Runtime keywords are used while variants are removed in the build. <br/>**Fix:** Add a Shader Variant Collection or Always Included shaders and prewarm if needed.

<span class="orange-bold">Mismatched graphics APIs</span>: The Editor uses DirectX 11 while the player uses Metal, Vulkan, or OpenGL ES. <br/>**Fix:** Align the target Graphics APIs and gate features per platform.

<span class="orange-bold">Srp asset not assigned</span>: URP or HDRP looks fine in Editor but is broken in build. <br/>**Fix:** Assign the correct Render Pipeline Asset in Graphics and Quality settings.

<span class="orange-bold">Tmp or fonts or materials missing</span>: Editor auto fallbacks hide missing assets. <br/>**Fix:** Include TextMeshPro resources and explicit font assets.

### Networking & Backends

<span class="orange-bold">Cors or webgl restrictions</span>: Local tests pass while the browser blocks cross origin requests in build. <br/>**Fix:** Configure server CORS and use https and same origin rules for WebGL.

<span class="orange-bold">Addressables remote content not deployed</span>: The player cannot find the catalog or bundles. <br/>**Fix:** Build and upload content for the correct profile and verify remote URLs and clear the cache.

<span class="orange-bold">Tls or certificate issues on device</span>: Calls work on the dev box but fail on mobile or console. <br/>**Fix:** Use valid certificate chains and avoid self signed certificates in production.

### UI & Events

<span class="orange-bold">Missing or multiple eventsystems</span>: UI does not respond or behaves erratically. <br/>**Fix:** Ensure exactly one EventSystem exists in the active scene.

<span class="orange-bold">Wrong input module</span>: Touch and mouse differences are mishandled. <br/>**Fix:** Use the correct Input System UI Input Module and test on the target device.

<span class="orange-bold">Canvas scaling differences</span>: The UI looks fine in the Editor Game view but breaks on the device. <br/>**Fix:** Configure the Canvas Scaler, reference resolution, and anchors for target aspects.

### Build or Player Settings & Misc

<span class="orange-bold">Development only flags</span>: Code behind `#if DEVELOPMENT_BUILD` works in dev builds but not in release. <br/>**Fix:** Do not rely on development only branches for core behavior.

<span class="orange-bold">Scripting define symbols mismatch</span>: Features are compiled in Editor but not in player or the reverse. <br/>**Fix:** Align Player Scripting Define Symbols per target.

<span class="orange-bold">Time scale or vsync differences</span>: Editor window settings mask timing bugs. <br/>**Fix:** Match device frame caps and vsync in testing.

:::note
**Quick Pre Build Audit**

- Search for `UnityEditor`, `AssetDatabase`, `#if UNITY_EDITOR`, `ExecuteInEditMode`, and `InitializeOnLoad`.
- Confirm that all loadable scenes are in Build Settings.
- Ensure anything loaded via string or reflection is in Resources or Addressables or is strongly referenced.
- Provide a `link.xml` or `[Preserve]` for reflection, JSON, Input System, and third party libraries.
- Write to `persistentDataPath` and read packaged files from `StreamingAssets` using platform correct loaders.
- Add mobile permissions and request them at runtime.
- Align the Graphics API, SRP/URP asset, and shader variants.
- Set Active Input Handling properly and test actions on device.
- Initialize static state at runtime and remove execution order assumptions.
- Use a Development Build with Script Debugging and inspect device logs.
  :::

**Good luck!**
