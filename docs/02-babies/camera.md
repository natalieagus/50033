---
sidebar_position: 2
---

import CollapsibleAnswer from '@site/src/components/CollapsibleAnswer';
import DeepDive from '@site/src/components/DeepDive';
import ImageCard from '@site/src/components/ImageCard';
import ChatBaseBubble from '@site/src/components/ChatBaseBubble';
import VideoItem from '@site/src/components/VideoItem';
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Camera Movement

We want the Camera follow the player, but clamped so that it doesn’t go out of screen too much the left or too much the right. Create a new script called `CameraController.cs` and declare the following variables:

### CameraController

```cs title="CameraController.cs"
using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class CameraController : MonoBehaviour
{

    public Transform player; // Mario's Transform
    public Transform endLimit; // GameObject that indicates end of map
    private float offset; // initial x-offset between camera and Mario
    private float startX; // smallest x-coordinate of the Camera
    private float endX; // largest x-coordinate of the camera
    private float viewportHalfWidth;

}

```

### ViewportToWorldPoint

In the `Start()` method, we need to get the **world** coordinate of the bottom-left point of the Camera’s viewport using `ViewportToWorldPoint`. The camera's viewport has its own **local coordinate system**, where `(0,0)` **means** the **bottom left** corner of the Camera's viewport. The reason we do this is because we need to find out what exactly is the width of the camera's **viewport** by taking the difference between the global coordinate of the camera's `bottomLeft` viewport position and Mario's transform `x` position. This way, we can keep the camera "centered" (or focused) on the player.

```cs title="CameraController.cs"
using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class CameraController : MonoBehaviour
{

    void  Start()
    {
        //highlight-start
        // get coordinate of the bottomleft of the viewport
        // z doesn't matter since the camera is orthographic
        Vector3 bottomLeft =  Camera.main.ViewportToWorldPoint(new  Vector3(0, 0, 0)); // the z-component is the distance of the resulting plane from the camera 
        viewportHalfWidth  =  Mathf.Abs(bottomLeft.x  -  this.transform.position.x);
        offset  =  this.transform.position.x  -  player.position.x;
        startX  =  this.transform.position.x;
        endX  =  endLimit.transform.position.x  -  viewportHalfWidth;
        //highlight-end
    }
}

```

:::note 
You might find [this documentation](https://docs.unity3d.com/ScriptReference/Camera.ViewportToWorldPoint.html) useful to explain the workings of `ViewportToWorldPoint`. 
:::

Then under the `Update()` method, the camera constantly follows the player unless it has reached the ends of the game map:

```cs title="CameraController.cs"
using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class CameraController : MonoBehaviour
{

    void  Update()
    {
        //highlight-start
        float desiredX =  player.position.x  +  offset;
        // check if desiredX is within startX and endX
        if (desiredX  >  startX  &&  desiredX  <  endX)
        this.transform.position  =  new  Vector3(desiredX, this.transform.position.y, this.transform.position.z);
        //highlight-end
    }
}
```

### StartLimit and EndLimit

Create an empty GameObject called `EndLimit` with an EdgeCollider2D to prevent Mario from going over too much to the right. You can do the same for the left side as well, right at the left side of the Camera’s ViewPort. In the clip below, we name it `StartLimit`. Then in the Camera’s inspector, link up the references of Mario’s Transform and EndLimit’s Transform:

<VideoItem path={"https://50033.s3.ap-southeast-1.amazonaws.com/week-2/movecamera.mp4"} widthPercentage="100%"/>

:::playtest
Test run and you shall have the Camera gracefully following Mario around the Scene.
:::

### Reset Camera

When Mario dies due to collision with Goomba, we now need to also reset the Camera's position back to where it started (at `0,0,-10`). Add the following code inside `ResetGame` in `PlayerMovement.cs`, and **don't forget** to hook up Camera's transform to this script in the **inspector**.

```cs title="PlayerMovement.cs"
//highlight-start
    public Transform gameCamera;
//highlight-end

    public void ResetGame()
    {
        // reset position
        marioBody.transform.position = new Vector3(-5.33f, -4.69f, 0.0f);

        // other code

        //highlight-start
        // reset camera position
        gameCamera.position = new Vector3(0, 0, -10);
//highlight-end

    }

```
