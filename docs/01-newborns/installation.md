---
sidebar_position: 1
---

import CollapsibleAnswer from '@site/src/components/CollapsibleAnswer';
import DeepDive from '@site/src/components/DeepDive';
import ImageCard from '@site/src/components/ImageCard';
import ChatBaseBubble from '@site/src/components/ChatBaseBubble';
import VideoItem from '@site/src/components/VideoItem';
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem'

# Installation and Setup

:::caution Versions
We are using the following versions of Unity editor, `dotnet`, and VSCode extensions:

- [Unity Hub 3.14.0](https://unity.com/download)
- [Unity 6000.0.56f1 LTS](https://unity.com/releases/editor/whats-new/6000.0.56f1#installs)
  - Released on August 2025
  - Installed via Unity Hub
  - Sign in to Unity Hub first and manage your personal license
- [.NET 8.0 Framework](https://dotnet.microsoft.com/en-us/download)
- [VSCode C# Dev Kit v1.50.33](https://marketplace.visualstudio.com/items?itemName=ms-dotnettools.csdevkit)
- [VSCode Unity v1.1.3 Extension](https://marketplace.visualstudio.com/items?itemName=VisualStudioToolsForUnity.vstuc)
  :::

Please install all of the above tools before proceeding.

#### Recommendation

:::info macOS or Linux distros
macOS users are recommended to use Visual Studio Code with the Unity + C# Dev kit extension.
:::

:::info Windows
Windows users are recommended to use Visual Studio instead of VSC. It will be the **default recommended** version when you install Unity from Unity Hub.
:::

### Basic Setup

:::note
**Download the starter asset** from your **course handout**, under "Class Calendar" heading, _Week 1 Lab Session_ row. We do not own any of the assets distributed in this lab, they can all be freely obtained from the Internet, credits are all indicated in the individual sheet/resources.

This is a **starter** asset for this week that you can import to your project and complete the lab. It contains all required images, sound files, etc so we can save time without having to search for all these assets.
:::

### Create New Project

Using UnityHub, create a new 2D project:

<ImageCard path={require("./images/installation/2023-07-25-16-39-08.png").default} widthPercentage="70%"/>

Then, **import** the asset `mario-lab.unitypackage` you downloaded from the Course Handout :
<ImageCard path={require("./images/installation/2023-07-25-16-40-37.png").default} widthPercentage="70%"/>

You should see a list of assets on the Project tab in the Unity editor.

:::warning Unity 6.2
You can create new project using the all new Unity 6.2 in the fall of 2025, but note the changes [here](https://docs.unity3d.com/6000.2/Documentation/Manual/WhatsNewUnity62.html). Some code might not be able to be copy-pasted as-is, but it is not difficult to figure out the new API. <span className="orange-bold">Don't worry</span>.
:::

### Setting up VSCode

Check that `dotnet` is installed properly:

<ImageCard path={require("/docs/01-newborns/images/installation/2025-01-21-23-14-28.png").default} widthPercentage="70%"/>
<br/>

If you're using VSCode, ensure that you install the C# Dev Kit VSCode extension:

<ImageCard path={require("/docs/01-newborns/images/installation/images/installation/csharp-extension.png.png").default} widthPercentage="70%"/>

<br/>

Then add the following to your VSCode `settings.json`:

```json title="[other path]/Code/Usersettings.json"
{
  // ... other settings
  "omnisharp.projectLoadTimeout": 60,

  "omnisharp.useModernNet": true,

  // change this where dotnet sdk is installed
  "omnisharp.sdkPath": "/usr/local/share/dotnet/sdk/8.0.402",
  // change this to where dotnet binary is located (1 level above)
  "dotnet.dotnetPath": "/usr/local/share/dotnet",

  "[csharp]": {
    "editor.defaultFormatter": "ms-vscode.cpptools"
  },

  // for format on save (automatically)
  "editor.formatOnSave": true,
  "[csharp]": {
    "editor.defaultFormatter": "ms-dotnettools.csharp"
  }
}
```

You might want to ignore irrelevant files while opening your project with VSCode. Add the following setting in your project workspace:

```json title=".vscode/settings.json"
    // Configure glob patterns for excluding files and folders.
    "files.exclude": {
        "**/.git": true,
        "**/.DS_Store": true,
        "**/*.meta": true,
        "**/*.*.meta": true,
        "**/*.unity": true,
        "**/*.unityproj": true,
        "**/*.mat": true,
        "**/*.fbx": true,
        "**/*.FBX": true,
        "**/*.tga": true,
        "**/*.cubemap": true,
        "**/*.prefab": true,
        "**/Library": true,
        "**/ProjectSettings": true,
        "**/Temp": true
    }
```

Finally, install the Unity Extension:

<ImageCard path={require("/docs/01-newborns/images/installation/2025-01-14-14-29-46.png").default} widthPercentage="70%"/>

#### Unity: Install Visual Studio Editor Package

Manually update the Visual Studio Editor package in all the Unity projects so that VSCode works with the Unity extension.

Go to Window >> Package Manager and install Visual Studio Editor:

<ImageCard path={require("./images/installation/2023-08-25-11-41-33.png").default} widthPercentage="70%"/>

Go to Unity >> Settings and set Visual Studio Code as your external tools:

<ImageCard path={require("/docs/01-newborns/images/installation/images/installation/2023-08-25-11-43-00.png.png").default} widthPercentage="70%"/>

Generate all `.csproj` files as shown and click **Regenerate Project Files**.

Finally, Completely <span className="orange-bold">quit and restart VSCode</span> and reopen your scripts via Unity. Your intellisense should be good to go:

<ImageCard path={require("./images/installation/2023-08-25-11-47-40.png").default} widthPercentage="70%"/>

:::important
Please contact your TA or instructor if you still can't get your intellisense working, or use another IDE/editor like Visual Studio. Do not program blind for the rest of the semester.
:::

## Completely Quit and Restart VSCode

If you find the following error:

<ImageCard path={require("./images/installation/2023-08-25-11-51-53.png").default} widthPercentage="50%"/>

Please <span className="orange-bold">restart VSCode</span> completely and reopen the script. This is due to the fact that you close VSCode window and it's still running (in the background), and yet you reopen the scripts from Unity. There will be a <span className="orange-bold">conflict</span> in the language server.

You **should** reopen your VSCode window from VSCode itself:

<ImageCard path={require("./images/installation/2023-08-25-11-54-25.png").default} widthPercentage="70%"/>

## Housekeeping

To work better, we need to set up the UI in a more comfortable way. We need at least the following **windows**:

1.  **Inspector** (to have an overview of all elements in a GameObject), set on the right hand side,
2.  Game Hierarchy (to have an overview of all GameObjects in the scene), set on the left hand side
3.  Scene Editor (to add GameObjects and place them), set on the middle of the screen
4.  Then usually we also have the following windows (kept as tabs):
    1.  Project (to show all the files),
    2.  Console (to see printed output)
    3.  Game Screen (to test your game)

Then, go to **Scenes** folder and rename your scene in a way that it makes more sense than “_SampleScene_”. Create **two more folders** called “**Scripts**”, and “**Prefabs**” under "**Assets**". We will learn about them soon.

Here's a suggested layout:

<ImageCard path={require("./images/installation/2023-07-27-08-14-48.png").default} widthPercentage="100%"/>

## Using git

You can use git as per normal and should not need to touch Git LFS for making this short, 15-minute game. Don't forget to add unity-specific `.gitignore` file.

Here's one suggestion, taken [from this source](https://github.com/github/gitignore/blob/main/Unity.gitignore):

```sh title=".gitignore"
# This .gitignore file should be placed at the root of your Unity project directory
#
# Get latest from https://github.com/github/gitignore/blob/main/Unity.gitignore
#

# for vscode
.vscode/*
!.vscode/settings.json
!.vscode/tasks.json
!.vscode/launch.json
!.vscode/extensions.json
!.vscode/*.code-snippets

# Local History for Visual Studio Code
.history/

# Built Visual Studio Code Extensions
*.vsix

/[Ll]ibrary/
/[Tt]emp/
/[Oo]bj/
/[Bb]uild/
/[Bb]uilds/
/[Ll]ogs/
/[Uu]ser[Ss]ettings/

# MemoryCaptures can get excessive in size.
# They also could contain extremely sensitive data
/[Mm]emoryCaptures/

# Recordings can get excessive in size
/[Rr]ecordings/

# Uncomment this line if you wish to ignore the asset store tools plugin
# /[Aa]ssets/AssetStoreTools*

# Autogenerated Jetbrains Rider plugin
/[Aa]ssets/Plugins/Editor/JetBrains*

# Visual Studio cache directory
.vs/

# Gradle cache directory
.gradle/

# Autogenerated VS/MD/Consulo solution and project files
ExportedObj/
.consulo/
*.csproj
*.unityproj
*.sln
*.suo
*.tmp
*.user
*.userprefs
*.pidb
*.booproj
*.svd
*.pdb
*.mdb
*.opendb
*.VC.db

# Unity3D generated meta files
*.pidb.meta
*.pdb.meta
*.mdb.meta

# Unity3D generated file on crash reports
sysinfo.txt

# Builds
*.apk
*.aab
*.unitypackage
*.app

# Crashlytics generated file
crashlytics-build.properties

# Packed Addressables
/[Aa]ssets/[Aa]ddressable[Aa]ssets[Dd]ata/*/*.bin*

# Temporary auto-generated Android Assets
/[Aa]ssets/[Ss]treamingAssets/aa.meta
/[Aa]ssets/[Ss]treamingAssets/aa/*
```

You can read more about how to use Git from this wonderful [article](https://unityatscale.com/unity-version-control-guide/how-to-setup-unity-project-on-github/).

### Force Text Asset Serialization

Go to Edit >> Project Settings in Unity, and set Asset Serialization Mode under Editor tab into Force Text:

<ImageCard path={require("./images/installation/2023-09-13-15-58-00.png").default} widthPercentage="70%"/>

### Git LFS

Git LFS should be used **only** if you need to version **large** files. Normal free-tier GitHub repository can hold as much as 5GB, but 1GB is the recommended size. You can push objects **not more** than 100MB in size. A typical 50.033 project is far less than 1GB in total, given that you use proper `.gitignore` file.

If you still want to use Git LFS because you have complex VFX or SFX, then give [this article a read](https://medium.com/@linojon/git-and-unity-getting-started-ad7c42be8324). Do note the [**billing** information about Git LFS](https://docs.github.com/en/billing/managing-billing-for-git-large-file-storage/about-billing-for-git-large-file-storage) (there's a limit on **bandwidth, not just size**).
