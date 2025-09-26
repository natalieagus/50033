---
sidebar_position: 5
---

import CollapsibleAnswer from '@site/src/components/CollapsibleAnswer';
import DeepDive from '@site/src/components/DeepDive';
import ImageCard from '@site/src/components/ImageCard';
import ChatBaseBubble from "@site/src/components/ChatBaseBubble";

# Creating Helper Buttons in Inspector

During development, you would frequently want to test and call a function that damages the Player, that triggers GameOver state, etc. They require certain conditions before they can be run, and you might need to spend time setting up the environment/conditions each time during Play Mode to test that function.

To save time, you can tie that function to a button in the Inspector and call that function directly during Play mode.

For example, suppose we have this regular MonoBehavior script that creates and kill characters on the Scene:

```cs title="CharacterCreator.cs"

using System.Collections.Generic;
using System.Linq;
using UnityEngine;
using UnityEngine.TextCore.Text;

public class CharacterCreator : MonoBehaviour
{

    public GameObject characterPrefab;
    public Vector3[] location;

    private List<GameObject> characterList = new List<GameObject>();


    public void SpawnCharacter()
    {
        characterList.Add(Instantiate(characterPrefab, location[Random.Range(0, location.Length)], Quaternion.identity));


    }

    public void KillOneCharacter()
    {
        if (characterList.Count > 0)
        {
            GameObject last = characterList[characterList.Count - 1];
            characterList.RemoveAt(characterList.Count - 1);
            Destroy(last);

        }
    }
}

```

We want to attach this script to a GameObject on the scene and then call the two functions `SpawnCharacter` and `KillOneCharacter` independently:
<ImageCard path={require("/resources/general/images/helper-buttons/2025-09-26-09-36-25.png").default} widthPercentage="100%"/>

## Create an Editor Script

Firstly, create the folder `/Assets/Editor/` in your Project, and create a new C# script in `Editor`. Name it something that relates to the script inspector you want to modify above and create the corresponding class inheriting the `Editor` Class.

For instance:

```cs title="CharacterCreatorEditor"

#if UNITY_EDITOR
using UnityEngine;
using UnityEditor;

[CustomEditor(typeof(CharacterCreator))]
[CanEditMultipleObjects]
public class CharacterCreatorEditor : Editor
{

    public override void OnInspectorGUI()
    {
        // Draw default inspector first
        DrawDefaultInspector();

        // Add some spacing
        EditorGUILayout.Space();

        if (GUILayout.Button("Generate Character"))
        {
            foreach (var t in targets)
            {
                ((CharacterCreator)t).SpawnCharacter();
            }
        }

        // Button 2
        if (GUILayout.Button("Kill Character"))
        {
            foreach (var t in targets)
                ((CharacterCreator)t).KillOneCharacter();
        }


    }
}
#endif
```

You need to import `UnityEditor` in order for this to work.

### Class Attributes

`[CustomEditor(typeof(CharacterCreator))]`:

- This tells Unity that the class you are writing (the custom editor script) is an inspector override for the `CharacterCreator` component.
- When you select a GameObject with a `CharacterCreator` script attached, Unity will use your custom Editor class (instead of the default inspector) to draw and handle the inspector UI.

`[CanEditMultipleObjects]`:

- By default, Unity’s custom inspectors only work on **one** selected object at a time.
- This attribute makes your custom editor support editing multiple objects **simultaneously** (multi-object editing).
- For example, if you select 3 GameObjects that each have a `CharacterCreator` script, changes you make in the inspector will apply to all 3 at once.

### Override OnInspectorGUI

This overrides Unity’s default inspector drawing for the target component (`CharacterCreator`). Unity calls this every time the inspector window needs to repaint.

You would typically want to draw default inspector first, and then put your new buttons below.

### Draw Buttons

The two `if` lines creates a clickable button in the inspector labeled `Generate Character` and `Kill Character` respectively. If clicked, it loops over **all** selected objects (targets comes from `[CanEditMultipleObjects]`), casts each to `CharacterCreator,` and calls its method `SpawnCharacter()` or `KillOneCharacter()`.

