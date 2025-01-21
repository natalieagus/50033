---
sidebar_position: 2
---

import CollapsibleAnswer from '@site/src/components/CollapsibleAnswer';
import DeepDive from '@site/src/components/DeepDive';
import ImageCard from '@site/src/components/ImageCard';
import ChatBaseBubble from "@site/src/components/ChatBaseBubble";

# Tilemap

:::info
**Unity Tilemap** is a feature of the Unity game engine designed to simplify the creation and management of 2D grid-based environments. It allows developers to create and edit tile-based worlds efficiently, making it particularly useful for games like platformers, RPGs, puzzle games, or any game that relies on a grid-like structure. You can read the official tutorial [here](https://learn.unity.com/tutorial/introduction-to-tilemaps#5f35935dedbc2a0894536cfe).
:::

Here's a good [tutorial](https://notslot.com/tutorials/2022/10/unity-tilemap) to begin exploring tilemap. The screenshots below are taken from this tutorial.

## Key Terminologies

Below is the summary of the key terminologies regarding Tilemap in Unity.

### Grid System

Unity Tilemap uses the **Grid component** to define a structured layout for placing tiles. It supports rectangular, isometric, and hexagonal grids, making it suitable for various game types.

<ImageCard path={require("/resources/images/tilemap/2025-01-21-23-48-50.png").default} widthPercentage="100%"/>

### Tile Palette

The **Tile Palette** is a collection of reusable tiles created from 2D sprite assets. Developers can paint these tiles directly onto the Tilemap for efficient level design.

<ImageCard path={require("/resources/images/tilemap/2025-01-21-23-49-07.png").default} widthPercentage="100%"/>

### Tilemap Renderer

The [**Tilemap Renderer**](https://docs.unity3d.com/6000.0/Documentation/Manual/tilemaps/work-with-tilemaps/tilemap-renderer-reference.html) controls how the tiles are displayed in the scene. It supports sorting layers, transparency, and blending for a polished visual presentation.

<ImageCard path={require("/resources/images/tilemap/2025-01-21-23-50-58.png").default} widthPercentage="100%"/>

### Scriptable Tiles

[Scriptable tiles](https://docs.unity3d.com/6000.0/Documentation/Manual/tilemaps/tiles-for-tilemaps/scriptable-tiles/create-scriptable-tile.html) are tiles that you can assign behavior scripts to and you can paint with the scriptable tiles on a Tilemap component. These tiles allow developers to define unique behaviors like animations, interactions, or triggers, adding dynamic functionality to the game world.

### Collision and Physics

The [**Tilemap Collider**](https://docs.unity3d.com/6000.0/Documentation/Manual/tilemaps/work-with-tilemaps/tilemap-collider-2d-reference.html) component automatically generates colliders for tiles, enabling seamless integration with Unity's physics system for collision detection.

<ImageCard path={require("/resources/images/tilemap/2025-01-21-23-53-19.png").default} widthPercentage="100%"/>

### Layered Tilemaps

Multiple Tilemaps can be **stacked** on different layers, enabling the creation of **backgrounds**, **foregrounds**, and **interactable** elements in a single scene. Watch [this](https://www.youtube.com/watch?v=m_NjNJ7N11Q) short tutorial (screenshot from the video).

<ImageCard path={require("/resources/images/tilemap/2025-01-21-23-56-05.png").default} widthPercentage="100%"/>

### Optimization

Unity Tilemaps are highly optimized, allowing efficient rendering and management of large grids, making them ideal for performance-sensitive 2D games.

## Summary

Use **Unity Tilemap** for grid-based layouts where environments follow a structured, consistent grid, such as in platformers, RPGs, or puzzle games.

- It is great in creating large, repetitive worlds efficiently by optimizing memory and performance for tiled assets
- Particularly useful for <span class="orange-bold">quick level design</span>, allowing us to paint large environments directly in the editor using the Tile Palette.
- Simplifies collision setup and layering for games with multiple background, foreground, and interactive elements.

> **Example**: _Super Mario Bros, Terraria, Stardew Valley_

<br/>
Use **individual sprites** when designing **unique**, **non-repetitive elements** that are not bound to a grid, such as detailed characters, standalone props, or complex objects.

- Sprites are better suited for **freeform** environments or when precise control over placement, animations, or interactions is required
- They work well in scenes where the focus is on unique visuals or objects that move independently of a grid structure.

> **Example**: _Hollow Knight, Cuphead, Celeste_ (unique environmental feature, hybrid)
