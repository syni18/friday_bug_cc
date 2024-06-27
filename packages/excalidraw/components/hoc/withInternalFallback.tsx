import { atom, useAtom } from "jotai";
import React, { useLayoutEffect, useRef } from "react";
import { useTunnels } from "../../context/tunnels";

export interface WithInternalFallbackProps {
  __fallback?: boolean;
  userRole?: string;
}

export const withInternalFallback = <P extends object>(
  componentName: string,
  Component: React.FC<P>,
) => {
  
  const renderAtom = atom(0);

  const WrapperComponent: React.FC<P & WithInternalFallbackProps> = (props) => {
  console.log("withInternal", props.userRole);


    const { jotaiScope } = useTunnels();
    const [, setCounter] = useAtom(renderAtom, jotaiScope);
    const metaRef = useRef({
      preferHost: false,
      counter: 0,
    });

    useLayoutEffect(() => {
      const meta = metaRef.current;
      setCounter((c) => {
        const next = c + 1;
        meta.counter = next;
        return next;
      });
      return () => {
        setCounter((c) => {
          const next = c - 1;
          meta.counter = next;
          if (!next) {
            meta.preferHost = false;
          }
          return next;
        });
      };
    }, [setCounter]);

    if (!props.__fallback) {
      metaRef.current.preferHost = true;
    }

    if (
      (!metaRef.current.counter &&
        props.__fallback &&
        metaRef.current.preferHost) ||
      (metaRef.current.counter > 1 && props.__fallback)
    ) {
      return null;
    }

    return <Component {...(props as P)} />;
  };

  WrapperComponent.displayName = componentName;

  return WrapperComponent;
};
