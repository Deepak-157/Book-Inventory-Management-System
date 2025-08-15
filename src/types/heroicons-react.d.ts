declare module "@heroicons/react/outline";
declare module "@heroicons/react/solid";
declare module "@headlessui/react" {
  import * as React from "react";

  export const Dialog: React.ComponentType<any> & {
    Overlay: React.ComponentType<any>;
    Title: React.ComponentType<any>;
    Description: React.ComponentType<any>;
  };
  export const Transition: any;
}
