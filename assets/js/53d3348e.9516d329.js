"use strict";(self.webpackChunksite_docusaurus_template=self.webpackChunksite_docusaurus_template||[]).push([[5404],{59100:(e,t,n)=>{n.r(t),n.d(t,{assets:()=>l,contentTitle:()=>d,default:()=>p,frontMatter:()=>h,metadata:()=>s,toc:()=>c});const s=JSON.parse('{"id":"toddlers/audio-management","title":"Audio Management","description":"Audio (background music, sound effects, sound cues) is an integral part of a good game. Unity\'s audio system can import most audio file formats (.mp3, .wav), emulate sounds in 3D space, and apply filters (lowpass, highpass, etc) during runtime. There can be many audio sources in the scene, but only one AudioListener per scene can be active.","source":"@site/docs/03-toddlers/audio-management.md","sourceDirName":"03-toddlers","slug":"/toddlers/audio-management","permalink":"/50033/docs/toddlers/audio-management","draft":false,"unlisted":false,"tags":[],"version":"current","sidebarPosition":3,"frontMatter":{"sidebar_position":3},"sidebar":"tutorialSidebar","previous":{"title":"The Observer Pattern","permalink":"/50033/docs/toddlers/observer-pattern"},"next":{"title":"Checkoff","permalink":"/50033/docs/toddlers/checkoff"}}');var o=n(74848),i=n(28453),a=(n(53398),n(19894),n(88761)),r=(n(89166),n(384));n(72206),n(82223);const h={sidebar_position:3},d="Audio Management",l={},c=[{value:"AudioListener",id:"audiolistener",level:2},{value:"AudioMixer",id:"audiomixer",level:2},{value:"Effects",id:"effects",level:3},{value:"Lowpass and Highpass Effect",id:"lowpass-and-highpass-effect",level:3},{value:"Pitch Shifter",id:"pitch-shifter",level:3},{value:"SFX Reverb",id:"sfx-reverb",level:3},{value:"Duck Volume",id:"duck-volume",level:3},{value:"Send Effect",id:"send-effect",level:4},{value:"Routing AudioSource Output To AudioMixer Group",id:"routing-audiosource-output-to-audiomixer-group",level:2},{value:"Snapshots and View",id:"snapshots-and-view",level:2}];function u(e){const t={a:"a",admonition:"admonition",blockquote:"blockquote",code:"code",em:"em",h1:"h1",h2:"h2",h3:"h3",h4:"h4",header:"header",li:"li",ol:"ol",p:"p",pre:"pre",strong:"strong",ul:"ul",...(0,i.R)(),...e.components};return(0,o.jsxs)(o.Fragment,{children:[(0,o.jsx)(t.header,{children:(0,o.jsx)(t.h1,{id:"audio-management",children:"Audio Management"})}),"\n",(0,o.jsxs)(t.p,{children:["Audio (background music, sound effects, sound cues) is an integral part of a good game. Unity's audio system can import most audio file formats (.mp3, .wav), emulate sounds in 3D space, and apply filters (lowpass, highpass, etc) during runtime. There can be many audio sources in the scene, but only ",(0,o.jsx)(t.strong,{children:"one"})," AudioListener per scene can be ",(0,o.jsx)(t.strong,{children:"active"}),"."]}),"\n",(0,o.jsx)(t.h2,{id:"audiolistener",children:"AudioListener"}),"\n",(0,o.jsxs)(t.p,{children:["The ",(0,o.jsx)(t.code,{children:"MainCamera"})," is usually the standard object that has ",(0,o.jsx)(t.code,{children:"AudioListener"})," component attached to it (for single-player games). Even for split-screen games where we have two cameras, we can only activate one AudioListener in either cameras or in another GameObject entirely."]}),"\n",(0,o.jsxs)(t.blockquote,{children:["\n",(0,o.jsx)(t.p,{children:"There are plenty of workarounds in the AssetStore though, be sure to check them out!"}),"\n"]}),"\n",(0,o.jsx)(a.A,{path:n(59243).A,widthPercentage:"100%"}),"\n",(0,o.jsx)(t.h2,{id:"audiomixer",children:"AudioMixer"}),"\n",(0,o.jsxs)(t.p,{children:[(0,o.jsx)(t.a,{href:"https://docs.unity3d.com/Manual/AudioMixerOverview.html",children:"Unity AudioMixer"})," allows you to route each AudioSource output in your scene, mix, apply effects on any of them and perform mastering. You can apply ",(0,o.jsx)(t.strong,{children:"effects"})," such as volume attenuation and pitch altering for each individual AudioSource. For example, you can reduce the background music of the game when there\u2019s a ",(0,o.jsx)(t.strong,{children:"cutscene"})," or ",(0,o.jsx)(t.strong,{children:"conversation"}),". We can mix any number of input signals from each AudioSource, and have exactly one output in the Scene: the AudioListener usually attached to the MainCamera. The figure below illustrates this scenario, taken from the Official Unity AudioMixer Documentation:"]}),"\n",(0,o.jsx)(a.A,{path:n(338).A,widthPercentage:"60%"}),"\n",(0,o.jsx)(t.p,{children:"We will not be going in depth about DSP concepts in Audio, and we assume that it is your job to find out which effects are more suitable for your project. However we will still be picking a few examples to illustrate how to utilize the AudioMixer. They include: lowpass and highpass, pitch shifting, reverb, and duck volume."}),"\n",(0,o.jsx)(t.p,{children:'Click Window \xbb Audio \xbb AudioMixer to have the AudioMixer tab open. Create a new Mixer called "SuperMarioBros".'}),"\n",(0,o.jsx)(a.A,{path:n(88620).A,widthPercentage:"80%"}),"\n",(0,o.jsxs)(t.p,{children:["On the left of the AudioMixer window, there are four sections: Mixers, Groups, Snapshot, and Views. The first section is called Mixers, and they contain the overview of all AudioMixers in your Project. The output of each mixer is routed to a Scene\u2019s default Audio Listener typically attached on the Main Camera. You can also route the output of one AudioMixer to another AudioMixer if your project is complex. ",(0,o.jsx)(t.a,{href:"https://docs.unity3d.com/Manual/AudioMixerSpecifics.html",children:"Specifics can be found in the official documentation"}),". The right region of the AudioMixer Window is called the ",(0,o.jsx)("span",{className:"orange-bold",children:"strip view"}),'. There\'s only one "bus" called Master right now.']}),"\n",(0,o.jsxs)(t.p,{children:["On the third section, there\u2019s Groups. You can create several AudioMixer ",(0,o.jsx)(t.strong,{children:"groups"})," and form a ",(0,o.jsx)(t.strong,{children:"hierarchy"}),". Each group creates another bus in the Audio Group ",(0,o.jsx)(t.strong,{children:"strip view"}),":"]}),"\n",(0,o.jsx)(a.A,{path:n(86214).A,widthPercentage:"100%"}),"\n",(0,o.jsx)(t.p,{children:"The purpose of having these groups is so that the output of each AudioSource can be routed here, and effects can be applied. Effects of the parent group is applied to all the children groups. Each group has a Master group by default, which controls the attenuation (loudness) of all children Audio groups."}),"\n",(0,o.jsx)(t.p,{children:"Create audio groups as shown in the screenshot above. You will only have Attenuation effect applied on each of them in the beginning, set at 0 dB. The attenuation is simply relative to one another, applied on a relative unit of measurement decibels."}),"\n",(0,o.jsx)(t.admonition,{type:"note",children:(0,o.jsx)(t.p,{children:"If you have sound group A at 0 dB, sound group B at 1 dB and sound group C at -2 dB, that means sound group B is the loudest among the three. How much louder is sound group B as compared to A? It depends on your perception. A change of 10 dB is accepted as the difference in level that is perceived by most listeners as \u201ctwice as loud\u201d or \u201chalf as loud\u201d"})}),"\n",(0,o.jsx)(t.h3,{id:"effects",children:"Effects"}),"\n",(0,o.jsxs)(t.p,{children:["You can apply various effects within each audio group. The effects are applied from top to bottom, meaning the order of effects can impact the final output of the sound. You can drag each effect in the ",(0,o.jsx)(t.strong,{children:"strip"})," view to reorder them."]}),"\n",(0,o.jsx)(a.A,{path:n(55699).A,widthPercentage:"60%"}),"\n",(0,o.jsx)(t.h3,{id:"lowpass-and-highpass-effect",children:"Lowpass and Highpass Effect"}),"\n",(0,o.jsx)(t.p,{children:"You can set two properties in Lowpass and Highpass effect:"}),"\n",(0,o.jsxs)(t.ul,{children:["\n",(0,o.jsx)(t.li,{children:"Cutoff frequency"}),"\n",(0,o.jsx)(t.li,{children:"Resonance"}),"\n"]}),"\n",(0,o.jsxs)(t.p,{children:["The cutoff frequency indicates the frequency that is allowed to pass the filter, so the output will contain range of frequencies from zero up to this cutoff frequency. As for ",(0,o.jsx)(t.strong,{children:"resonance"}),", you can leave the value as 1.00 unless you\u2019re familiar with it. It dictates how much the filter\u2019s self-resonance is ",(0,o.jsx)(t.em,{children:"dampened"}),"."]}),"\n",(0,o.jsxs)(t.blockquote,{children:["\n",(0,o.jsx)(t.p,{children:"Higher lowpass resonance quality indicates a lower rate of energy loss, that is the oscillations die out more slowly."}),"\n"]}),"\n",(0,o.jsxs)(t.p,{children:["An audio with lowpass filter effect applied will sound more ",(0,o.jsx)(t.strong,{children:"dull"})," and ",(0,o.jsx)(t.strong,{children:"less"})," sharp, for example it is ideal for effects where the game character throw blunt objects around."]}),"\n",(0,o.jsx)(t.p,{children:"On the contrary, Highpass effect allows us to pass any frequency above the cutoff. If you\u2019d like to pass through certain bands, let\u2019s say between 1000 Hz to 5000 Hz, then you can apply a lowpass at 5000Hz, and then a highpass at 1000Hz. The order doesn\u2019t matter in this case, as long as you set the right frequency cutoff for each type of effect."}),"\n",(0,o.jsx)(t.p,{children:"The following example allows frequencies between 1000 to 2000 Hz to pass through:"}),"\n",(0,o.jsx)(a.A,{path:n(11961).A,widthPercentage:"100%"}),"\n",(0,o.jsx)(t.h3,{id:"pitch-shifter",children:"Pitch Shifter"}),"\n",(0,o.jsxs)(t.p,{children:["The pitch shifter effect allows you to change the pitch of the group ",(0,o.jsx)("span",{className:"orange-bold",children:"without"})," causing the output to sound sped up or slowed down. This is formally called as pitch scaling."]}),"\n",(0,o.jsx)(t.admonition,{title:"Pitch Scaling",type:"note",children:(0,o.jsx)(t.p,{children:"The process of changing audio pitch without affecting its speed. It is commonly used in games to improve the game feel by making sound effects less repetitive and by helping to convey information to the player."})}),"\n",(0,o.jsx)(t.p,{children:"Usage examples:"}),"\n",(0,o.jsxs)(t.ul,{children:["\n",(0,o.jsxs)(t.li,{children:[(0,o.jsx)("span",{className:"orange-bold",children:"Collision"})," information: the speed, material of items colliding"]}),"\n",(0,o.jsxs)(t.li,{children:[(0,o.jsx)("span",{className:"orange-bold",children:"Importance"})," of events"]}),"\n",(0,o.jsxs)(t.li,{children:[(0,o.jsx)("span",{className:"orange-bold",children:"Response"})," to player inputs and actions"]}),"\n"]}),"\n",(0,o.jsxs)(t.p,{children:["This pitch shifter effect ",(0,o.jsx)("span",{className:"orange-bold",children:"different"})," from the pitch slider located at the top of the group inspector. The regular pitch slider changes the pitch of the audio file by manipulating the sampling frequency of the audio output."]}),"\n",(0,o.jsxs)(t.blockquote,{children:["\n",(0,o.jsx)(t.p,{children:"If the system\u2019s sampling rate was set at 44.1 kHz and we used a 22.05 kHz audio file, the system would read the samples faster than it should. As a result, the audio would sound sped up and higher-pitched. The inverse also can happen. Playing an audio file slower than it should will cause it to sound slowed down and lower-pitched."}),"\n"]}),"\n",(0,o.jsx)(t.p,{children:"The Pitch Shifter effect has the following properties:"}),"\n",(0,o.jsxs)(t.ul,{children:["\n",(0,o.jsx)(t.li,{children:"Pitch: adjust this slider to determine the pitch multiplier"}),"\n",(0,o.jsx)(t.li,{children:"FFT size, Overlap, and Max Channels: parameters of the Fast Fourier Transform algorithm as real-time pitch shifting is done using FFT."}),"\n"]}),"\n",(0,o.jsxs)(t.p,{children:["You\u2019re not required to know the details behind pitch shifting DSP. If you\u2019re interested in the details of such implementation, you may refer to the Python implementation ",(0,o.jsx)(t.a,{href:"https://lcav.gitbook.io/dsp-labs/dft/implementation",children:"here"}),". Since Unity is not open source, we do not know the exact implementation of these effects, but we can certainly learn to implement our own pitch shifter or any other audio effects by reading other research papers online."]}),"\n",(0,o.jsx)(t.h3,{id:"sfx-reverb",children:"SFX Reverb"}),"\n",(0,o.jsx)(t.p,{children:'This effect causes the sound group to be as if it is played within a room, having that complex "blurry", "dreamy" effect. Each room sounds differently, depending on the amount of things that exist in a room, for example listening to music in the bathroom (high reverb) sounds different than listening to the same music in an open field. Routing all audio output through the same reverb filter has the effect as if each of the audio files are played in the same room.'}),"\n",(0,o.jsx)(t.p,{children:"This is particularly handy if you have different sections in your game, e.g: cave, open field, wooden houses, etc. For example, the player\u2019s footsteps will sound different in each scenario, despite having the same audio file for footsteps."}),"\n",(0,o.jsx)(a.A,{path:n(46722).A,widthPercentage:"100%"}),"\n",(0,o.jsxs)(t.p,{children:["SFX Reverb has many properties, and it is best if you find presets online to get the room effect that you want without going into the details. The ",(0,o.jsx)(t.a,{href:"https://docs.unity3d.com/Manual/class-AudioReverbEffect.html",children:"official documentation"})," provides a brief description of each property, but it doesn\u2019t seem like much help for beginners who aren\u2019t familiar with the term."]}),"\n",(0,o.jsx)(t.h3,{id:"duck-volume",children:"Duck Volume"}),"\n",(0,o.jsxs)(t.p,{children:["Another very useful effect to know is ",(0,o.jsx)(t.strong,{children:"duck volume."})," This allows the group\u2019s volume to automatically reduce when something else is playing ",(0,o.jsx)(t.strong,{children:"above"})," a certain threshold. For example, if we want to reduce the background music whenever the player is jumping, we add add Duck Volume effect in Background Sound group, and set its threshold to be -65 dB:"]}),"\n",(0,o.jsx)(t.p,{children:"This configuration means:"}),"\n",(0,o.jsxs)(t.ul,{children:["\n",(0,o.jsx)(t.li,{children:"Any input over -65db will cause the volume to go down (Threshold)"}),"\n",(0,o.jsxs)(t.li,{children:["The volume will go down by quite a ",(0,o.jsx)(t.strong,{children:"high"})," amount (Ratio)"]}),"\n",(0,o.jsx)(t.li,{children:"The volume will go down very quickly (Attack time) at 100 ms and,"}),"\n",(0,o.jsx)(t.li,{children:"After the alert has gone below -25db, the backround music should go back to normal somewhat quickly (Release time)."}),"\n"]}),"\n",(0,o.jsx)(t.p,{children:"Leave the other properties as is unless you know what they means. Right now we do not need it, and we are confident that you can learn them independently next time when you need it."}),"\n",(0,o.jsx)(a.A,{path:n(21092).A,widthPercentage:"100%"}),"\n",(0,o.jsx)(t.h4,{id:"send-effect",children:"Send Effect"}),"\n",(0,o.jsxs)(t.p,{children:["Now the final thing to do is to Send an input to this Duck Volume effect, which is the source that can cause this audio group\u2019s volume to duck. Add a new group called Player Dies under SFX and add the Send effect. Select ",(0,o.jsx)(t.strong,{children:"Background Sound"})," as its Receive target and set its send level to 0.00 dB (so the background sound unit can receive the full amount of Player Dies SFX output)."]}),"\n",(0,o.jsx)(a.A,{path:n(40874).A,widthPercentage:"100%"}),"\n",(0,o.jsx)(t.h2,{id:"routing-audiosource-output-to-audiomixer-group",children:"Routing AudioSource Output To AudioMixer Group"}),"\n",(0,o.jsx)(t.p,{children:"Now go back to your scene and click on every type of AudioSource present in your scene, and set the output to each group accordingly. You can also create new ones whenever we deem appropriate. In this example, we simply have 3 used groups: Player, Player Dies, and Background Music."}),"\n",(0,o.jsxs)(t.ol,{children:["\n",(0,o.jsxs)(t.li,{children:["Background Music in general is ",(0,o.jsx)(t.strong,{children:"not as loud"})," as SFX (Player), so we adjust its attenuation"]}),"\n",(0,o.jsxs)(t.li,{children:["We want to ensure that the background music ",(0,o.jsx)(t.strong,{children:"ducks"})," when the player-death sound effect (gameover sound) is played, and the background music gradually comes back as we are seeing the restart screen"]}),"\n",(0,o.jsx)(t.li,{children:"For convenience sake, we create another GameObject under GameManager to simply hold the gameover sound effect audio source, which will be routed to PlayerDies audio group, caused the duck-volume effect on Background Music to be triggered when Mario Dies"}),"\n"]}),"\n",(0,o.jsx)(r.A,{path:"https://50033.s3.ap-southeast-1.amazonaws.com/week-3/audio-mixer.mp4",widthPercentage:"100%"}),"\n",(0,o.jsx)(t.admonition,{type:"playtest",children:(0,o.jsx)(t.p,{children:"Test that you can run the game and that all our sound effects are applied as desired."})}),"\n",(0,o.jsx)(t.h2,{id:"snapshots-and-view",children:"Snapshots and View"}),"\n",(0,o.jsxs)(t.p,{children:["For management purposes, we can create ",(0,o.jsx)(t.strong,{children:"snapshots"})," and ",(0,o.jsx)(t.strong,{children:"views"}),". Snapshot is a saved state of your Audio Mixer, a great way to define moods or themes of the mix and have those moods change as the player progresses through the game. For example, we might want to the parameters of Reverb filter depending on the location of the player. It is more convenient than manually changing all SFX Reverb parameters one by one during runtime through scripts."]}),"\n",(0,o.jsx)(t.p,{children:'You can create a new View by clicking the + button, rename the view and then click to focus on it. Then you can start hiding some groups that you don\u2019t want to see within this view. For example, we want have "SFX Only" View that show only SFX related audio groups, and hide all other groups:'}),"\n",(0,o.jsxs)(t.p,{children:["The following shows how to create Snapshots and Views, and ",(0,o.jsx)("span",{className:"orange-bold",children:"color code"})," your group:"]}),"\n",(0,o.jsx)(r.A,{path:"https://50033.s3.ap-southeast-1.amazonaws.com/week-3/snapshots-view.mp4",widthPercentage:"100%"}),"\n",(0,o.jsx)(t.p,{children:"You can change between snapshots programmatically as follows:"}),"\n",(0,o.jsx)(t.pre,{children:(0,o.jsx)(t.code,{className:"language-cs",children:'private AudioMixerSnapshot snapshot;\npublic AudioMixer mixer;\n\n// instantiate somewhere in the code\nsnapshot = mixer.FindSnapshot("[snapshot_name]");\n\n// then transition\nsnapshot.TransitionTo(.5f); //transition to snapshot\n'})}),"\n",(0,o.jsx)(t.p,{children:"We already have one snapshot by default, the one with the \u2605 symbol. This is our starting snapshot (the state that will be used when we start the game)."}),"\n",(0,o.jsx)(t.admonition,{type:"note",children:(0,o.jsx)(t.p,{children:"Snapshot won\u2019t work with new effects or new group within the Mixer, only the parameters. If you create or delete groups or effects, it will be reflected on all Snapshots."})})]})}function p(e={}){const{wrapper:t}={...(0,i.R)(),...e.components};return t?(0,o.jsx)(t,{...e,children:(0,o.jsx)(u,{...e})}):u(e)}},338:(e,t,n)=>{n.d(t,{A:()=>s});const s=n.p+"assets/images/AudioMixerSignalPath-e786f4b44a116fdb85093ef31e7a0b0f.png"},88620:(e,t,n)=>{n.d(t,{A:()=>s});const s=n.p+"assets/images/2023-08-16-14-27-46-57d46e4e9e48ecd890e20eb079567c82.png"},59243:(e,t,n)=>{n.d(t,{A:()=>s});const s=n.p+"assets/images/2023-08-16-14-28-13-0ad48911c60f861f51a52a38e71756ba.png"},86214:(e,t,n)=>{n.d(t,{A:()=>s});const s=n.p+"assets/images/2023-08-16-14-32-20-569c7bc177fedb25c1f0da9b442e5ab3.png"},11961:(e,t,n)=>{n.d(t,{A:()=>s});const s=n.p+"assets/images/2023-08-16-14-43-34-ce49d8c83be0160892aaf4cd0068f89a.png"},46722:(e,t,n)=>{n.d(t,{A:()=>s});const s=n.p+"assets/images/2023-08-16-14-49-13-7abeb9649585e8308835cf0441b537b1.png"},21092:(e,t,n)=>{n.d(t,{A:()=>s});const s=n.p+"assets/images/2023-08-16-14-52-24-4690c81bf28966229fc6454264abf653.png"},40874:(e,t,n)=>{n.d(t,{A:()=>s});const s=n.p+"assets/images/2023-08-16-17-42-02-0989315409e43d153067cca108f97f87.png"},55699:(e,t,n)=>{n.d(t,{A:()=>s});const s=n.p+"assets/images/2023-08-16-17-55-58-31ffad4c5829c98d738d9676124fcb23.png"}}]);