### Summary

The `CharacterCreatorEditor` script gives you an inspector where you _see_ the usual CharacterCreator fields, plus **two** buttons: one to spawn a character and another to kill one. If multiple CharacterCreator components are selected, the buttons affect all of them.

## Generic Debut Button Generator Editor Script

This section is written if you'd like to implement this functionality to ANY gameobject and not needing to create an Editor script for each script you want to debug. The idea is simple:

1. You can add an attribute like [DebugButton] on top of any method in your MonoBehavior script and you should see buttons created automatically in the Inspector
2. The method can support simple primitives, enums, and object references
3. Still works with multi-object selection

### Create `InspectorButtonAttribute.cs`

Put this in a `Scripts/Utils` folder (anywhere inside Scripts also works, since it’s just an attribute).

```cs title="InspectorButtonAttribute.cs"
using UnityEngine;
using System;
namespace Game.DebugTools
{
    /// <summary>
    /// Marks a method to be drawn as a button in the Unity inspector.
    /// </summary>
    [AttributeUsage(AttributeTargets.Method, Inherited = true)]
    public class InspectorButtonAttribute : PropertyAttribute { }
}

```

:::note
We use custom namespace to avoid clashing with other libraries.
:::

### Create `InspectorButtonEditor.cs`

This one must go inside an `Editor/` folder in your Unity project (e.g., `Assets/Scripts/Editor/` or `Assets/Editor`).

:::note
Unity only compiles editor scripts if they’re in an Editor folder.
:::

```cs title="InspectorButtonEditor.cs"
using UnityEngine;
using UnityEditor;
using System.Reflection;
using System.Collections.Generic;
using System.Linq;
using Game.DebugTools;

// works on ANY GameObject
[CustomEditor(typeof(MonoBehaviour), true)]
[CanEditMultipleObjects]
public class InspectorButtonEditor : Editor
{
    // cache parameter values per method
    private Dictionary<string, object[]> methodParams = new Dictionary<string, object[]>();

    public override void OnInspectorGUI()
    {
        DrawDefaultInspector();
        EditorGUILayout.Space();

        var type = target.GetType();
        var methods = type.GetMethods(BindingFlags.Instance | BindingFlags.Public | BindingFlags.NonPublic);

        foreach (var method in methods)
        {
            if (!System.Attribute.IsDefined(method, typeof(InspectorButtonAttribute)))
                continue;

            var parameters = method.GetParameters();
            string methodKey = type.FullName + "." + method.Name;

            if (!methodParams.ContainsKey(methodKey))
                methodParams[methodKey] = new object[parameters.Length];

            EditorGUILayout.BeginVertical("box");
            EditorGUILayout.LabelField(ObjectNames.NicifyVariableName(method.Name), EditorStyles.boldLabel);

            for (int i = 0; i < parameters.Length; i++)
            {
                var p = parameters[i];
                object currentValue = methodParams[methodKey][i];
                methodParams[methodKey][i] = DrawParameterField(p, currentValue);
            }

            if (GUILayout.Button("Run"))
            {
                foreach (var t in targets)
                {
                    method.Invoke(t, methodParams[methodKey]);
                    EditorUtility.SetDirty(t);
                }
            }

            EditorGUILayout.EndVertical();
        }
    }

    private object DrawParameterField(ParameterInfo p, object value)
    {
        var type = p.ParameterType;

        // arrays and lists
        if (type.IsArray || (type.IsGenericType && type.GetGenericTypeDefinition() == typeof(List<>)))
        {
            System.Type elementType = type.IsArray ? type.GetElementType() : type.GetGenericArguments()[0];

            // convert to list
            var list = new List<object>();
            if (value is System.Array arr)
                list.AddRange(arr.Cast<object>());
            else if (value is System.Collections.IEnumerable enumerable && !(value is string))
                foreach (var item in enumerable) list.Add(item);

            EditorGUILayout.BeginVertical("box");
            int newSize = EditorGUILayout.IntField($"{p.Name} Size", list.Count);

            while (newSize > list.Count) list.Add(GetDefault(elementType));
            while (newSize < list.Count) list.RemoveAt(list.Count - 1);

            for (int i = 0; i < list.Count; i++)
                list[i] = DrawFieldForType(elementType, list[i], $"{p.Name} [{i}]");

            EditorGUILayout.EndVertical();

            if (type.IsArray)
                return list.ToArray();
            else
            {
                var genericList = (System.Collections.IList)System.Activator.CreateInstance(type);
                foreach (var item in list) genericList.Add(item);
                return genericList;
            }
        }

        // single field
        return DrawFieldForType(type, value, p.Name);
    }

    private object DrawFieldForType(System.Type type, object value, string label)
    {
        // primitive params
        if (type == typeof(int))
            return EditorGUILayout.IntField(label, (int)(value ?? 0));

        if (type == typeof(float))
            return EditorGUILayout.FloatField(label, (float)(value ?? 0f));

        if (type == typeof(bool))
            return EditorGUILayout.Toggle(label, (bool)(value ?? false));

        if (type == typeof(string))
            return EditorGUILayout.TextField(label, (string)(value ?? ""));

        // enum and object reference
        if (type.IsEnum)
            return EditorGUILayout.EnumPopup(label, (System.Enum)(value ?? System.Enum.GetValues(type).GetValue(0)));

        if (typeof(UnityEngine.Object).IsAssignableFrom(type))
            return EditorGUILayout.ObjectField(label, (UnityEngine.Object)value, type, true);

        // Unity extended types
        if (type == typeof(Vector2))
            return EditorGUILayout.Vector2Field(label, value != null ? (Vector2)value : Vector2.zero);

        if (type == typeof(Vector3))
            return EditorGUILayout.Vector3Field(label, value != null ? (Vector3)value : Vector3.zero);

        if (type == typeof(Vector4))
            return EditorGUILayout.Vector4Field(label, value != null ? (Vector4)value : Vector4.zero);

        if (type == typeof(Color))
            return EditorGUILayout.ColorField(label, value != null ? (Color)value : Color.white);

        if (type == typeof(LayerMask))
            return EditorGUILayout.LayerField(label, (int)(value ?? 0));

        EditorGUILayout.LabelField($"{label} (Unsupported: {type.Name})");
        return value;
    }

    private object GetDefault(System.Type type)
    {
        if (type.IsValueType) return System.Activator.CreateInstance(type);
        return null;
    }
}

```

