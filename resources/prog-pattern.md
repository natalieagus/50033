---
sidebar_position: 3
---

import CollapsibleAnswer from '@site/src/components/CollapsibleAnswer';
import DeepDive from '@site/src/components/DeepDive';
import ImageCard from '@site/src/components/ImageCard';
import ChatBaseBubble from "@site/src/components/ChatBaseBubble";

# Game Programming Patterns

This section provides curated resources for improving game code structure and maintainability.

Programming patterns **enhance** code organization, reusability, and performance while ensuring maintainability. They streamline development, making larger game projects like our 1D project more collaborative and scalable by providing structured, efficient solutions to common coding challenges. It is also easier to finetune during the User Testing stage.

There are two resources that are recommended:

- Unity’s official blog post on game programming patterns.
- _Game Programming Patterns_ book by Robert Nystrom.

## Unity Blog: "Level Up Your Code with Game Programming Patterns"\*\*

📌 **[Link to article](https://unity.com/blog/games/level-up-your-code-with-game-programming-patterns)**

This article provides an **overview** of how game programming patterns apply in Unity. It includes links to **examples** of practical implementations using Unity's ecosystem, as well as best practices to avoid common pitfalls.

[The demo repository can be found here](https://github.com/Unity-Technologies/game-programming-patterns-demo), and the [full 100-page e-book can be found here](https://unity.com/resources/level-up-your-code-with-game-programming-patterns). The demo code is complementary to the book and serves as an excellent resource to explore common programming principles like SOLID and concepts such as KISS and DRY.

### **Highlighted Patterns & Unity Applications**

1. **Singleton Pattern**

   - Useful for managing global states (e.g., Game Manager, Audio Manager).
   - Implementing in Unity: Using `DontDestroyOnLoad()`, thread-safe singletons.
   - Caution: Avoid overusing singletons to prevent dependency issues.

2. **Object Pooling**

   - Efficient memory management for frequently spawned objects (e.g., bullets, enemies).
   - Unity Implementation: `Queue<T>`, preloaded GameObjects in a pool.
   - Performance benefits: Reduces Garbage Collection (GC) overhead.

3. **Event-Driven Architecture (Observer Pattern)**

   - Ideal for decoupling UI updates, game state changes.
   - Unity’s approach: `C# Events & Delegates`, `UnityEvent`.
   - Example: Player health changes triggering UI updates.

4. **Command Pattern**

   - Used for input handling and undo systems.
   - Unity Use Case: Input abstraction via `ScriptableObject` architecture.
   - Benefits: Allows for flexible control remapping and AI-assisted gameplay.

5. **State Pattern**

   - Manages AI behavior, character animations, and game phases.
   - Unity Integration: `State Machines`, `Animator Controllers`, `Switch Case` pattern.
   - Example: Enemy AI transitioning between patrol, chase, and attack states.

6. **Service Locator Pattern**
   - Alternative to Singletons for dependency management.
   - Unity Use Case: Centralized service retrieval (e.g., Audio, UI, Input Systems).
   - Reduces direct dependencies and improves modularity.

---

## Game Programming Patterns by Robert Nystrom

📌 **[Link to book](https://gameprogrammingpatterns.com/contents.html)**

Game Programming Patterns is a collection of patterns the author found in games that make code **cleaner**, **easier** to understand, and **faster**. He found that many programmers don't usually go past Singleton in terms of game architecture, which is a decent architecture but there are far better ones. He curated and polished the best patterns he's found in games, listed below.

### **Recommended Patterns & Their Unity Applications**

1. **Game Loop**

   - Fundamental for structuring update cycles in Unity.
   - Unity Implementation: `Update()`, `FixedUpdate()`, `LateUpdate()`.
   - Best Practices: Avoid logic in `FixedUpdate()` unless physics-related.

2. **Component Pattern**

   - Core of Unity’s Entity-Component System (ECS).
   - Encourages modular and reusable behaviors (`MonoBehaviours`).
   - Example: Attaching movement, health, and AI components to different entities.

3. **Event Queue**

   - Manages asynchronous game events like cutscenes and UI transitions.
   - Unity Implementation: `Coroutines`, `Event Handlers`, `ScriptableObjects`.

4. **Flyweight Pattern**

   - Optimizes memory usage for repeated objects (e.g., tile maps, projectiles).
   - Unity Example: Using `ScriptableObjects` for shared data instances.

5. **Prototype Pattern**

   - Useful for creating variations of objects efficiently.
   - Unity Example: Cloning GameObjects at runtime (`Instantiate()`).

6. **Spatial Partitioning**

   - Improves performance in large worlds.
   - Unity Use Case: Quadtrees, Grid-based partitioning for collision detection.

7. **Dirty Flag**

   - Efficiently updates only necessary changes in large-scale systems.
   - Unity Example: UI optimizations, selective game state updates.

8. **Bytecode Pattern**
   - Useful for scripting systems within games.
   - Unity Example: Implementing an in-game scripting engine (e.g., Lua, Ink for dialogue).

## Practical Implementation Tips

Here are the summarized practical implementation tips from both sources:

1. Decoupling game logic using `C# Events & Delegates` helps reduce tight coupling, making code more modular and easier to maintain.
2. To optimize performance, avoid excessive `Update()` calls and use `Coroutines` where appropriate to manage tasks efficiently.
3. For large-scale games, Unity’s [Entity Component System (ECS)](https://docs.unity3d.com/Packages/com.unity.entities@1.3/manual/index.html) provides a **data-oriented approach** (as opposed to object-oriented) that significantly improves performance. We are talking thousands or millions of game objects components.
4. Debugging and profiling tools like Unity’s **Profiler**, **Deep Profiling**, and **Frame Debugger** are essential for identifying bottlenecks and optimizing game performance.

{:.info}
Use **ECS** when you need to handle thousands of game objects efficiently (e.g., mass enemy AI, particle systems, procedural world generation). Use **ScriptableObjects** when you need centralized, reusable game data (e.g., character stats, ability configs, game settings). They can be used together, for example, an ECS system might **process** enemies, but their individual **stats** could be stored in ScriptableObjects.

## Conclusion and Further Learning

Patterns are essential for writing scalable and maintainable game code, but knowing when<span class="orange-bold"></span> and <span class="orange-bold">how</span> to apply them is crucial for effective development.
Understanding their pros and cons allows us to build efficient, well-structured systems.

For further learning, the **[Unity Scripting API](https://docs.unity3d.com/ScriptReference/)** provides in-depth documentation, while **[Unity Learn](https://learn.unity.com/)** offers hands-on tutorials. Books like _Game Programming Gems_ (read review on [reddit here](https://www.reddit.com/r/gamedev/comments/35ptf1/game_programming_gems/?rdt=53994)) and _Clean Code_ (read [github gist](https://gist.github.com/wojteklu/73c6914cc446146b8b533c0988cf8d29) here) are also valuable resources for mastering game architecture and best coding practices.
