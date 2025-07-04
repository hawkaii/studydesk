import { useState } from "react";
import Slider from "rc-slider";
import {
  useDarkToggleStore,
  useShortBreakTimer,
  useLongBreakTimer,
  usePomodoroTimer,
  useHasStarted,
  useAudioVolume,
  useAlarmOption,
  useGrid,
  useLockWidgetsStore,
  useSeoVisibilityStore,
} from "@Store";
import { IoCloseSharp } from "react-icons/io5";
import { BsMusicPlayerFill, BsBellFill } from "react-icons/bs";
import { GiPanFlute } from "react-icons/gi";
import { CgPiano } from "react-icons/cg";
import { Button } from "@Components/Common/Button";
import { ToggleOption } from "./ToggleOption";
import { successToast } from "@App/utils/toast";
import useSetDefault from "@App/utils/hooks/useSetDefault";
import clsx from "clsx";

import piano from "/assets/music/piano.wav";
import flute from "/assets/music/flute.wav";
import arcade from "/assets/music/arcade.wav";
import bells from "/assets/music/bells.wav";

export const TimerSettings = ({ onClose }) => {
  const { isDark } = useDarkToggleStore();
  const { shortBreakLength, setShortBreak } = useShortBreakTimer();
  const { longBreakLength, setLongBreak } = useLongBreakTimer();
  const { pomodoroLength, setPomodoroLength } = usePomodoroTimer();
  const { hasStarted } = useHasStarted();
  const [pomoCount, setPomoCount] = useState(pomodoroLength);
  const [shortBreak, setShortBreakState] = useState(shortBreakLength);
  const [longBreak, setLongBreakState] = useState(longBreakLength);
  const { audioVolume, setAudioVolume } = useAudioVolume();
  const [currentVolume, setCurrentVolume] = useState(audioVolume);
  const { alarm, setAlarm } = useAlarmOption();
  const [currentAlarm, setCurrentAlarm] = useState(alarm);
  const { grid, setGrid } = useGrid();
  const [currentGrid, setCurrentGrid] = useState(grid);
  const { areWidgetsLocked, setAreWidgetsLocked } = useLockWidgetsStore();
  const { isSeoVisible, setSeoVisibility } = useSeoVisibilityStore();
  const [currentWidgetLockState, setCurrentWidgetLockState] = useState(areWidgetsLocked);

  function onDefaultChange() {
    if (currentGrid === null) {
      return 0;
    }
    return currentGrid[0];
  }

  const setDefault = useSetDefault();

  function onVolumeChange(value: number) {
    setCurrentVolume(value);
  }

  function onGridChange(value: number) {
    if (value == 0) {
      setCurrentGrid(null);
      return;
    }
    setCurrentGrid([value, value]);
  }

  function onSubmit() {
    setShortBreak(shortBreak);
    setLongBreak(longBreak);
    setPomodoroLength(pomoCount);
    setAudioVolume(currentVolume);
    setAlarm(currentAlarm);
    setGrid(currentGrid);
    setAreWidgetsLocked(currentWidgetLockState);
    onClose();
    successToast("Settings saved", isDark);
  }

  function handleDefaults() {
    if (hasStarted) return;

    var answer = window.confirm("Are you sure you want to reset to defaults?");
    if (answer) {
      // set master states
      setDefault();

      // set local states
      setPomoCount(1500);
      setShortBreakState(300);
      setLongBreakState(900);
      setCurrentVolume(0.7);
      setCurrentAlarm(
        "https://raw.githubusercontent.com/freeCodeCamp/cdn/master/build/testable-projects-fcc/audio/BeepSound.wav"
      );
      setCurrentGrid(null);
      setCurrentWidgetLockState(false);
    }
  }

  function handleLengthChange(
    e: any,
    decrement: string,
    increment: string,
    minLength: number,
    maxLength: number,
    propertyLength: number,
    setStateFunc: (val: number) => void,
    step: number
  ) {
    if (hasStarted) return; // guard against change when running

    if (e.target.id === decrement && propertyLength > minLength) {
      setStateFunc(propertyLength - step);
      e.target.nextSibling.value = Math.floor((propertyLength - step) / 60);
    } else if (e.target.id === increment && propertyLength < maxLength) {
      setStateFunc(propertyLength + step);
      e.target.previousSibling.value = Math.floor((propertyLength + step) / 60);
    }
  }

  function changeAlarm(alarmPath: string) {
    let audioRef = new Audio(alarmPath);
    audioRef.volume = currentVolume;
    audioRef.play();
    setCurrentAlarm(alarmPath);
  }

  function unHideInfo() {
    setSeoVisibility(true);
    onClose();
    successToast("Info now visible", isDark);
  }

  return (
    <div className="w-72 max-w-sm rounded-lg bg-background-primary p-4 text-text-primary shadow-card-hover border border-border-light sm:w-96">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold text-text-primary">Settings</h2>
        <IoCloseSharp 
          className="cursor-pointer text-error hover:text-red-600 transition-colors duration-200" 
          onClick={onClose} 
        />
      </div>
      
      <div className="space-y-6">
        <div className="border border-border-light rounded-lg p-4">
          <div className="text-center font-medium mb-4">
            Time <span className="text-text-secondary italic">(minutes)</span>
          </div>
          <div className="flex items-center justify-between gap-4 text-center">
            <ToggleOption
              title="Pomodoro"
              decrement="session-decrement"
              increment="session-increment"
              onClick={(e: React.MouseEvent<HTMLButtonElement>) =>
                handleLengthChange(e, "session-decrement", "session-increment", 60, 3600, pomoCount, setPomoCount, 60)
              }
              onChange={e => {
                if (hasStarted) {
                  e.target.readOnly = true;
                  return;
                }
                setPomoCount(e.target.value * 60);
              }}
              propertyLength={Math.floor(pomoCount / 60)}
              hasStarted={hasStarted}
            />
            <ToggleOption
              title="Short Break"
              decrement="short-break-decrement"
              increment="short-break-increment"
              onClick={(e: React.MouseEvent<HTMLButtonElement>) =>
                handleLengthChange(
                  e,
                  "short-break-decrement",
                  "short-break-increment",
                  60,
                  3600,
                  shortBreak,
                  setShortBreakState,
                  60
                )
              }
              onChange={e => {
                if (hasStarted) {
                  e.target.readOnly = true;
                  return;
                }
                setShortBreakState(e.target.value * 60);
              }}
              propertyLength={Math.floor(shortBreak / 60)}
              hasStarted={hasStarted}
            />
            <ToggleOption
              title="Long Break"
              decrement="long-break-decrement"
              increment="long-break-increment"
              onClick={(e: React.MouseEvent<HTMLButtonElement>) =>
                handleLengthChange(
                  e,
                  "long-break-decrement",
                  "long-break-increment",
                  60,
                  3600,
                  longBreak,
                  setLongBreakState,
                  60
                )
              }
              onChange={e => {
                if (hasStarted) {
                  e.target.readOnly = true;
                  return;
                }
                setLongBreakState(e.target.value * 60);
              }}
              propertyLength={Math.floor(longBreak / 60)}
              hasStarted={hasStarted}
            />
          </div>
        </div>

        <div className="border border-border-light rounded-lg p-4">
          <div className="text-center font-medium mb-4">Alarm Volume</div>
          <div className="px-2">
            <Slider
              defaultValue={audioVolume}
              onChange={value => {
                onVolumeChange(value as number);
              }}
              step={0.1}
              min={0}
              max={1}
              railStyle={{
                backgroundColor: "var(--color-border-medium)",
                height: 6,
              }}
              handleStyle={{
                backgroundColor: "var(--color-accent-orange)",
                borderColor: "var(--color-accent-orange)",
                height: 18,
                width: 18,
              }}
              trackStyle={{
                backgroundColor: "var(--color-accent-orange)",
                height: 6,
              }}
            />
          </div>
        </div>

        <div className="border border-border-light rounded-lg p-4">
          <div className="text-center font-medium mb-4">Alarm Sound</div>
          <div className="flex items-center justify-between gap-2 text-center">
            <div className="flex-1">
              <div className="text-sm mb-2">Retro</div>
              <div
                className={clsx(
                  "flex cursor-pointer items-center justify-center bg-background-secondary p-3 text-center rounded-lg transition-all duration-200 border",
                  currentAlarm == arcade 
                    ? "border-accent-orange bg-accent-orange text-white" 
                    : "border-border-light hover:border-accent-orange hover:bg-background-tertiary"
                )}
                onClick={() => changeAlarm(arcade)}
              >
                <BsMusicPlayerFill />
              </div>
            </div>
            <div className="flex-1">
              <div className="text-sm mb-2">Bells</div>
              <div
                className={clsx(
                  "flex cursor-pointer items-center justify-center bg-background-secondary p-3 text-center rounded-lg transition-all duration-200 border",
                  currentAlarm == bells 
                    ? "border-accent-orange bg-accent-orange text-white" 
                    : "border-border-light hover:border-accent-orange hover:bg-background-tertiary"
                )}
                onClick={() => changeAlarm(bells)}
              >
                <BsBellFill />
              </div>
            </div>
            <div className="flex-1">
              <div className="text-sm mb-2">Flute</div>
              <div
                className={clsx(
                  "flex cursor-pointer items-center justify-center bg-background-secondary p-3 text-center rounded-lg transition-all duration-200 border",
                  currentAlarm == flute 
                    ? "border-accent-orange bg-accent-orange text-white" 
                    : "border-border-light hover:border-accent-orange hover:bg-background-tertiary"
                )}
                onClick={() => changeAlarm(flute)}
              >
                <GiPanFlute />
              </div>
            </div>
            <div className="flex-1">
              <div className="text-sm mb-2">Piano</div>
              <div
                className={clsx(
                  "flex cursor-pointer items-center justify-center bg-background-secondary p-3 text-center rounded-lg transition-all duration-200 border",
                  currentAlarm == piano 
                    ? "border-accent-orange bg-accent-orange text-white" 
                    : "border-border-light hover:border-accent-orange hover:bg-background-tertiary"
                )}
                onClick={() => changeAlarm(piano)}
              >
                <CgPiano />
              </div>
            </div>
          </div>
        </div>

        <div className="border border-border-light rounded-lg p-4">
          <div className="text-center font-medium mb-4">Grid Size (increasing Step Size)</div>
          <div className="px-2">
            <Slider
              //@ts-ignore
              defaultValue={onDefaultChange}
              onChange={value => {
                onGridChange(value as number);
              }}
              step={50}
              min={0}
              max={150}
              railStyle={{
                backgroundColor: "var(--color-border-medium)",
                height: 6,
              }}
              handleStyle={{
                backgroundColor: "var(--color-accent-orange)",
                borderColor: "var(--color-accent-orange)",
                height: 18,
                width: 18,
              }}
              trackStyle={{
                backgroundColor: "var(--color-accent-orange)",
                height: 6,
              }}
            />
          </div>
        </div>

        <div className="border border-border-light rounded-lg p-4">
          <div className="text-center font-medium mb-4">Lock Widgets In-place</div>
          <div className="flex justify-center">
            <Button
              className={clsx(
                "w-[70%]",
                currentWidgetLockState && "bg-error hover:bg-red-600 border-error"
              )}
              variant={currentWidgetLockState ? "danger" : "primary"}
              onClick={() => setCurrentWidgetLockState(!currentWidgetLockState)}
            >
              {currentWidgetLockState ? "Unlock" : "Lock"} Widgets
            </Button>
          </div>
        </div>

        <div className="flex justify-between gap-3">
          <Button
            variant="tertiary"
            onClick={handleDefaults}
          >
            Default
          </Button>

          <Button
            variant="secondary"
            onClick={unHideInfo}
          >
            Unhide Info
          </Button>

          <Button
            variant="primary"
            onClick={onSubmit}
          >
            Save
          </Button>
        </div>
      </div>
    </div>
  );
};