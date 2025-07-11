import { useRef, useEffect } from "react";
import { useSetBackground } from "@Store";
import { BackgroundDropdownItem } from "./BackgroundDropdownItem";
import { Background } from "@Root/src/App";

export const BackgroundNav = ({
  isVisible = false,
  onClose,
}: {
  isVisible: boolean;
  onClose: any;
}) => {
  const { backgroundId, setBackgroundId } = useSetBackground();
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    //https://stackoverflow.com/questions/32553158/detect-click-outside-react-component
    function handleClickOutside(event: any) {
      if (!menuRef.current?.contains(event.target)) {
        onClose();
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      // Unbind the event listener on clean up
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [menuRef]);

  return !isVisible ? null : (
    <div className="flex justify-end" ref={menuRef}>
      <div className="w-70 text-left">
        <div
          className="absolute right-2 z-[9999] mt-2 ml-2 w-56 origin-top-right divide-y divide-border-light rounded-lg bg-background-primary shadow-card-hover ring-1 ring-border-light border border-border-light focus:outline-none"
          role="menu"
          ref={menuRef}
        >
          <BackgroundDropdownItem
            isPicked={backgroundId == Background.CITY}
            setBackgroundId={setBackgroundId}
            background={Background.CITY}
            title="City"
            className="rounded-t-lg"
          />
          <BackgroundDropdownItem
            isPicked={backgroundId == Background.JAPAN}
            setBackgroundId={setBackgroundId}
            background={Background.JAPAN}
            title="Japan"
          />
          <BackgroundDropdownItem
            isPicked={backgroundId == Background.LOFIGIRL}
            setBackgroundId={setBackgroundId}
            background={Background.LOFIGIRL}
            title="Lofi Girl"
          />
        </div>
      </div>
    </div>
  );
};