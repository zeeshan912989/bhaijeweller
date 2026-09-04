"use client";

import * as React from "react";
import {
  motion,
  useAnimation,
  type SVGMotionProps,
  type Variants,
  type HTMLMotionProps,
} from "motion/react";
import { cn } from "@/lib/utils";

const staticAnimations = {
  path: {
    initial: { pathLength: 1 },
    animate: {
      pathLength: [0.05, 1],
      transition: {
        duration: 0.8,
        ease: "easeInOut",
      },
    },
  } as Variants,
  "path-loop": {
    initial: { pathLength: 1 },
    animate: {
      pathLength: [1, 0.05, 1],
      transition: {
        duration: 1.6,
        ease: "easeInOut",
      },
    },
  } as Variants,
} as const;

type StaticAnimations = keyof typeof staticAnimations;
type TriggerProp<T = string> = boolean | StaticAnimations | T;
type Trigger = TriggerProp<string>;

type AnimateIconContextValue = {
  controls: ReturnType<typeof useAnimation> | undefined;
  animation: StaticAnimations | string;
  loop: boolean;
  loopDelay: number;
  active: boolean;
  animate?: Trigger;
};

export type DefaultIconProps<T = string> = {
  animate?: TriggerProp<T>;
  animateOnHover?: TriggerProp<T>;
  animateOnTap?: TriggerProp<T>;
  animation?: T | StaticAnimations | "default" | string;
  loop?: boolean;
  loopDelay?: number;
  delay?: number;
};

export type AnimateIconProps<T = string> = HTMLMotionProps<"span"> &
  DefaultIconProps<T> & {
    children: React.ReactNode;
  };

export type IconProps<T = string> = DefaultIconProps<T> &
  Omit<SVGMotionProps<SVGSVGElement>, "animate"> & {
    size?: number;
  };

export type IconWrapperProps<T = string> = IconProps<T> & {
  icon: React.ComponentType<IconProps<T>>;
};

const AnimateIconContext = React.createContext<AnimateIconContextValue | null>(null);

export function useAnimateIconContext() {
  const context = React.useContext(AnimateIconContext);
  if (!context)
    return {
      controls: undefined,
      animation: "default",
      loop: false,
      loopDelay: 0,
      active: false,
      animate: undefined,
    };
  return context;
}

export function AnimateIcon({
  animate = false,
  animateOnHover = false,
  animateOnTap = false,
  animation = "default",
  loop = false,
  loopDelay = 0,
  children,
  className,
  ...props
}: AnimateIconProps) {
  const controls = useAnimation();
  const [localAnimate, setLocalAnimate] = React.useState<boolean>(Boolean(animate));

  React.useEffect(() => {
    if (animate) {
      controls.start("animate");
    } else {
      controls.start("initial");
    }
  }, [animate, controls]);

  const handleMouseEnter = (e: React.MouseEvent<HTMLSpanElement>) => {
    props.onMouseEnter?.(e);
    if (animateOnHover) {
      controls.start("animate");
    }
  };

  const handleMouseLeave = (e: React.MouseEvent<HTMLSpanElement>) => {
    props.onMouseLeave?.(e);
    if (animateOnHover) {
      controls.start("initial");
    }
  };

  return (
    <AnimateIconContext.Provider
      value={{
        controls,
        animation: typeof animate === "string" ? animate : animation,
        loop,
        loopDelay,
        active: localAnimate,
        animate,
      }}
    >
      <motion.span
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        className={cn("inline-flex items-center justify-center", className)}
        {...props}
      >
        {children}
      </motion.span>
    </AnimateIconContext.Provider>
  );
}

export function IconWrapper<T extends string>({
  size = 20,
  animation = "default",
  animate,
  animateOnHover,
  animateOnTap,
  icon: IconComponent,
  className,
  ...props
}: IconWrapperProps<T>) {
  const context = React.useContext(AnimateIconContext);

  if (context) {
    return (
      <IconComponent
        size={size}
        className={className}
        {...props}
      />
    );
  }

  return (
    <AnimateIcon
      animate={animate}
      animateOnHover={animateOnHover}
      animateOnTap={animateOnTap}
      animation={animation}
    >
      <IconComponent
        size={size}
        className={className}
        {...props}
      />
    </AnimateIcon>
  );
}

export function getVariants<
  V extends { default: T; [key: string]: T },
  T extends Record<string, Variants>
>(animations: V): T {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const { animation: animationType } = useAnimateIconContext();

  if (animationType in staticAnimations) {
    const variant = staticAnimations[animationType as StaticAnimations];
    const result = {} as T;
    for (const key in animations.default) {
      result[key] = variant as T[Extract<keyof T, string>];
    }
    return result;
  }

  return ((animations[animationType as keyof V] as T) ?? animations.default);
}