### Example Usage

Simply add the `[DebugButton]` attribute on a method in any MonoBehavior script. For example:

```cs title="CharacterCreatorAdvanced.cs"
using UnityEngine;
using System.Collections.Generic;
using Game.DebugTools;

public enum HeroType { Warrior, Mage, Rogue }

public class CharacterCreatorAdvanced : MonoBehaviour
{
    [InspectorButton]
    public void NoParams()
    {
        Debug.Log("No params called");
    }

    [InspectorButton]
    public void WithPrimitives(int count, float power, bool active, string name)
    {
        Debug.Log($"Primitives -> count:{count}, power:{power}, active:{active}, name:{name}");
    }

    [InspectorButton]
    public void WithEnum(HeroType hero)
    {
        Debug.Log($"Enum -> {hero}");
    }

    [InspectorButton]
    public void WithUnityTypes(GameObject obj, ScriptableObject asset, Color color, Vector3 pos)
    {
        Debug.Log($"UnityTypes -> {obj?.name}, {asset?.name}, color:{color}, pos:{pos}");
    }

    [InspectorButton]
    public void WithCollections(int[] numbers, List<GameObject> objects)
    {
        Debug.Log($"Collections -> numbers:{string.Join(",", numbers)}, objects:{string.Join(",", objects)}");
    }
}

```

### Demo

Attach the CharacterCreatorAdvanced script to any GameObject. You should see the following interface. Hopefully that makes your testing easier:

<ImageCard path={require("/resources/general/images/helper-buttons/2025-09-26-10-47-19.png").default} widthPercentage="100%"/>
