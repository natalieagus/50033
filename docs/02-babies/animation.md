---
sidebar_position: 1
---

import CollapsibleAnswer from '@site/src/components/CollapsibleAnswer';
import DeepDive from '@site/src/components/DeepDive';
import ImageCard from '@site/src/components/ImageCard';
import ChatBaseBubble from '@site/src/components/ChatBaseBubble';
import VideoItem from '@site/src/components/VideoItem';
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Animation

:::caution Lab Checkoff Requirements
The lab handout uses Super Mario Bros as assets to demonstrate certain Unity features and functionalities. You are free to follow along and submit it for checkoff, **OR you can also create an entirely new project to demonstrate the requested feature(s)**.

The requirement(s) for the lab checkoff can be found [here](./checkoff.md).
:::

You can continue from where you left off in the previous Lab. Note that you **need** to finish the previous lab before starting on this one. In this lab we will upgrade our game by adding animation, sound effect, camera movement, and **obstacles** (leveraging on Unity's Physics2D engine) in the game.

## Mario's Animation

Mario’s animation can be broken down into five main states:

- **Idle** state, when he’s not moving at all
- **Running** state, when he’s moving left or right
- **Skidding** state, when he switches direction while running and brake too hard
- **Jumping** state, when he’s off the ground
- **Death** state, when he hits the enemy

> The Mario sprite given in the starter asset already contain the corresponding sprite that’s suitable for each state.

To begin animating a GameObject, we need these things:

- An `Animator` element attached to the GameObject,
- An Animator `Controller` (need to create it in the Project Window under `Assets`),
- and several **Animation Clips** to be managed by the controller.

### Animation Controller

Open the Animation Window (Window >> Animation >> Animation), then click on Mario. You will be then prompted to create an **Animator** for Mario, along with an animation clip. When you click `create`, both are created by default. You can then begin **recording** Mario's changes on each frame/time on the [dopesheet](https://docs.unity3d.com/Manual/animeditor-AdvancedKeySelectionAndManipulation.html). First, create the folders: `Assets/Animation/Mario` to contain all your Mario animation. Then, here's how to create a running Mario animation:

<VideoItem path={"https://50033.s3.ap-southeast-1.amazonaws.com/week-2/create-mario-anim-run.mp4"} widthPercentage="100%"/>

### Animation Clips

Now create three more animation **clips** for idle, skidding, and jumping:

<VideoItem path={"https://50033.s3.ap-southeast-1.amazonaws.com/week-2/create-mario-other-anims.mp4"} widthPercentage="100%"/>

:::info
Each GameObject that you want to animate should have one Animator (just one). Each Animator is responsible over **several animation clips** that you can create. Always create new animation clip from the Dopesheet when focusing on current GameObject with Animator attached. If you create it straight from the project inspector, then it won't be automatically associated with the animation controller.
:::

### Animator State Machine

If you press `Play` right now, you should see that your Mario immediately goes to play `mario-run` animation clip. We do not want that. We want to have the following animation depending on Mario's state:

1. If Mario's moving (have velocity), then we play `mario-run` clip on a loop
2. If Mario's off the ground, then we play `mario-jump` clip
3. If we change Mario's running direction from right to left, we want it to play `mario-skid` clip
4. Otherwise, Mario stays at `mario-idle` clip

To enable correct transition conditions, we need to create `parameters`. These parameters will be used to trigger transition between each animation clip (motion). Create these three parameters on Animator Window:

- `onGround` of type bool
- `xSpeed` of type float
- `onSkid` of type trigger (a boolean parameter that is reset by the controller when **consumed** by a transition)

Then add the following inside `PlayerMovement.cs`:

```cs title="PlayerMovement.cs"

    // for animation
    public Animator marioAnimator;

    void Start(){
        // ...

        //highlight-start
        // update animator state
        marioAnimator.SetBool("onGround", onGroundState);
        //highlight-end
    }
    void Update()
    {

        if (Input.GetKeyDown("a") && faceRightState)
        {
            faceRightState = false;
            marioSprite.flipX = true;
            //highlight-start
            if (marioBody.linearVelocity.x > 0.1f)
                marioAnimator.SetTrigger("onSkid");
//highlight-end
        }

        if (Input.GetKeyDown("d") && !faceRightState)
        {
            faceRightState = true;
            marioSprite.flipX = false;
            //highlight-start
            if (marioBody.linearVelocity.x < -0.1f)
                marioAnimator.SetTrigger("onSkid");
                //highlight-end
        }

        //highlight-start
        marioAnimator.SetFloat("xSpeed", Mathf.Abs(marioBody.linearVelocity.x));
        //highlight-end
    }

    void OnCollisionEnter2D(Collision2D col)
    {
        //highlight-start
        if (col.gameObject.CompareTag("Ground") && !onGroundState)
        {
            onGroundState = true;
            // update animator state
            marioAnimator.SetBool("onGround", onGroundState);
        }
        //highlight-end
    }

    void FixedUpdate(){
        // ...

        if (Input.GetKeyDown("space") && onGroundState)
        {
            marioBody.AddForce(Vector2.up * upSpeed, ForceMode2D.Impulse);
            onGroundState = false;
            //highlight-start
            // update animator state
            marioAnimator.SetBool("onGround", onGroundState);
            //highlight-end
        }
    }
```

### Transition Time

Let's gradually test it by setting Mario's running animation first. Pay attention on when we **untick** exit time and **setting** the transition duration to 0:

:::info Transition duration
Transition duration: The duration of the transition itself, in normalized time or seconds depending on the Fixed Duration mode, relative to the current state’s duration. This is visualized in the transition graph as the portion between the two blue markers.
:::

:::info Exit time
If Has Exit Time is checked, this value represents the exact time at which the transition can take effect. This is represented in normalized time (for example, an exit time of 0.75 means that on the first frame where 75% of the animation has played, the Exit Time condition is true). On the next frame, the condition is false.
:::

<VideoItem path={"https://50033.s3.ap-southeast-1.amazonaws.com/week-2/set-animation-transition-run.mp4"} widthPercentage="100%"/>

### Exit time

Now complete the rest of the state animation state machine. It will definitely take a bit of time to setup the right **exit** time. We want most transition to happen **immediately**, but the transition between skidding state and running state should have some exit time. What we want is for the entire skidding state to complete (all frames played) before transitioning to the running state. The transition itself takes no time.

:::important
Read more documentation on [transition properties here](https://docs.unity3d.com/Manual/class-Transition.html).
:::

Here's a sped up recording to help you out. Pause it at certain key frames if needed. The key is to always check your output frequently.

<VideoItem path={"https://50033.s3.ap-southeast-1.amazonaws.com/week-2/set-animation-therest.mp4"} widthPercentage="100%"/>

### Animation Event

We can create animation events on animation clips, of which we can **subscribe** a callback from a script **attached** to the GameObject where that animator is added to, as long as the signature matches (`void` return type, and accepting either of the parameters: `Float`, `Int`, `String`, or `Object`).

:::caution
As stated in the [documentation](https://docs.unity3d.com/Manual/AnimationEventsOnImportedClips.html), make sure that any **GameObject** which uses this animation in its animator has a corresponding script attached that contains a **function** with a matching event name. If you wish to call other functions in other script, you need to create a **custom** animation event tool script. You will learn more about this in Week 3.
:::

For instance, let's say we want to play a sound effect whenever Mario jumps. First, create the following global variable and function in `PlayerMovement.cs`:

```cs
    // for audio
    public AudioSource marioAudio;

        void PlayJumpSound()
    {
        // play jump sound
        marioAudio.PlayOneShot(marioAudio.clip);
    }
```

Then:

1. Create AudioSource component at Mario GameObject, and load the `smb_jump-small` AudioClip. Ensure that you disable Play on Awake property.
2. Then link this AudioSource component to `marioAudio` on the script from the inspector
3. Open `mario-jump` animation clip, and create an event at timestamp `0:00` as shown in the recording below
4. Ensure that `mario-jump` Animation clip Loop Time property is **unticked**

<VideoItem path={"https://50033.s3.ap-southeast-1.amazonaws.com/week-2/anim-event.mp4"} widthPercentage="100%"/>

:::playtest
You should hear the jumping sound effect **exactly ONCE** each time Mario jumps.
:::

### Death Animation

Now add death animation and sound effects. This is slightly more complicated because we want Mario to:

1. Show the death sprite when colliding with Goomba
2. Apply impulse force upwards
3. Play death sound effect (`smb_death.mp3`), [download here](https://www.dropbox.com/scl/fi/fbskuwdv5nd01fgstghg0/smb_death.mp3?rlkey=8w4ufx5sic7f3homrjhctxy7y&dl=0)
4. Then show Game Over scene
5. Restart everything when restart button is pressed

Here's the overview of the end product:

<VideoItem path={"https://50033.s3.ap-southeast-1.amazonaws.com/week-2/mario-death.mp4"} widthPercentage="100%"/>

First, create a `mario-die` animation with 4 samples, simply changing the sprite.

- Add `gameRestart` Trigger parameter to Mario's animator
- Remove "Has Exit Time", we want Mario to go back to `idle` state immediately when the game is restarted
- Add transition between `mario-die` to `mario-idle`
- and add the `gameRestart` condition to this newly created transition

<ImageCard path={require("./images/animation/2023-08-03-10-26-52.png").default} widthPercentage="100%"/>

Also, make sure to **turn off** `Loop Time` in `mario-die` animation clip. This is because we don't want the clip to loop and just play it once.

<ImageCard path={require("./images/animation/2023-08-03-10-28-16.png").default} widthPercentage="50%"/>

Then head to `PlayerMovement.cs` and edit the `OnTriggerEnter2D` and `ResetGame`, while adding these two functions:

```cs title="PlayerMovement.cs"

//highlight-start
    public AudioClip marioDeath;
    public float deathImpulse = 15;

    // state
    [System.NonSerialized]
    public bool alive = true;
    //highlight-end


//highlight-start
    void PlayDeathImpulse()
    {
        marioBody.AddForce(Vector2.up * deathImpulse, ForceMode2D.Impulse);
    }
//highlight-end

//highlight-start
    void GameOverScene()
    {
        // stop time
        Time.timeScale = 0.0f;
        // set gameover scene
        gameManager.GameOver(); // replace this with whichever way you triggered the game over screen for Checkoff 1
    }
//highlight-end


    void OnTriggerEnter2D(Collider2D other)
    {
        if (other.gameObject.CompareTag("Enemy") && alive)
        {
            Debug.Log("Collided with goomba!");

            //highlight-start
            // play death animation
            marioAnimator.Play("mario-die");
            marioAudio.PlayOneShot(marioDeath);
            alive = false;
            //highlight-end
        }
    }

    public void ResetGame()
    {
        // reset position
        marioBody.transform.position = new Vector3(-5.33f, -4.69f, 0.0f);
        // ... other instruction

        //highlight-start
        // reset animation
        marioAnimator.SetTrigger("gameRestart");
        alive = true;
        //highlight-end


    }
```

The idea is not to immediately stop time when Mario collides with Goomba but to play the animation first for about 1 second before stopping time, to give enough time for the Physics engine to simulate the effect of `deathImpulse`. We also have the **state** `alive` to prevent collision with Goomba to be re-triggered. Then create **two events** in `mario-die` animation, one to trigger `PlayDeathImpulse` and the other to trigger `GameOverScene`. Hook it up to the respective functions in `PlayerMovement.cs`. Also, do not forget to link up the `AudioClip` (`MarioDeath`) in the Inspector:

<VideoItem path={"https://50033.s3.ap-southeast-1.amazonaws.com/week-2/setup-death-script.mp4"} widthPercentage="100%"/>

:::note
Also notice how although `alive` is a public state, we do not see it serialized in the inspector due to `[System.NonSerialized]` [attribute](https://learn.microsoft.com/en-us/dotnet/csharp/advanced-topics/reflection-and-attributes/).
:::

## Disable Control when not `alive`

The final thing that you need to do is to **disable** Mario's movement when he is **dead**. Modify `PlayerMovement.cs` `FixedUpdate`:

```cs title="PlayerMovement.cs"
    void FixedUpdate()
    {
        //highlight-start
        if (alive)
        {
            //highlight-end

            float moveHorizontal = Input.GetAxisRaw("Horizontal");
            // other code

            //highlight-start
        }
        //highlight-end
    }
```

:::note
Our game starts to become a little <span className="orange-bold">messier</span>. We have states everywhere: player's status (alive or dead), score, game state (stopped or restarted), etc. We should have sort of `GameManager` that's supposed to manage the game but many other scripts that sort of manages itself (like `PlayerMovement.cs`). We will refactor our game to have a better architecture next week.
:::

## Fix gameRestart Bug

When the restart button is pressed while Mario is **NOT** in `mario-die` state in the animator, we will inadvertently set `gameRestart` trigger in the Animator, disallowing `mario-die` clip to play the **next** time he collides with Goomba. What we want is to <span className="orange-bold">consume</span> `gameRestart` trigger in `mario-idle` just in case a player restarts the game while Mario isn't dead.

1. Create a transition from mario-idle to mario-idle
2. Remove HasExitTime
3. Add transition condition as `gameRestart`

The following clip demonstrates both the bug and the fix:

<VideoItem path={"https://50033.s3.ap-southeast-1.amazonaws.com/week-2/restart-fix.mp4"} widthPercentage="100%"/>
