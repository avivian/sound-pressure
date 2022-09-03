import { useEffect, useRef } from "react";
import { useRive, useStateMachineInput } from "rive-react";
import "./App.css";

// +(function () {
//   var ctx = new AudioContext(),
//     url =
//       "https://cf-media.sndcdn.com/OfjMZo27DlvH.128.mp3?Policy=eyJTdGF0ZW1lbnQiOlt7IlJlc291cmNlIjoiKjovL2NmLW1lZGlhLnNuZGNkbi5jb20vT2ZqTVpvMjdEbHZILjEyOC5tcDMiLCJDb25kaXRpb24iOnsiRGF0ZUxlc3NUaGFuIjp7IkFXUzpFcG9jaFRpbWUiOjE1MTUwNDM5Njd9fX1dfQ__&Signature=FfmL2qUssAKs3Z7EPoYo0Yq8-SAg8rKLPs65EasXwuVkfsOB4joFqeCvVR2elpaG-lJaV4hXpXFiRCDWXNOYyAtO4Oz~sexiPwIoSk8-jWiVbGQRS8TMmUmj7TJzxemMOIj7ugWJKk6PHsrUdgqs9woDpHzxmkGCzk6sfqJEIsdeZJ4rWUFAh4iGWn9M6b0xfzTgndAJmytkNj9raCpWCBVmdr5u-r9nt~q5uF1easNSW9oaFilM4s1Hq2ei~VJye8zW9bzvrGm8idVdy-tiPeMWAKcE8J2VuaS1Ret6jRTRaHTDuiNgA5sZvgTzNpEpKtWI7UmAWI5TrqNVSlxpgQ__&Key-Pair-Id=APKAJAGZ7VMH2PFPW6UQ",
//     audio = new Audio(url),
//     // 2048 sample buffer, 1 channel in, 1 channel out
//     processor = ctx.createScriptProcessor(2048, 1, 1),
//     meter = document.getElementById("meter"),
//     source;

//   audio.crossOrigin = "anonymous";

//   audio.addEventListener(
//     "canplaythrough",
//     function () {
//       source = ctx.createMediaElementSource(audio);
//       source.connect(processor);
//       source.connect(ctx.destination);
//       processor.connect(ctx.destination);
//       audio.play();
//     },
//     false
//   );

//   // loop through PCM data and calculate average
//   // volume for a given 2048 sample buffer
//   processor.onaudioprocess = function (evt) {
//     var input = evt.inputBuffer.getChannelData(0),
//       len = input.length,
//       total = (i = 0),
//       rms;
//     while (i < len) total += Math.abs(input[i++]);
//     rms = Math.sqrt(total / len);
//     meter.style.width = rms * 100 + "%";
//   };
// })();

function App() {
  const audioRef = useRef();

  const { rive, RiveComponent } = useRive({
    src: "tree-demo.riv",
    stateMachines: "State Machine 1",
    autoplay: true,
  });

  const soundLevel = useStateMachineInput(rive, "State Machine 1", "input");

  function onClick() {
    audioRef.current.play();
  }

  function onStartClick() {
    const ctx = new AudioContext();
    audioRef.current = new Audio("shooting-stars.mp3");
    const processor = ctx.createScriptProcessor(2048, 1, 1);
    let source;

    audioRef.current.addEventListener("canplaythrough", () => {
      if (!source) {
        source = ctx.createMediaElementSource(audioRef.current);
        source.connect(processor);
        source.connect(ctx.destination);
        processor.connect(ctx.destination);
      }
    });

    processor.onaudioprocess = (evt) => {
      const input = evt.inputBuffer.getChannelData(0);
      const len = input.length;
      let i = 0;
      let total = 0;
      let rms;
      while (i < len) {
        total += Math.abs(input[i++]);
      }
      rms = Math.sqrt(total / len);
      soundLevel.value = rms * 100;
    };
  }

  return (
    <>
      <div style={{ width: "500px", height: "500px" }} onClick={onClick}>
        <RiveComponent />
      </div>
      <button onClick={onStartClick}>Start</button>
    </>
  );
}

export default App;
