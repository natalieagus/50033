"use strict";(self.webpackChunksite_docusaurus_template=self.webpackChunksite_docusaurus_template||[]).push([[9903],{97047:(e,n,t)=>{t.r(n),t.d(n,{assets:()=>l,contentTitle:()=>d,default:()=>p,frontMatter:()=>h,metadata:()=>i,toc:()=>c});const i=JSON.parse('{"id":"babies/animation","title":"Animation","description":"The lab handout uses Super Mario Bros as assets to demonstrate certain Unity features and functionalities. You are free to follow along and submit it for checkoff, OR you can also create an entirely new project to demonstrate the requested feature(s).","source":"@site/docs/02-babies/animation.md","sourceDirName":"02-babies","slug":"/babies/animation","permalink":"/50033/docs/babies/animation","draft":false,"unlisted":false,"tags":[],"version":"current","sidebarPosition":1,"frontMatter":{"sidebar_position":1},"sidebar":"tutorialSidebar","previous":{"title":"Unity for Babies","permalink":"/50033/docs/category/unity-for-babies"},"next":{"title":"Camera Movement","permalink":"/50033/docs/babies/camera"}}');var a=t(74848),o=t(28453),s=(t(53398),t(19894),t(88761)),r=(t(89166),t(384));t(72206),t(82223);const h={sidebar_position:1},d="Animation",l={},c=[{value:"Mario&#39;s Animation",id:"marios-animation",level:2},{value:"Animation Controller",id:"animation-controller",level:3},{value:"Animation Clips",id:"animation-clips",level:3},{value:"Animator State Machine",id:"animator-state-machine",level:3},{value:"Transition Time",id:"transition-time",level:3},{value:"Exit time",id:"exit-time",level:3},{value:"Animation Event",id:"animation-event",level:3},{value:"Death Animation",id:"death-animation",level:3},{value:"Disable Control when not <code>alive</code>",id:"disable-control-when-not-alive",level:2},{value:"Fix gameRestart Bug",id:"fix-gamerestart-bug",level:2}];function m(e){const n={a:"a",admonition:"admonition",blockquote:"blockquote",code:"code",h1:"h1",h2:"h2",h3:"h3",header:"header",li:"li",ol:"ol",p:"p",pre:"pre",strong:"strong",ul:"ul",...(0,o.R)(),...e.components};return(0,a.jsxs)(a.Fragment,{children:[(0,a.jsx)(n.header,{children:(0,a.jsx)(n.h1,{id:"animation",children:"Animation"})}),"\n",(0,a.jsxs)(n.admonition,{title:"Lab Checkoff Requrements",type:"caution",children:[(0,a.jsxs)(n.p,{children:["The lab handout uses Super Mario Bros as assets to demonstrate certain Unity features and functionalities. You are free to follow along and submit it for checkoff, ",(0,a.jsx)(n.strong,{children:"OR you can also create an entirely new project to demonstrate the requested feature(s)"}),"."]}),(0,a.jsxs)(n.p,{children:["The requirement(s) for the lab checkoff can be found ",(0,a.jsx)(n.a,{href:"/50033/docs/babies/checkoff",children:"here"}),"."]})]}),"\n",(0,a.jsxs)(n.p,{children:["You can continue from where you left off in the previous Lab. Note that you ",(0,a.jsx)(n.strong,{children:"need"})," to finish the previous lab before starting on this one. In this lab we will upgrade our game by adding animation, sound effect, camera movement, and ",(0,a.jsx)(n.strong,{children:"obstacles"})," (leveraging on Unity's Physics2D engine) in the game."]}),"\n",(0,a.jsx)(n.h2,{id:"marios-animation",children:"Mario's Animation"}),"\n",(0,a.jsx)(n.p,{children:"Mario\u2019s animation can be broken down into five main states:"}),"\n",(0,a.jsxs)(n.ul,{children:["\n",(0,a.jsxs)(n.li,{children:[(0,a.jsx)(n.strong,{children:"Idle"})," state, when he\u2019s not moving at all"]}),"\n",(0,a.jsxs)(n.li,{children:[(0,a.jsx)(n.strong,{children:"Running"})," state, when he\u2019s moving left or right"]}),"\n",(0,a.jsxs)(n.li,{children:[(0,a.jsx)(n.strong,{children:"Skidding"})," state, when he switches direction while running and brake too hard"]}),"\n",(0,a.jsxs)(n.li,{children:[(0,a.jsx)(n.strong,{children:"Jumping"})," state, when he\u2019s off the ground"]}),"\n",(0,a.jsxs)(n.li,{children:[(0,a.jsx)(n.strong,{children:"Death"})," state, when he hits the enemy"]}),"\n"]}),"\n",(0,a.jsxs)(n.blockquote,{children:["\n",(0,a.jsx)(n.p,{children:"The Mario sprite given in the starter asset already contain the corresponding sprite that\u2019s suitable for each state."}),"\n"]}),"\n",(0,a.jsx)(n.p,{children:"To begin animating a GameObject, we need these things:"}),"\n",(0,a.jsxs)(n.ul,{children:["\n",(0,a.jsxs)(n.li,{children:["An ",(0,a.jsx)(n.code,{children:"Animator"})," element attached to the GameObject,"]}),"\n",(0,a.jsxs)(n.li,{children:["An Animator ",(0,a.jsx)(n.code,{children:"Controller"})," (need to create it in the Project Window under ",(0,a.jsx)(n.code,{children:"Assets"}),"),"]}),"\n",(0,a.jsxs)(n.li,{children:["and several ",(0,a.jsx)(n.strong,{children:"Animation Clips"})," to be managed by the controller."]}),"\n"]}),"\n",(0,a.jsx)(n.h3,{id:"animation-controller",children:"Animation Controller"}),"\n",(0,a.jsxs)(n.p,{children:["Open the Animation Window (Window >> Animation >> Animation), then click on Mario. You will be then prompted to create an ",(0,a.jsx)(n.strong,{children:"Animator"})," for Mario, along with an animation clip. When you click ",(0,a.jsx)(n.code,{children:"create"}),", both are created by default. You can then begin ",(0,a.jsx)(n.strong,{children:"recording"})," Mario's changes on each frame/time on the ",(0,a.jsx)(n.a,{href:"https://docs.unity3d.com/Manual/animeditor-AdvancedKeySelectionAndManipulation.html",children:"dopesheet"}),". First, create the folders: ",(0,a.jsx)(n.code,{children:"Assets/Animation/Mario"})," to contain all your Mario animation. Then, here's how to create a running Mario animation:"]}),"\n",(0,a.jsx)(r.A,{path:"https://50033.s3.ap-southeast-1.amazonaws.com/week-2/create-mario-anim-run.mp4",widthPercentage:"100%"}),"\n",(0,a.jsx)(n.h3,{id:"animation-clips",children:"Animation Clips"}),"\n",(0,a.jsxs)(n.p,{children:["Now create three more animation ",(0,a.jsx)(n.strong,{children:"clips"})," for idle, skidding, and jumping:"]}),"\n",(0,a.jsx)(r.A,{path:"https://50033.s3.ap-southeast-1.amazonaws.com/week-2/create-mario-other-anims.mp4",widthPercentage:"100%"}),"\n",(0,a.jsx)(n.admonition,{type:"info",children:(0,a.jsxs)(n.p,{children:["Each GameObject that you want to animate should have one Animator (just one). Each Animator is responsible over ",(0,a.jsx)(n.strong,{children:"several animation clips"})," that you can create. Always create new animation clip from the Dopesheet when focusing on current GameObject with Animator attached. If you create it straight from the project inspector, then it won't be automatically associated with the animation controller."]})}),"\n",(0,a.jsx)(n.h3,{id:"animator-state-machine",children:"Animator State Machine"}),"\n",(0,a.jsxs)(n.p,{children:["If you press ",(0,a.jsx)(n.code,{children:"Play"})," right now, you should see that your Mario immediately goes to play ",(0,a.jsx)(n.code,{children:"mario-run"})," animation clip. We do not want that. We want to have the following animation depending on Mario's state:"]}),"\n",(0,a.jsxs)(n.ol,{children:["\n",(0,a.jsxs)(n.li,{children:["If Mario's moving (have velocity), then we play ",(0,a.jsx)(n.code,{children:"mario-run"})," clip on a loop"]}),"\n",(0,a.jsxs)(n.li,{children:["If Mario's off the ground, then we play ",(0,a.jsx)(n.code,{children:"mario-jump"})," clip"]}),"\n",(0,a.jsxs)(n.li,{children:["If we change Mario's running direction from right to left, we want it to play ",(0,a.jsx)(n.code,{children:"mario-skid"})," clip"]}),"\n",(0,a.jsxs)(n.li,{children:["Otherwise, Mario stays at ",(0,a.jsx)(n.code,{children:"mario-idle"})," clip"]}),"\n"]}),"\n",(0,a.jsxs)(n.p,{children:["To enable correct transition conditions, we need to create ",(0,a.jsx)(n.code,{children:"parameters"}),". These parameters will be used to trigger transition between each animation clip (motion). Create these three parameters on Animator Window:"]}),"\n",(0,a.jsxs)(n.ul,{children:["\n",(0,a.jsxs)(n.li,{children:[(0,a.jsx)(n.code,{children:"onGround"})," of type bool"]}),"\n",(0,a.jsxs)(n.li,{children:[(0,a.jsx)(n.code,{children:"xSpeed"})," of type float"]}),"\n",(0,a.jsxs)(n.li,{children:[(0,a.jsx)(n.code,{children:"onSkid"})," of type trigger (a boolean parameter that is reset by the controller when ",(0,a.jsx)(n.strong,{children:"consumed"})," by a transition)"]}),"\n"]}),"\n",(0,a.jsxs)(n.p,{children:["Then add the following inside ",(0,a.jsx)(n.code,{children:"PlayerMovement.cs"}),":"]}),"\n",(0,a.jsx)(n.pre,{children:(0,a.jsx)(n.code,{className:"language-cs",metastring:'title="PlayerMovement.cs"',children:'\n    // for animation\n    public Animator marioAnimator;\n\n    void Start(){\n        // ...\n\n        //highlight-start\n        // update animator state\n        marioAnimator.SetBool("onGround", onGroundState);\n        //highlight-end\n    }\n    void Update()\n    {\n\n        if (Input.GetKeyDown("a") && faceRightState)\n        {\n            faceRightState = false;\n            marioSprite.flipX = true;\n            //highlight-start\n            if (marioBody.velocity.x > 0.1f)\n                marioAnimator.SetTrigger("onSkid");\n//highlight-end\n        }\n\n        if (Input.GetKeyDown("d") && !faceRightState)\n        {\n            faceRightState = true;\n            marioSprite.flipX = false;\n            //highlight-start\n            if (marioBody.velocity.x < -0.1f)\n                marioAnimator.SetTrigger("onSkid");\n                //highlight-end\n        }\n\n        //highlight-start\n        marioAnimator.SetFloat("xSpeed", Mathf.Abs(marioBody.velocity.x));\n        //highlight-end\n    }\n\n    void OnCollisionEnter2D(Collision2D col)\n    {\n        //highlight-start\n        if (col.gameObject.CompareTag("Ground") && !onGroundState)\n        {\n            onGroundState = true;\n            // update animator state\n            marioAnimator.SetBool("onGround", onGroundState);\n        }\n        //highlight-end\n    }\n\n    void FixedUpdate(){\n        // ...\n\n        if (Input.GetKeyDown("space") && onGroundState)\n        {\n            marioBody.AddForce(Vector2.up * upSpeed, ForceMode2D.Impulse);\n            onGroundState = false;\n            //highlight-start\n            // update animator state\n            marioAnimator.SetBool("onGround", onGroundState);\n            //highlight-end\n        }\n    }\n'})}),"\n",(0,a.jsx)(n.h3,{id:"transition-time",children:"Transition Time"}),"\n",(0,a.jsxs)(n.p,{children:["Let's gradually test it by setting Mario's running animation first. Pay attention on when we ",(0,a.jsx)(n.strong,{children:"untick"})," exit time and ",(0,a.jsx)(n.strong,{children:"setting"})," the transition duration to 0:"]}),"\n",(0,a.jsx)(n.admonition,{title:"Transition duration",type:"info",children:(0,a.jsx)(n.p,{children:"Transition duration: The duration of the transition itself, in normalized time or seconds depending on the Fixed Duration mode, relative to the current state\u2019s duration. This is visualized in the transition graph as the portion between the two blue markers."})}),"\n",(0,a.jsx)(n.admonition,{title:"Exit time",type:"info",children:(0,a.jsx)(n.p,{children:"If Has Exit Time is checked, this value represents the exact time at which the transition can take effect. This is represented in normalized time (for example, an exit time of 0.75 means that on the first frame where 75% of the animation has played, the Exit Time condition is true). On the next frame, the condition is false."})}),"\n",(0,a.jsx)(r.A,{path:"https://50033.s3.ap-southeast-1.amazonaws.com/week-2/set-animation-transition-run.mp4",widthPercentage:"100%"}),"\n",(0,a.jsx)(n.h3,{id:"exit-time",children:"Exit time"}),"\n",(0,a.jsxs)(n.p,{children:["Now complete the rest of the state animation state machine. It will definitely take a bit of time to setup the right ",(0,a.jsx)(n.strong,{children:"exit"})," time. We want most transition to happen ",(0,a.jsx)(n.strong,{children:"immediately"}),", but the transition between skidding state and running state should have some exit time. What we want is for the entire skidding state to complete (all frames played) before transitioning to the running state. The transition itself takes no time."]}),"\n",(0,a.jsx)(n.admonition,{type:"important",children:(0,a.jsxs)(n.p,{children:["Read more documentation on ",(0,a.jsx)(n.a,{href:"https://docs.unity3d.com/Manual/class-Transition.html",children:"transition properties here"}),"."]})}),"\n",(0,a.jsx)(n.p,{children:"Here's a sped up recording to help you out. Pause it at certain key frames if needed. The key is to always check your output frequently."}),"\n",(0,a.jsx)(r.A,{path:"https://50033.s3.ap-southeast-1.amazonaws.com/week-2/set-animation-therest.mp4",widthPercentage:"100%"}),"\n",(0,a.jsx)(n.h3,{id:"animation-event",children:"Animation Event"}),"\n",(0,a.jsxs)(n.p,{children:["We can create animation events on animation clips, of which we can ",(0,a.jsx)(n.strong,{children:"subscribe"})," a callback from a script ",(0,a.jsx)(n.strong,{children:"attached"})," to the GameObject where that animator is added to, as long as the signature matches (",(0,a.jsx)(n.code,{children:"void"})," return type, and accepting either of the parameters: ",(0,a.jsx)(n.code,{children:"Float"}),", ",(0,a.jsx)(n.code,{children:"Int"}),", ",(0,a.jsx)(n.code,{children:"String"}),", or ",(0,a.jsx)(n.code,{children:"Object"}),")."]}),"\n",(0,a.jsx)(n.admonition,{type:"caution",children:(0,a.jsxs)(n.p,{children:["As stated in the ",(0,a.jsx)(n.a,{href:"https://docs.unity3d.com/Manual/AnimationEventsOnImportedClips.html",children:"documentation"}),", make sure that any ",(0,a.jsx)(n.strong,{children:"GameObject"})," which uses this animation in its animator has a corresponding script attached that contains a ",(0,a.jsx)(n.strong,{children:"function"})," with a matching event name. If you wish to call other functions in other script, you need to create a ",(0,a.jsx)(n.strong,{children:"custom"})," animation event tool script. You will learn more about this in Week 3."]})}),"\n",(0,a.jsxs)(n.p,{children:["For instance, let's say we want to play a sound effect whenever Mario jumps. First, create the following global variable and function in ",(0,a.jsx)(n.code,{children:"PlayerMovement.cs"}),":"]}),"\n",(0,a.jsx)(n.pre,{children:(0,a.jsx)(n.code,{className:"language-cs",children:"    // for audio\n    public AudioSource marioAudio;\n\n        void PlayJumpSound()\n    {\n        // play jump sound\n        marioAudio.PlayOneShot(marioAudio.clip);\n    }\n"})}),"\n",(0,a.jsx)(n.p,{children:"Then:"}),"\n",(0,a.jsxs)(n.ol,{children:["\n",(0,a.jsxs)(n.li,{children:["Create AudioSource component at Mario GameObject, and load the ",(0,a.jsx)(n.code,{children:"smb_jump_small"})," AudioClip. Ensure that you disable Play on Awake property."]}),"\n",(0,a.jsxs)(n.li,{children:["Then link this AudioSource component to ",(0,a.jsx)(n.code,{children:"marioAudio"})," on the script from the inspector"]}),"\n",(0,a.jsxs)(n.li,{children:["Open ",(0,a.jsx)(n.code,{children:"mario_jump"})," animation clip, and create an event at timestamp ",(0,a.jsx)(n.code,{children:"0:00"})," as shown in the recording below"]}),"\n",(0,a.jsxs)(n.li,{children:["Ensure that ",(0,a.jsx)(n.code,{children:"mario-jump"})," Animation clip Loop Time property is ",(0,a.jsx)(n.strong,{children:"unticked"})]}),"\n"]}),"\n",(0,a.jsx)(r.A,{path:"https://50033.s3.ap-southeast-1.amazonaws.com/week-2/anim-event.mp4",widthPercentage:"100%"}),"\n",(0,a.jsx)(n.admonition,{type:"playtest",children:(0,a.jsxs)(n.p,{children:["You should hear the jumping sound effect ",(0,a.jsx)(n.strong,{children:"exactly ONCE"})," each time Mario jumps."]})}),"\n",(0,a.jsx)(n.h3,{id:"death-animation",children:"Death Animation"}),"\n",(0,a.jsx)(n.p,{children:"Now add death animation and sound effects. This is slightly more complicated because we want Mario to:"}),"\n",(0,a.jsxs)(n.ol,{children:["\n",(0,a.jsx)(n.li,{children:"Show the death sprite when colliding with Goomba"}),"\n",(0,a.jsx)(n.li,{children:"Apply impulse force upwards"}),"\n",(0,a.jsxs)(n.li,{children:["Play death sound effect (",(0,a.jsx)(n.code,{children:"smb_death.mp3"}),"), ",(0,a.jsx)(n.a,{href:"https://www.dropbox.com/scl/fi/fbskuwdv5nd01fgstghg0/smb_death.mp3?rlkey=8w4ufx5sic7f3homrjhctxy7y&dl=0",children:"download here"})]}),"\n",(0,a.jsx)(n.li,{children:"Then show Game Over scene"}),"\n",(0,a.jsx)(n.li,{children:"Restart everything when restart button is pressed"}),"\n"]}),"\n",(0,a.jsx)(n.p,{children:"Here's the overview of the end product:"}),"\n",(0,a.jsx)(r.A,{path:"https://50033.s3.ap-southeast-1.amazonaws.com/week-2/mario-death.mp4",widthPercentage:"100%"}),"\n",(0,a.jsxs)(n.p,{children:["First, create a ",(0,a.jsx)(n.code,{children:"mario_die"})," animation with 4 samples, simply changing the sprite."]}),"\n",(0,a.jsxs)(n.ul,{children:["\n",(0,a.jsxs)(n.li,{children:["Add ",(0,a.jsx)(n.code,{children:"gameRestart"})," Trigger parameter to Mario's animator"]}),"\n",(0,a.jsxs)(n.li,{children:['Remove "Has Exit Time", we want mario to go back to ',(0,a.jsx)(n.code,{children:"idle"})," state immediately when the game is restarted"]}),"\n",(0,a.jsxs)(n.li,{children:["Add transition between ",(0,a.jsx)(n.code,{children:"mario_die"})," to ",(0,a.jsx)(n.code,{children:"mario_idle"})]}),"\n",(0,a.jsxs)(n.li,{children:["and add the ",(0,a.jsx)(n.code,{children:"gameRestart"})," condition to this newly created transition"]}),"\n"]}),"\n",(0,a.jsx)(s.A,{path:t(44820).A,widthPercentage:"100%"}),"\n",(0,a.jsxs)(n.p,{children:["Also, make sure to ",(0,a.jsx)(n.strong,{children:"turn off"})," ",(0,a.jsx)(n.code,{children:"Loop Time"})," in ",(0,a.jsx)(n.code,{children:"mario_die"})," animation clip. This is because we don't want the clip to loop and just play it once."]}),"\n",(0,a.jsx)(s.A,{path:t(15126).A,widthPercentage:"50%"}),"\n",(0,a.jsxs)(n.p,{children:["Then head to ",(0,a.jsx)(n.code,{children:"PlayerMovement.cs"})," and edit the ",(0,a.jsx)(n.code,{children:"OnTriggerEnter2D"})," and ",(0,a.jsx)(n.code,{children:"ResetGame"}),", while adding these two functions:"]}),"\n",(0,a.jsx)(n.pre,{children:(0,a.jsx)(n.code,{className:"language-cs",metastring:'title="PlayerMovement.cs"',children:'\n//highlight-start\n    public AudioClip marioDeath;\n    public float deathImpulse = 15;\n\n    // state\n    [System.NonSerialized]\n    public bool alive = true;\n    //highlight-end\n\n\n//highlight-start\n    void PlayDeathImpulse()\n    {\n        marioBody.AddForce(Vector2.up * deathImpulse, ForceMode2D.Impulse);\n    }\n//highlight-end\n\n//highlight-start\n    void GameOverScene()\n    {\n        // stop time\n        Time.timeScale = 0.0f;\n        // set gameover scene\n        gameManager.GameOver(); // replace this with whichever way you triggered the game over screen for Checkoff 1\n    }\n//highlight-end\n\n\n    void OnTriggerEnter2D(Collider2D other)\n    {\n        if (other.gameObject.CompareTag("Enemy") && alive)\n        {\n            Debug.Log("Collided with goomba!");\n\n            //highlight-start\n            // play death animation\n            marioAnimator.Play("mario-die");\n            marioAudio.PlayOneShot(marioDeath);\n            alive = false;\n            //highlight-end\n        }\n    }\n\n    public void ResetGame()\n    {\n        // reset position\n        marioBody.transform.position = new Vector3(-5.33f, -4.69f, 0.0f);\n        // ... other instruction\n\n        //highlight-start\n        // reset animation\n        marioAnimator.SetTrigger("gameRestart");\n        alive = true;\n        //highlight-end\n\n\n    }\n'})}),"\n",(0,a.jsxs)(n.p,{children:["The idea is not to immediately stop time when Mario collides with Goomba but to play the animation first for about 1 second before stopping time, to give enough time for the Physics engine to simulate the effect of ",(0,a.jsx)(n.code,{children:"deathImpulse"}),". We also have the ",(0,a.jsx)(n.strong,{children:"state"})," ",(0,a.jsx)(n.code,{children:"alive"})," to prevent collision with Goomba to be re-triggered. Then create ",(0,a.jsx)(n.strong,{children:"two events"})," in ",(0,a.jsx)(n.code,{children:"mario_die"})," animation, one to trigger ",(0,a.jsx)(n.code,{children:"PlayDeathImpulse"})," and the other to trigger ",(0,a.jsx)(n.code,{children:"GameOverScene"}),". Hook it up to the respective functions in ",(0,a.jsx)(n.code,{children:"PlayerMovement.cs"}),". Also, do not forget to link up the ",(0,a.jsx)(n.code,{children:"AudioClip"})," (",(0,a.jsx)(n.code,{children:"MarioDeath"}),") in the Inspector:"]}),"\n",(0,a.jsx)(r.A,{path:"https://50033.s3.ap-southeast-1.amazonaws.com/week-2/setup-death-script.mp4",widthPercentage:"100%"}),"\n",(0,a.jsx)(n.admonition,{type:"note",children:(0,a.jsxs)(n.p,{children:["Also notice how although ",(0,a.jsx)(n.code,{children:"alive"})," is a public state, we do not see it serialized in the inspector due to ",(0,a.jsx)(n.code,{children:"[System.NonSerialized]"})," ",(0,a.jsx)(n.a,{href:"https://learn.microsoft.com/en-us/dotnet/csharp/advanced-topics/reflection-and-attributes/",children:"attribute"}),"."]})}),"\n",(0,a.jsxs)(n.h2,{id:"disable-control-when-not-alive",children:["Disable Control when not ",(0,a.jsx)(n.code,{children:"alive"})]}),"\n",(0,a.jsxs)(n.p,{children:["The final thing that you need to do is to ",(0,a.jsx)(n.strong,{children:"disable"})," Mario's movement when he is ",(0,a.jsx)(n.strong,{children:"dead"}),". Modify ",(0,a.jsx)(n.code,{children:"PlayerMovement.cs"})," ",(0,a.jsx)(n.code,{children:"FixedUpdate"}),":"]}),"\n",(0,a.jsx)(n.pre,{children:(0,a.jsx)(n.code,{className:"language-cs",metastring:'title="PlayerMovement.cs"',children:'    void FixedUpdate()\n    {\n        //highlight-start\n        if (alive)\n        {\n            //highlight-end\n\n            float moveHorizontal = Input.GetAxisRaw("Horizontal");\n            // other code\n\n            //highlight-start\n        }\n        //highlight-end\n    }\n'})}),"\n",(0,a.jsx)(n.admonition,{type:"note",children:(0,a.jsxs)(n.p,{children:["Our game starts to become a little ",(0,a.jsx)("span",{className:"orange-bold",children:"messier"}),". We have states everywhere: player's status (alive or dead), score, game state (stopped or restarted), etc. We should have sort of ",(0,a.jsx)(n.code,{children:"GameManager"})," that's supposed to manage the game but many other scripts that sort of manages itself (like ",(0,a.jsx)(n.code,{children:"PlayerMovement.cs"}),"). We will refactor our game to have a better architecture next week."]})}),"\n",(0,a.jsx)(n.h2,{id:"fix-gamerestart-bug",children:"Fix gameRestart Bug"}),"\n",(0,a.jsxs)(n.p,{children:["When the restart button is pressed while Mario is ",(0,a.jsx)(n.strong,{children:"NOT"})," in ",(0,a.jsx)(n.code,{children:"mario-die"})," state in the animator, we will inadvertently set ",(0,a.jsx)(n.code,{children:"gameRestart"})," trigger in the Animator, disallowing ",(0,a.jsx)(n.code,{children:"mario-die"})," clip to play the ",(0,a.jsx)(n.strong,{children:"next"})," time he collides with Goomba. What we want is to ",(0,a.jsx)("span",{className:"orange-bold",children:"consume"})," ",(0,a.jsx)(n.code,{children:"gameRestart"})," trigger in ",(0,a.jsx)(n.code,{children:"mario-idle"})," just in case a player restarts the game while mario isn't dead."]}),"\n",(0,a.jsxs)(n.ol,{children:["\n",(0,a.jsx)(n.li,{children:"Create a transition from mario-idle to mario-idle"}),"\n",(0,a.jsx)(n.li,{children:"Remove HasExitTime"}),"\n",(0,a.jsxs)(n.li,{children:["Add transition condition as ",(0,a.jsx)(n.code,{children:"gameRestart"})]}),"\n"]}),"\n",(0,a.jsx)(n.p,{children:"The following clip demonstrates both the bug and the fix:"}),"\n",(0,a.jsx)(r.A,{path:"https://50033.s3.ap-southeast-1.amazonaws.com/week-2/restart-fix.mp4",widthPercentage:"100%"})]})}function p(e={}){const{wrapper:n}={...(0,o.R)(),...e.components};return n?(0,a.jsx)(n,{...e,children:(0,a.jsx)(m,{...e})}):m(e)}},44820:(e,n,t)=>{t.d(n,{A:()=>i});const i=t.p+"assets/images/2023-08-03-10-26-52-db11fff1f84584768e959775d6a09f16.png"},15126:(e,n,t)=>{t.d(n,{A:()=>i});const i=t.p+"assets/images/2023-08-03-10-28-16-fb83ffab44a2ce51e4b1096e7cf27af4.png"}}]);